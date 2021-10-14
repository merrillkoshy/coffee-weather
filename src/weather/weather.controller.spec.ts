import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MongoService } from './mongo/mongo.service';
import { getModelToken } from '@nestjs/mongoose';
import { City } from './mongo/schemas/city-weather.schema';
import { CityHistory } from './mongo/schemas/city-history.schema';
import { OpenweatherService } from './openweather/openweather.service';
import { WeatherSchedulerService } from './weatherscheduler/weather.scheduler.service';
describe('WeatherController', () => {
  let controller: WeatherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        SchedulerRegistry,
        WeatherSchedulerService,
        MongoService,
        OpenweatherService,
        ConfigService,
        //the test cant get to the constructor and decorators, so pass token
        //to the model reference and define the providers
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

    controller = module.get<WeatherController>(WeatherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
