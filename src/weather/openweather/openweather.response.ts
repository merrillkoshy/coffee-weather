export interface weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export class OpenweatherResponse {
  id?: number;
  name: string;

  cityId: number;

  coord: {
    lat: number;
    lon: number;
  };

  lat?: number;
  lon?: number;
  weather?: weather[];

  current?: {
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    weather: Array<weather>;
  };
  daily?: {
    dt: number;
    temp: {
      morn: number;
      day: number;
      eve: number;
      night: number;
    };
    weather: {
      main: string;
    }[];
    pressure: number;
  }[];
  temp?: number;

  feels_like?: number;

  pressure?: number;
  humidity?: number;

  dt?: number;

  main?: {
    temp: number;
    feels_like: number;
    temp_min?: number;
    temp_max?: number;
    pressure: number;
    humidity: number;
  };
  timezone?: number;
}
