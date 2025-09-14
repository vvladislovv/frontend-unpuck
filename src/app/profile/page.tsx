'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { ProfileContent } from '@/components/profile/profile-content'
import { profileAPI } from '@/lib/api'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setIsLoading(true)
      
      // Пытаемся загрузить данные с сервера
      const response = await profileAPI.getProfile()
      if (response.data) {
        setProfileData(response.data.data || response.data)
      }
    } catch (error: any) {
      console.error('Ошибка загрузки профиля:', error)
      
      // Если API недоступен, используем моковые данные
      const mockProfileData = {
        id: '123456789',
        firstName: 'Иван',
        lastName: 'Петров',
        username: 'ivan_petrov',
        languageCode: 'ru',
        isPremium: false,
        photoUrl: '/api/placeholder/100/100',
        email: 'ivan.petrov@example.com',
        phone: '+7 (999) 123-45-67',
        bio: 'Продавец и покупатель на платформе',
        verified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z'
      }
      
      setProfileData(mockProfileData)
      toast.error('Не удалось загрузить данные профиля. Показаны демонстрационные данные.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <ProfileContent 
        userData={profileData}
        isLoading={isLoading}
        theme="light"
        onHaptic={() => {}} // Пустая функция для haptic
      />
    </MainLayout>
  )
}

