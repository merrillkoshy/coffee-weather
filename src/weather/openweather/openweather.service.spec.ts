import { Test, TestingModule } from '@nestjs/testing';
import { OpenweatherService } from './openweather.service';
import { ConfigService } from '@nestjs/config';

describe('OpenweatherService', () => {
  let service: OpenweatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, OpenweatherService],
    }).compile();

    service = module.get<OpenweatherService>(OpenweatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
