import { Test, TestingModule } from '@nestjs/testing';
import { MongoService } from './mongo.service';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { City } from './schemas/city-weather.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CityHistory } from './schemas/city-history.schema';
describe('MongoService', () => {
  let service: MongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        MongoService,
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

    service = module.get<MongoService>(MongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
