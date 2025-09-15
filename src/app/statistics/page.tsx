'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { statisticsAPI } from '@/lib/api'
import { autoAuth } from '@/lib/auth-helper'
import { useAuthStore } from '@/store/auth'
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
  const { user, isAuthenticated } = useAuthStore()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRealData, setIsRealData] = useState(false)

  // Моковые данные как fallback (если API недоступен)
  const mockStats: UserStats = {
    totalProducts: 0,
    activeProducts: 0,
    totalDeals: 0,
    completedDeals: 0,
    totalRevenue: 0,
    totalSpent: 0,
    totalReferrals: 0,
    referralEarnings: 0,
    totalTransactions: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    completionRate: 0,
    averageTransactionAmount: 0
  }

  useEffect(() => {
    loadStatsWithAuth()
  }, [])

  const loadStatsWithAuth = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Загружаем реальную статистику с бэкенда...')
      
      // Сначала пытаемся авторизоваться
      const authResult = await autoAuth()
      if (authResult) {
        console.log('✅ Авторизован, загружаем реальные данные')
        const { user, token } = authResult
        
        // Обновляем store
        useAuthStore.getState().login(user, token)
        
        // Загружаем статистику с API
        try {
          const response = await statisticsAPI.getUserStats({ period: '30d' })
          console.log('✅ Ответ сервера (статистика):', response.data)
          
          const statsData = response.data.data || response.data
          if (statsData) {
            console.log('✅ Используем реальные данные из API')
            setStats(statsData)
            setIsRealData(true)
            return
          }
        } catch (apiError: any) {
          console.error('❌ Ошибка API статистики:', apiError)
        }
      }
      
      // Если авторизация не удалась или API не вернул данные, используем моковые данные
      console.log('⚠️ Используем моковые данные как fallback')
      setStats(mockStats)
      setIsRealData(false)
      
    } catch (error) {
      console.error('❌ Ошибка загрузки:', error)
      setStats(mockStats)
      setIsRealData(false)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      console.log('🔄 Загружаем статистику с параметрами:', { period: '30d' })
      
      const response = await statisticsAPI.getUserStats({ period: '30d' })
      console.log('✅ Ответ сервера (статистика):', response.data)
      
      const statsData = response.data.data || response.data
      if (statsData) {
        console.log('✅ Используем реальные данные из API')
        setStats(statsData)
        return
      }
      
      // Если API не вернул данные, используем моковые данные
      console.log('⚠️ API не вернул данные, используем моковые данные')
      setStats(mockStats)
      
    } catch (apiError: any) {
      console.error('❌ Ошибка API статистики:', apiError)
      console.log('⚠️ Ошибка API, используем моковые данные')
      setStats(mockStats)
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

  // Убираем блок ошибки, так как теперь всегда показываем статистику

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
            <div>
              <h1 className="text-xl font-bold text-gray-900">Статистика</h1>
              {!loading && (
                <p className="text-xs text-gray-500">
                  {isRealData ? '📊 Реальные данные' : '🎭 Демо данные'}
                </p>
              )}
            </div>
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
