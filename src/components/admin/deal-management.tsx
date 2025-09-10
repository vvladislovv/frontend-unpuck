'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Deal, DealStatus } from '@/types'
import {
    CheckCircleIcon,
    ClockIcon,
    EyeIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    TruckIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

// Моковые данные сделок
const mockDeals: Deal[] = [
  {
    id: '1',
    product: {
      id: 'prod1',
      title: 'Кроссовки Nike Air Max 270',
      description: 'Стильные и удобные кроссовки',
      price: 8999,
      originalPrice: 12999,
      category: 'Обувь',
      subcategory: 'Кроссовки',
      images: ['/products/nike1.jpg'],
      rating: 4.8,
      reviewsCount: 156,
      seller: {
        id: 'seller1',
        name: 'СпортМир',
        avatar: '/avatars/seller1.jpg',
        verified: true,
      },
      inStock: true,
      tags: ['nike', 'кроссовки'],
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
    },
    buyer: {
      id: 'buyer1',
      name: 'Анна Петрова',
      email: 'anna@email.com',
      phone: '+7 (999) 123-45-67',
      avatar: '/avatars/user1.jpg',
      role: 'buyer',
      verified: true,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
    },
    seller: {
      id: 'seller1',
      name: 'СпортМир',
      email: 'sport@email.com',
      phone: '+7 (999) 234-56-78',
      avatar: '/avatars/seller1.jpg',
      role: 'seller',
      verified: true,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
    },
    status: 'pending',
    quantity: 1,
    totalPrice: 8999,
    paymentMethod: 'card',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    estimatedDelivery: '2024-01-20T00:00:00Z',
  },
  {
    id: '2',
    product: {
      id: 'prod2',
      title: 'Платье летнее в цветочек',
      description: 'Легкое платье из хлопка',
      price: 2499,
      category: 'Одежда',
      subcategory: 'Платья',
      images: ['/products/dress1.jpg'],
      rating: 4.5,
      reviewsCount: 89,
      seller: {
        id: 'seller2',
        name: 'Модный стиль',
        avatar: '/avatars/seller2.jpg',
        verified: true,
      },
      inStock: true,
      tags: ['платье', 'лето'],
      createdAt: '2024-01-12T16:20:00Z',
      updatedAt: '2024-01-14T09:15:00Z',
    },
    buyer: {
      id: 'buyer2',
      name: 'Елена Смирнова',
      email: 'elena@email.com',
      phone: '+7 (999) 345-67-89',
      avatar: '/avatars/user3.jpg',
      role: 'buyer',
      verified: false,
      createdAt: '2024-01-10T16:20:00Z',
      updatedAt: '2024-01-16T11:45:00Z',
    },
    seller: {
      id: 'seller2',
      name: 'Модный стиль',
      email: 'fashion@email.com',
      phone: '+7 (999) 456-78-90',
      avatar: '/avatars/seller2.jpg',
      role: 'seller',
      verified: true,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
    },
    status: 'shipped',
    quantity: 1,
    totalPrice: 2499,
    paymentMethod: 'wallet',
    trackingNumber: 'RU123456789',
    createdAt: '2024-01-14T15:45:00Z',
    updatedAt: '2024-01-16T09:20:00Z',
    estimatedDelivery: '2024-01-18T00:00:00Z',
  },
  {
    id: '3',
    product: {
      id: 'prod3',
      title: 'Смартфон iPhone 14',
      description: 'Новейший iPhone с отличной камерой',
      price: 89999,
      originalPrice: 99999,
      category: 'Электроника',
      subcategory: 'Телефоны',
      images: ['/products/iphone1.jpg'],
      rating: 4.9,
      reviewsCount: 234,
      seller: {
        id: 'seller3',
        name: 'ТехноМир',
        avatar: '/avatars/seller3.jpg',
        verified: true,
      },
      inStock: false,
      tags: ['iphone', 'смартфон'],
      createdAt: '2024-01-08T12:00:00Z',
      updatedAt: '2024-01-16T11:45:00Z',
    },
    buyer: {
      id: 'buyer3',
      name: 'Михаил Иванов',
      email: 'mikhail@email.com',
      phone: '+7 (999) 567-89-01',
      avatar: '/avatars/user2.jpg',
      role: 'buyer',
      verified: true,
      createdAt: '2024-01-05T12:00:00Z',
      updatedAt: '2024-01-14T09:15:00Z',
    },
    seller: {
      id: 'seller3',
      name: 'ТехноМир',
      email: 'tech@email.com',
      phone: '+7 (999) 678-90-12',
      avatar: '/avatars/seller3.jpg',
      role: 'seller',
      verified: true,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
    },
    status: 'delivered',
    quantity: 1,
    totalPrice: 89999,
    paymentMethod: 'crypto',
    trackingNumber: 'RU987654321',
    createdAt: '2024-01-10T12:00:00Z',
    updatedAt: '2024-01-18T16:30:00Z',
    estimatedDelivery: '2024-01-15T00:00:00Z',
  },
]

interface DealManagementProps {
  onViewDeal: (deal: Deal) => void
  onUpdateDealStatus: (dealId: string, status: DealStatus) => void
  onResolveDispute: (dealId: string, resolution: string) => void
}

export function DealManagement({ 
  onViewDeal, 
  onUpdateDealStatus, 
  onResolveDispute 
}: DealManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [showFilters, setShowFilters] = useState(false)

  const statuses = [
    { value: 'all', label: 'Все статусы' },
    { value: 'pending', label: 'Ожидает подтверждения' },
    { value: 'confirmed', label: 'Подтверждена' },
    { value: 'shipped', label: 'Отправлена' },
    { value: 'delivered', label: 'Доставлена' },
    { value: 'cancelled', label: 'Отменена' },
  ]

  const filteredDeals = mockDeals.filter(deal => {
    const matchesSearch = deal.product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.id.includes(searchQuery)
    const matchesStatus = selectedStatus === 'all' || deal.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.totalPrice - a.totalPrice
      case 'buyer':
        return a.buyer.name.localeCompare(b.buyer.name)
      case 'seller':
        return a.seller.name.localeCompare(b.seller.name)
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const getStatusBadgeVariant = (status: DealStatus) => {
    switch (status) {
      case 'pending': return 'secondary'
      case 'confirmed': return 'default'
      case 'shipped': return 'outline'
      case 'delivered': return 'default'
      case 'cancelled': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusLabel = (status: DealStatus) => {
    switch (status) {
      case 'pending': return 'Ожидает подтверждения'
      case 'confirmed': return 'Подтверждена'
      case 'shipped': return 'Отправлена'
      case 'delivered': return 'Доставлена'
      case 'cancelled': return 'Отменена'
      default: return status
    }
  }

  const getStatusIcon = (status: DealStatus) => {
    switch (status) {
      case 'pending': return ClockIcon
      case 'confirmed': return CheckCircleIcon
      case 'shipped': return TruckIcon
      case 'delivered': return CheckCircleIcon
      case 'cancelled': return XCircleIcon
      default: return ClockIcon
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card': return 'Карта'
      case 'wallet': return 'Кошелек'
      case 'crypto': return 'Криптовалюта'
      default: return method
    }
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление сделками</h2>
          <p className="text-gray-600">Всего сделок: {mockDeals.length}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">
            Ожидают: {mockDeals.filter(d => d.status === 'pending').length}
          </Badge>
          <Badge variant="default">
            Активные: {mockDeals.filter(d => ['confirmed', 'shipped'].includes(d.status)).length}
          </Badge>
          <Badge variant="outline">
            Завершены: {mockDeals.filter(d => d.status === 'delivered').length}
          </Badge>
        </div>
      </div>

      {/* Поиск и фильтры */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск сделок..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">По дате</option>
              <option value="price">По сумме</option>
              <option value="buyer">По покупателю</option>
              <option value="seller">По продавцу</option>
            </select>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сумма от
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сумма до
                </label>
                <input
                  type="number"
                  placeholder="100000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Способ оплаты
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="all">Все</option>
                  <option value="card">Карта</option>
                  <option value="wallet">Кошелек</option>
                  <option value="crypto">Криптовалюта</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Список сделок */}
      <div className="space-y-4">
        {sortedDeals.map((deal) => {
          const StatusIcon = getStatusIcon(deal.status)
          return (
            <Card key={deal.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {deal.product.images[0] ? (
                      <img
                        src={deal.product.images[0]}
                        alt={deal.product.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">Нет фото</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {deal.product.title}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {deal.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIcon className="h-5 w-5 text-gray-400" />
                  <Badge variant={getStatusBadgeVariant(deal.status)}>
                    {getStatusLabel(deal.status)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Покупатель</p>
                  <p className="text-sm font-medium">{deal.buyer.name}</p>
                  <p className="text-xs text-gray-500">{deal.buyer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Продавец</p>
                  <p className="text-sm font-medium">{deal.seller.name}</p>
                  <p className="text-xs text-gray-500">{deal.seller.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Сумма</p>
                  <p className="text-lg font-bold text-blue-600">
                    {deal.totalPrice.toLocaleString()} ₽
                  </p>
                  <p className="text-xs text-gray-500">
                    {getPaymentMethodLabel(deal.paymentMethod)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Количество</p>
                  <p className="text-sm font-medium">{deal.quantity} шт.</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Дата создания</p>
                  <p className="text-sm font-medium">
                    {new Date(deal.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>

              {deal.trackingNumber && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Трек-номер:</strong> {deal.trackingNumber}
                  </p>
                </div>
              )}

              {deal.estimatedDelivery && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Ожидаемая доставка:</strong>{' '}
                    {new Date(deal.estimatedDelivery).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDeal(deal)}
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Просмотр
                </Button>
                
                {deal.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => onUpdateDealStatus(deal.id, 'confirmed')}
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Подтвердить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateDealStatus(deal.id, 'cancelled')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      Отменить
                    </Button>
                  </>
                )}
                
                {deal.status === 'confirmed' && (
                  <Button
                    size="sm"
                    onClick={() => onUpdateDealStatus(deal.id, 'shipped')}
                  >
                    <TruckIcon className="h-4 w-4 mr-1" />
                    Отметить отправку
                  </Button>
                )}
                
                {deal.status === 'shipped' && (
                  <Button
                    size="sm"
                    onClick={() => onUpdateDealStatus(deal.id, 'delivered')}
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Отметить доставку
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {sortedDeals.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Сделки не найдены</h3>
          <p className="text-gray-600">Попробуйте изменить параметры поиска или фильтры</p>
        </Card>
      )}
    </div>
  )
}



