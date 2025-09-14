'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { profileAPI } from '@/lib/api'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  marketing: boolean
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    marketing: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadNotificationSettings()
  }, [])

  const loadNotificationSettings = async () => {
    try {
      setIsLoading(true)
      const response = await profileAPI.getNotifications()
      if (response.data) {
        setSettings(response.data.data || response.data)
      }
    } catch (error: any) {
      console.error('Ошибка загрузки настроек уведомлений:', error)
      // Используем моковые данные
      setSettings({
        email: true,
        push: true,
        sms: false,
        marketing: false
      })
      toast.error('Не удалось загрузить настройки уведомлений. Показаны демонстрационные данные.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)

    try {
      setIsSaving(true)
      await profileAPI.updateNotificationSettings(newSettings)
      toast.success('Настройки сохранены!')
    } catch (error: any) {
      console.error('Ошибка сохранения настроек:', error)
      toast.error('Не удалось сохранить настройки')
      // Возвращаем предыдущее значение
      setSettings(settings)
    } finally {
      setIsSaving(false)
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
            <h1 className="text-xl font-bold text-gray-900">Уведомления</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Email Notifications */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Email уведомления</h3>
                <p className="text-sm text-gray-500">Получать уведомления на email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email}
                  onChange={(e) => handleSettingChange('email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Push уведомления</h3>
                <p className="text-sm text-gray-500">Получать push уведомления в браузере</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.push}
                  onChange={(e) => handleSettingChange('push', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">SMS уведомления</h3>
                <p className="text-sm text-gray-500">Получать уведомления по SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sms}
                  onChange={(e) => handleSettingChange('sms', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Marketing Notifications */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Маркетинговые уведомления</h3>
                <p className="text-sm text-gray-500">Получать рекламные предложения и новости</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.marketing}
                  onChange={(e) => handleSettingChange('marketing', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">О уведомлениях</h4>
            <p className="text-sm text-blue-800">
              Вы можете в любое время изменить настройки уведомлений. 
              Некоторые уведомления (например, о важных изменениях в аккаунте) 
              не могут быть отключены.
            </p>
          </div>

          {isSaving && (
            <div className="text-center text-sm text-gray-500">
              Сохранение настроек...
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

