import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class City extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  id: number;

  @Prop({ type: Object, required: true })
  coord: {
    lat: number;
    lon: number;
  };

  @Prop({ type: Array, required: true })
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    },
  ];

  @Prop({ type: Object, required: true })
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };

  @Prop({ type: Object, required: true })
  daily?: [
    {
      dt: number;
      temp: {
        morn: number;
        day: number;
        eve: number;
        night: number;
      };
      weather: [
        {
          main: string;
        },
      ];
      pressure: number;
    },
  ];

  @Prop({ required: true, type: Date })
  expirationDate?: Date;
}

export const CityWeatherSchema = SchemaFactory.createForClass(City);
