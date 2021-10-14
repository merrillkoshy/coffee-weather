import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { MongoService } from '../mongo/mongo.service';
import { OpenweatherService } from '../openweather/openweather.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
//Cannot get ConfigService to put in the env variables because
//It evaluates .env after all the imports and decorators are resolved
@Injectable()
export class WeatherSchedulerService {
  private readonly logger = new Logger(WeatherSchedulerService.name);

  constructor(
    private configService: ConfigService,
    private readonly mongo: MongoService,
    private readonly openweather: OpenweatherService,
  ) {}

  private readonly sm = this?.configService.get<string>('CRON_INTERVAL');

  @Cron(CronExpression[process.env.CRON_INTERVAL], {
    name: 'update_cities',
  })
  async updateCities() {
    const mongoRes = await this.mongo.findAllCities();
    if (mongoRes && mongoRes.length > 0) {
      // eslint-disable-next-line prettier/prettier
      mongoRes.forEach(async res => {
        this.mongo.remove(res.id);
        const openweatherRes = await this.openweather.findCity(res.name);
        return await this.mongo.create(openweatherRes.data);
      });
    }
  }
}
