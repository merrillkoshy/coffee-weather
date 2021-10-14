import { Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MongoService } from '../mongo/mongo.service';
import { OpenweatherService } from '../openweather/openweather.service';
import { WeatherSchedulerService } from './weather.scheduler.service';

@Module({
  providers: [
    WeatherSchedulerService,
    OpenweatherService,
    MongoService,
    SchedulerRegistry,
  ],
})
export class WeatherSchedulerModule {}
