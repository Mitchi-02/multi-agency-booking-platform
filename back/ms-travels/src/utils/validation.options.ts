import { HttpStatus, ValidationPipeOptions } from "@nestjs/common"
import { CustomHttpException } from "./CustomHttpException"
import { ValidationOptions, isJSON, registerDecorator, validateSync, ValidationArguments } from "class-validator"
import { plainToInstance } from "class-transformer"

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

export function IsAfter(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          const relatedValue = (args.object as any)[relatedPropertyName]
          return value > relatedValue
        }
      }
    })
  }
}

export function IsValidArray(dto: any, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: "IsValidArray",
      target: object.constructor,
      propertyName,
      constraints: [dto],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [dtoClass] = args.constraints
          return (
            Array.isArray(value) &&
            value.every((item: any) => {
              return isJSON(item) && validateSync(plainToInstance(dtoClass, JSON.parse(item))).length === 0
            })
          )
        }
      }
    })
  }
}