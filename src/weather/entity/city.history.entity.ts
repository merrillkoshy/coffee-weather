import { ApiProperty } from '@nestjs/swagger';

export class CityHistoryEntity {
  @ApiProperty({
    example: 'Rotterdam',
    description: 'The name of the city',
  })
  cityName: string;
  @ApiProperty({
    example: 360630,
    description: 'The ID of city in OpenWeatherMaps',
  })
  id: number;

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
    example: '2021-10-13T21:16:26.474Z',
    description:
      'Time till truthiness of the document & reference to fetch an updated document',
  })
  expirationDate: Date;
}
