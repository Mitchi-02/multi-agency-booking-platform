import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import validationOptions from "./utils/validation.options"
import { HttpExceptionFilter } from "./utils/http-exception.filter"
import { rawBodyMiddleware } from "./utils/rawBodyMiddleware"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true })
  app.use(rawBodyMiddleware())
  app.useGlobalPipes(new ValidationPipe(validationOptions))
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(process.env.PORT)
}
bootstrap()
