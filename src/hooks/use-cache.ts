import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

// Конфигурация кэширования для React Query
export const queryConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000, // 10 минут
      retry: (failureCount: number, error: any) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
}

// Хук для работы с кэшем
export const useCache = () => {
  const queryClient = useQueryClient()

  // Очистка кэша
  const clearCache = useCallback(() => {
    queryClient.clear()
  }, [queryClient])

  // Инвалидация конкретного запроса
  const invalidateQuery = useCallback((queryKey: string[]) => {
    queryClient.invalidateQueries({ queryKey })
  }, [queryClient])

  // Предзагрузка данных
  const prefetchQuery = useCallback(async (queryKey: string[], queryFn: () => Promise<any>) => {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: 5 * 60 * 1000,
    })
  }, [queryClient])

  // Получение данных из кэша
  const getCachedData = useCallback((queryKey: string[]) => {
    return queryClient.getQueryData(queryKey)
  }, [queryClient])

  // Установка данных в кэш
  const setCachedData = useCallback((queryKey: string[], data: any) => {
    queryClient.setQueryData(queryKey, data)
  }, [queryClient])

  return {
    clearCache,
    invalidateQuery,
    prefetchQuery,
    getCachedData,
    setCachedData,
  }
}

// Хук для кэшированных запросов
export const useCachedQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean
    staleTime?: number
    gcTime?: number
  }
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: options?.staleTime || 5 * 60 * 1000,
    gcTime: options?.gcTime || 10 * 60 * 1000,
    enabled: options?.enabled !== false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}
