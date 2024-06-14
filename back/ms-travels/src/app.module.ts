import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { EurekaModule } from "nest-eureka"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { TravelAgencyModule } from "./travel-agency/travel-agency.module"
import { TravelModule } from "./travel/travel.module"
import { SeederModule } from "./seeder/seeder.module"
import { TravelBookingModule } from "./travel-booking/travel-booking.module"
import { QueryCacheModule } from "./query-cache/query-cache.module"
import { TravelReviewModule } from "./travel-review/travel-review.module"
import { KafkaModule } from "./kafka/kafka.module"

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
        requestRetryDelay: 10000
      },
      service: {
        name: "ms-travels",
        port: parseInt(process.env.PORT)
      }
    }),
    TravelAgencyModule,
    TravelModule,
    SeederModule,
    TravelBookingModule,
    QueryCacheModule,
    TravelReviewModule,
    KafkaModule
  ],
  controllers: [AppController]
})
export class AppModule {}
