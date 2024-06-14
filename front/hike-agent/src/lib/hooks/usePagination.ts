import { SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import { DefinedInitialDataOptions, QueryKey, useQuery } from "@tanstack/react-query"
import { CustomAxiosError, PaginationQuery, PaginationResponse } from "@/api/types"
import { usePathname } from "next/navigation"
import { emptyParam } from "../utils"
import useDebounce from "./useDebounce"

export interface hookReturnData<Q, T> {
  isLoading: boolean
  isDebounceLoading: boolean
  isError: boolean
  debounceQuery: (wait: number | undefined, query: Q, shouldUpdateUrl?: boolean) => void
  setQuery: (query: SetStateAction<Q>, keep?: boolean) => void
  data: T[]
  query: Q
  setSingleQuery: (key: keyof Q, value: Q[keyof Q], shouldUpdateUrl?: boolean) => void
  debounceSingleQuery: (wait: number | undefined, key: keyof Q, value: Q[keyof Q], shouldUpdateUrl?: boolean) => void
  pagination: {
    setPage: (page: SetStateAction<number>, keep?: boolean) => void
    currentPage: number
    pages: number
    count: number
    canNext: boolean
    canPrev: boolean
  }
}

export interface usePaginationProps<Q, T> {
  fetchMethod: (query: Q) => Promise<PaginationResponse<T>>
  queryKey: string
  initialQuery?: Q
  dependencies?: string[]
  options?: Omit<
    DefinedInitialDataOptions<any, CustomAxiosError, PaginationResponse<T>, QueryKey>,
    "queryKey" | "queryFn" | "placeholderData"
  >
}

const usePagination = <Q extends PaginationQuery, T>({
  fetchMethod,
  queryKey,
  initialQuery,
  dependencies,
  options
}: usePaginationProps<Q, T>): hookReturnData<Q, T> => {
  const [query, setQuery] = useState(
    initialQuery ??
      ({
        page: 1
      } as Q)
  )
  const [isDebounceLoading, setIsDebounceLoading] = useState(false)
  const keepData = useRef(false)
  const pathname = usePathname()

  //used on search inputs
  const debounceQuery = useDebounce((q: Q, shouldUpdateUrl?: boolean) => {
    if (shouldUpdateUrl) {
      updateUrl(q)
    }
    setIsDebounceLoading(true)
    keepData.current = false
    setQuery({
      ...q,
      page: 1
    })
  })

  const { isLoading, isError, data } = useQuery<any, CustomAxiosError, PaginationResponse<T>>({
    queryFn: async () => {
      const response = await fetchMethod(query)
      setPages(Math.ceil(response.count / response.page_size))
      setCount(response.count)
      setIsDebounceLoading(false)
      if (!keepData.current) {
        setResults(response.results)
      } else {
        keepData.current = false
        setResults((prev) => [...prev, ...response.results])
      }
      return response
    },
    queryKey: [queryKey, query, ...(dependencies ?? [])],
    ...(options ?? {})
  })

  useEffect(() => {
    if (isError) setIsDebounceLoading(false)
  }, [isError])

  const [results, setResults] = useState<T[]>(data?.results ?? [])
  const [pages, setPages] = useState(data ? Math.ceil(data.count / data.page_size) : 1)
  const [count, setCount] = useState(data?.count || 0)

  useEffect(() => {
    setQuery(
      initialQuery ??
        ({
          page: 1
        } as Q)
    )
  }, [initialQuery])

  const updateUrl = useCallback(
    (q: Q) => {
      const temp: Record<string, any> = { ...q }
      if (q.page === 1) delete temp.page
      const newUrl = Object.keys(emptyParam(temp)).length
        ? `${pathname}?${new URLSearchParams(emptyParam(temp)).toString()}`
        : pathname

      if (newUrl !== window.location.pathname + window.location.search) {
        window.history.pushState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl)
      }
    },
    [pathname]
  )

  const setSingleQuery = useCallback(
    <K extends keyof Q>(key: K, value: Q[K], shouldUpdateUrl?: boolean) => {
      setQuery((prev) => {
        if (shouldUpdateUrl) {
          updateUrl({
            ...prev,
            [key]: value
          })
        }
        return {
          ...prev,
          [key]: value
        }
      })
    },
    [setQuery, updateUrl]
  )

  const debounceSingleQuery = useDebounce(<K extends keyof Q>(key: K, value: Q[K], shouldUpdateUrl?: boolean) => {
    setIsDebounceLoading(true)
    setQuery((prev) => {
      if (shouldUpdateUrl) {
        updateUrl({
          ...prev,
          [key]: value
        })
      }
      return { ...prev, [key]: value, page: 1 }
    })
  })

  const setQ = useCallback(
    (q: SetStateAction<Q>, keep?: boolean) => {
      keepData.current = keep ?? false
      if (typeof q === "function") {
        setQuery((prev) => q(prev))
      } else {
        setQuery(q)
      }
    },
    [setQuery]
  )

  const setP = useCallback(
    (page: SetStateAction<number>, keep?: boolean) => {
      keepData.current = keep ?? false
      if (typeof page === "function") {
        setQuery((prev) => ({
          ...prev,
          page: page(prev.page)
        }))
      } else {
        setQuery((prev) => ({
          ...prev,
          page
        }))
      }
    },
    [setQuery]
  )

  return {
    data: results,
    isError,
    isDebounceLoading,
    setSingleQuery,
    debounceSingleQuery,
    isLoading,
    debounceQuery,
    setQuery: setQ,
    query,
    pagination: {
      currentPage: query.page,
      pages,
      count,
      canNext: query.page < pages,
      canPrev: query.page > 1,
      setPage: setP
    }
  }
}

export default usePagination
