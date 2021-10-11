import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import Axios, { AxiosResponse } from 'axios';
import { OpenweatherResponse } from './openweather.response';

@Injectable()
export class OpenweatherService {
  readonly WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  readonly UNIT_METRICS = 'metric';

  constructor(private readonly configService: ConfigService) {}

  // create(createOpenweatherDto: CreateOpenweatherDto) {
  //   return 'This action adds a new openweather';
  // }

  findCity(cityName: string): Promise<AxiosResponse<OpenweatherResponse>> {
    return Axios.get(this.WEATHER_API_URL, {
      params: {
        q: cityName,
        appid: this.configService.get<string>('OPENWEATHER_API_KEY'),
        units: this.UNIT_METRICS,
      },
    });
  }

  // update(id: number, updateOpenweatherDto: UpdateOpenweatherDto) {
  //   return `This action updates a #${id} openweather`;
  // }

  remove(id: number) {
    return `This action removes a #${id} openweather`;
  }
}
