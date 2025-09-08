'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { ArrowLeftIcon, CheckCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

export default function SupportPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: message,
        isUser: true,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, newMessage])
      setMessage('')
      setIsLoading(true)
      
      // Симуляция ответа поддержки
      setTimeout(() => {
        const response: Message = {
          id: Date.now() + 1,
          text: 'Спасибо за ваше сообщение! Мы получили ваш запрос и ответим в ближайшее время. Обычно время ответа составляет 1-2 часа в рабочее время.',
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, response])
        setIsLoading(false)
      }, 2000)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Заголовок */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={() => router.back()} className="p-1 -ml-1">
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Поддержка</h1>
          </div>
        </div>

        {/* Чат */}
        <div className="flex-1 flex flex-col">
          {/* Сообщения */}
          <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-blue-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircleIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Добро пожаловать в поддержку!</h3>
                <p className="text-gray-600">Напишите ваш вопрос, и мы ответим в ближайшее время.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.isUser 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {msg.timestamp.toLocaleTimeString('ru-RU', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">Поддержка печатает...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Форма ввода */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                rows={1}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Напишите ваш вопрос..."
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Обычно время ответа составляет 1-2 часа в рабочее время
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
