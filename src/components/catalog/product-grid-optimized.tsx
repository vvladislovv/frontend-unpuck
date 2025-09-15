'use client'

import { usePagination } from '@/hooks/use-pagination'
import { useProductsCache } from '@/hooks/use-products-cache'
import { productsAPI } from '@/lib/api'
import { Product } from '@/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ProductCard } from './product-card'

interface ProductGridProps {
  viewMode: 'grid' | 'list'
  searchQuery: string
  category: string
  showFavorites?: boolean
  priceRange?: { min: number; max: number }
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'rating'
  onFavoritesCountChange?: (count: number) => void
}

export function ProductGrid({ 
  viewMode, 
  searchQuery, 
  category, 
  showFavorites = false, 
  priceRange = { min: 0, max: 0 }, 
  sortBy = 'newest',
  onFavoritesCountChange
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  // Хуки для пагинации и кэширования
  const pagination = usePagination({
    initialPageSize: 30,
    loadMoreSize: 10,
    threshold: 1000
  })
  
  const cache = useProductsCache()

  // Параметры запроса
  const requestParams = useMemo(() => ({
    search: searchQuery || undefined,
    category: category !== 'all' ? category : undefined,
    minPrice: priceRange.min > 0 ? priceRange.min : undefined,
    maxPrice: priceRange.max > 0 ? priceRange.max : undefined,
    sortBy: sortBy === 'newest' ? 'date' : sortBy === 'price-low' ? 'price' : sortBy === 'price-high' ? 'price' : 'rating',
    sortOrder: sortBy === 'price-high' ? 'desc' : 'asc',
    limit: pagination.pageSize,
    offset: (pagination.page - 1) * pagination.pageSize
  }), [searchQuery, category, priceRange, sortBy, pagination.page, pagination.pageSize])

  // Ключ кэша
  const cacheKey = cache.generateKey(requestParams)

  // Получаем избранные товары из localStorage
  const getFavoritesFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem('favorites') || '[]')
  }, [])

  // Загружаем товары с сервера
  const loadProducts = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        pagination.setLoadingMore(true)
      } else {
        pagination.setLoading(true)
        setError(null)
      }

      // Проверяем кэш только для первой загрузки
      if (!isLoadMore) {
        const cached = cache.get(cacheKey)
        if (cached) {
          console.log('📦 Используем кэшированные данные')
          setProducts(cached.data)
          pagination.setTotal(cached.total)
          pagination.setHasMore(cached.hasMore)
          pagination.setLoading(false)
          return
        }
      }

      console.log('🔄 Загружаем товары с параметрами:', requestParams)
      const response = await productsAPI.getProducts(requestParams)
      console.log('✅ Ответ сервера:', response.data)
      
      const productsData = response.data.products || response.data.data || response.data
      const total = response.data.pagination?.total || 0
      const hasMore = (pagination.page * pagination.pageSize) < total

      if (isLoadMore) {
        // Добавляем к существующим товарам
        setProducts(prev => {
          const existingIds = new Set(prev.map(item => item.id))
          const newProducts = Array.isArray(productsData) 
            ? productsData.filter(item => !existingIds.has(item.id))
            : []
          return [...prev, ...newProducts]
        })
        cache.append(cacheKey, productsData, total, hasMore)
      } else {
        // Заменяем товары
        setProducts(Array.isArray(productsData) ? productsData : [])
        cache.set(cacheKey, productsData, total, hasMore)
      }

      pagination.setTotal(total)
      pagination.setHasMore(hasMore)
    } catch (err: any) {
      console.error('❌ Ошибка загрузки товаров:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки товаров')
      if (!isLoadMore) {
        setProducts([])
      }
    } finally {
      if (isLoadMore) {
        pagination.setLoadingMore(false)
      } else {
        pagination.setLoading(false)
      }
    }
  }, [requestParams, cacheKey, cache, pagination])

  // Загружаем товары при изменении параметров
  useEffect(() => {
    pagination.reset()
    loadProducts(false)
  }, [searchQuery, category, priceRange.min, priceRange.max, sortBy])

  // Загружаем избранные товары
  useEffect(() => {
    const savedFavorites = getFavoritesFromStorage()
    setFavorites(savedFavorites)
    onFavoritesCountChange?.(savedFavorites.length)
  }, [getFavoritesFromStorage, onFavoritesCountChange])

  // Обработчик подгрузки
  useEffect(() => {
    if (pagination.page > 1 && !pagination.isLoadingMore) {
      loadProducts(true)
    }
  }, [pagination.page])

  // Фильтруем товары по избранному
  const filteredProducts = useMemo(() => {
    return showFavorites 
      ? products.filter(product => favorites.includes(product.id))
      : products
  }, [products, showFavorites, favorites])

  // Переключаем избранное
  const toggleFavorite = useCallback((productId: string) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId]
    
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    onFavoritesCountChange?.(newFavorites.length)
  }, [favorites, onFavoritesCountChange])

  if (pagination.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем товары...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ошибка загрузки</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadProducts(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {showFavorites ? 'Нет избранных товаров' : 'Товары не найдены'}
          </h3>
          <p className="text-gray-600">
            {showFavorites 
              ? 'Добавьте товары в избранное, чтобы они отображались здесь'
              : 'Попробуйте изменить параметры поиска или фильтры'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Информация о загруженных товарах */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Показано: {filteredProducts.length} из {pagination.total}
        </span>
        {pagination.hasMore && (
          <span className="text-blue-600">
            Еще товары загружаются автоматически...
          </span>
        )}
      </div>

      {/* Сетка товаров */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "space-y-4"
      }>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            isFavorite={favorites.includes(product.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {/* Индикатор загрузки для подгрузки */}
      {pagination.isLoadingMore && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Загружаем еще товары...</p>
          </div>
        </div>
      )}

      {/* Кнопка "Загрузить еще" для ручной подгрузки */}
      {pagination.hasMore && !pagination.isLoadingMore && (
        <div className="flex justify-center py-8">
          <button
            onClick={() => pagination.loadMore()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Загрузить еще товары
          </button>
        </div>
      )}

      {/* Элемент для автоматической подгрузки при скролле */}
      <div ref={pagination.loadMoreRef} className="h-4" />

      {/* Сообщение о том, что все товары загружены */}
      {!pagination.hasMore && filteredProducts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Все товары загружены</p>
        </div>
      )}
    </div>
  )
}





