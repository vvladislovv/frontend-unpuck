'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { ProfileContent } from '@/components/profile/profile-content'
import { useTelegram } from '@/components/providers/telegram-provider'
import { useTelegramAPI } from '@/hooks/use-telegram-api'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { user, theme, haptic } = useTelegram()
  const { userData, getUserData, getUserPhoto, isLoading } = useTelegramAPI()
  const [profileData, setProfileData] = useState<any>(null)

  useEffect(() => {
    if (user) {
      // Используем данные из Telegram WebApp как fallback
      const fallbackData = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        languageCode: user.language_code,
        isPremium: user.is_premium,
        photoUrl: user.photo_url,
        email: `${user.username || user.id}@telegram.user`,
        phone: '+7 (999) 123-45-67' // Placeholder
      }
      setProfileData(fallbackData)
    }
  }, [user])

  useEffect(() => {
    if (userData) {
      setProfileData(userData)
    }
  }, [userData])

  return (
    <MainLayout>
      <ProfileContent 
        userData={profileData}
        isLoading={isLoading}
        theme={theme}
        onHaptic={haptic.impact}
      />
    </MainLayout>
  )
}

