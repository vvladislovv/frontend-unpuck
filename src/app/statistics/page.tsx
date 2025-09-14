'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { statisticsAPI } from '@/lib/api'
import { ArrowLeftIcon, CurrencyDollarIcon, EyeIcon, ShoppingBagIcon, StarIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface UserStats {
  totalProducts: number
  activeProducts: number
  totalDeals: number
  completedDeals: number
  totalRevenue: number
  totalSpent: number
  totalReferrals: number
  referralEarnings: number
  // Дополнительные метрики
  totalTransactions?: number
  completedTransactions?: number
  pendingTransactions?: number
  totalIncome?: number
  totalExpenses?: number
  netIncome?: number
  completionRate?: number
  averageTransactionAmount?: number
}

export default function StatisticsPage() {
  const router = useRouter()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Загружаем статистику с параметрами:', { period: '30d' })
      const response = await statisticsAPI.getUserStats({ period: '30d' })
      console.log('✅ Ответ сервера (статистика):', response.data)
      
      const statsData = response.data.data || response.data
      setStats(statsData)
    } catch (err: any) {
      console.error('❌ Ошибка загрузки статистики:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки статистики')
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка статистики...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error && !stats) {
    return (
      <MainLayout>
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
              onClick={loadStats}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!stats) return null

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
            {/* Товары */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
                <span className="text-xs font-medium text-green-600">{stats.activeProducts}/{stats.totalProducts}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
              <p className="text-sm text-gray-500">Товары</p>
            </div>

            {/* Сделки */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                <span className="text-xs font-medium text-green-600">{stats.completedDeals}/{stats.totalDeals}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalDeals}</h3>
              <p className="text-sm text-gray-500">Сделки</p>
            </div>

            {/* Доходы */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <EyeIcon className="h-6 w-6 text-gray-400" />
                <span className="text-xs font-medium text-green-600">₽{stats.totalRevenue.toLocaleString()}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">₽ {stats.totalRevenue.toLocaleString()}</h3>
              <p className="text-sm text-gray-500">Доходы</p>
            </div>

            {/* Рефералы */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <StarIcon className="h-6 w-6 text-gray-400" />
                <span className="text-xs font-medium text-green-600">₽{stats.referralEarnings.toLocaleString()}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</h3>
              <p className="text-sm text-gray-500">Рефералы</p>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Дополнительная информация</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Потрачено всего</span>
                <span className="text-sm font-medium text-gray-900">
                  ₽ {stats.totalSpent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Заработано с рефералов</span>
                <span className="text-sm font-medium text-gray-900">
                  ₽ {stats.referralEarnings.toLocaleString()}
                </span>
              </div>
              
              {/* Дополнительные метрики */}
              {stats.totalTransactions !== undefined && (
                <>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Транзакции</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Всего транзакций</span>
                        <span className="text-xs font-medium text-gray-900">{stats.totalTransactions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Завершенных</span>
                        <span className="text-xs font-medium text-green-600">{stats.completedTransactions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Ожидающих</span>
                        <span className="text-xs font-medium text-yellow-600">{stats.pendingTransactions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Процент завершения</span>
                        <span className="text-xs font-medium text-blue-600">{stats.completionRate?.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Финансы</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Общий доход</span>
                        <span className="text-xs font-medium text-green-600">₽{stats.totalIncome?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Общие расходы</span>
                        <span className="text-xs font-medium text-red-600">₽{stats.totalExpenses?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Чистый доход</span>
                        <span className={`text-xs font-medium ${(stats.netIncome || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₽{stats.netIncome?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Средняя сумма</span>
                        <span className="text-xs font-medium text-blue-600">₽{stats.averageTransactionAmount?.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
