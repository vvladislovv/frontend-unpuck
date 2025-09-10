import { useAuthStore } from '@/store/auth'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Кэш для GET запросов
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 минут

// Функция для проверки кэша
const getCachedData = (key: string) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

// Функция для сохранения в кэш
const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() })
}

// Функция для очистки кэша
export const clearCache = () => {
  cache.clear()
}

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'max-age=300', // 5 минут кэш
  },
})

// Request interceptor to add auth token and check cache
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Проверяем кэш для GET запросов
    if (config.method === 'get') {
      const cacheKey = `${config.url}?${JSON.stringify(config.params || {})}`
      const cachedData = getCachedData(cacheKey)
      if (cachedData) {
        // Возвращаем кэшированные данные
        return Promise.resolve({
          ...config,
          data: cachedData,
          fromCache: true
        })
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and caching
api.interceptors.response.use(
  (response) => {
    // Кэшируем успешные GET запросы
    if (response.config.method === 'get' && response.status === 200) {
      const cacheKey = `${response.config.url}?${JSON.stringify(response.config.params || {})}`
      setCachedData(cacheKey, response.data)
    }
    return response
  },
  (error) => {
    const { response } = error

    if (response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout()
      toast.error('Сессия истекла. Пожалуйста, войдите снова.')
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
    } else if (response?.status === 403) {
      toast.error('У вас нет прав для выполнения этого действия')
    } else if (response?.status === 404) {
      toast.error('Ресурс не найден')
    } else if (response?.status >= 500) {
      toast.error('Ошибка сервера. Попробуйте позже.')
    } else if (response?.data?.message) {
      toast.error(response.data.message)
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Превышено время ожидания')
    } else if (!navigator.onLine) {
      toast.error('Проверьте подключение к интернету')
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials: { identifier: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (data: {
    firstName: string
    lastName?: string
    email?: string
    username?: string
    password: string
    role: string
    referralCode?: string
  }) => api.post('/auth/register', data),
  
  telegramAuth: (data: {
    telegramId: string
    firstName: string
    lastName?: string
    username?: string
    photoUrl?: string
  }) => api.post('/auth/telegram', data),
  
  getProfile: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
}

// Users API
export const usersAPI = {
  updateProfile: (data: Partial<{
    firstName: string
    lastName: string
    email: string
    phone: string
    avatar: string
  }>) => api.put('/users/profile', data),
  
  getReferrals: () => api.get('/users/referrals'),
  getBalance: () => api.get('/users/balance'),
  
  getNotifications: (params?: {
    limit?: number
    offset?: number
    unread?: boolean
  }) => api.get('/users/notifications', { params }),
  
  markNotificationRead: (id: string) => 
    api.put(`/users/notifications/${id}/read`),
  
  markAllNotificationsRead: () => 
    api.put('/users/notifications/read-all'),
}

// Products API
export const productsAPI = {
  getProducts: (params?: {
    search?: string
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    sellerId?: string
    limit?: number
    offset?: number
    sortBy?: string
    sortOrder?: string
  }) => api.get('/products', { params }),
  
  getProduct: (id: string) => api.get(`/products/${id}`),
  
  createProduct: (data: {
    wbArticle: string
    title: string
    description?: string
    price: number
    images: string[]
    category: string
    brand?: string
  }) => api.post('/products', data),
  
  updateProduct: (id: string, data: Partial<{
    title: string
    description: string
    price: number
    images: string[]
    category: string
    brand: string
  }>) => api.put(`/products/${id}`, data),
  
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  getMyProducts: (params?: { limit?: number; offset?: number; isActive?: boolean }) =>
    api.get('/products/my/products', { params }),
}

// Campaigns API
export const campaignsAPI = {
  getCampaigns: (params?: {
    type?: string
    status?: string
    advertiserId?: string
    limit?: number
    offset?: number
  }) => api.get('/campaigns', { params }),
  
  getCampaign: (id: string) => api.get(`/campaigns/${id}`),
  
  createCampaign: (data: {
    title: string
    description?: string
    type: 'product' | 'channel'
    budget: number
    pricePerClick: number
    maxClicks?: number
    startDate?: string
    endDate?: string
    productId?: string
    channelId?: string
  }) => api.post('/campaigns', data),
  
  updateCampaign: (id: string, data: Partial<{
    title: string
    description: string
    budget: number
    pricePerClick: number
    maxClicks: number
    startDate: string
    endDate: string
  }>) => api.put(`/campaigns/${id}`, data),
  
  startCampaign: (id: string) => api.post(`/campaigns/${id}/start`),
  pauseCampaign: (id: string) => api.post(`/campaigns/${id}/pause`),
  recordClick: (id: string) => api.post(`/campaigns/${id}/click`),
  getMyCampaigns: (params?: { status?: string; limit?: number; offset?: number }) =>
    api.get('/campaigns/my/campaigns', { params }),
}

// Chat API
export const chatAPI = {
  getChats: (params?: { limit?: number; offset?: number }) =>
    api.get('/chat/chats', { params }),
  
  createChat: (data: {
    name?: string
    isGroup?: boolean
    participantIds: string[]
  }) => api.post('/chat/chats', data),
  
  getMessages: (chatId: string, params?: { limit?: number; cursor?: string }) =>
    api.get(`/chat/chats/${chatId}/messages`, { params }),
  
  sendMessage: (chatId: string, data: {
    content: string
    type?: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'
    metadata?: any
  }) => api.post(`/chat/chats/${chatId}/messages`, data),
  
  editMessage: (messageId: string, data: { content: string }) =>
    api.put(`/chat/messages/${messageId}`, data),
  
  deleteMessage: (messageId: string) => api.delete(`/chat/messages/${messageId}`),
  
  addParticipant: (chatId: string, data: { userId: string }) =>
    api.post(`/chat/chats/${chatId}/participants`, data),
  
  leaveChat: (chatId: string) => api.post(`/chat/chats/${chatId}/leave`),
}

// Transactions API
export const transactionsAPI = {
  getTransactions: (params?: {
    type?: string
    status?: string
    limit?: number
    offset?: number
    dateFrom?: string
    dateTo?: string
  }) => api.get('/transactions', { params }),
  
  requestWithdrawal: (data: {
    amount: number
    method: 'bank_card' | 'yoomoney' | 'qiwi'
    details: {
      cardNumber?: string
      accountId?: string
      phone?: string
    }
  }) => api.post('/transactions/withdrawal', data),
  
  getStats: (params?: { period?: '7d' | '30d' | '90d' | '1y' }) =>
    api.get('/transactions/stats', { params }),
  
  cancelTransaction: (id: string) => api.post(`/transactions/${id}/cancel`),
}

// Deals API
export const dealsAPI = {
  getDeals: (params?: {
    status?: string
    buyerId?: string
    sellerId?: string
    limit?: number
    offset?: number
  }) => api.get('/deals', { params }),
  
  getDeal: (id: string) => api.get(`/deals/${id}`),
  
  createDeal: (data: {
    productId: string
    quantity: number
    totalPrice: number
    paymentMethod: 'card' | 'wallet' | 'crypto'
  }) => api.post('/deals', data),
  
  updateDeal: (id: string, data: Partial<{
    status: string
    trackingNumber: string
    notes: string
  }>) => api.put(`/deals/${id}`, data),
  
  cancelDeal: (id: string) => api.post(`/deals/${id}/cancel`),
  
  getMyDeals: (params?: { status?: string; limit?: number; offset?: number }) =>
    api.get('/deals/my/deals', { params }),
}

// Payment API
export const paymentAPI = {
  createPayment: (data: {
    productId: string
    quantity: number
    totalPrice: number
    userId: string
    paymentMethod: 'card' | 'wallet' | 'crypto'
  }) => api.post('/payment/create', data),
  
  getPayment: (id: string) => api.get(`/payment/${id}`),
  
  confirmPayment: (id: string) => api.post(`/payment/${id}/confirm`),
  
  cancelPayment: (id: string) => api.post(`/payment/${id}/cancel`),
}

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  
  getMessages: (params?: {
    status?: string
    type?: string
    limit?: number
    offset?: number
  }) => api.get('/admin/messages', { params }),
  
  replyToMessage: (messageId: string, data: { reply: string }) =>
    api.post(`/admin/messages/${messageId}/reply`, data),
  
  getUsers: (params?: {
    role?: string
    verified?: boolean
    blocked?: boolean
    limit?: number
    offset?: number
  }) => api.get('/admin/users', { params }),
  
  updateUser: (userId: string, data: Partial<{
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    verified: boolean
  }>) => api.put(`/admin/users/${userId}`, data),
  
  blockUser: (userId: string, data: { reason: string }) =>
    api.post(`/admin/users/${userId}/block`, data),
  
  unblockUser: (userId: string) => api.post(`/admin/users/${userId}/unblock`),
  
  verifyUser: (userId: string) => api.post(`/admin/users/${userId}/verify`),
  
  getProducts: (params?: {
    sellerId?: string
    category?: string
    status?: string
    limit?: number
    offset?: number
  }) => api.get('/admin/products', { params }),
  
  updateProduct: (productId: string, data: Partial<{
    title: string
    description: string
    price: number
    category: string
    isActive: boolean
  }>) => api.put(`/admin/products/${productId}`, data),
  
  deleteProduct: (productId: string) => api.delete(`/admin/products/${productId}`),
  
  getDeals: (params?: {
    status?: string
    buyerId?: string
    sellerId?: string
    limit?: number
    offset?: number
  }) => api.get('/admin/deals', { params }),
  
  updateDealStatus: (dealId: string, data: { status: string; notes?: string }) =>
    api.put(`/admin/deals/${dealId}/status`, data),
  
  resolveDispute: (dealId: string, data: { resolution: string; refundAmount?: number }) =>
    api.post(`/admin/deals/${dealId}/resolve-dispute`, data),
}

// Upload API
export const uploadAPI = {
  uploadFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  
  uploadFiles: (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    return api.post('/upload/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  
  deleteFile: (filename: string) => api.delete(`/upload/file/${filename}`),
  getFileInfo: (filename: string) => api.get(`/upload/file/${filename}/info`),
}

// Statistics API
export const statisticsAPI = {
  getUserStats: (params?: { period?: '7d' | '30d' | '90d' | '1y' }) =>
    api.get('/statistics/user', { params }),
  
  getProductStats: (productId: string, params?: { period?: '7d' | '30d' | '90d' | '1y' }) =>
    api.get(`/statistics/product/${productId}`, { params }),
  
  getSalesStats: (params?: { period?: '7d' | '30d' | '90d' | '1y' }) =>
    api.get('/statistics/sales', { params }),
}

// Support API
export const supportAPI = {
  sendMessage: (data: {
    subject: string
    message: string
    type: 'support' | 'complaint' | 'suggestion' | 'other'
    priority: 'low' | 'medium' | 'high'
  }) => api.post('/support/message', data),
  
  getMessages: (params?: {
    status?: string
    type?: string
    limit?: number
    offset?: number
  }) => api.get('/support/messages', { params }),
  
  getMessage: (messageId: string) => api.get(`/support/messages/${messageId}`),
  
  replyToMessage: (messageId: string, data: { reply: string }) =>
    api.post(`/support/messages/${messageId}/reply`, data),
}

// Academy API
export const academyAPI = {
  getCourses: (params?: {
    category?: string
    level?: string
    limit?: number
    offset?: number
  }) => api.get('/academy/courses', { params }),
  
  getCourse: (courseId: string) => api.get(`/academy/courses/${courseId}`),
  
  getLessons: (courseId: string) => api.get(`/academy/courses/${courseId}/lessons`),
  
  getLesson: (courseId: string, lessonId: string) =>
    api.get(`/academy/courses/${courseId}/lessons/${lessonId}`),
  
  markLessonComplete: (courseId: string, lessonId: string) =>
    api.post(`/academy/courses/${courseId}/lessons/${lessonId}/complete`),
  
  getProgress: (courseId?: string) =>
    api.get('/academy/progress', { params: courseId ? { courseId } : {} }),
}

// Affiliate API
export const affiliateAPI = {
  getReferralStats: () => api.get('/affiliate/stats'),
  
  getReferrals: (params?: {
    status?: string
    limit?: number
    offset?: number
  }) => api.get('/affiliate/referrals', { params }),
  
  getCommissions: (params?: {
    status?: string
    dateFrom?: string
    dateTo?: string
    limit?: number
    offset?: number
  }) => api.get('/affiliate/commissions', { params }),
  
  requestPayout: (data: {
    amount: number
    method: 'bank_card' | 'yoomoney' | 'qiwi'
    details: {
      cardNumber?: string
      accountId?: string
      phone?: string
    }
  }) => api.post('/affiliate/payout', data),
  
  getPayoutHistory: (params?: {
    status?: string
    limit?: number
    offset?: number
  }) => api.get('/affiliate/payouts', { params }),
}

// Telegram API
export const telegramAPI = {
  getUserInfo: (telegramId: string) => api.get(`/telegram/user/${telegramId}`),
  
  getUserPhoto: (telegramId: string) => api.get(`/telegram/user/${telegramId}/photo`),
  
  searchUser: (username: string) => api.get(`/telegram/search/${username}`),
  
  verifyUser: (telegramId: string, data: {
    firstName: string
    lastName?: string
    username?: string
    photoUrl?: string
  }) => api.post(`/telegram/verify/${telegramId}`, data),
  
  connectAccount: (data: {
    platform: 'telegram' | 'instagram' | 'youtube' | 'tiktok'
    username: string
    url: string
    telegramId?: string
  }) => api.post('/social/connect', data),
  
  getSocialLinks: () => api.get('/social/links'),
  
  updateSocialLink: (linkId: string, data: {
    username: string
    url: string
    verified: boolean
  }) => api.put(`/social/links/${linkId}`, data),
  
  deleteSocialLink: (linkId: string) => api.delete(`/social/links/${linkId}`),
}
