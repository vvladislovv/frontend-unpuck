'use client'

import { getDealById, updateDealStatus } from '@/lib/storage'
import { Deal, DealStatus } from '@/types'
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Принудительно рендерим на стороне клиента
export const dynamic = 'force-dynamic'

// Тестовые данные сделок (в реальном приложении это будет API запрос)
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

const statusConfig: Record<DealStatus, {
  label: string
  icon: string
  color: string
  bgColor: string
  borderColor: string
}> = {
  pending: {
    label: 'Ожидает подтверждения',
    icon: '⏰',
    color: 'text-yellow-600 bg-yellow-50',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  confirmed: {
    label: 'Подтверждено',
    icon: '✅',
    color: 'text-blue-600 bg-blue-50',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  shipped: {
    label: 'Отправлено',
    icon: '🚚',
    color: 'text-purple-600 bg-purple-50',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  delivered: {
    label: 'Доставлено',
    icon: '✅',
    color: 'text-green-600 bg-green-50',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  cancelled: {
    label: 'Отменено',
    icon: '❌',
    color: 'text-red-600 bg-red-50',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
}


export default function DealDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    const dealId = params.id as string
    
    // Сначала проверяем localStorage
    const storedDeal = getDealById(dealId)
    if (storedDeal) {
      setDeal(storedDeal)
      setLoading(false)
      return
    }
    
    // Если в localStorage нет, берем из mockDeals
    const foundDeal = mockDeals.find(d => d.id === dealId)
    setDeal(foundDeal || null)
    setLoading(false)
  }, [params.id])

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

  if (!deal) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Сделка не найдена</h1>
          <Link 
            href="/deals"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Вернуться к сделкам</span>
          </Link>
        </div>
      </div>
    )
  }

  const config = statusConfig[deal.status]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card': return 'Банковская карта'
      case 'wallet': return 'Электронный кошелек'
      case 'crypto': return 'Криптовалюта'
      default: return method
    }
  }

  const handleCancelOrder = () => {
    setShowCancelModal(true)
  }

  const handleConfirmCancel = async () => {
    if (!deal) return

    setIsCancelling(true)
    
    try {
      const response = await fetch('/api/deals/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealId: deal.id,
          reason: cancelReason || 'Отменено покупателем'
        })
      })

      const result = await response.json()

      if (result.success) {
        // Обновляем статус сделки в localStorage
        updateDealStatus(deal.id, 'cancelled', cancelReason || 'Отменено покупателем')
        
        // Обновляем локальное состояние
        setDeal(prev => prev ? { 
          ...prev, 
          status: 'cancelled',
          updatedAt: new Date().toISOString()
        } : null)
        setShowCancelModal(false)
        setCancelReason('')
        
        // Отправляем событие для синхронизации с другими страницами
        window.dispatchEvent(new CustomEvent('dealUpdated', { 
          detail: { dealId: deal.id, status: 'cancelled' } 
        }))
        
        // Показываем уведомление об успешной отмене
        alert('Заказ успешно отменен')
      } else {
        throw new Error(result.error || 'Ошибка при отмене заказа')
      }
    } catch (error) {
      console.error('Ошибка при отмене заказа:', error)
      alert('Произошла ошибка при отмене заказа. Попробуйте еще раз.')
    } finally {
      setIsCancelling(false)
    }
  }

  const handleCancelModalClose = () => {
    setShowCancelModal(false)
    setCancelReason('')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 pt-6">
        <div className="flex items-center space-x-4">
          <Link 
            href="/deals"
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Детали сделки</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 pt-6">
        {/* Статус */}
        <div className="mb-8">
          <div className={`inline-flex items-center space-x-3 rounded-lg px-4 py-3 border ${config.bgColor} ${config.borderColor}`}>
            <span className="text-2xl">{config.icon}</span>
            <span className={`text-lg font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Информация о товаре */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Товар</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex space-x-6">
              <div className="relative h-32 w-32 flex-shrink-0">
                <Image
                  src={deal.product.images[0] || '/api/placeholder/300/300'}
                  alt={deal.product.title}
                  fill
                  className="rounded-lg object-cover"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/api/placeholder/300/300'
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {deal.product.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {deal.product.description}
                </p>
                <div className="flex items-center space-x-6">
                  <span className="text-2xl font-bold text-gray-900">
                    {deal.totalPrice.toLocaleString()} ₽
                  </span>
                  <span className="text-gray-500">
                    Количество: {deal.quantity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Информация о продавце */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Продавец</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16">
                <Image
                  src={deal.seller.avatar || '/api/placeholder/40/40'}
                  alt={deal.seller.name}
                  fill
                  className="rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/api/placeholder/40/40'
                  }}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{deal.seller.name}</h3>
                <p className="text-gray-600">
                  {deal.seller.verified ? '✅ Проверенный продавец' : '⚠️ Непроверенный продавец'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Детали заказа */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Детали заказа</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Дата заказа:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(deal.createdAt)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Способ оплаты:</span>
                <span className="font-medium text-gray-900">
                  {getPaymentMethodLabel(deal.paymentMethod)}
                </span>
              </div>
              
              {deal.trackingNumber && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Трек-номер:</span>
                  <span className="font-mono font-medium text-gray-900">
                    {deal.trackingNumber}
                  </span>
                </div>
              )}
              
              {deal.estimatedDelivery && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Ожидаемая доставка:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(deal.estimatedDelivery)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2 border-t border-gray-200 pt-4">
                <span className="text-lg font-semibold text-gray-900">Общая сумма:</span>
                <span className="text-2xl font-bold text-gray-900">
                  {deal.totalPrice.toLocaleString()} ₽
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Дополнительные действия */}
        
        {(deal.status === 'pending' || deal.status === 'confirmed') && (
          <div className="mb-6">
            <button 
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className={`w-full rounded-lg border border-red-300 px-6 py-4 text-lg font-medium transition-colors ${
                isCancelling
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'text-red-700 hover:bg-red-50'
              }`}
            >
              {isCancelling ? 'Отмена...' : 'Отменить заказ'}
            </button>
          </div>
        )}

        {/* Кнопка назад */}
        <div className="mt-8">
          <Link 
            href="/deals"
            className="w-full inline-flex items-center justify-center space-x-2 rounded-lg bg-gray-100 px-6 py-4 text-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Вернуться к сделкам</span>
          </Link>
        </div>
      </div>

      {/* Модальное окно подтверждения отмены */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Отменить заказ?</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Вы уверены, что хотите отменить этот заказ? Это действие нельзя отменить.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Причина отмены (необязательно):
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Укажите причину отмены..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCancelModalClose}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isCancelling
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isCancelling ? 'Отмена...' : 'Да, отменить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
