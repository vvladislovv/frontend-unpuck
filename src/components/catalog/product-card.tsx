'use client'

import { Product } from '@/types'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import { HeartIcon, StarIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
  priority?: boolean
}

export function ProductCard({ product, viewMode, priority = false }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  // Синхронизируем состояние с localStorage
  useEffect(() => {
    const updateFavoriteState = () => {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      const isInFavorites = savedFavorites.includes(product.id)
      setIsFavorite(isInFavorites)
    }

    // Обновляем состояние при монтировании
    updateFavoriteState()

    // Слушаем изменения в localStorage
    const handleStorageChange = () => {
      updateFavoriteState()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Также слушаем кастомное событие для обновления в той же вкладке
    window.addEventListener('favoritesChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('favoritesChanged', handleStorageChange)
    }
  }, [product.id])

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)
    
    // Сохраняем в localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    if (newFavoriteState) {
      if (!savedFavorites.includes(product.id)) {
        savedFavorites.push(product.id)
      }
    } else {
      const index = savedFavorites.indexOf(product.id)
      if (index > -1) {
        savedFavorites.splice(index, 1)
      }
    }
    localStorage.setItem('favorites', JSON.stringify(savedFavorites))
    
    // Отправляем кастомное событие для обновления других компонентов
    window.dispatchEvent(new CustomEvent('favoritesChanged'))
    
    console.log(`Товар ${product.id} ${newFavoriteState ? 'добавлен в' : 'удален из'} избранное`)
  }

  const handleProductClick = () => {
    // Переход к детальной странице товара
    window.location.href = `/product/${product.id}`
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0


  return (
    <div 
      onClick={handleProductClick}
      className="group cursor-pointer rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={true}
        />
        
        {/* Теги */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {product.tags.includes('новинка') && (
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              NEW
            </div>
          )}
          {discountPercentage > 0 && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              -{discountPercentage}%
            </div>
          )}
        </div>
        
        {/* Кнопка избранного */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/95 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center justify-center backdrop-blur-sm"
        >
          {isFavorite ? (
            <HeartIcon className="h-4 w-4 text-red-500" />
          ) : (
            <HeartOutlineIcon className="h-4 w-4 text-gray-500 hover:text-red-400 transition-colors duration-200" />
          )}
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
          {product.title}
        </h3>
        
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="ml-1 text-xs text-gray-600">
              {product.rating}
            </span>
            <span className="ml-1 text-xs text-gray-400">
              ({product.reviewsCount})
            </span>
          </div>
          
          <div className="text-xs text-gray-500">
            {product.seller.name}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {product.originalPrice && (
              <div className="text-xs text-gray-400 line-through">
                {product.originalPrice.toLocaleString()} ₽
              </div>
            )}
            <div className="text-sm font-semibold text-gray-900">
              {product.price.toLocaleString()} ₽
            </div>
          </div>
          
          {!product.inStock && (
            <div className="text-xs text-red-500 font-medium">
              Нет в наличии
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
