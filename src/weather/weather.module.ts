import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoService } from './mongo/mongo.service';
import { OpenweatherService } from './openweather/openweather.service';

import { City, CityWeatherSchema } from './mongo/schemas/city-weather.schema';
import {
  CityHistory,
  CityHistorySchema,
} from './mongo/schemas/city-history.schema';

@Module({
  controllers: [WeatherController],
  providers: [MongoService, OpenweatherService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: City.name, schema: CityWeatherSchema },
      { name: CityHistory.name, schema: CityHistorySchema },
    ]),
  ],
})
export class WeatherModule {}
