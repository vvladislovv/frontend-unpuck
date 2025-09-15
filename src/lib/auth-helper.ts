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
    
    // ПРИНУДИТЕЛЬНО очищаем localStorage перед входом
    if (typeof window !== 'undefined') {
      console.log('🧹 ПРИНУДИТЕЛЬНАЯ очистка localStorage в loginWithTestUser...')
      localStorage.clear()
    }
    
    // Пробуем разных пользователей с данными (сначала тех, у кого больше данных)
    const testUsers = [
      { identifier: 'user1@test.com', password: 'user1123' }, // 4 продукта, 8 сделок, 4 транзакции, 3 реферала
      { identifier: 'user2@test.com', password: 'user2123' }, // 9 продуктов, 3 сделки, 6 транзакций, 2 реферала
      { identifier: 'user3@test.com', password: 'user3123' }, // 7 продуктов, 6 сделок, 6 транзакций, 1 реферал
      { identifier: 'testuser', password: 'password123' }     // 9 продуктов, 9 сделок, 26 транзакций, 2 реферала
    ]
    
    for (const user of testUsers) {
      try {
        console.log(`Пробуем пользователя: ${user.identifier}`)
        
        const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })

        if (response.ok) {
          const data = await response.json()
          console.log('✅ Успешный вход с тестовым пользователем:', data.user.firstName, data.user.lastName)
          
          // Проверяем, есть ли у пользователя данные для статистики
          const hasData = await checkUserHasStatsData(data.token)
          if (hasData) {
            console.log('✅ Пользователь имеет данные для статистики')
            // Сохраняем токен в localStorage
            localStorage.setItem('auth_token', data.token)
            return data
          } else {
            console.log('⚠️ Пользователь не имеет данных для статистики, пробуем следующего')
          }
        } else {
          console.log(`❌ Ошибка входа с ${user.identifier}:`, response.status)
        }
      } catch (error) {
        console.log(`❌ Ошибка входа с ${user.identifier}:`, error)
      }
    }
    
    console.log('❌ Не удалось войти ни с одним тестовым пользователем')
    return null
  } catch (error) {
    console.error('❌ Общая ошибка входа с тестовым пользователем:', error)
    return null
  }
}

// Функция для автоматической авторизации (сначала проверяет существующий токен, потом тестового пользователя)
export const autoAuth = async (): Promise<AuthResponse | null> => {
  console.log('🚀 Автоматическая авторизация...')
  
  // ПРИНУДИТЕЛЬНО очищаем localStorage
  if (typeof window !== 'undefined') {
    console.log('🧹 ПРИНУДИТЕЛЬНАЯ очистка localStorage в autoAuth...')
    localStorage.clear()
  }
  
  // Пропускаем проверку существующего токена и сразу пробуем тестовых пользователей
  console.log('🔄 Пропускаем проверку существующего токена, сразу пробуем тестовых пользователей...')
  
  // Пробуем войти с тестовым пользователем
  const testAuth = await loginWithTestUser()
  if (testAuth) {
    return testAuth
  }
  
  console.log('❌ Не удалось авторизоваться автоматически')
  return null
}

// Функция для проверки, есть ли у пользователя данные для статистики
const checkUserHasStatsData = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3000/statistics/user?period=30d', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const stats = await response.json()
      // Проверяем, есть ли значимые данные (не только продукты)
      const hasData = stats.totalDeals > 0 || stats.totalTransactions > 0 || stats.totalReferrals > 0 || stats.totalRevenue > 0
      console.log(`📊 Пользователь имеет данные: ${hasData}`, stats)
      return hasData
    }
    
    return false
  } catch (error) {
    console.error('❌ Ошибка проверки данных пользователя:', error)
    return false
  }
}
