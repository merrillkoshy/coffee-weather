import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongoService } from 'src/weather/mongo/mongo.service';
import { City } from 'src/weather/mongo/schemas/city-weather.schema';

//Bonus 3: Integration Tests
describe('AppController (e2e)', () => {
  let app: INestApplication;

  let mongoService: MongoService;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    const result = [
      {
        cityName: '',

        cityId: 0,

        coord: {
          lat: 0,
          lon: 0,
        },

        weather: '',

        temperature: 0,

        feels_like: 0,

        pressure: 0,

        humidity: 0,

        expirationDate: new Date(),
      },
    ];

    return request
      .default(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(result);
      });
  });
});
