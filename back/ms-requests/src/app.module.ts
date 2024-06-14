import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { EurekaModule } from "nest-eureka"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { AgencyRequestModule } from "./agency-request/agency-request.module"
import { SeederModule } from "./seeder/seeder.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`,
      {
        dbName: process.env.DB_DATABASE
      }
    ),
    EurekaModule.forRoot({
      global: true,
      disable: false,
      disableDiscovery: false,
      eureka: {
        host: process.env.EUREKA_HOST,
        port: process.env.EUREKA_PORT,
        servicePath: process.env.EUREKA_URL,
        maxRetries: 10,
        requestRetryDelay: 100
      },
      service: {
        name: "ms-requests",
        port: parseInt(process.env.PORT)
      }
    }),
    AgencyRequestModule,
    SeederModule
  ],
  controllers: [AppController]
})
export class AppModule {}
