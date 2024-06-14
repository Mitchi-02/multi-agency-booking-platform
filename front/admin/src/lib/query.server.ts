// app/getQueryClient.jsx
import { QueryClient } from "@tanstack/react-query"
import { cache } from "react"

// cache() is scoped per request, so we don't leak data between requests
const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60000
        }
      }
    })
)
export default getQueryClient
