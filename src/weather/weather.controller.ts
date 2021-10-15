import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiTags,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { MongoService } from './mongo/mongo.service';
import { OpenweatherService } from './openweather/openweather.service';
import { CityNotFoundHttpException } from './404/notFound';
import { DataNotFoundHttpException } from './404/dbDataNotFound';
import moment from 'moment';
import { CityEntity } from './entity/city.entity';
import { createCityDto } from './dto/create-city.dto';
import { weather } from './openweather/openweather.response';
import { CityCurrentAndHistoryEntity } from './entity/city.current-and-history.entity';
import { deleteCityDto } from './dto/delete-city.dto';
import { WeatherSchedulerService } from './weatherscheduler/weather.scheduler.service';
import { SchedulerRegistry } from '@nestjs/schedule';

@ApiTags('cities')
@Controller('cities')
export class WeatherController {
  constructor(
    private readonly mongo: MongoService,
    private readonly openweather: OpenweatherService,

    private readonly weatherscheduler: WeatherSchedulerService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  //The following are the endpoints(ep) described in the assessment
  @Get() //ep-1
  @ApiOperation({
    summary:
      'Returns a list of all cities with the latest weather data for that city (as stored in the database)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cities fetched.',
    type: CityEntity,
  })
  @ApiOkResponse({ status: 200, description: 'Cities fetched.' })
  @ApiNotFoundResponse({ status: 404, description: 'None found in DB.' })
  public async getListOfCities() {
    // const job = this.schedulerRegistry.getCronJob('update_cities');
    const mongoRes = await this.mongo.findAllCities();
    if (mongoRes && mongoRes.length > 0) {
      // eslint-disable-next-line prettier/prettier
      mongoRes.filter(res => {
        if (res.expirationDate.getTime() > new Date().getTime()) return res;
      });
      // job.start();
      return mongoRes;
    } else {
      return HttpStatus.NOT_FOUND;
    }
  }
  @Post() //ep-2
  @ApiOperation({
    summary:
      'Creates a new city and retrieve the current temperature and other basic weather data for that city',
  })
  @ApiCreatedResponse({ status: 201, description: 'New city created.' })
  @ApiConflictResponse({
    status: 409,
    description: 'City with same name exists',
  })
  @ApiNotFoundResponse({ status: 404, description: 'City not found.' })
  public async CreateAcity(@Body() city: createCityDto): Promise<any> {
    try {
      const openweatherRes = await this.openweather.findCity(city.cityName);
      const { coord, name, id } = await openweatherRes.data;
      const oneApiCall = await this.openweather.findCurrentAndFutureCity(coord);
      return await this.mongo.create(oneApiCall.data, name, id);
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 409) {
        return { statusCode: 409, error: error.message };
      } else if (error?.response?.status === 404) {
        throw new CityNotFoundHttpException(city.cityName);
      }
      return { statusCode: 500, error: error.message };
    }
  }

  @Delete(':id') //ep-3
  @ApiOperation({
    summary: 'Deletes the city and its weather data from the database',
  })
  @ApiResponse({
    status: 200,
    description: 'City deleted',
  })
  @ApiNotFoundResponse({ status: 404, description: 'City not found.' })
  public async deleteWeatherEntry(
    @Param('id') id: deleteCityDto,
  ): Promise<any> {
    if ((await this.mongo.remove(id.cityId)) === 404)
      throw new CityNotFoundHttpException(id.cityId.toString());
    if ((await this.mongo.remove(id.cityId)) === 200)
      return `#${id.cityId} Successfully deleted.`;
  }
  @Get('weather') //ep-4
  @ApiOperation({
    summary:
      "Returns an array for every city in the database and it's last known weather data.",
  })
  @ApiResponse({
    status: 200,
    description: 'Cities fetched.',
    type: CityEntity,
  })
  @ApiOkResponse({ status: 200, description: 'Cities fetched.' })
  @ApiNotFoundResponse({ status: 404, description: 'None found in DB.' })
  public async getAllWeather() {
    const mongoRes = await this.mongo.findAllCities();
    if (mongoRes && mongoRes.length > 0) {
      // eslint-disable-next-line prettier/prettier
      mongoRes.filter(res => {
        if (res.expirationDate.getTime() > new Date().getTime()) return res;
      });
      return mongoRes;
    } else {
      throw new DataNotFoundHttpException();
    }
  }

