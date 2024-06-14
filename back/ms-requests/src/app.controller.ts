import { Controller, Get } from "@nestjs/common"

@Controller()
export class AppController {

  @Get("/test")
  getHello(): string {
    return "Hello World from ms-hikes!"
  }
}
