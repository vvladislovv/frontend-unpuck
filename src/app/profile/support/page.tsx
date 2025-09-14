'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { chatAPI } from '@/lib/api'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'admin'
  timestamp: string
  isRead: boolean
}

export default function SupportPage() {
  // Чат состояние
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Загрузка сообщений из БД
  useEffect(() => {
    loadChatMessages()
  }, [])

  // Автоскролл к последнему сообщению
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isTyping])

  const loadChatMessages = async () => {
    try {
      setIsLoading(true)
      const response = await chatAPI.getAdminChat()
      if (response.data) {
        const messages = response.data.messages || response.data
        
        setChatMessages(messages.map((msg: any) => {
          // Логика определения отправителя
          // Если есть metadata.isFromAdmin, то это сообщение от админа
          const isAdmin = msg.metadata && msg.metadata.isFromAdmin
          
          return {
            id: msg.id,
            text: msg.content || msg.text,
            sender: isAdmin ? 'admin' : 'user',
            timestamp: msg.createdAt || msg.timestamp,
            isRead: true
          }
        }))
      }
    } catch (error: any) {
      console.error('Ошибка загрузки сообщений:', error)
      // Используем демо данные если БД недоступна
      setChatMessages([
        {
          id: '1',
          text: 'Добро пожаловать! Чем могу помочь?',
          sender: 'admin',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          isRead: true
        },
        {
          id: '2',
          text: 'Привет! У меня проблема с оплатой заказа',
          sender: 'user',
          timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
          isRead: true
        },
        {
          id: '3',
          text: 'Понимаю. Расскажите подробнее, какой именно заказ и что происходит при попытке оплаты?',
          sender: 'admin',
          timestamp: new Date(Date.now() - 30 * 1000).toISOString(),
          isRead: true
        }
      ])
      toast.error('Не удалось загрузить сообщения. Показаны демонстрационные данные.')
    } finally {
      setIsLoading(false)
    }
  }

  // Функции для чата
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const messageText = newMessage.trim()
    setNewMessage('')
    setIsTyping(true)

    try {
      // Отправляем сообщение в БД
      const response = await chatAPI.sendMessageToAdmin(messageText)
      
      if (response.data) {
        // Добавляем сообщение пользователя в чат
        const userMessage: ChatMessage = {
          id: response.data.id || Date.now().toString(),
          text: messageText,
          sender: 'user',
          timestamp: response.data.createdAt || new Date().toISOString(),
          isRead: true
        }

        setChatMessages(prev => [...prev, userMessage])
        
        // Симулируем ответ админа (в реальном приложении это будет webhook или polling)
        setTimeout(() => {
          const adminResponses = [
            'Понял, разбираюсь с вашей проблемой...',
            'Спасибо за информацию! Проверяю данные.',
            'Хорошо, я передам это в техническую поддержку.',
            'Понятно, сейчас посмотрю что можно сделать.',
            'Отлично! Я уже работаю над решением вашего вопроса.'
          ]
          
          const randomResponse = adminResponses[Math.floor(Math.random() * adminResponses.length)]
          
          const adminMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: randomResponse,
            sender: 'admin',
            timestamp: new Date().toISOString(),
            isRead: true
          }

          setChatMessages(prev => [...prev, adminMessage])
          setIsTyping(false)
        }, 1500)
      }
    } catch (error: any) {
      console.error('Ошибка отправки сообщения:', error)
      toast.error('Не удалось отправить сообщение')
      setIsTyping(false)
      
      // Добавляем сообщение локально если БД недоступна
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: messageText,
        sender: 'user',
        timestamp: new Date().toISOString(),
        isRead: true
      }

      setChatMessages(prev => [...prev, userMessage])
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
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

        {/* Чат на весь экран */}
        <div className="flex flex-col h-[calc(100vh-80px)]">
          {/* Заголовок чата */}
          <div className="px-4 py-3 border-b border-gray-200 bg-white">
            <h3 className="text-lg font-medium text-gray-900">Онлайн чат с поддержкой</h3>
            <p className="text-sm text-gray-500">Обычно отвечаем в течение 5 минут</p>
          </div>
          
          {/* Сообщения чата */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Загрузка сообщений...</p>
                </div>
              </div>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-xs lg:max-w-md">
                    {/* Подпись отправителя */}
                    <div className={`text-xs text-gray-500 mb-1 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {message.sender === 'user' ? 'Вы' : 'Админ'}
                    </div>
                    
                    {/* Сообщение */}
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    
                    {/* Время */}
                    <p className={`text-xs mt-1 text-gray-500 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {/* Индикатор печати */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md">
                  <div className="text-xs text-gray-500 mb-1 text-left">
                    Админ печатает...
                  </div>
                  <div className="bg-white text-gray-900 px-4 py-2 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          {/* Форма отправки сообщения */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}