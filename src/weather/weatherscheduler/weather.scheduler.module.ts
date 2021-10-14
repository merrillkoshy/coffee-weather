import { Module } from '@nestjs/common';
import { WeatherSchedulerService } from './weather.scheduler.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [WeatherSchedulerService],
})
export class WeatherSchedulerModule {}
