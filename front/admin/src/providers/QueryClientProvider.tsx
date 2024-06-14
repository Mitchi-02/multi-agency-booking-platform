"use client"

import queryClient from "@/lib/queryClient"
import { QueryClientProvider as Provider, QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

function getQueryClient() {
  if (typeof window === "undefined") {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000
        }
      }
    })
  }
  return queryClient
}

export default function QueryClientProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <Provider client={queryClient}>
      {props.children}
      <ReactQueryDevtools />
    </Provider>
  )
}
