import { ApiProperty } from '@nestjs/swagger';

export class CityCurrentAndHistoryEntity {
  @ApiProperty({
    example: 'Rotterdam',
    description: 'The name of the city',
  })
  name: string;

  @ApiProperty({
    example: 360630,
    description: 'The ID of city in OpenWeatherMaps',
  })
  id: number;

  @ApiProperty({
    example: 'coord: {lon: 4.47917,lat: 51.922501}',
    description: 'The coordinates of the city',
  })
  coord: {
    lat: number;
    lon: number;
  };
  @ApiProperty({
    example: `[
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ]`,
    description: 'Weather array',
  })
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    },
  ];
  @ApiProperty({
    example: `{
        "temp": 282.55,
        "feels_like": 281.86,
        "temp_min": 280.37,
        "temp_max": 284.26,
        "pressure": 1023,
        "humidity": 100
      }`,
    description: 'Temperature measurements',
  })
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  @ApiProperty({
    example: `{
        "day": "10/09/2021",
        "lat": 59.9127,
        "lon": 10.7461,
        "temperature": 13.69,
        "feels_like": 12.5,
        "pressure": 1008,
        "humidity": 53
      }`,
    description:
      'The hisory data of each city dating back till 5 days. The result will be the array of 5 day data',
  })
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
  @ApiProperty({
    example: `[
      {
      "dt":1634295600,
      "temp":{
        "day":51.8,
        "night":39.33,
        "eve":43.21,
        "morn":44.96
          },
        "weather":[
            {
              "main":"Rain",
            }
          ],
          "pressure":1001,
      }
    ]`,
    description: 'An array of data for the next 7 days',
  })
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
  @ApiProperty({
    example: '2021-10-13T21:16:26.474Z',
    description:
      'Time till truthiness of the document & reference to fetch an updated document',
  })
  expirationDate: Date;
}
