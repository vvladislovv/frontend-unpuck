'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { ArrowLeftIcon, CheckCircleIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// Типы для данных оплаты
interface PaymentData {
  productId: string
  productTitle: string
  productImage: string
  price: number
  originalPrice?: number
  quantity: number
  totalPrice: number
  seller: {
    id: string
    name: string
    verified: boolean
  }
}

// Моковые данные товара (в реальном приложении будут передаваться через URL параметры)
const mockPaymentData: PaymentData = {
  productId: '1',
  productTitle: 'Электрические МЕЛЬНИЦЫ',
  productImage: '/api/placeholder/300/300',
  price: 2500,
  originalPrice: 3000,
  quantity: 1,
  totalPrice: 2500,
  seller: {
    id: '1',
    name: 'KitchenPro',
    verified: true,
  }
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'crypto'>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    // Получение данных из URL параметров
    const productId = searchParams.get('productId')
    const quantity = searchParams.get('quantity')
    const price = searchParams.get('price')
    const originalPrice = searchParams.get('originalPrice')
    const title = searchParams.get('title')
    const image = searchParams.get('image')
    const sellerId = searchParams.get('sellerId')
    const sellerName = searchParams.get('sellerName')
    const sellerVerified = searchParams.get('sellerVerified')

    if (productId && quantity && price && title && image && sellerId && sellerName) {
      setPaymentData({
        productId,
        productTitle: title,
        productImage: image,
        price: parseInt(price),
        originalPrice: originalPrice ? parseInt(originalPrice) : undefined,
        quantity: parseInt(quantity),
        totalPrice: parseInt(price) * parseInt(quantity),
        seller: {
          id: sellerId,
          name: sellerName,
          verified: sellerVerified === 'true'
        }
      })
    } else {
      // Fallback на моковые данные если параметры не переданы
      setPaymentData(mockPaymentData)
    }
    setLoading(false)
  }, [searchParams])

  const handleBack = () => {
    router.back()
  }

  const handlePayment = async () => {
    if (!paymentData) return

    setIsProcessing(true)
    
    try {
      // Создание платежа через API
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: paymentData.productId,
          quantity: paymentData.quantity,
          totalPrice: paymentData.totalPrice,
          userId: 'user_123', // В реальном приложении будет из контекста авторизации
          paymentMethod
        })
      })

      const result = await response.json()

      if (result.success && result.payment) {
        // В реальном приложении здесь будет перенаправление на ЮKassa
        // window.location.href = result.payment.confirmation.confirmation_url
        
        // Для демонстрации показываем успешную оплату
        setPaymentSuccess(true)
      } else {
        throw new Error(result.error || 'Ошибка при создании платежа')
      }
    } catch (error) {
      console.error('Ошибка при обработке платежа:', error)
      alert('Произошла ошибка при обработке платежа. Попробуйте еще раз.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSuccessRedirect = () => {
    // Перенаправление на страницу сделок после успешной оплаты
    router.push('/deals')
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!paymentData) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Ошибка загрузки данных</h1>
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Вернуться назад</span>
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (paymentSuccess) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white">
          {/* Заголовок */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Оплата</h1>
            </div>
          </div>

          {/* Успешная оплата */}
          <div className="px-4 py-8">
            <div className="text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Оплата успешно завершена!</h2>
              <p className="text-gray-600 mb-8">
                Ваш заказ на сумму {paymentData.totalPrice.toLocaleString()} ₽ успешно оплачен.
              </p>
              
              <button
                onClick={handleSuccessRedirect}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Перейти к сделкам
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  const discountPercentage = paymentData.originalPrice 
    ? Math.round(((paymentData.originalPrice - paymentData.price) / paymentData.originalPrice) * 100)
    : 0

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Заголовок */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Назад</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Оплата</h1>
          </div>
        </div>

        {/* Информация о товаре */}
        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Товар к оплате</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex space-x-4">
              <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                  src={paymentData.productImage}
                  alt={paymentData.productTitle}
                  fill
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {paymentData.productTitle}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg font-bold text-gray-900">
                    {paymentData.price.toLocaleString()} ₽
                  </span>
                  {paymentData.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {paymentData.originalPrice.toLocaleString()} ₽
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span className="text-xs text-red-500 font-medium">
                      -{discountPercentage}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Продавец: {paymentData.seller.name}
                  {paymentData.seller.verified && (
                    <span className="ml-1 text-green-500">✓</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Способы оплаты */}
        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Способ оплаты</h2>
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 rounded-lg border-2 transition-colors ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CreditCardIcon className="h-6 w-6 text-gray-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Банковская карта</div>
                  <div className="text-sm text-gray-600">Visa, Mastercard, МИР</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('wallet')}
              className={`w-full p-4 rounded-lg border-2 transition-colors ${
                paymentMethod === 'wallet'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="h-6 w-6 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Ю</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">ЮMoney</div>
                  <div className="text-sm text-gray-600">Электронный кошелек</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('crypto')}
              className={`w-full p-4 rounded-lg border-2 transition-colors ${
                paymentMethod === 'crypto'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="h-6 w-6 bg-yellow-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">₿</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Криптовалюта</div>
                  <div className="text-sm text-gray-600">Bitcoin, Ethereum</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Итоговая сумма */}
        <div className="px-4 py-6 border-t border-gray-200">
          <div className="flex justify-between items-center py-2">
            <span className="text-lg font-semibold text-gray-900">К оплате:</span>
            <span className="text-2xl font-bold text-gray-900">
              {paymentData.totalPrice.toLocaleString()} ₽
            </span>
          </div>
        </div>

        {/* Кнопка оплаты */}
        <div className="px-4 py-6">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-4 px-4 rounded-lg font-medium transition-colors ${
              isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Обработка платежа...</span>
              </div>
            ) : (
              `Оплатить ${paymentData.totalPrice.toLocaleString()} ₽`
            )}
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Нажимая кнопку "Оплатить", вы соглашаетесь с условиями использования
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
