import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City } from './schemas/city-weather.schema';
import { OpenweatherResponse } from '../openweather/openweather.response';
import { CityHistory } from './schemas/city-history.schema';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel(City.name) private cityWeatherModel: Model<City>,
    @InjectModel(CityHistory.name) private cityHistoryModel: Model<CityHistory>,
  ) {}

  //There are two types of docs created, one is with current data that should
  //be read when a plain GET request is made. And the other one stores
  //historical data of the past 5 days, read when a citywise GET request
  //is called.
  async create(
    { lat, lon, current, daily }: OpenweatherResponse,
    name: string,
    id: number,
  ): Promise<City> {
    await this.cityWeatherModel
      .deleteOne({
        cityName: { $regex: new RegExp(name, 'i') },
      })
      .exec();

    const expirationDate = new Date();

    expirationDate.setHours(expirationDate.getHours() + 1);

    const city = new this.cityWeatherModel({
      name: name,
      id: id,
      coord: { lat: lat, lon: lon },
      weather: current.weather,
      main: {
        temp: current.temp,
        feels_like: current.feels_like,
        pressure: current.pressure,
        humidity: current.humidity,
      },
      daily: daily,
      expirationDate,
    });
    return city.save();
  }

  findAllCities(): Promise<City[]> {
    return this.cityWeatherModel.find().exec();
  }

  //Not asked in the assessment to retreive a city from db explicitly.
  // But just in case..
  //
  // findCityWeather(cityName: string): Promise<City> {
  //   return this.cityWeatherModel
  //     .findOne({ cityName: { $regex: new RegExp(cityName, 'i') } })
  //     .exec();
  // }

  //The API only accepts coordinates, not names or id for retrieval
  //Therefore this request is our middleware request
  findCoords(name: string): Promise<City> {
    //should run a case-insensitive regex to get the data from the doc.
    return this.cityWeatherModel
      .findOne({ name: { $regex: new RegExp(name, 'i') } })
      .exec();
  }
  //Gets historical data (5days) from the history doc.
  findCityHistory(name: string): Promise<CityHistory> {
    return this.cityHistoryModel
      .findOne({
        name: { $regex: new RegExp(name, 'i') },
      })
      .exec();
  }
  //Takes a number arg and references it in the doc to delete
  async remove(id: number) {
    let existsInCityCurrent;
    let existsInCityHistory;
    await this.cityWeatherModel
      .deleteOne({
        id: { $eq: id },
      })
      .exec()
      // eslint-disable-next-line prettier/prettier
      .then(result => {
        existsInCityCurrent = result.deletedCount;
      });
    await this.cityHistoryModel
      .deleteMany({
        id: { $eq: id },
      })
      .exec()
      // eslint-disable-next-line prettier/prettier
      .then(result => {
        existsInCityHistory = result.deletedCount;
      });
    if (existsInCityCurrent < 1 || existsInCityHistory < 1)
      return HttpStatus.NOT_FOUND;
    if (existsInCityCurrent == 1 && existsInCityHistory == 1)
      return HttpStatus.OK;
  }
  //Hopefully we are creating history now :)
  //Typed input to typed data in the doc.
  async createHistory(historyDataElement: {
    name: string;
    id: number;
    historicData: {
      day: string;

      lat: number;

      lon: number;

      dt: number;

      weather: OpenweatherResponse['weather'];

      temperature: number;

      feels_like: number;

      pressure: number;

      humidity: number;
    }[];
  }): Promise<CityHistory> {
    // eslint-disable-next-line prettier/prettier
    const name = historyDataElement.name;
    const id = historyDataElement.id;
    await this.cityHistoryModel
      .deleteOne({
        cityName: { $regex: new RegExp(name, 'i') },
      })
      .exec();

    const expirationDate = new Date();

    expirationDate.setHours(expirationDate.getHours() + 1);

    const city = new this.cityHistoryModel({
      cityName: name,
      id: id,
      historicData: historyDataElement.historicData,
      expirationDate,
    });
    return city.save();
  }
}
