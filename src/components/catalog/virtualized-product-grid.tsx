'use client'

import { Product } from '@/types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ProductCard } from './product-card'

interface VirtualizedProductGridProps {
  products: Product[]
  viewMode: 'grid' | 'list'
  favorites: string[]
  onToggleFavorite: (productId: string) => void
  isLoadingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
}

const ITEM_HEIGHT = 300 // Высота одного товара в пикселях
const CONTAINER_HEIGHT = 600 // Высота видимой области
const OVERSCAN = 5 // Количество элементов для рендера за пределами видимой области

export function VirtualizedProductGrid({
  products,
  viewMode,
  favorites,
  onToggleFavorite,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore
}: VirtualizedProductGridProps) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Вычисляем количество колонок в зависимости от режима просмотра
  const columnsCount = useMemo(() => {
    if (viewMode === 'list') return 1
    // Определяем количество колонок на основе ширины экрана
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      if (width < 640) return 1 // sm
      if (width < 1024) return 2 // lg
      if (width < 1280) return 3 // xl
      return 4 // 2xl+
    }
    return 3
  }, [viewMode])

  // Вычисляем количество строк
  const rowsCount = Math.ceil(products.length / columnsCount)
  const totalHeight = rowsCount * ITEM_HEIGHT

  // Вычисляем видимые элементы
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN)
    const endIndex = Math.min(
      rowsCount - 1,
      Math.ceil((scrollTop + CONTAINER_HEIGHT) / ITEM_HEIGHT) + OVERSCAN
    )
    return { startIndex, endIndex }
  }, [scrollTop, rowsCount])

  // Получаем видимые товары
  const visibleProducts = useMemo(() => {
    const startProductIndex = visibleRange.startIndex * columnsCount
    const endProductIndex = Math.min(
      products.length,
      (visibleRange.endIndex + 1) * columnsCount
    )
    return products.slice(startProductIndex, endProductIndex)
  }, [products, visibleRange, columnsCount])

  // Обработчик скролла
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // Intersection Observer для автоматической подгрузки
  useEffect(() => {
    if (!loadMoreRef.current || !onLoadMore) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore()
        }
      },
      {
        rootMargin: '100px'
      }
    )

    observerRef.current.observe(loadMoreRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoadingMore, onLoadMore])

  // Рендерим товары в строках
  const renderRow = useCallback((rowIndex: number) => {
    const startProductIndex = rowIndex * columnsCount
    const endProductIndex = Math.min(products.length, startProductIndex + columnsCount)
    const rowProducts = products.slice(startProductIndex, endProductIndex)

    return (
      <div
        key={rowIndex}
        className="flex gap-4 mb-4"
        style={{
          height: ITEM_HEIGHT,
          position: 'absolute',
          top: rowIndex * ITEM_HEIGHT,
          left: 0,
          right: 0
        }}
      >
        {rowProducts.map((product, index) => (
          <div
            key={product.id}
            className={`flex-1 ${viewMode === 'list' ? 'w-full' : ''}`}
            style={{
              width: viewMode === 'grid' ? `${100 / columnsCount}%` : '100%'
            }}
          >
            <ProductCard
              product={product}
              viewMode={viewMode}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
        {/* Заполняем пустые места в последней строке */}
        {Array.from({ length: columnsCount - rowProducts.length }).map((_, index) => (
          <div key={`empty-${index}`} className="flex-1" />
        ))}
      </div>
    )
  }, [products, columnsCount, viewMode, favorites, onToggleFavorite])

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Товары не найдены</h3>
          <p className="text-gray-600">Попробуйте изменить параметры поиска или фильтры</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Информация о загруженных товарах */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Показано: {products.length} товаров</span>
        {hasMore && (
          <span className="text-blue-600">
            Еще товары загружаются автоматически...
          </span>
        )}
      </div>

      {/* Виртуализированная сетка */}
      <div
        ref={containerRef}
        className="relative overflow-auto"
        style={{ height: CONTAINER_HEIGHT }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {Array.from({ length: visibleRange.endIndex - visibleRange.startIndex + 1 }).map((_, index) => {
            const rowIndex = visibleRange.startIndex + index
            return renderRow(rowIndex)
          })}
        </div>
      </div>

      {/* Индикатор загрузки для подгрузки */}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Загружаем еще товары...</p>
          </div>
        </div>
      )}

      {/* Элемент для автоматической подгрузки */}
      <div ref={loadMoreRef} className="h-4" />

      {/* Сообщение о том, что все товары загружены */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Все товары загружены</p>
        </div>
      )}
    </div>
  )
}




