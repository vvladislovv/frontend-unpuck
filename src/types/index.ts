// Основные типы приложения
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  role: 'seller' | 'blogger' | 'manager' | 'buyer'
  verified: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  images: string[]
  rating: number
  reviewsCount: number
  seller: {
    id: string
    name: string
    avatar?: string
    verified: boolean
  }
  inStock: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
  isFavorite?: boolean
}

export type DealStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface Deal {
  id: string
  product: Product
  buyer: User
  seller: User
  status: DealStatus
  quantity: number
  totalPrice: number
  paymentMethod: 'card' | 'wallet' | 'crypto'
  trackingNumber?: string
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  parentId?: string
  children?: Category[]
}

export interface SearchFilters {
  query?: string
  category?: string
  subcategory?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price' | 'name' | 'date' | 'rating'
  inStock?: boolean
  favoritesOnly?: boolean
}

export type ProductCategory = 'all' | 'clothing' | 'beauty' | 'home' | 'electronics' | 'other'
export type ProductSubcategory = 'shirts' | 'pants' | 'dresses' | 'shoes' | 'accessories' | 'makeup' | 'skincare' | 'furniture' | 'decor' | 'kitchen' | 'phones' | 'laptops' | 'other'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'wallet' | 'crypto'
  name: string
  last4?: string
  isDefault: boolean
}

export interface SocialLink {
  id: string
  platform: 'telegram' | 'instagram' | 'youtube' | 'tiktok'
  username: string
  url: string
  verified: boolean
}

// Админка
export interface AdminMessage {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  message: string
  type: 'support' | 'complaint' | 'suggestion' | 'other'
  status: 'new' | 'in_progress' | 'resolved'
  adminReply?: string
  createdAt: string
  updatedAt: string
}

export interface AdminStats {
  totalUsers: number
  totalProducts: number
  totalDeals: number
  pendingMessages: number
  revenue: number
  newUsersToday: number
  newProductsToday: number
  completedDealsToday: number
}

export interface AdminUser extends User {
  lastLogin?: string
  totalSpent: number
  totalEarned: number
  dealsCount: number
  productsCount: number
  isBlocked: boolean
  blockReason?: string
}

// Навигация
export type TabType = 'catalog' | 'deals' | 'profile' | 'admin'

// Состояние приложения
export interface AppState {
  currentTab: TabType
  user: User | null
  products: Product[]
  deals: Deal[]
  categories: Category[]
  notifications: Notification[]
  searchFilters: SearchFilters
  loading: boolean
  error: string | null
}

// API ответы
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
