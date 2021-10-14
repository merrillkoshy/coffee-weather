import { ApiProperty } from '@nestjs/swagger';

export class CityEntity {
  @ApiProperty({
    example: 'Rotterdam',
    description: 'The name of city in OpenWeatherMaps',
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
}
