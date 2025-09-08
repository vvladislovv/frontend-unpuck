'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { User } from '@/types'
import { ArrowLeftIcon, CameraIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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

export default function ProfileEditPage() {
  const router = useRouter()
  const [user, setUser] = useState<User>(mockUser)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    bio: user.bio || '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setUser(prev => ({ ...prev, ...formData }))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      bio: user.bio || '',
    })
    setIsEditing(false)
    router.back()
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Заголовок */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={handleBack} className="p-1 -ml-1">
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Редактирование профиля</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Аватар */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-24 w-24 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <CameraIcon className="h-4 w-4 text-white" />
              </button>
            </div>
            <button className="text-sm text-blue-600 font-medium">
              Изменить фото
            </button>
          </div>

          {/* Форма */}
          <div className="space-y-4">
            {/* Имя */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите ваше имя"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите ваш email"
              />
            </div>

            {/* Телефон */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Телефон
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            {/* О себе */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                О себе
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Расскажите о себе"
              />
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <CheckIcon className="h-5 w-5" />
              <span>Сохранить</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
