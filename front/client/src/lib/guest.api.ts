import axios from "axios"
import { SERVER_URL } from "./constants"

const guestApi = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000
})

guestApi.interceptors.request.use(
  async (config) => {
    if (!config.headers["Content-Type"]) {
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data"
      } else {
        config.headers["Content-Type"] = "application/json"
      }
    }

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default guestApi
