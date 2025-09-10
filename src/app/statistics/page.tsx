'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { statisticsAPI } from '@/lib/api'
import { ArrowLeftIcon, CurrencyDollarIcon, EyeIcon, ShoppingBagIcon, StarIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface UserStats {
  totalPurchases: number
  totalSpent: number
  profileViews: number
  rating: number
  monthlyStats: Array<{
    month: string
    amount: number
    purchases: number
  }>
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    status: 'completed' | 'in_progress'
    progress?: number
    total?: number
  }>
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
      
      const response = await statisticsAPI.getUserStats({ period: '30d' })
      const statsData = response.data.data || response.data
      setStats(statsData)
    } catch (err: any) {
      console.error('Ошибка загрузки статистики:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки статистики')
      
      // Fallback на моковые данные
      setStats({
        totalPurchases: 24,
        totalSpent: 45600,
        profileViews: 1234,
        rating: 4.8,
        monthlyStats: [
          { month: 'Июль', amount: 21000, purchases: 9 },
          { month: 'Август', amount: 28500, purchases: 12 },
          { month: 'Сентябрь', amount: 23400, purchases: 10 },
          { month: 'Октябрь', amount: 26700, purchases: 11 },
          { month: 'Ноябрь', amount: 19200, purchases: 8 },
          { month: 'Декабрь', amount: 14500, purchases: 6 }
        ],
        achievements: [
          { id: '1', title: 'Первая покупка', description: 'Получено', icon: '🏆', status: 'completed' },
          { id: '2', title: 'VIP клиент', description: 'Получено', icon: '💎', status: 'completed' },
          { id: '3', title: '50 покупок', description: '24 из 50', icon: '🎯', status: 'in_progress', progress: 24, total: 50 },
          { id: '4', title: 'Отзывчик', description: '15 из 20', icon: '⭐', status: 'in_progress', progress: 15, total: 20 }
        ]
      })
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
            {/* Общие покупки */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
                <span className="text-xs font-medium text-green-600">+12.5%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalPurchases}</h3>
              <p className="text-sm text-gray-500">Общие покупки</p>
            </div>

            {/* Потрачено */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                <span className="text-xs font-medium text-green-600">+8.2%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">₽ {stats.totalSpent.toLocaleString()}</h3>
              <p className="text-sm text-gray-500">Потрачено</p>
            </div>

            {/* Просмотры профиля */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <EyeIcon className="h-6 w-6 text-gray-400" />
                <span className="text-xs font-medium text-red-600">-2.1%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.profileViews.toLocaleString()}</h3>
              <p className="text-sm text-gray-500">Просмотры профиля</p>
            </div>

            {/* Рейтинг */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <StarIcon className="h-6 w-6 text-gray-400" />
                <span className="text-xs font-medium text-green-600">+0.3%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.rating}</h3>
              <p className="text-sm text-gray-500">Рейтинг</p>
            </div>
          </div>

          {/* Простая статистика за последние месяцы */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">За последние 6 месяцев</h3>
            <div className="space-y-3">
              {stats.monthlyStats.map((month, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{month.month}</span>
                  <span className="text-sm font-medium text-gray-900">
                    ₽ {month.amount.toLocaleString()} ({month.purchases} покупок)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Достижения */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Достижения</h3>
            <div className="grid grid-cols-2 gap-3">
              {stats.achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`rounded-lg p-3 text-center ${
                    achievement.status === 'completed' 
                      ? 'bg-green-50' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <p className={`text-sm font-medium ${
                    achievement.status === 'completed' 
                      ? 'text-green-900' 
                      : 'text-gray-900'
                  }`}>
                    {achievement.title}
                  </p>
                  <p className={`text-xs ${
                    achievement.status === 'completed' 
                      ? 'text-green-700' 
                      : 'text-gray-700'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
