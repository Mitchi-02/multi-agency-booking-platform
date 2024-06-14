import { HttpService } from "@nestjs/axios"
import { Injectable } from "@nestjs/common"
import { DiscoveryService, ServiceDto } from "nest-eureka"

@Injectable()
export class ProxyService {
  msUsers: ServiceDto
  constructor(
    private readonly httpService: HttpService,
    private readonly discoveryService: DiscoveryService
  ) {}

  public async getUserById(id: number) {
    this.msUsers = this.discoveryService.resolveHostname("ms-users")
    try {
      const res = await this.httpService.axiosRef.get(`http://ms-users:${this.msUsers.port}/user/internal/${id}`)
      return res.data.data
    } catch (error) {
      return null
    }
  }
}
