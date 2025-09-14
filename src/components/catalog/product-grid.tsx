'use client'

import { productsAPI } from '@/lib/api'
import { Product } from '@/types'
import { useEffect, useRef, useState } from 'react'
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
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Получаем избранные товары из localStorage
  const getFavoritesFromStorage = () => {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem('favorites') || '[]')
  }

  // Загружаем товары с сервера
  const loadProducts = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setError(null)
        setOffset(0)
      }
      
      const params = {
        search: searchQuery || undefined,
        category: category !== 'all' ? category : undefined,
        minPrice: priceRange.min > 0 ? priceRange.min : undefined,
        maxPrice: priceRange.max > 0 ? priceRange.max : undefined,
        sortBy: sortBy === 'newest' ? 'date' : sortBy === 'price-low' ? 'price' : sortBy === 'price-high' ? 'price' : 'rating',
        sortOrder: sortBy === 'price-high' ? 'desc' : 'asc',
        limit: isLoadMore ? 10 : 30,
        offset: isLoadMore ? offset : 0
      }

      console.log('🔄 Загружаем товары с параметрами:', params)
      const response = await productsAPI.getProducts(params)
      console.log('✅ Ответ сервера:', response.data)
      
      const productsData = response.data.products || response.data.data || response.data
      const newTotal = response.data.pagination?.total || 0
      const currentOffset = isLoadMore ? offset : 0
      const currentLimit = isLoadMore ? 10 : 30
      const newHasMore = (currentOffset + currentLimit) < newTotal

      if (isLoadMore) {
        setProducts(prev => {
          const existingIds = new Set(prev.map(item => item.id))
          const newProducts = Array.isArray(productsData) 
            ? productsData.filter(item => !existingIds.has(item.id))
            : []
          return [...prev, ...newProducts]
        })
        setOffset(prev => prev + 10)
      } else {
        setProducts(Array.isArray(productsData) ? productsData : [])
        setOffset(30)
      }
      
      setTotal(newTotal)
      setHasMore(newHasMore)
    } catch (err: any) {
      console.error('❌ Ошибка загрузки товаров:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки товаров')
      if (!isLoadMore) {
        setProducts([])
      }
    } finally {
      if (isLoadMore) {
        setLoadingMore(false)
      } else {
        setLoading(false)
      }
    }
  }

  // Подгрузка товаров
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadProducts(true)
    }
  }

  // Загружаем товары при изменении параметров
  useEffect(() => {
    loadProducts()
  }, [searchQuery, category, priceRange, sortBy])

  // Intersection Observer для автоматической подгрузки
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore()
        }
      },
      {
        rootMargin: '100px'
      }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [hasMore, loadingMore, loading])

  // Загружаем избранное при монтировании компонента
  useEffect(() => {
    // Очищаем localStorage при первой загрузке (для тестирования)
    if (typeof window !== 'undefined') {
      const isFirstLoad = !localStorage.getItem('favoritesInitialized')
      if (isFirstLoad) {
        localStorage.setItem('favorites', '[]')
        localStorage.setItem('favoritesInitialized', 'true')
      }
    }
    const initialFavorites = getFavoritesFromStorage()
    setFavorites(initialFavorites)
    
    // Уведомляем о начальном количестве
    if (onFavoritesCountChange) {
      onFavoritesCountChange(initialFavorites.length)
    }
  }, [onFavoritesCountChange])

  // Слушаем изменения в localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newFavorites = getFavoritesFromStorage()
      setFavorites(newFavorites)
      
      // Уведомляем родительский компонент о количестве избранных
      if (onFavoritesCountChange) {
        onFavoritesCountChange(newFavorites.length)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('favoritesChanged', handleStorageChange)
    
    // Инициализируем количество при загрузке
    if (onFavoritesCountChange) {
      onFavoritesCountChange(favorites.length)
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('favoritesChanged', handleStorageChange)
    }
  }, [favorites.length, onFavoritesCountChange])

  // Переключаем избранное
  const toggleFavorite = (productId: string) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId]
    
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    onFavoritesCountChange?.(newFavorites.length)
  }

  // Фильтрация товаров (дополнительная фильтрация на клиенте для избранного)
  let filteredProducts = products.filter((product) => {
    // Проверяем избранное из состояния
    const isInFavorites = favorites.includes(product.id)
    const matchesFavorites = !showFavorites || isInFavorites || product.isFavorite

    return matchesFavorites
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Загрузка товаров...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ошибка загрузки</h3>
        <p className="text-gray-500 text-center mb-4">{error}</p>
        <button
          onClick={loadProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Товары не найдены</h3>
        <p className="text-gray-500 text-center">
          Попробуйте изменить поисковый запрос или фильтры
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            priority={index < 4} // Приоритет для первых 4 товаров
            isFavorite={favorites.includes(product.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {/* Кнопка подгрузки */}
      {hasMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loadingMore ? 'Загружаем...' : 'Загрузить еще'}
          </button>
        </div>
      )}

      {/* Индикатор загрузки */}
      {loadingMore && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Элемент для отслеживания прокрутки */}
      <div ref={loadMoreRef} className="h-4" />
    </div>
  )
}
