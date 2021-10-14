import { ApiProperty } from '@nestjs/swagger';

export class deleteCityDto {
  @ApiProperty()
  cityId: number;
}
