'use client'

import { getDealsFromStorage, saveDealsToStorage } from '@/lib/storage'
import { Deal } from '@/types'
import { useEffect, useState } from 'react'
import { DealCard } from './deal-card'

// Тестовые данные сделок
const mockDeals: Deal[] = [
  {
    id: '1',
    product: {
      id: '1',
      title: 'Электрические МЕЛЬНИЦЫ',
      description: 'Современные электрические мельницы для дома и офиса',
      price: 2500,
      originalPrice: 3000,
      category: 'kitchen',
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
    },
    buyer: {
      id: '2',
      name: 'Иван Петров',
      email: 'ivan@example.com',
      role: 'buyer' as const,
      verified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    seller: {
      id: '1',
      name: 'KitchenPro',
      email: 'kitchen@example.com',
      role: 'seller' as const,
      verified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    status: 'shipped',
    quantity: 1,
    totalPrice: 2500,
    paymentMethod: 'card',
    trackingNumber: 'TRK123456789',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    estimatedDelivery: '2024-01-20T18:00:00Z',
  },
  {
    id: '2',
    product: {
      id: '2',
      title: 'МАТОВАЯ ПОМАДА КАРАНДАШ 3B1 N°11',
      description: 'Качественная матовая помада-карандаш для губ',
      price: 890,
      originalPrice: 1200,
      category: 'beauty',
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
    },
    buyer: {
      id: '2',
      name: 'Иван Петров',
      email: 'ivan@example.com',
      role: 'buyer' as const,
      verified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    seller: {
      id: '2',
      name: 'BeautyStore',
      email: 'beauty@example.com',
      role: 'seller' as const,
      verified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    status: 'delivered',
    quantity: 2,
    totalPrice: 1780,
    paymentMethod: 'wallet',
    createdAt: '2024-01-10T15:30:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
  },
  {
    id: '3',
    product: {
      id: '3',
      title: 'БЛЕСК ДЛЯ ГУБ',
      description: 'Блестящий блеск для губ с долгим эффектом',
      price: 450,
      category: 'beauty',
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
    },
    buyer: {
      id: '2',
      name: 'Иван Петров',
      email: 'ivan@example.com',
      role: 'buyer' as const,
      verified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    seller: {
      id: '3',
      name: 'CosmeticShop',
      email: 'cosmetic@example.com',
      role: 'seller' as const,
      verified: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    status: 'pending',
    quantity: 1,
    totalPrice: 450,
    paymentMethod: 'crypto',
    createdAt: '2024-01-18T12:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
  },
]

export function DealsContent() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Сначала проверяем localStorage
    const storedDeals = getDealsFromStorage()
    if (storedDeals) {
      setDeals(storedDeals)
      setLoading(false)
      return
    }

    // Если в localStorage нет, инициализируем с mockDeals
    setDeals(mockDeals)
    saveDealsToStorage(mockDeals)
    setLoading(false)
  }, [])

  // Слушаем изменения в localStorage и кастомные события
  useEffect(() => {
    const handleStorageChange = () => {
      const storedDeals = getDealsFromStorage()
      if (storedDeals) {
        setDeals(storedDeals)
      }
    }

    const handleDealUpdate = () => {
      const storedDeals = getDealsFromStorage()
      if (storedDeals) {
        setDeals(storedDeals)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('dealUpdated', handleDealUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('dealUpdated', handleDealUpdate)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Заголовок */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 pt-6">
        <h1 className="text-xl font-bold text-gray-900">Сделки</h1>
      </div>

      {/* Список сделок */}
      <div className="px-6 pb-6 pt-6">
        {deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Сделок не найдено</h3>
            <p className="text-gray-500 text-center">
              У вас пока нет сделок с выбранным статусом
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {deals.map((deal) => (
              <DealCard 
                key={deal.id} 
                deal={deal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

