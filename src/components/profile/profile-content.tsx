'use client'

import { User } from '@/types'
import { useState } from 'react'
import { OtherSection } from './other-section'
import { ProfileSection } from './profile-section'
import { ToolsSection } from './tools-section'

// Тестовые данные пользователя
const mockUser: User = {
  id: '1',
  name: 'Иван Петров',
  email: 'ivan@example.com',
  phone: '+7 (999) 123-45-67',
  avatar: '/api/placeholder/80/80',
  bio: 'Люблю качественные товары и хороший сервис',
  role: 'buyer',
  verified: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-18T12:00:00Z',
}

export function ProfileContent() {
  const [user] = useState<User>(mockUser)

  return (
    <div className="min-h-screen bg-white">
      {/* Заголовок */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">Профиль</h1>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Информация о пользователе */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative h-16 w-16 flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              {user.verified && (
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              {user.phone && (
                <p className="text-sm text-gray-500">{user.phone}</p>
              )}
              {user.bio && (
                <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Профиль */}
        <ProfileSection />

        {/* Инструменты */}
        <ToolsSection />

        {/* Другое */}
        <OtherSection />
      </div>
    </div>
  )
}
