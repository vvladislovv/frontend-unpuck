'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { ArrowLeftIcon, ClockIcon, ShareIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function VerificationPage() {
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(false)

  const handleTelegramVerification = () => {
    setIsVerifying(true)
    // Открываем Telegram бота для верификации
    const botUsername = 'unpacker_verification_bot'
    const botUrl = `https://t.me/${botUsername}?start=verify_${Date.now()}`
    window.open(botUrl, '_blank')
    
    // Сбрасываем состояние через 3 секунды
    setTimeout(() => {
      setIsVerifying(false)
    }, 3000)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Заголовок */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={() => router.back()} className="p-1 -ml-1">
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Верификация</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Главная секция верификации */}
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShareIcon className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Верификация через Telegram</h2>
            <p className="text-gray-600 mb-6">
              Для завершения верификации поделитесь номером телефона через нашего Telegram бота
            </p>
          </div>

          {/* Карточка с ботом */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">@unpacker_verification_bot</h3>
                <p className="text-blue-100 text-sm">Официальный бот для верификации</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ShareIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <button 
              onClick={handleTelegramVerification}
              disabled={isVerifying}
              className="w-full py-3 px-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
            >
              {isVerifying ? (
                <>
                  <ClockIcon className="h-5 w-5 animate-spin" />
                  <span>Открываем бота...</span>
                </>
              ) : (
                <>
                  <ShareIcon className="h-5 w-5" />
                  <span>Открыть в Telegram</span>
                </>
              )}
            </button>
          </div>

          {/* Инструкции */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Как пройти верификацию:</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">1</div>
                <p className="text-sm text-gray-700">Нажмите кнопку "Открыть в Telegram" выше</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">2</div>
                <p className="text-sm text-gray-700">В Telegram нажмите "START" или "Начать"</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">3</div>
                <p className="text-sm text-gray-700">Разрешите боту доступ к номеру телефона</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">4</div>
                <p className="text-sm text-gray-700">Вернитесь в приложение - верификация завершена!</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  )
}