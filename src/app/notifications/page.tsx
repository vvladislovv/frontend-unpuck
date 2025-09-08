'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { Notification } from '@/types'
import { ArrowLeftIcon, BellIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Заказ подтвержден',
    message: 'Ваш заказ #12345 успешно подтвержден продавцом',
    type: 'success',
    read: false,
    createdAt: '2024-01-18T10:30:00Z'
  },
  {
    id: '2',
    title: 'Новое сообщение',
    message: 'У вас новое сообщение от продавца по заказу #12340',
    type: 'info',
    read: false,
    createdAt: '2024-01-18T09:15:00Z'
  },
  {
    id: '3',
    title: 'Заказ отправлен',
    message: 'Заказ #12338 отправлен. Трек-номер: 1234567890',
    type: 'info',
    read: true,
    createdAt: '2024-01-17T16:45:00Z'
  },
  {
    id: '4',
    title: 'Проблема с оплатой',
    message: 'Не удалось обработать платеж. Проверьте данные карты',
    type: 'error',
    read: true,
    createdAt: '2024-01-17T14:20:00Z'
  },
  {
    id: '5',
    title: 'Заказ доставлен',
    message: 'Ваш заказ #12335 успешно доставлен. Оцените покупку!',
    type: 'success',
    read: true,
    createdAt: '2024-01-16T11:30:00Z'
  },
  {
    id: '6',
    title: 'Новое предложение',
    message: 'Скидка 20% на товары из категории "Электроника"',
    type: 'info',
    read: true,
    createdAt: '2024-01-15T08:00:00Z'
  }
]


export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Только что'
    } else if (diffInHours < 24) {
      return `${diffInHours} ч назад`
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'info':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'success':
        return 'Успех'
      case 'error':
        return 'Ошибка'
      case 'warning':
        return 'Предупреждение'
      case 'info':
        return 'Информация'
      default:
        return 'Уведомление'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Заголовок */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => router.back()} className="p-1 -ml-1">
                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Уведомления</h1>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 font-medium"
              >
                Прочитать все
              </button>
            )}
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Уведомлений пока нет</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                      <BellIcon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(notification.type)}`}>
                            {getTypeText(notification.type)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </p>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 font-medium"
                          >
                            Отметить как прочитанное
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
