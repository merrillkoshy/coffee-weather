import { Test, TestingModule } from '@nestjs/testing';
import { WeatherSchedulerService } from './weather.scheduler.service';
import { MongoService } from '../mongo/mongo.service';
import { getModelToken } from '@nestjs/mongoose';
import { City } from '../mongo/schemas/city-weather.schema';
import { CityHistory } from '../mongo/schemas/city-history.schema';
import { OpenweatherService } from '../openweather/openweather.service';
import { ConfigService } from '@nestjs/config';

describe('WeatherSchedulerService', () => {
  let service: WeatherSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoService,
        WeatherSchedulerService,
        OpenweatherService,
        ConfigService,
        {
          provide: getModelToken(City.name),
          useValue: 'cityWeatherModel',
        },
        {
          provide: getModelToken(CityHistory.name),
          useValue: 'cityHistoryModel',
        },
      ],
    }).compile();

    service = module.get<WeatherSchedulerService>(WeatherSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
