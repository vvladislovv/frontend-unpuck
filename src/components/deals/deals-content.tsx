'use client'

import { dealsAPI } from '@/lib/api'
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
  const [error, setError] = useState<string | null>(null)

  // Загружаем сделки с сервера
  const loadDeals = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await dealsAPI.getMyDeals({ limit: 50, offset: 0 })
      const dealsData = response.data.data || response.data
      const dealsArray = Array.isArray(dealsData) ? dealsData : []
      
      setDeals(dealsArray)
      saveDealsToStorage(dealsArray)
    } catch (err: any) {
      console.error('Ошибка загрузки сделок:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки сделок')
      
      // Fallback на localStorage или моковые данные
      const storedDeals = getDealsFromStorage()
      if (storedDeals && storedDeals.length > 0) {
        setDeals(storedDeals)
      } else {
        setDeals(mockDeals)
        saveDealsToStorage(mockDeals)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDeals()
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
          <p className="text-gray-600">Загрузка сделок...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ошибка загрузки</h3>
          <p className="text-gray-500 text-center mb-4">{error}</p>
          <button
            onClick={loadDeals}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Попробовать снова
          </button>
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

