'use client'

import { cn } from '@/lib/utils'
import { Deal } from '@/types'
import {
    CheckCircleIcon,
    ClockIcon,
    TruckIcon,
    XCircleIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

interface DealCardProps {
  deal: Deal
}

const statusConfig = {
  pending: {
    label: 'Ожидает подтверждения',
    icon: ClockIcon,
    color: 'text-yellow-600 bg-yellow-50',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  confirmed: {
    label: 'Подтверждено',
    icon: CheckCircleIcon,
    color: 'text-blue-600 bg-blue-50',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  shipped: {
    label: 'Отправлено',
    icon: TruckIcon,
    color: 'text-purple-600 bg-purple-50',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  delivered: {
    label: 'Доставлено',
    icon: CheckCircleIcon,
    color: 'text-green-600 bg-green-50',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  cancelled: {
    label: 'Отменено',
    icon: XCircleIcon,
    color: 'text-red-600 bg-red-50',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
}

export function DealCard({ deal }: DealCardProps) {
  const config = statusConfig[deal.status]
  const StatusIcon = config.icon

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
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

  return (
    <div className={cn(
      'rounded-lg border p-4 transition-shadow hover:shadow-md',
      config.bgColor,
      config.borderColor
    )}>
      {/* Заголовок с статусом */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <StatusIcon className={cn('h-5 w-5', config.color)} />
          <span className={cn('text-sm font-medium', config.color)}>
            {config.label}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {formatDate(deal.createdAt)}
        </div>
      </div>

      {/* Информация о товаре */}
      <div className="flex space-x-3 mb-3">
        <div className="relative h-16 w-16 flex-shrink-0">
          <Image
            src={deal.product.images[0]}
            alt={deal.product.title}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {deal.product.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Продавец: {deal.seller.name}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-semibold text-gray-900">
              {deal.totalPrice.toLocaleString()} ₽
            </span>
            <span className="text-xs text-gray-500">
              Количество: {deal.quantity}
            </span>
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Способ оплаты:</span>
          <span className="font-medium">{getPaymentMethodLabel(deal.paymentMethod)}</span>
        </div>
        
        {deal.trackingNumber && (
          <div className="flex justify-between">
            <span>Трек-номер:</span>
            <span className="font-medium font-mono">{deal.trackingNumber}</span>
          </div>
        )}
        
        {deal.estimatedDelivery && (
          <div className="flex justify-between">
            <span>Ожидаемая доставка:</span>
            <span className="font-medium">
              {formatDate(deal.estimatedDelivery)}
            </span>
          </div>
        )}
      </div>

      {/* Действия */}
      <div className="mt-4 flex space-x-2">
        <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          Подробнее
        </button>
        
        {deal.status === 'delivered' && (
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Оценить
          </button>
        )}
        
        {(deal.status === 'pending' || deal.status === 'confirmed') && (
          <button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors">
            Отменить
          </button>
        )}
      </div>
    </div>
  )
}
