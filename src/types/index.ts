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

// Навигация
export type TabType = 'catalog' | 'deals' | 'profile'

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
