import { Injectable } from '@nestjs/common';
import data from '../../../data/city.list.json';
import { ConfigService } from '@nestjs/config';
import Axios, { AxiosResponse } from 'axios';
import { OpenweatherResponse } from './openweather.response';

@Injectable()
export class OpenweatherService {
  readonly WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
  readonly CURRENT_FORECAST_API_URL =
    'https://api.openweathermap.org/data/2.5/onecall';
  readonly HISTORIC_WEATHER_API_URL =
    'https://api.openweathermap.org/data/2.5/onecall/timemachine';

  readonly UNIT_METRICS = 'metric';

  constructor(private readonly configService: ConfigService) {}

  // create(createOpenweatherDto: CreateOpenweatherDto) {
  //   return 'This action adds a new openweather';
  // }
  async findAllCities(): Promise<
    Promise<AxiosResponse<OpenweatherResponse>>[]
  > {
    try {
      const getAllCities = await data.map(
        (city): Promise<AxiosResponse<OpenweatherResponse>> => {
          return Axios.get(this.WEATHER_API_URL, {
            params: {
              q: city.name,
              appid: this.configService.get<string>('OPENWEATHER_API_KEY'),
              units: this.UNIT_METRICS,
            },
          });
        },
      );
      return await getAllCities;
    } catch (error) {
      console.log(error);
    }
  }
  findCity(cityName: string): Promise<AxiosResponse<OpenweatherResponse>> {
    return Axios.get(this.WEATHER_API_URL, {
      params: {
        q: cityName,
        appid: this.configService.get<string>('OPENWEATHER_API_KEY'),
        units: this.UNIT_METRICS,
      },
    });
  }

  findCurrentAndFutureCity(coords: {
    lat: number;
    lon: number;
  }): Promise<AxiosResponse<OpenweatherResponse>> {
    return Axios.get(this.CURRENT_FORECAST_API_URL, {
      params: {
        lat: coords.lat,
        lon: coords.lon,
        exclude: 'minutely,hourly,alerts',
        appid: this.configService.get<string>('OPENWEATHER_API_KEY'),
        units: this.UNIT_METRICS,
      },
    });
  }
  findHistoryCity(
    coords: {
      lat: number;
      lon: number;
    },
    dt: number,
  ): Promise<AxiosResponse<OpenweatherResponse>> {
    return Axios.get(this.HISTORIC_WEATHER_API_URL, {
      params: {
        lat: coords.lat,
        lon: coords.lon,
        dt: dt,
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
