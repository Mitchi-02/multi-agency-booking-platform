import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { EurekaModule } from "nest-eureka"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import CreateTravelPaymentsTable1709927923346 from "./database/migrations/1709927923346-create_travel_payments_table"
import { StripeModule } from "./stripe/stripe.module"
import CreateHikePaymentsTable1709927923346 from "./database/migrations/1715622641318-create_hike_payments_table"
import { TravelPaymentIntentModule } from "./travel-payment-intent/travel-payment-intent.module"
import { PaymentWebhookModule } from "./payment-webhook/payment-webhook.module"
import { HikePaymentIntentModule } from "./hike-payment-intent/hike-payment-intent.module"
import { QueryCacheModule } from "./query-cache/query-cache.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_CONNECTION as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      autoLoadEntities: true,
      migrations: [CreateTravelPaymentsTable1709927923346, CreateHikePaymentsTable1709927923346],
      database: process.env.DB_DATABASE,
      synchronize: true,
      logging: true,
      migrationsRun: true
    }),
    EurekaModule.forRoot({
      disable: false,
      global: true,
      disableDiscovery: false,
      eureka: {
        host: process.env.EUREKA_HOST,
        port: process.env.EUREKA_PORT,
        servicePath: process.env.EUREKA_URL,
        maxRetries: 1000000000,
        requestRetryDelay: 10000
      },
      service: {
        name: "ms-payment",
        port: parseInt(process.env.PORT)
      }
    }),
    StripeModule,
    TravelPaymentIntentModule,
    HikePaymentIntentModule,
    PaymentWebhookModule,
    QueryCacheModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
