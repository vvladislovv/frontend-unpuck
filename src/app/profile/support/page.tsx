'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { profileAPI } from '@/lib/api'
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface SupportTicket {
  id: string
  subject: string
  message: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  createdAt: string
  updatedAt: string
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH'
  })

  useEffect(() => {
    loadSupportTickets()
  }, [])

  const loadSupportTickets = async () => {
    try {
      setIsLoading(true)
      const response = await profileAPI.getSupportTickets()
      if (response.data) {
        setTickets(response.data.data || response.data)
      }
    } catch (error: any) {
      console.error('Ошибка загрузки тикетов поддержки:', error)
      // Используем моковые данные
      setTickets([
        {
          id: '1',
          subject: 'Проблема с оплатой',
          message: 'Не могу оплатить заказ',
          priority: 'HIGH',
          status: 'OPEN',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          subject: 'Предложение по улучшению',
          message: 'Хотелось бы видеть больше фильтров в каталоге',
          priority: 'LOW',
          status: 'RESOLVED',
          createdAt: '2024-01-10T14:20:00Z',
          updatedAt: '2024-01-12T16:45:00Z'
        }
      ])
      toast.error('Не удалось загрузить тикеты поддержки. Показаны демонстрационные данные.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await profileAPI.createSupportTicket(newTicket)
      if (response.data) {
        setTickets(prev => [response.data.data || response.data, ...prev])
        setNewTicket({ subject: '', message: '', priority: 'MEDIUM' })
        setShowCreateForm(false)
        toast.success('Тикет создан! Мы ответим в ближайшее время.')
      }
    } catch (error: any) {
      console.error('Ошибка создания тикета:', error)
      toast.error('Не удалось создать тикет')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'text-red-600 bg-red-50'
      case 'IN_PROGRESS':
        return 'text-yellow-600 bg-yellow-50'
      case 'RESOLVED':
        return 'text-green-600 bg-green-50'
      case 'CLOSED':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Открыт'
      case 'IN_PROGRESS':
        return 'В работе'
      case 'RESOLVED':
        return 'Решен'
      case 'CLOSED':
        return 'Закрыт'
      default:
        return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'Низкий'
      case 'MEDIUM':
        return 'Средний'
      case 'HIGH':
        return 'Высокий'
      default:
        return priority
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
            <h1 className="text-xl font-bold text-gray-900">Поддержка</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Create Ticket Button */}
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Создать обращение</span>
            </button>
          )}

          {/* Create Ticket Form */}
          {showCreateForm && (
            <form onSubmit={handleCreateTicket} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Создать обращение</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Приоритет
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="LOW">Низкий</option>
                  <option value="MEDIUM">Средний</option>
                  <option value="HIGH">Высокий</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тема
                </label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Кратко опишите проблему"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сообщение
                </label>
                <textarea
                  value={newTicket.message}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Подробно опишите вашу проблему или предложение"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Отправить
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          )}

          {/* Tickets List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Ваши обращения</h3>
            {tickets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">У вас пока нет обращений</p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                          {getStatusText(ticket.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Приоритет: {getPriorityText(ticket.priority)}</p>
                      <p className="text-sm text-gray-600 mb-2">{ticket.message}</p>
                      <p className="text-xs text-gray-400">
                        Создано: {new Date(ticket.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Contact Info */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">Контакты поддержки</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p><strong>Email:</strong> support@unpacksbot.com</p>
              <p><strong>Telegram:</strong> @unpacksbot_support</p>
              <p><strong>Время работы:</strong> 9:00 - 21:00 (МСК)</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

