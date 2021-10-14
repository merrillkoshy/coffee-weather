import { HttpException, HttpStatus } from '@nestjs/common';

export class DataNotFoundHttpException extends HttpException {
  constructor() {
    super(`No data found in Database`, HttpStatus.NOT_FOUND);
  }
}