  @Get(':city/weather') //ep-5
  @ApiOperation({
    summary:
      'Returns the last known weather data for the city given by name (not id).\nIf a city is not found in the database, it should realtime retrieve the data from OpenWeatherMap API.',
  })
  @ApiResponse({
    status: 200,
    description: 'City fetched and stored',
    type: CityCurrentAndHistoryEntity,
  })
  public async cityHistoricalWeather(
    @Param('city') cityName: string,
  ): Promise<any> {
    //It's smart to store this data in the database but not necessary.
    // Make sure that you don't add the city to the cities collection
    // because then the cronjob will keep retrieving weather data for
    // it
    const mongoRes = await this.mongo.findCityHistory(cityName);
    if (mongoRes) {
      if (mongoRes.expirationDate.getTime() > new Date().getTime())
        return mongoRes;
    } else {
      try {
        //If a city is not found in the database, it should realtime retrieve the
        // data from OpenWeatherMap API.
        const openweatherResGetCoords = await this.openweather.findCity(
          cityName,
        );
        const coords = openweatherResGetCoords.data.coord;
        const name = openweatherResGetCoords.data.name;
        const id = openweatherResGetCoords.data.id;
        // eslint-disable-next-line prettier/prettier
        const openweatherResCurrent = await this.openweather.findCurrentAndFutureCity(
          coords,
        );
        console.log(openweatherResCurrent);
        // Should also include the weather data for the last 7 days (not longer)
        // (which should be retrieved from OpenWeatherMap API)
        //5 days is the API limit for this API on OpenWeatherMap, therefore we use 5.
        const resultArray: Array<{
          day: string;

          lat: number;

          lon: number;

          dt: number;

          weather: weather[];

          temperature: number;

          feels_like: number;

          pressure: number;

          humidity: number;
        }> = new Array(5);
        const dailyArray: Array<{
          dt: number;
          temp: {
            morn: number;
            day: number;
            eve: number;
            night: number;
          };
          weather: [
            {
              main: string;
            },
          ];
          pressure: number;
        }> = new Array(7);
        for (let index = 0; index < 5; index++) {
          //The api instructs each call has to be seperate
          const dayMoment = moment().subtract(5 - index, 'd');
          const dt = moment(dayMoment.format()).unix();
          const openweatherRes = await this.openweather.findHistoryCity(
            coords,
            dt,
          );
          resultArray[index] = {
            day: dayMoment.format('L'),

            lat: openweatherRes.data.lat,

            lon: openweatherRes.data.lon,

            dt: openweatherRes.data.dt,

            weather: openweatherRes.data.weather,

            temperature: openweatherRes.data.current.temp,

            feels_like: openweatherRes.data.current.feels_like,

            pressure: openweatherRes.data.current.pressure,

            humidity: openweatherRes.data.current.humidity,
          };
        }

        const historicData = {
          name: name,
          id: id,
          historicData: resultArray,
        };
        const daily = openweatherResCurrent.data.daily;
        // eslint-disable-next-line prettier/prettier
        const {
          weather,
          temp,
          feels_like,
          pressure,
          humidity,
          // eslint-disable-next-line prettier/prettier
        } = openweatherResCurrent.data.current;
        for (let index = 0; index < 7; index++) {
          dailyArray[index] = {
            dt: daily[index].dt,
            temp: {
              morn: daily[index].temp.morn,
              day: daily[index].temp.day,
              eve: daily[index].temp.eve,
              night: daily[index].temp.night,
            },
            weather: [
              {
                main: daily[index].weather[index].main,
              },
            ],
            pressure: daily[index].pressure,
          };
        }

        const currentData = {
          name: name,
          cityId: id,
          coord: coords,
          weather: weather,
          temp: temp,
          feels_like: feels_like,
          pressure: pressure,
          humidity: humidity,
          daily: dailyArray,
        };
        await this.mongo.createHistory(historicData);

        return [currentData, ...resultArray];
      } catch (error) {
        console.error(error);
        if (error?.response?.status === 404) {
          throw new CityNotFoundHttpException(cityName);
        }
        console.error(error);
        return { statusCode: error?.response?.status, error: error.message };
      }
    }
  }
}
