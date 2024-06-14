import { getSession } from "@/actions/getSession"
import axios from "axios"

const apiInstance = axios.create({
  baseURL: "https://api.tripx.site/api/",
  timeout: 10000
})

apiInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    const token = session.accessToken
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }

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

export default apiInstance
