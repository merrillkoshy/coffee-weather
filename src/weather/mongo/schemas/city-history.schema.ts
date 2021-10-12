import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CityHistory extends Document {
  @Prop({ required: true, unique: true })
  cityName: string;

  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lon: number;

  @Prop({ required: true })
  dt: number;

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

export const CityHistorySchema = SchemaFactory.createForClass(CityHistory);
