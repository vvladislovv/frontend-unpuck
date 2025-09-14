// Глобальный менеджер токенов для всего приложения

class TokenManager {
  private static instance: TokenManager
  private token: string | null = null
  private user: any = null
  private isInitialized = false

  private constructor() {
    this.initializeFromStorage()
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  // Инициализация из localStorage при загрузке приложения
  private initializeFromStorage() {
    if (typeof window === 'undefined') return

    try {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')
      
      if (storedToken) {
        this.token = storedToken
        console.log('🔑 Токен загружен из localStorage:', storedToken.substring(0, 20) + '...')
      }
      
      if (storedUser) {
        this.user = JSON.parse(storedUser)
        console.log('👤 Пользователь загружен из localStorage:', this.user.firstName, this.user.lastName)
      }
      
      this.isInitialized = true
      console.log('✅ TokenManager инициализирован')
    } catch (error) {
      console.error('❌ Ошибка инициализации TokenManager:', error)
    }
  }

  // Получить текущий токен
  public getToken(): string | null {
    if (!this.isInitialized) {
      this.initializeFromStorage()
    }
    return this.token
  }

  // Получить текущего пользователя
  public getUser(): any {
    if (!this.isInitialized) {
      this.initializeFromStorage()
    }
    return this.user
  }

  // Проверить, авторизован ли пользователь
  public isAuthenticated(): boolean {
    return !!(this.token && this.user)
  }

  // Установить токен и пользователя
  public setAuth(token: string, user: any): void {
    this.token = token
    this.user = user
    
    // Сохраняем в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
      console.log('💾 Токен и пользователь сохранены в localStorage')
    }
  }

  // Очистить авторизацию
  public clearAuth(): void {
    this.token = null
    this.user = null
    
    // Очищаем localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      console.log('🗑️ Токен и пользователь удалены из localStorage')
    }
  }

  // Обновить информацию о пользователе
  public updateUser(user: any): void {
    this.user = user
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user))
      console.log('👤 Информация о пользователе обновлена')
    }
  }

  // Проверить валидность токена на сервере
  public async validateToken(): Promise<boolean> {
    if (!this.token) return false

    try {
      const response = await fetch('http://localhost:3000/auth/me', {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const user = await response.json()
        this.updateUser(user)
        console.log('✅ Токен валиден, пользователь обновлен')
        return true
      } else {
        console.log('❌ Токен невалиден, статус:', response.status)
        this.clearAuth()
        return false
      }
    } catch (error) {
      console.error('❌ Ошибка проверки токена:', error)
      return false
    }
  }

  // Автоматическая авторизация
  public async autoAuth(): Promise<{ user: any; token: string } | null> {
    try {
      console.log('🔐 Попытка автоматической авторизации...')
      
      // Сначала проверяем существующий токен
      if (this.isAuthenticated()) {
        console.log('🔑 Найден существующий токен, проверяем валидность...')
        const isValid = await this.validateToken()
        if (isValid) {
          console.log('✅ Автоматическая авторизация через существующий токен')
          return { user: this.user, token: this.token! }
        } else {
          console.log('❌ Существующий токен невалиден, очищаем...')
          this.clearAuth()
        }
      }

      // Если токен невалиден или отсутствует, пробуем войти с админ пользователем
      console.log('🔐 Попытка входа с админ пользователем...')
      
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: 'admin@unpacksbot.com',
          password: 'admin123'
        })
      })

      if (response.ok) {
        const data = await response.json()
        this.setAuth(data.token, data.user)
        console.log('✅ Автоматическая авторизация успешна:', data.user.firstName, data.user.lastName)
        return data
      } else {
        console.log('❌ Ошибка автоматической авторизации:', response.status)
        const errorText = await response.text()
        console.log('📄 Детали ошибки:', errorText)
        return null
      }
    } catch (error) {
      console.error('❌ Ошибка автоматической авторизации:', error)
      return null
    }
  }
}

// Экспортируем единственный экземпляр
export const tokenManager = TokenManager.getInstance()

// Хук для использования в React компонентах
export const useTokenManager = () => {
  return {
    token: tokenManager.getToken(),
    user: tokenManager.getUser(),
    isAuthenticated: tokenManager.isAuthenticated(),
    setAuth: tokenManager.setAuth.bind(tokenManager),
    clearAuth: tokenManager.clearAuth.bind(tokenManager),
    updateUser: tokenManager.updateUser.bind(tokenManager),
    validateToken: tokenManager.validateToken.bind(tokenManager),
    autoAuth: tokenManager.autoAuth.bind(tokenManager)
  }
}
