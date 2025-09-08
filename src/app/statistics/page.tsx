'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { ArrowLeftIcon, CurrencyDollarIcon, EyeIcon, ShoppingBagIcon, StarIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function StatisticsPage() {
  const router = useRouter()

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Заголовок */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={() => router.back()} className="p-1 -ml-1">
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Статистика</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Основные метрики */}
          <div className="grid grid-cols-2 gap-4">
            {/* Общие покупки */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
                <span className="text-xs font-medium text-green-600">+12.5%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">24</h3>
              <p className="text-sm text-gray-500">Общие покупки</p>
            </div>

            {/* Потрачено */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                <span className="text-xs font-medium text-green-600">+8.2%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">₽ 45,600</h3>
              <p className="text-sm text-gray-500">Потрачено</p>
            </div>

            {/* Просмотры профиля */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <EyeIcon className="h-6 w-6 text-gray-400" />
                <span className="text-xs font-medium text-red-600">-2.1%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">1,234</h3>
              <p className="text-sm text-gray-500">Просмотры профиля</p>
            </div>

            {/* Рейтинг */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <StarIcon className="h-6 w-6 text-gray-400" />
                <span className="text-xs font-medium text-green-600">+0.3%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
              <p className="text-sm text-gray-500">Рейтинг</p>
            </div>
          </div>

          {/* Простая статистика за последние месяцы */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">За последние 6 месяцев</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Июль</span>
                <span className="text-sm font-medium text-gray-900">₽ 21,000 (9 покупок)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Август</span>
                <span className="text-sm font-medium text-gray-900">₽ 28,500 (12 покупок)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Сентябрь</span>
                <span className="text-sm font-medium text-gray-900">₽ 23,400 (10 покупок)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Октябрь</span>
                <span className="text-sm font-medium text-gray-900">₽ 26,700 (11 покупок)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ноябрь</span>
                <span className="text-sm font-medium text-gray-900">₽ 19,200 (8 покупок)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Декабрь</span>
                <span className="text-sm font-medium text-gray-900">₽ 14,500 (6 покупок)</span>
              </div>
            </div>
          </div>

          {/* Достижения */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Достижения</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <p className="text-sm font-medium text-green-900">Первая покупка</p>
                <p className="text-xs text-green-700">Получено</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">💎</div>
                <p className="text-sm font-medium text-green-900">VIP клиент</p>
                <p className="text-xs text-green-700">Получено</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">🎯</div>
                <p className="text-sm font-medium text-gray-900">50 покупок</p>
                <p className="text-xs text-gray-700">24 из 50</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">⭐</div>
                <p className="text-sm font-medium text-gray-900">Отзывчик</p>
                <p className="text-xs text-gray-700">15 из 20</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
