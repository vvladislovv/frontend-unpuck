'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { affiliateAPI } from '@/lib/api'
import { ArrowLeftIcon, DocumentDuplicateIcon, ShareIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface AffiliateStats {
  totalReferrals: number
  activeReferrals: number
  totalEarnings: number
  pendingEarnings: number
  referralCode: string
  referralLink: string
}

export default function AffiliatePage() {
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAffiliateStats()
  }, [])

  const loadAffiliateStats = async () => {
    try {
      setIsLoading(true)
      const response = await affiliateAPI.getReferralStats()
      if (response.data) {
        setStats(response.data.data || response.data)
      }
    } catch (error: any) {
      console.error('Ошибка загрузки статистики партнерской программы:', error)
      // Используем моковые данные
      setStats({
        totalReferrals: 12,
        activeReferrals: 8,
        totalEarnings: 15420,
        pendingEarnings: 3200,
        referralCode: 'IVAN2024',
        referralLink: 'https://unpacksbot.com/ref/IVAN2024'
      })
      toast.error('Не удалось загрузить статистику партнерской программы. Показаны демонстрационные данные.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyReferralLink = () => {
    if (stats?.referralLink) {
      navigator.clipboard.writeText(stats.referralLink)
      toast.success('Ссылка скопирована!')
    }
  }

  const copyReferralCode = () => {
    if (stats?.referralCode) {
      navigator.clipboard.writeText(stats.referralCode)
      toast.success('Код скопирован!')
    }
  }

  const shareReferralLink = () => {
    if (stats?.referralLink) {
      if (navigator.share) {
        navigator.share({
          title: 'Присоединяйтесь к UnpacksBot!',
          text: 'Зарабатывайте с нами через партнерскую программу',
          url: stats.referralLink
        })
      } else {
        copyReferralLink()
      }
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-4">
            <Link 
              href="/profile"
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Партнерская программа</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Всего рефералов</h3>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalReferrals || 0}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Активных рефералов</h3>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeReferrals || 0}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Заработано</h3>
              <p className="text-2xl font-bold text-green-600">
                {stats?.totalEarnings?.toLocaleString() || 0} ₽
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">К выплате</h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.pendingEarnings?.toLocaleString() || 0} ₽
              </p>
            </div>
          </div>

          {/* Referral Code */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ваш реферальный код</h3>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <p className="text-2xl font-mono font-bold text-gray-900">
                  {stats?.referralCode || 'IVAN2024'}
                </p>
              </div>
              <button
                onClick={copyReferralCode}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <DocumentDuplicateIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Referral Link */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ваша реферальная ссылка</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 break-all">
                    {stats?.referralLink || 'https://unpacksbot.com/ref/IVAN2024'}
                  </p>
                </div>
                <button
                  onClick={copyReferralLink}
                  className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <DocumentDuplicateIcon className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={shareReferralLink}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ShareIcon className="h-5 w-5" />
                <span>Поделиться</span>
              </button>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">Как это работает</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <p>Поделитесь своей реферальной ссылкой с друзьями</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <p>Ваш друг регистрируется по вашей ссылке</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <p>Вы получаете 10% с каждой покупки вашего реферала</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <p>Выплаты происходят еженедельно на ваш счет</p>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Условия программы</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Минимальная сумма для выплаты: 1000 ₽</li>
              <li>• Комиссия: 10% с каждой покупки реферала</li>
              <li>• Выплаты: еженедельно по понедельникам</li>
              <li>• Реферал должен быть активным пользователем</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}




