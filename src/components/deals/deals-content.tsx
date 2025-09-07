'use client'

import { Deal, DealStatus } from '@/types'
import { useState } from 'react'
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

const statusFilters: { id: DealStatus | 'all'; label: string; count: number }[] = [
  { id: 'all', label: 'Все', count: mockDeals.length },
  { id: 'pending', label: 'Ожидает', count: mockDeals.filter(d => d.status === 'pending').length },
  { id: 'confirmed', label: 'Подтверждено', count: mockDeals.filter(d => d.status === 'confirmed').length },
  { id: 'shipped', label: 'Отправлено', count: mockDeals.filter(d => d.status === 'shipped').length },
  { id: 'delivered', label: 'Доставлено', count: mockDeals.filter(d => d.status === 'delivered').length },
  { id: 'cancelled', label: 'Отменено', count: mockDeals.filter(d => d.status === 'cancelled').length },
]

export function DealsContent() {
  const [selectedStatus, setSelectedStatus] = useState<DealStatus | 'all'>('all')

  const filteredDeals = selectedStatus === 'all' 
    ? mockDeals 
    : mockDeals.filter(deal => deal.status === selectedStatus)

  return (
    <div className="min-h-screen bg-white">
      {/* Заголовок */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">Сделки</h1>
      </div>

      {/* Фильтры статусов */}
      <div className="px-4 py-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedStatus(filter.id)}
              className={`flex items-center space-x-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedStatus === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{filter.label}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Список сделок */}
      <div className="px-4 pb-4">
        {filteredDeals.length === 0 ? (
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
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
