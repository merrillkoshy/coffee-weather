import { Controller, Get, Param } from '@nestjs/common';
import { MongoService } from './mongo/mongo.service';
import { OpenweatherService } from './openweather/openweather.service';
import { CityNotFoundHttpException } from './404/notFound';

@Controller('weather')
export class WeatherController {
  constructor(
    private readonly mongo: MongoService,
    private readonly openweather: OpenweatherService,
  ) {}

  @Get(':city')
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
      return { statusCode: 500, error: error.message };
    }
  }
}
