import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class QueryCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.cacheManager.reset()
  }

  async get<T>({ key, value, promise }: { key: string; value: any; promise: Promise<T> }) {
    const cacheValue = await this.cacheManager.get(`${key}::${value}`)
    if (cacheValue) return typeof cacheValue === "string" ? JSON.parse(cacheValue) : cacheValue
    const result = await promise
    if (result)
      await this.cacheManager.store.set(
        `${key}::${value}`,
        typeof result === "object" ? JSON.stringify(result) : result
      )
    return result as T
  }

  async set<T>({
    key,
    objectKeyValues,
    value,
    promise,
    result,
    invalidate = []
  }: {
    key: string
    value?: any
    objectKeyValues?: keyof T
    promise?: Promise<T>
    result?: T
    invalidate?: {
      key: string
      value?: string
      all?: boolean
    }[]
  }) {
    if (!result && !promise) return
    if (!result) result = await promise
    if (!value && !objectKeyValues) return
    if (!value) value = result[objectKeyValues]
    if (result) this.cacheManager.set(`${key}::${value}`, typeof result === "object" ? JSON.stringify(result) : result)
    for (const inv of invalidate) {
      if (inv.all) {
        this.cacheManager.store.keys(`${inv.key}::*`).then((keys) =>
          keys.forEach((k) => {
            this.cacheManager.del(k)
          })
        )
      } else {
        this.cacheManager.del(`${inv.key}::${inv.value}`)
      }
    }
    return result
  }

  async invalidate({
    promise,
    couples
  }: {
    promise?: Promise<any>
    couples: { key: string; value?: any; all?: boolean }[]
  }) {
    let res: any
    if (promise) {
      res = await promise
      if (!res) return
    }
    for (const couple of couples) {
      if (couple.all) {
        this.cacheManager.store.keys(`${couple.key}::*`).then((keys) =>
          keys.forEach((k) => {
            this.cacheManager.del(k)
          })
        )
      } else if (couple.value) {
        this.cacheManager.del(`${couple.key}::${couple.value}`)
      }
    }
    return res
  }
}
