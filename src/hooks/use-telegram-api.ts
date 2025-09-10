import { useTelegram } from '@/components/providers/telegram-provider'
import { telegramAPI } from '@/lib/api'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export function useTelegramAPI() {
  const { user, webApp, haptic, showAlert, showConfirm } = useTelegram()
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  // Получаем данные пользователя из Telegram
  const getUserData = useCallback(async () => {
    if (!user?.id) return null

    try {
      setIsLoading(true)
      const response = await telegramAPI.getUserInfo(user.id.toString())
      const data = response.data.data || response.data
      setUserData(data)
      return data
    } catch (error) {
      console.error('Ошибка получения данных пользователя:', error)
      // Fallback на данные из Telegram WebApp
      const fallbackData = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        languageCode: user.language_code,
        isPremium: user.is_premium,
        photoUrl: user.photo_url
      }
      setUserData(fallbackData)
      return fallbackData
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Получаем фото пользователя
  const getUserPhoto = useCallback(async () => {
    if (!user?.id) return null

    try {
      const response = await telegramAPI.getUserPhoto(user.id.toString())
      return response.data.data || response.data
    } catch (error) {
      console.error('Ошибка получения фото пользователя:', error)
      return user.photo_url || null
    }
  }, [user])

  // Поиск пользователя
  const searchUser = useCallback(async (username: string) => {
    try {
      setIsLoading(true)
      const response = await telegramAPI.searchUser(username)
      return response.data.data || response.data
    } catch (error) {
      console.error('Ошибка поиска пользователя:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Верификация пользователя
  const verifyUser = useCallback(async (data: {
    firstName: string
    lastName?: string
    username?: string
    photoUrl?: string
  }) => {
    if (!user?.id) throw new Error('Пользователь не найден')

    try {
      setIsLoading(true)
      const response = await telegramAPI.verifyUser(user.id.toString(), data)
      const result = response.data.data || response.data
      
      haptic.notification('success')
      toast.success('Пользователь успешно верифицирован!')
      
      return result
    } catch (error) {
      console.error('Ошибка верификации пользователя:', error)
      haptic.notification('error')
      toast.error('Ошибка верификации пользователя')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [user, haptic])

  // Подключение социальной сети
  const connectSocial = useCallback(async (platform: string, username: string, url: string) => {
    try {
      setIsLoading(true)
      const response = await telegramAPI.connectAccount({
        platform: platform as any,
        username,
        url,
        telegramId: user?.id?.toString()
      })
      
      const result = response.data.data || response.data
      
      haptic.notification('success')
      toast.success('Социальная сеть успешно подключена!')
      
      return result
    } catch (error) {
      console.error('Ошибка подключения социальной сети:', error)
      haptic.notification('error')
      toast.error('Ошибка подключения социальной сети')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [user, haptic])

  // Получение социальных ссылок
  const getSocialLinks = useCallback(async () => {
    try {
      const response = await telegramAPI.getSocialLinks()
      return response.data.data || response.data
    } catch (error) {
      console.error('Ошибка получения социальных ссылок:', error)
      return []
    }
  }, [])

  // Обновление социальной ссылки
  const updateSocialLink = useCallback(async (linkId: string, data: {
    username: string
    url: string
    verified: boolean
  }) => {
    try {
      setIsLoading(true)
      const response = await telegramAPI.updateSocialLink(linkId, data)
      const result = response.data.data || response.data
      
      haptic.notification('success')
      toast.success('Социальная ссылка обновлена!')
      
      return result
    } catch (error) {
      console.error('Ошибка обновления социальной ссылки:', error)
      haptic.notification('error')
      toast.error('Ошибка обновления социальной ссылки')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [haptic])

  // Удаление социальной ссылки
  const deleteSocialLink = useCallback(async (linkId: string) => {
    try {
      setIsLoading(true)
      await telegramAPI.deleteSocialLink(linkId)
      
      haptic.notification('success')
      toast.success('Социальная ссылка удалена!')
    } catch (error) {
      console.error('Ошибка удаления социальной ссылки:', error)
      haptic.notification('error')
      toast.error('Ошибка удаления социальной ссылки')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [haptic])

  // Показать уведомление через Telegram
  const showTelegramAlert = useCallback(async (message: string) => {
    haptic.notification('success')
    await showAlert(message)
  }, [haptic, showAlert])

  // Показать подтверждение через Telegram
  const showTelegramConfirm = useCallback(async (message: string) => {
    haptic.notification('success')
    return await showConfirm(message)
  }, [haptic, showConfirm])

  // Отправить данные в Telegram
  const sendTelegramData = useCallback((data: any) => {
    if (webApp) {
      webApp.sendData(JSON.stringify(data))
      haptic.notification('success')
    }
  }, [webApp, haptic])

  // Загружаем данные пользователя при монтировании
  useEffect(() => {
    if (user?.id) {
      getUserData()
    }
  }, [user, getUserData])

  return {
    user,
    userData,
    isLoading,
    getUserData,
    getUserPhoto,
    searchUser,
    verifyUser,
    connectSocial,
    getSocialLinks,
    updateSocialLink,
    deleteSocialLink,
    showTelegramAlert,
    showTelegramConfirm,
    sendTelegramData,
    haptic
  }
}
