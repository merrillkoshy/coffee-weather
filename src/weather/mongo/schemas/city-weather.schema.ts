import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CityWeather extends Document {
  @Prop({ required: true, unique: true })
  cityName: string;

  @Prop({ required: true })
  weather: string;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  windSpeed: number;

  @Prop()
  visibility: number;

  @Prop({ required: true, type: Date })
  expirationDate: Date;
}

export const CityWeatherSchema = SchemaFactory.createForClass(CityWeather);
