import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomHttpException extends HttpException {

  errors?: Record<string, any>;
  constructor(message: string, status: HttpStatus, errors?: Record<string, any>) {
    super(message, status);
    this.errors = errors;
  }
}
