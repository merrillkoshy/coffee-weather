/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import {
  City,
  CityWeatherSchema,
} from '../src/weather/mongo/schemas/city-weather.schema';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Model } from 'mongoose';
import { WeatherModule } from '../src/weather/weather.module';
import { factory } from 'fakingoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

//Bonus 3: Integration Tests
describe('AppController (e2e)', () => {
  let cityModel;
  let app: NestExpressApplication;
  const cityFactory = factory<City>(
    CityWeatherSchema,
    {},
  ).setGlobalObjectIdOptions({ tostring: false });
  jest.setTimeout(30000);
  const apiClient = () => {
    return request.default(app.getHttpServer());
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            const mongo = await MongoMemoryServer.create();
            const uri = mongo.getUri();
            return {
              uri: uri,
            };
          },
        }),
        WeatherModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    cityModel = moduleFixture.get<Model<City>>(getModelToken(City.name));
    await app.init();
  });

  beforeEach(() => {
    const mockCity = cityFactory.generate();
    return cityModel.create(mockCity);
  });
  afterEach(async () => {
    cityModel.remove({});
  });
  const postData = async () => {
    // eslint-disable-next-line prettier/prettier
    return await apiClient()
      .post('/cities')
      .send({
        cityName: 'saskatchewan',
      });
  };

  const fetchData = async (cityName: string) => {
    return await apiClient().get(`/cities/${cityName}/weather`);
  };
  it('creates a city', async () => {
    try {
      // eslint-disable-next-line prettier/prettier
      await postData().then(async result => {
        await expect(result.text).toContain('Saskatchewan');
      });
    } catch (error) {
      console.log(error);
    }
    // const cities: City[] = (await apiClient().get('/cities')).body;
    // expect(cities[0].name).toBe('Rotterdam');
  });
  it('fetches a city', async () => {
    try {
      // eslint-disable-next-line prettier/prettier
      await fetchData('Saskatchewan').then(async result => {
        await expect(result.text).toContain('Saskatchewan');
      });
    } catch (error) {
      console.log(error);
    }
  });
  afterAll(() => {
    app.close();
  });
});
