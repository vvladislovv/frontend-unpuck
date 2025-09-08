'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = searchParams.get('payment_id')
    setPaymentId(id)
    setLoading(false)
  }, [searchParams])

  const handleGoToDeals = () => {
    router.push('/deals')
  }

  const handleGoToCatalog = () => {
    router.push('/catalog')
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

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Заголовок */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Назад</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Оплата</h1>
          </div>
        </div>

        {/* Успешная оплата */}
        <div className="px-4 py-8">
          <div className="text-center">
            <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Оплата успешно завершена!</h2>
            <p className="text-lg text-gray-600 mb-2">
              Ваш заказ успешно оплачен и принят в обработку.
            </p>
            {paymentId && (
              <p className="text-sm text-gray-500 mb-8">
                Номер платежа: {paymentId}
              </p>
            )}
            
            <div className="space-y-4">
              <button
                onClick={handleGoToDeals}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Перейти к сделкам
              </button>
              
              <button
                onClick={handleGoToCatalog}
                className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Продолжить покупки
              </button>
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="px-4 py-6 bg-gray-50">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Что дальше?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">1</span>
                </div>
                <p>Продавец получит уведомление о вашем заказе</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">2</span>
                </div>
                <p>Товар будет подготовлен и отправлен в течение 1-3 дней</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">3</span>
                </div>
                <p>Вы получите трек-номер для отслеживания посылки</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
