import { HttpStatus } from "@nestjs/common"
import { CustomHttpException } from "./CustomHttpException"

export class BaseController {
  protected sendSuccessResponse(message: string, data?: any) {
    return { message, data: data ?? null }
  }

  protected sendErrorResponse(message: string, status: HttpStatus, errors?: Record<string, any>) {
    throw new CustomHttpException(message, status, errors ?? null)
  }
}