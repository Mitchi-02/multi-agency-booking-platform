import { Response, json } from "express"
import { Request } from "express"

export interface RequestWithRawBody extends Request {
  rawBody: Buffer
}

export function rawBodyMiddleware(): any {
  return json({
    verify: (request: RequestWithRawBody, _: Response, buffer: Buffer) => {
      if (request.url === "/webhook" && Buffer.isBuffer(buffer)) {
        request.rawBody = Buffer.from(buffer)
      }
      return true
    }
  })
}
