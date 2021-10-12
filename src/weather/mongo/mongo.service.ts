import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City } from './schemas/city-weather.schema';
import { AxiosResponse } from 'axios';
import { OpenweatherResponse } from '../openweather/openweather.response';
import { CityHistory } from './schemas/city-history.schema';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel(City.name) private cityWeatherModel: Model<City>,
    @InjectModel(CityHistory.name) private cityHistoryModel: Model<CityHistory>,
  ) {}

  async create({
    name,
    cityId,
    coord,
    weather,
    temp,
    feels_like,
    pressure,
    humidity,
  }: OpenweatherResponse): Promise<City> {
    await this.cityWeatherModel
      .deleteOne({
        cityName: { $regex: new RegExp(name, 'i') },
      })
      .exec();

    const expirationDate = new Date();

    expirationDate.setHours(expirationDate.getHours() + 1);

    const city = new this.cityWeatherModel({
      cityName: name,
      cityId: cityId,
      coord: coord,
      weather: weather[0].main ?? 'No info!',
      temperature: temp,
      feels_like: feels_like,
      pressure: pressure,
      humidity: humidity,
      expirationDate,
    });
    return city.save();
  }
  async createMany(bundle: any) {
    // eslint-disable-next-line prettier/prettier
    try {
      // eslint-disable-next-line prettier/prettier
      const result = await bundle.map(async single => {
        const createCityData = await single;
        if (createCityData) this.create(createCityData?.data);
      });
      return await result;
    } catch (error) {
      console.log(error);
    }
  }

  findAllCities(): Promise<City[]> {
    return this.cityWeatherModel.find().exec();
  }

  findCityWeather(cityName: string): Promise<City> {
    return this.cityWeatherModel
      .findOne({ cityName: { $regex: new RegExp(cityName, 'i') } })
      .exec();
  }

  findCoords(cityName: string): Promise<City> {
    return this.cityWeatherModel
      .findOne({ cityName: { $regex: new RegExp(cityName, 'i') } })
      .exec();
  }
  findCityHistory(cityName: string): Promise<CityHistory[]> {
    return this.cityHistoryModel
      .find({
        cityName: { $regex: new RegExp(cityName, 'i') },
      })
      .exec();
  }
  // update(id: number, updateMongoDto: UpdateMongoDto) {
  //   return `This action updates a #${id} mongo`;
  // }

  async remove(id: number) {
    await this.cityWeatherModel
      .deleteOne({
        cityId: { $eq: id },
      })
      .exec();
    await this.cityHistoryModel
      .deleteMany({
        cityId: { $eq: id },
      })
      .exec();
    return `#${id} Out of current data and history`;
  }
  // {
  //   name,
  //   cityId,
  //   lat,
  //   lon,
  //   dt,
  //   weather,
  //   temp,
  //   feels_like,
  //   pressure,
  //   humidity,
  // }: OpenweatherResponse
  async createHistory(historyDataArray: any): Promise<CityHistory> {
    return historyDataArray.forEach(
      async (historyData: { day: string; data: any; cityName: string }) => {
        const { lat, lon } = historyData?.data;

        // eslint-disable-next-line prettier/prettier
        const {
          dt,
          temp,
          feels_like,
          pressure,
          humidity,
          // eslint-disable-next-line prettier/prettier
        } = historyData?.data.current;
        const weather = historyData?.data?.current?.weather[0]?.main;
        const name = historyData.cityName;
        await this.cityHistoryModel
          .deleteOne({
            cityName: { $regex: new RegExp(name, 'i') },
          })
          .exec();

        const expirationDate = new Date();

        expirationDate.setHours(expirationDate.getHours() + 1);

        const city = new this.cityHistoryModel({
          cityName: name,
          lat: lat,
          lon: lon,
          dt: dt,
          weather: weather,
          temperature: temp,
          feels_like: feels_like,
          pressure: pressure,
          humidity: humidity,
          expirationDate,
        });
        return city.save();
      },
    );
  }
}
