import { HttpException, HttpStatus } from '@nestjs/common';

export class CityNotFoundHttpException extends HttpException {
  constructor(cityName: string) {
    super(`City ${cityName} not found!`, HttpStatus.NOT_FOUND);
  }
}
