'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Deal, DealStatus } from '@/types'
import {
    CheckCircleIcon,
    ClockIcon,
    CreditCardIcon,
    ShoppingBagIcon,
    TruckIcon,
    UserIcon,
    XCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'

interface DealModalProps {
  isOpen: boolean
  onClose: () => void
  deal: Deal | null
}

export function DealModal({ isOpen, onClose, deal }: DealModalProps) {
  if (!isOpen || !deal) return null

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
      case 'card': return 'Банковская карта'
      case 'wallet': return 'Электронный кошелек'
      case 'crypto': return 'Криптовалюта'
      default: return method
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return CreditCardIcon
      case 'wallet': return ShoppingBagIcon
      case 'crypto': return ShoppingBagIcon
      default: return CreditCardIcon
    }
  }

  const StatusIcon = getStatusIcon(deal.status)
  const PaymentIcon = getPaymentMethodIcon(deal.paymentMethod)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Детали сделки</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Информация о сделке */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ShoppingBagIcon className="h-5 w-5 mr-2" />
                  Информация о сделке
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID сделки:</span>
                    <span className="font-medium">{deal.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Статус:</span>
                    <Badge variant={getStatusBadgeVariant(deal.status)} className="flex items-center">
                      <StatusIcon className="h-4 w-4 mr-1" />
                      {getStatusLabel(deal.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Сумма:</span>
                    <span className="font-bold text-lg text-blue-600">
                      {deal.totalPrice.toLocaleString()} ₽
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Количество:</span>
                    <span className="font-medium">{deal.quantity} шт.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Способ оплаты:</span>
                    <span className="font-medium flex items-center">
                      <PaymentIcon className="h-4 w-4 mr-1" />
                      {getPaymentMethodLabel(deal.paymentMethod)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Дата создания:</span>
                    <span className="font-medium">
                      {new Date(deal.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  {deal.estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ожидаемая доставка:</span>
                      <span className="font-medium">
                        {new Date(deal.estimatedDelivery).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  )}
                  {deal.trackingNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Трек-номер:</span>
                      <span className="font-medium font-mono">{deal.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Участники сделки
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Покупатель</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          {deal.buyer.avatar ? (
                            <img
                              src={deal.buyer.avatar}
                              alt={deal.buyer.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium">
                              {deal.buyer.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{deal.buyer.name}</p>
                          <p className="text-sm text-gray-600">{deal.buyer.email}</p>
                          {deal.buyer.phone && (
                            <p className="text-sm text-gray-600">{deal.buyer.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Продавец</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          {deal.seller.avatar ? (
                            <img
                              src={deal.seller.avatar}
                              alt={deal.seller.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium">
                              {deal.seller.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{deal.seller.name}</p>
                          <p className="text-sm text-gray-600">{deal.seller.email}</p>
                          {deal.seller.phone && (
                            <p className="text-sm text-gray-600">{deal.seller.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Информация о товаре */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Товар</h3>
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  {deal.product.images[0] ? (
                    <img
                      src={deal.product.images[0]}
                      alt={deal.product.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">Нет фото</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">
                    {deal.product.title}
                  </h4>
                  <p className="text-gray-600 mb-3">{deal.product.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Категория:</span>
                      <p className="font-medium">{deal.product.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Цена за штуку:</span>
                      <p className="font-medium">{deal.product.price.toLocaleString()} ₽</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Рейтинг:</span>
                      <p className="font-medium">★ {deal.product.rating} ({deal.product.reviewsCount} отзывов)</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Наличие:</span>
                      <Badge variant={deal.product.inStock ? 'default' : 'destructive'}>
                        {deal.product.inStock ? 'В наличии' : 'Нет в наличии'}
                      </Badge>
                    </div>
                  </div>
                  {deal.product.tags.length > 0 && (
                    <div className="mt-3">
                      <span className="text-gray-600 text-sm">Теги:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {deal.product.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* История изменений */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">История изменений</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Сделка создана</p>
                    <p className="text-sm text-gray-600">
                      {new Date(deal.createdAt).toLocaleString('ru-RU')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <StatusIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Статус: {getStatusLabel(deal.status)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(deal.updatedAt).toLocaleString('ru-RU')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Кнопки действий */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Закрыть
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}



