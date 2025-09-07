'use client'

import { Product } from '@/types'
import { useEffect, useState } from 'react'
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

// Тестовые данные товаров
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Электрические МЕЛЬНИЦЫ',
    description: 'Современные электрические мельницы для дома и офиса',
    price: 2500,
    originalPrice: 3000,
    category: 'home',
    subcategory: 'kitchen',
    images: ['/api/placeholder/300/300'],
    rating: 4.5,
    reviewsCount: 23,
    seller: {
      id: '1',
      name: 'KitchenPro',
      avatar: '/api/placeholder/40/40',
      verified: true,
    },
    inStock: true,
    tags: ['новинка', 'скидка'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    isFavorite: false,
  },
  {
    id: '2',
    title: 'МАТОВАЯ ПОМАДА КАРАНДАШ 3B1 N°11',
    description: 'Качественная матовая помада-карандаш для губ',
    price: 890,
    originalPrice: 1200,
    category: 'beauty',
    subcategory: 'makeup',
    images: ['/api/placeholder/300/300'],
    rating: 4.8,
    reviewsCount: 156,
    seller: {
      id: '2',
      name: 'BeautyStore',
      avatar: '/api/placeholder/40/40',
      verified: true,
    },
    inStock: true,
    tags: ['новинка', 'хит'],
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14',
    isFavorite: false,
  },
  {
    id: '3',
    title: 'БЛЕСК ДЛЯ ГУБ',
    description: 'Блестящий блеск для губ с долгим эффектом',
    price: 450,
    category: 'beauty',
    subcategory: 'makeup',
    images: ['/api/placeholder/300/300'],
    rating: 4.2,
    reviewsCount: 89,
    seller: {
      id: '3',
      name: 'CosmeticShop',
      avatar: '/api/placeholder/40/40',
      verified: false,
    },
    inStock: true,
    tags: ['популярное'],
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13',
    isFavorite: false,
  },
  {
    id: '4',
    title: 'РУМЯНА 2 В 1 СУХИЕ И КРЕМОВЫЕ N°01',
    description: 'Универсальные румяна сухие и кремовые в одном',
    price: 1200,
    category: 'beauty',
    subcategory: 'makeup',
    images: ['/api/placeholder/300/300'],
    rating: 4.6,
    reviewsCount: 67,
    seller: {
      id: '4',
      name: 'BeautyPro',
      avatar: '/api/placeholder/40/40',
      verified: true,
    },
    inStock: true,
    tags: ['2в1', 'качество'],
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
    isFavorite: false,
  },
  {
    id: '5',
    title: 'РУМЯНА 2 В 1 СУХИЕ И КРЕМОВЫЕ N°04',
    description: 'Универсальные румяна сухие и кремовые в одном',
    price: 1200,
    category: 'beauty',
    subcategory: 'makeup',
    images: ['/api/placeholder/300/300'],
    rating: 4.4,
    reviewsCount: 45,
    seller: {
      id: '4',
      name: 'BeautyPro',
      avatar: '/api/placeholder/40/40',
      verified: true,
    },
    inStock: true,
    tags: ['2в1', 'качество'],
    createdAt: '2024-01-11',
    updatedAt: '2024-01-11',
    isFavorite: false,
  },
  {
    id: '6',
    title: 'Зеленые растения для дома',
    description: 'Комнатные растения для украшения интерьера',
    price: 800,
    category: 'home',
    subcategory: 'decor',
    images: ['/api/placeholder/300/300'],
    rating: 4.7,
    reviewsCount: 34,
    seller: {
      id: '5',
      name: 'GreenHome',
      avatar: '/api/placeholder/40/40',
      verified: true,
    },
    inStock: true,
    tags: ['растения', 'дом'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    isFavorite: false,
  },
  {
    id: '7',
    title: 'Джинсы классические',
    description: 'Удобные джинсы из качественного денима',
    price: 2500,
    category: 'clothing',
    subcategory: 'pants',
    images: ['/api/placeholder/300/300'],
    rating: 4.3,
    reviewsCount: 78,
    seller: {
      id: '6',
      name: 'FashionStore',
      avatar: '/api/placeholder/40/40',
      verified: true,
    },
    inStock: true,
    tags: ['джинсы', 'классика'],
    createdAt: '2024-01-09',
    updatedAt: '2024-01-09',
    isFavorite: false,
  },
  {
    id: '8',
    title: 'Белая футболка',
    description: 'Мягкая хлопковая футболка базового кроя',
    price: 800,
    category: 'clothing',
    subcategory: 'shirts',
    images: ['/api/placeholder/300/300'],
    rating: 4.5,
    reviewsCount: 123,
    seller: {
      id: '7',
      name: 'BasicWear',
      avatar: '/api/placeholder/40/40',
      verified: true,
    },
    inStock: true,
    tags: ['базовая', 'хлопок'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
    isFavorite: false,
  },
  {
    id: '9',
    title: 'Смартфон iPhone 15',
    description: 'Новейший смартфон с отличной камерой',
    price: 89990,
    originalPrice: 99990,
    category: 'electronics',
    subcategory: 'phones',
    images: ['/api/placeholder/300/300'],
    rating: 4.9,
    reviewsCount: 234,
    seller: {
      id: '8',
      name: 'TechStore',
      avatar: '/api/placeholder/40/40',
      verified: true,
    },
    inStock: true,
    tags: ['новинка', 'скидка', 'премиум'],
    createdAt: '2024-01-07',
    updatedAt: '2024-01-07',
    isFavorite: false,
  },
  {
    id: '10',
    title: 'Книга "Программирование"',
    description: 'Учебник по современному программированию',
    price: 1200,
    category: 'other',
    subcategory: 'other',
    images: ['/api/placeholder/300/300'],
    rating: 4.6,
    reviewsCount: 45,
    seller: {
      id: '9',
      name: 'BookStore',
      avatar: '/api/placeholder/40/40',
      verified: true,
    },
    inStock: true,
    tags: ['учеба', 'технологии'],
    createdAt: '2024-01-06',
    updatedAt: '2024-01-06',
    isFavorite: false,
  },
]

export function ProductGrid({ 
  viewMode, 
  searchQuery, 
  category, 
  showFavorites = false, 
  priceRange = { min: 0, max: 0 }, 
  sortBy = 'newest',
  onFavoritesCountChange
}: ProductGridProps) {
  const [favorites, setFavorites] = useState<string[]>([])

  // Получаем избранные товары из localStorage
  const getFavoritesFromStorage = () => {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem('favorites') || '[]')
  }

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

  // Фильтрация товаров
  let filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = category === 'all' || product.category === category

    // Проверяем избранное из состояния
    const isInFavorites = favorites.includes(product.id)
    const matchesFavorites = !showFavorites || isInFavorites || product.isFavorite

    const matchesPriceRange = (priceRange.min === 0 && priceRange.max === 0) || 
                             (product.price >= priceRange.min && 
                              (priceRange.max === 0 || product.price <= priceRange.max))

    return matchesSearch && matchesCategory && matchesFavorites && matchesPriceRange
  })

  // Сортировка товаров
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

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
    <div className="grid grid-cols-2 gap-4">
      {filteredProducts.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          priority={index < 4} // Приоритет для первых 4 товаров
        />
      ))}
    </div>
  )
}
