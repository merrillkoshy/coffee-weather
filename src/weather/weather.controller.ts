import { Controller, Delete, Get, Param } from '@nestjs/common';
import { MongoService } from './mongo/mongo.service';
import { OpenweatherService } from './openweather/openweather.service';
import { CityNotFoundHttpException } from './404/notFound';
import moment from 'moment';

@Controller('cities')
export class WeatherController {
  constructor(
    private readonly mongo: MongoService,
    private readonly openweather: OpenweatherService,
  ) {}

  @Get('weather')
  public async getAllWeather() {
    const mongoRes = await this.mongo.findAllCities();
    if (mongoRes) {
      // eslint-disable-next-line prettier/prettier
      mongoRes.filter(res => {
        if (res.expirationDate.getTime() > new Date().getTime()) return res;
      });
      try {
        const openweatherRes = await this.openweather.findAllCities();
        return await this.mongo.createMany(openweatherRes);
      } catch (error) {
        if (error?.response.status === 404) {
          console.error(error);
          return { statusCode: 500, error: error.message };
        }
        console.error(error);
        return { statusCode: 500, error: error.message };
      }
    }

    return { statusCode: 500, error: "Can't find any" };
  }

  @Get('weather/:city')
  public async cityWeather(@Param('city') cityName: string): Promise<any> {
    const mongoRes = await this.mongo.findCityWeather(cityName);

    if (mongoRes && mongoRes.expirationDate.getTime() > new Date().getTime()) {
      return mongoRes;
    }

    try {
      const openweatherRes = await this.openweather.findCity(cityName);
      return await this.mongo.create(openweatherRes.data);
    } catch (error) {
      if (error?.response.status === 404) {
        throw new CityNotFoundHttpException(cityName);
      }
      console.error(error);
      return { statusCode: error?.response.status, error: error.message };
    }
  }
  @Get(':city/weather')
  public async cityHistoricalWeather(
    @Param('city') cityName: string,
  ): Promise<any> {
    //pull from db
    const mongoRes = await this.mongo.findCityHistory(cityName);
    if (mongoRes && mongoRes.length > 0) {
      return mongoRes;
    } else {
      try {
        //or get live data
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
        //5 is the API limit
        const resultArray = new Array(5);
        for (let index = 0; index <= 5; index++) {
          //The api instructs each call has to be seperate
          const dayMoment = moment().subtract(5 - index, 'd');
          const dt = moment(dayMoment.format()).unix();
          const openweatherRes = await this.openweather.findHistoryCity(
            coords,
            dt,
          );
          resultArray[index] = {
            day: dayMoment.format('L'),
            data: openweatherRes.data,
            cityName: name,
            cityId: id,
          };
        }

        // eslint-disable-next-line prettier/prettier
        const {
          weather,
          temp,
          feels_like,
          pressure,
          humidity,
          // eslint-disable-next-line prettier/prettier
        } = openweatherResCurrent.data.current;
        const currentData = {
          name: name,
          cityId: id,
          coord: coords,
          weather: weather,
          temp: temp,
          feels_like: feels_like,
          pressure: pressure,
          humidity: humidity,
        };
        await this.mongo.create(currentData);
        await this.mongo.createHistory(resultArray);
        // eslint-disable-next-line prettier/prettier
        return [
          {
            cityId: id,
            city: name,
            coords: coords,
            weather: weather,
            temperature: temp,
            feels_like: feels_like,
            pressure: pressure,
            humidity: humidity,
          },
          ...resultArray,
        ];
      } catch (error) {
        console.error(error);
        if (error?.response.status === 404) {
          throw new CityNotFoundHttpException(cityName);
        }
        console.error(error);
        return { statusCode: error?.response.status, error: error.message };
      }
    }
  }
  @Delete(':id')
  public async deleteWeatherEntry(@Param('id') cityId: number): Promise<any> {
    return await this.mongo.remove(cityId);
  }
}
