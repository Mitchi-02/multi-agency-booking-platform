import { Module } from "@nestjs/common"
import { QueryCacheService } from "./query-cache.service"
import { CacheModule } from "@nestjs/cache-manager"
import { redisStore } from "cache-manager-redis-yet"

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          ttl: 120000, //in ms
          socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT)
          },
          username: process.env.REDIS_USERNAME,
          password: process.env.REDIS_PASSWORD
        })
      })
    })
  ],
  providers: [QueryCacheService],
  exports: [QueryCacheService]
})
export class QueryCacheModule {}
