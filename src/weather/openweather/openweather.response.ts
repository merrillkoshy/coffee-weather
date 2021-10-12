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
  daily?: any;
  temp?: number;

  feels_like?: number;

  pressure?: number;
  humidity?: number;

  dt?: number;

  timezone?: number;
}
