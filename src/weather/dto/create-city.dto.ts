import { ApiProperty } from '@nestjs/swagger';

export class createCityDto {
  @ApiProperty()
  cityName: string;
}
