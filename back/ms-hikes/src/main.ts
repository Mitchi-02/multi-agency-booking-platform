import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { HttpExceptionFilter } from "./utils/http-exception.filter"
import { ValidationPipe } from "@nestjs/common"
import validationOptions from "./utils/validation.options"
import mongoose from "mongoose"

async function bootstrap() {
  mongoose.set("debug", true)
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe(validationOptions)
  )
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(process.env.PORT)
}
bootstrap()
