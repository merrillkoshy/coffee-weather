import { Module } from '@nestjs/common';
import { WeatherSchedulerService } from './weather.scheduler.service';

@Module({
  providers: [WeatherSchedulerService],
})
export class WeatherSchedulerModule {}
