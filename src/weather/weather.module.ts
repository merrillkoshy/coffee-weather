import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoService } from './mongo/mongo.service';
import { OpenweatherService } from './openweather/openweather.service';

import {
  CityWeather,
  CityWeatherSchema,
} from './mongo/schemas/city-weather.schema';

@Module({
  controllers: [WeatherController],
  providers: [MongoService, OpenweatherService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: CityWeather.name, schema: CityWeatherSchema },
    ]),
  ],
})
export class WeatherModule {}
