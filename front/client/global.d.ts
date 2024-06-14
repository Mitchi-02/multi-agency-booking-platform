declare module "*.svg" {
  import { FC, SVGProps } from "react"
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>
  export default SVG
}

declare module "*.svg?url" {
  const content: any
  export default content
}

//change global axios error type
import { AxiosError as Ax } from "axios"

declare module "axios" {
  export interface AxiosError extends Ax {
    response: AxiosResponse<{
      message: string
      errors: Record<string, string[]>
    }>
  }
}
