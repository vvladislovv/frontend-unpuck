// Вспомогательные функции для работы с авторизацией

export interface AuthUser {
  id: string
  username?: string
  email?: string
  firstName: string
  lastName?: string
  avatar?: string
  role: 'SELLER' | 'BLOGGER' | 'MANAGER' | 'ADMIN'
  balance: number
  referralCode: string
  isVerified: boolean
  telegramId?: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

// Функция для получения существующего токена из localStorage
export const getExistingToken = (): string | null => {
  if (typeof window === 'undefined') return null
  
  // Проверяем разные возможные ключи
  const possibleKeys = ['auth_token', 'token', 'authToken', 'access_token']
  
  for (const key of possibleKeys) {
    const token = localStorage.getItem(key)
    if (token) {
      console.log(`🔑 Найден токен в localStorage: ${key}`)
      return token
    }
  }
  
  return null
}

// Функция для автоматического входа с существующим токеном
export const autoLoginWithExistingToken = async (): Promise<AuthResponse | null> => {
  try {
    const existingToken = getExistingToken()
    if (!existingToken) {
      console.log('🔍 Токен не найден в localStorage')
      return null
    }

    // Проверяем токен, делая запрос к /auth/me
    const response = await fetch('http://localhost:3000/auth/me', {
      headers: {
        'Authorization': `Bearer ${existingToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const user = await response.json()
      console.log('✅ Токен валиден, пользователь авторизован:', user.firstName, user.lastName)
      return { user, token: existingToken }
    } else {
      console.log('❌ Токен невалиден, статус:', response.status)
      // Очищаем невалидный токен
      localStorage.removeItem('auth_token')
      localStorage.removeItem('token')
      return null
    }
  } catch (error) {
    console.error('❌ Ошибка проверки токена:', error)
    return null
  }
}

// Функция для входа с тестовым пользователем
export const loginWithTestUser = async (): Promise<AuthResponse | null> => {
  try {
    console.log('🔐 Попытка входа с тестовым пользователем...')
    
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: 'testuser',
        password: 'password123'
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Успешный вход с тестовым пользователем:', data.user.firstName, data.user.lastName)
      
      // Сохраняем токен в localStorage
      localStorage.setItem('auth_token', data.token)
      
      return data
    } else {
      console.log('❌ Ошибка входа с тестовым пользователем:', response.status)
      return null
    }
  } catch (error) {
    console.error('❌ Ошибка входа с тестовым пользователем:', error)
    return null
  }
}

// Функция для автоматической авторизации (сначала проверяет существующий токен, потом тестового пользователя)
export const autoAuth = async (): Promise<AuthResponse | null> => {
  console.log('🚀 Автоматическая авторизация...')
  
  // Сначала пробуем существующий токен
  const existingAuth = await autoLoginWithExistingToken()
  if (existingAuth) {
    return existingAuth
  }
  
  // Если нет токена, пробуем войти с тестовым пользователем
  const testAuth = await loginWithTestUser()
  if (testAuth) {
    return testAuth
  }
  
  console.log('❌ Не удалось авторизоваться автоматически')
  return null
}
