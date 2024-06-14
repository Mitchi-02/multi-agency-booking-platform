"use client"

import { QueryClient } from "@tanstack/react-query"


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 6 * 10000
    }
  }
})

export default queryClient
