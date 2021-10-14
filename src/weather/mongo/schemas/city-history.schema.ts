import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CityHistory extends Document {
  @Prop({ required: true, unique: true })
  cityName: string;
  @Prop({ required: true })
  id: number;

  @Prop({ type: Object, required: true })
  historicData: {
    day: string;

    lat: number;

    lon: number;

    dt: number;

    weather: string;

    temperature: number;

    feels_like: number;

    pressure: number;

    humidity: number;
  };
  @Prop({ required: true, type: Date })
  expirationDate: Date;
}

export const CityHistorySchema = SchemaFactory.createForClass(CityHistory);
