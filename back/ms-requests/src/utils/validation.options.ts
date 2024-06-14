import { HttpStatus, ValidationPipeOptions } from "@nestjs/common"
import { CustomHttpException } from "./CustomHttpException"

const validationOptions: ValidationPipeOptions = {
  stopAtFirstError: true,
  exceptionFactory: (errors = []) => {
    const formattedErrors = {}
    for (const error of errors) {
      formattedErrors[error.property] = Object.values(error.constraints)
    }
    throw new CustomHttpException(
      Object.values(formattedErrors)[0][0],
      HttpStatus.UNPROCESSABLE_ENTITY,
      formattedErrors
    )
  }
}

export default validationOptions
