import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CityWeather } from './schemas/city-weather.schema';
import { OpenweatherResponse } from '../openweather/openweather.response';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel(CityWeather.name) private cityWeatherModel: Model<CityWeather>,
  ) {}

  async create({
    name,
    weather,
    main,
    wind,
    visibility,
  }: OpenweatherResponse): Promise<CityWeather> {
    await this.cityWeatherModel
      .deleteOne({
        cityName: { $regex: new RegExp(name, 'i') },
      })
      .exec();

    const expirationDate = new Date();

    expirationDate.setHours(expirationDate.getHours() + 1);

    const city = new this.cityWeatherModel({
      cityName: name,
      weather: weather[0].main ?? 'No info!',
      temperature: main.temp,
      windSpeed: wind.speed,
      visibility,
      expirationDate,
    });

    return city.save();
  }

  findAllCities() {
    return this.cityWeatherModel;
  }

  findCityWeather(cityName: string): Promise<CityWeather> {
    return this.cityWeatherModel
      .findOne({ cityName: { $regex: new RegExp(cityName, 'i') } })
      .exec();
  }

  // update(id: number, updateMongoDto: UpdateMongoDto) {
  //   return `This action updates a #${id} mongo`;
  // }

  remove(id: number) {
    return `This action removes a #${id} mongo`;
  }
}
