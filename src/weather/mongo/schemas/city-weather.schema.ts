import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class City extends Document {
  @Prop({ required: true, unique: true })
  cityName: string;

  @Prop({ required: true })
  cityId: number;

  @Prop({ type: Object, required: true })
  coord: {
    lat: number;
    lon: number;
  };

  @Prop({ required: true })
  weather: string;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  feels_like: number;

  @Prop()
  pressure: number;

  @Prop()
  humidity: number;

  @Prop({ required: true, type: Date })
  expirationDate: Date;
}

export const CityWeatherSchema = SchemaFactory.createForClass(City);
