'use client'

import { ChatMessages } from '@/components/admin/chat-messages'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { DealManagementMobile } from '@/components/admin/deal-management-mobile'
import { DealModal } from '@/components/admin/deal-modal'
import { Notification } from '@/components/admin/notification'
import { ProductManagement } from '@/components/admin/product-management'
import { ProductModal } from '@/components/admin/product-modal'
import { UserManagement } from '@/components/admin/user-management'
import { UserModal } from '@/components/admin/user-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { adminAPI } from '@/lib/api'
import { tokenManager } from '@/lib/token-manager'
import { AdminMessage, AdminStats, AdminUser, ChatMessage, Deal, DealStatus, Product } from '@/types'
import {
    ArrowLeftIcon,
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    ShoppingBagIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

// Инициализация с пустыми данными
const initialStats: AdminStats = {
  totalUsers: 0,
  totalProducts: 0,
  totalDeals: 0,
  pendingMessages: 0,
  revenue: 0,
  newUsersToday: 0,
  newProductsToday: 0,
  completedDealsToday: 0,
}

type AdminTab = 'dashboard' | 'messages' | 'products' | 'deals' | 'users'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null)
  const [replyText, setReplyText] = useState('')
  const [showProductModal, setShowProductModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showDealModal, setShowDealModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)

  const tabs = [
    { id: 'dashboard', label: 'Панель', icon: ChartBarIcon },
    { id: 'messages', label: 'Сообщения', icon: ChatBubbleLeftRightIcon },
    { id: 'products', label: 'Товары', icon: ShoppingBagIcon },
    { id: 'deals', label: 'Сделки', icon: ChartBarIcon },
    { id: 'users', label: 'Пользователи', icon: UserGroupIcon },
  ]
  const [productModalMode, setProductModalMode] = useState<'create' | 'edit'>('create')
  const [userModalMode, setUserModalMode] = useState<'create' | 'edit'>('create')
  const [stats, setStats] = useState<AdminStats>(initialStats)
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    isVisible: boolean
  }>({
    message: '',
    type: 'info',
    isVisible: false
  })
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type?: 'warning' | 'danger' | 'info'
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  })

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    // Сначала пытаемся авторизоваться, затем загружаем данные
    const initializeAdmin = async () => {
      try {
        // Пытаемся авторизоваться автоматически
        const authResult = await tokenManager.autoAuth()
        if (authResult) {
          console.log('✅ Авторизация в админке успешна')
        } else {
          console.log('⚠️ Авторизация не удалась, но продолжаем загрузку данных')
        }
      } catch (error) {
        console.error('❌ Ошибка авторизации в админке:', error)
      }
      
      // Загружаем данные независимо от результата авторизации
    loadAdminData()
    }
    
    initializeAdmin()
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      
      // Загружаем все данные с API
      const [statsResponse, messagesResponse, chatMessagesResponse, productsResponse, usersResponse, dealsResponse] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getMessages({ limit: 50 }),
        adminAPI.getChatMessages(),
        adminAPI.getProducts(),
        adminAPI.getUsers(),
        adminAPI.getDeals()
      ])
      
        if (statsResponse.data) {
        const apiStats = statsResponse.data
        // Преобразуем данные API в формат AdminStats
        setStats({
          totalUsers: apiStats.totalUsers || 0,
          totalProducts: apiStats.totalProducts || 0,
          totalDeals: apiStats.totalDeals || 0,
          pendingMessages: apiStats.newMessages || 0,
          revenue: apiStats.totalRevenue || 0,
          newUsersToday: apiStats.usersChange || 0,
          newProductsToday: apiStats.productsChange || 0,
          completedDealsToday: apiStats.dealsChange || 0,
        })
        console.log('📊 Статистика загружена:', apiStats)
      }
      
      if (messagesResponse.data) {
        const apiMessages = Array.isArray(messagesResponse.data) ? messagesResponse.data : []
        // Преобразуем данные API в формат AdminMessage
        const formattedMessages: AdminMessage[] = apiMessages.map((msg: any) => ({
          id: msg.id,
          userId: msg.userId,
          userName: `${msg.user?.firstName || ''} ${msg.user?.lastName || ''}`.trim(),
          userAvatar: '/avatars/default.jpg',
          message: msg.message,
          type: 'support',
          status: msg.status?.toLowerCase() || 'new',
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt,
        }))
        setMessages(formattedMessages)
        console.log('💬 Сообщения загружены:', formattedMessages.length)
      }
      
      if (chatMessagesResponse.data) {
        const apiChatMessages = Array.isArray(chatMessagesResponse.data) ? chatMessagesResponse.data : []
        setChatMessages(apiChatMessages)
        console.log('💬 Сообщения чатов загружены:', apiChatMessages.length)
      }
      
      if (productsResponse.data) {
        const apiProducts = Array.isArray(productsResponse.data) ? productsResponse.data : []
        // Преобразуем данные API в формат Product
        const formattedProducts: Product[] = apiProducts.map((prod: any) => ({
          id: prod.id,
          title: prod.title,
          description: prod.description,
          price: parseInt(prod.price) || 0,
          originalPrice: parseInt(prod.price) || 0,
          category: prod.category,
          subcategory: prod.category,
          images: prod.images || [],
          rating: 4.5,
          reviewsCount: 0,
          seller: {
            id: prod.seller?.id || '',
            name: `${prod.seller?.firstName || ''} ${prod.seller?.lastName || ''}`.trim(),
            avatar: '/avatars/default.jpg',
            verified: true,
          },
          inStock: prod.isActive || false,
          tags: [],
          createdAt: prod.createdAt,
          updatedAt: prod.updatedAt,
        }))
        setProducts(formattedProducts)
        console.log('📦 Товары загружены:', formattedProducts.length)
      }
      
      if (usersResponse.data) {
        const apiUsers = Array.isArray(usersResponse.data) ? usersResponse.data : []
        // Преобразуем данные API в формат AdminUser
        const formattedUsers: AdminUser[] = apiUsers.map((user: any) => ({
          id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
          phone: user.phone || '',
          avatar: '/avatars/default.jpg',
          bio: '',
          role: user.role?.toLowerCase() || 'buyer',
          verified: user.isVerified || false,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLogin: user.lastLoginAt,
          totalSpent: 0,
          totalEarned: 0,
          dealsCount: 0,
          productsCount: 0,
          isBlocked: !user.isActive,
        }))
        setUsers(formattedUsers)
        console.log('👥 Пользователи загружены:', formattedUsers.length)
      }
      
      if (dealsResponse.data) {
        const apiDeals = Array.isArray(dealsResponse.data) ? dealsResponse.data : []
        // Преобразуем данные API в формат Deal
        const formattedDeals: Deal[] = apiDeals.map((deal: any) => ({
          id: deal.id,
          product: {
            id: deal.product?.id || '',
            title: deal.product?.title || '',
            description: '',
            price: parseInt(deal.product?.price) || 0,
            originalPrice: parseInt(deal.product?.price) || 0,
            category: '',
            subcategory: '',
            images: [],
            rating: 4.5,
            reviewsCount: 0,
            seller: {
              id: deal.seller?.id || '',
              name: `${deal.seller?.firstName || ''} ${deal.seller?.lastName || ''}`.trim(),
              avatar: '/avatars/default.jpg',
              verified: true,
            },
            inStock: true,
            tags: [],
            createdAt: deal.createdAt,
            updatedAt: deal.updatedAt,
          },
          buyer: {
            id: deal.buyer?.id || '',
            name: `${deal.buyer?.firstName || ''} ${deal.buyer?.lastName || ''}`.trim(),
            email: '',
            phone: '',
            avatar: '/avatars/default.jpg',
            role: 'buyer',
            verified: true,
            createdAt: deal.createdAt,
            updatedAt: deal.updatedAt,
          },
          seller: {
            id: deal.seller?.id || '',
            name: `${deal.seller?.firstName || ''} ${deal.seller?.lastName || ''}`.trim(),
            email: '',
            phone: '',
            avatar: '/avatars/default.jpg',
            role: 'seller',
            verified: true,
            createdAt: deal.createdAt,
            updatedAt: deal.updatedAt,
          },
          status: deal.status?.toLowerCase() || 'pending',
          totalPrice: parseInt(deal.amount) || 0,
          quantity: 1,
          shippingAddress: {
            street: '',
            city: '',
            postalCode: '',
            country: '',
          },
          paymentMethod: 'card',
          trackingNumber: undefined,
          notes: deal.description || '',
          createdAt: deal.createdAt,
          updatedAt: deal.updatedAt,
          estimatedDelivery: deal.createdAt,
        }))
        setDeals(formattedDeals)
        console.log('🤝 Сделки загружены:', formattedDeals.length)
      }
      
    } catch (error: any) {
      console.error('Ошибка загрузки админ данных:', error)
      showNotification('Ошибка загрузки данных: ' + (error.message || 'Неизвестная ошибка'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setNotification({
      message,
      type,
      isVisible: true
    })
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }))
    }, 5000)
  }

  const handleBackToMenu = () => {
    window.location.href = '/'
  }

  const handleCreateProduct = () => {
    setSelectedProduct(null)
    setProductModalMode('create')
    setShowProductModal(true)
  }

  const handleSaveProduct = async (product: Product) => {
    try {
      if (productModalMode === 'create') {
        await adminAPI.createProduct({
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          wbArticle: product.wbArticle,
          images: product.images,
          isActive: product.inStock,
        })
        showNotification('Товар создан', 'success')
      } else {
        await adminAPI.updateProduct(product.id, {
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          isActive: product.inStock,
        })
        showNotification('Товар обновлен', 'success')
      }
      setShowProductModal(false)
      loadAdminData()
    } catch (error) {
      showNotification('Ошибка при сохранении товара', 'error')
    }
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setProductModalMode('edit')
    setShowProductModal(true)
  }

  const handleDeleteProduct = (productId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Удалить товар',
      message: 'Вы уверены, что хотите удалить этот товар?',
      type: 'danger',
      onConfirm: async () => {
        try {
          await adminAPI.deleteProduct(productId)
          showNotification('Товар удален', 'success')
          loadAdminData()
        } catch (error) {
          showNotification('Ошибка при удалении товара', 'error')
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowProductModal(true)
  }

  const handleCreateUser = () => {
    // Генерируем уникальный email для нового пользователя
    const uniqueEmail = `user${Date.now()}@test.com`
    
    setSelectedUser({
      id: '',
      name: '',
      email: uniqueEmail,
      phone: '',
      role: 'BUYER',
      verified: false,
      createdAt: new Date().toISOString(),
    })
    setUserModalMode('create')
    setShowUserModal(true)
  }

  const handleSaveUser = async (user: AdminUser) => {
    try {
      if (userModalMode === 'create') {
        await adminAPI.createUser({
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')[1] || '',
          email: user.email,
          phone: user.phone,
          role: user.role.toUpperCase(),
          verified: user.verified,
        })
        showNotification('Пользователь создан', 'success')
      } else {
        await adminAPI.updateUser(user.id, {
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')[1] || '',
          email: user.email,
          phone: user.phone,
          role: user.role.toUpperCase(),
          verified: user.verified,
        })
        showNotification('Пользователь обновлен', 'success')
      }
      setShowUserModal(false)
      loadAdminData()
    } catch (error: any) {
      console.error('Ошибка при сохранении пользователя:', error)
      
      // Обрабатываем разные типы ошибок
      let errorMessage = 'Ошибка при сохранении пользователя'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      // Специальная обработка для разных статусов
      if (error.response?.status === 409) {
        errorMessage = 'Пользователь с таким email уже существует'
      } else if (error.response?.status === 400) {
        errorMessage = errorMessage || 'Некорректные данные'
      } else if (error.response?.status === 401) {
        errorMessage = 'Необходима авторизация'
      } else if (error.response?.status === 403) {
        errorMessage = 'Недостаточно прав'
      }
      
      showNotification(errorMessage, 'error')
    }
  }

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user)
    setUserModalMode('edit')
    setShowUserModal(true)
  }

  const handleBlockUser = (userId: string, reason: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Заблокировать пользователя',
      message: `Вы уверены, что хотите заблокировать этого пользователя? Причина: ${reason}`,
      type: 'danger',
      onConfirm: async () => {
        try {
          await adminAPI.blockUser(userId, { reason })
          showNotification('Пользователь заблокирован', 'success')
          loadAdminData()
        } catch (error) {
          showNotification('Ошибка при блокировке пользователя', 'error')
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  const handleUnblockUser = (userId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Разблокировать пользователя',
      message: 'Вы уверены, что хотите разблокировать этого пользователя?',
      type: 'warning',
      onConfirm: async () => {
        try {
          await adminAPI.unblockUser(userId)
          showNotification('Пользователь разблокирован', 'success')
          loadAdminData()
        } catch (error) {
          showNotification('Ошибка при разблокировке пользователя', 'error')
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  const handleVerifyUser = (userId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Верифицировать пользователя',
      message: 'Вы уверены, что хотите верифицировать этого пользователя?',
      type: 'info',
      onConfirm: async () => {
        try {
          await adminAPI.verifyUser(userId)
          showNotification('Пользователь верифицирован', 'success')
          loadAdminData()
        } catch (error) {
          showNotification('Ошибка при верификации пользователя', 'error')
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const handleViewDeal = (deal: Deal) => {
    setSelectedDeal(deal)
    setShowDealModal(true)
  }

  const handleUpdateDealStatus = async (dealId: string, status: DealStatus) => {
    try {
      await adminAPI.updateDealStatus(dealId, status)
      showNotification('Статус сделки обновлен', 'success')
      loadAdminData()
    } catch (error) {
      showNotification('Ошибка при обновлении статуса сделки', 'error')
    }
  }

  const handleCloseDeal = async (dealId: string) => {
    try {
      await adminAPI.closeDeal(dealId)
      showNotification('Сделка закрыта', 'success')
      loadAdminData()
    } catch (error) {
      showNotification('Ошибка при закрытии сделки', 'error')
    }
  }

  const handleOpenDeal = async (dealId: string) => {
    try {
      await adminAPI.openDeal(dealId)
      showNotification('Сделка открыта', 'success')
      loadAdminData()
    } catch (error) {
      showNotification('Ошибка при открытии сделки', 'error')
    }
  }

  const handleCancelDeal = async (dealId: string) => {
    try {
      await adminAPI.cancelDeal(dealId)
      showNotification('Сделка отменена', 'success')
      loadAdminData()
    } catch (error) {
      showNotification('Ошибка при отмене сделки', 'error')
    }
  }

  const handleDisputeDeal = async (dealId: string) => {
    try {
      await adminAPI.disputeDeal(dealId)
      showNotification('Сделка переведена в спор', 'success')
      loadAdminData()
    } catch (error) {
      showNotification('Ошибка при переводе сделки в спор', 'error')
    }
  }

  const handleUpdateDealStatusConfirm = (dealId: string, status: DealStatus) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Обновить статус сделки',
      message: `Вы уверены, что хотите изменить статус сделки на "${status}"?`,
      type: 'warning',
      onConfirm: async () => {
        try {
          await adminAPI.updateDealStatus(dealId, status)
          showNotification('Статус сделки обновлен', 'success')
          loadAdminData()
        } catch (error) {
          showNotification('Ошибка при обновлении статуса сделки', 'error')
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  const handleResolveDispute = async (dealId: string, resolution: string) => {
    try {
      // Здесь можно добавить API для разрешения спора
      showNotification('Спор разрешен', 'success')
      loadAdminData()
    } catch (error) {
      showNotification('Ошибка при разрешении спора', 'error')
    }
  }

  const handleReplyToMessage = async () => {
    if (!selectedMessage || !replyText.trim()) return

    try {
      await adminAPI.replyToMessage(selectedMessage.id, { content: replyText })
      showNotification('Ответ отправлен пользователю', 'success')
      setSelectedMessage(null)
      setReplyText('')
      loadAdminData()
    } catch (error) {
      showNotification('Ошибка при отправке ответа', 'error')
    }
  }

  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Пользователи</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-xs sm:text-sm text-green-600 truncate">+{stats.newUsersToday}% за месяц</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
              <ShoppingBagIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Товары</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              <p className="text-xs sm:text-sm text-green-600 truncate">+{stats.newProductsToday}% за месяц</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
              <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Сделки</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalDeals}</p>
              <p className="text-xs sm:text-sm text-green-600 truncate">+{stats.completedDealsToday}% за месяц</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
              <ChatBubbleLeftRightIcon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Сообщения</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.pendingMessages}</p>
              <p className="text-xs sm:text-sm text-red-600 truncate">Требуют внимания</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Доход */}
        <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Общий доход</h3>
        <div className="text-3xl font-bold text-green-600">
          {stats.revenue.toLocaleString()} ₽
                </div>
        <p className="text-sm text-gray-600 mt-2">За все время</p>
        </Card>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Сообщения поддержки</h2>
        <Badge variant="secondary">
          Всего: {messages.length}
        </Badge>
      </div>

      <div className="grid gap-4">
        {messages.map((message) => (
          <Card key={message.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {message.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{message.userName}</h3>
                  <Badge variant={message.status === 'new' ? 'destructive' : 'secondary'}>
                    {message.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedMessage(message)}
                  >
                    Ответить
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Сообщения чатов */}
      <div className="mt-8">
        <ChatMessages 
          messages={chatMessages} 
          onReply={handleReplyToMessage}
        />
      </div>
    </div>
  )

  const renderProducts = () => (
    <ProductManagement
      products={products}
      onEditProduct={handleEditProduct}
      onDeleteProduct={handleDeleteProduct}
      onViewProduct={handleViewProduct}
      onCreateProduct={handleCreateProduct}
    />
  )

  const renderDeals = () => (
    <DealManagementMobile
      deals={deals}
      onViewDeal={handleViewDeal}
      onUpdateDealStatus={handleUpdateDealStatusConfirm}
      onResolveDispute={handleResolveDispute}
      onCloseDeal={handleCloseDeal}
      onOpenDeal={handleOpenDeal}
      onCancelDeal={handleCancelDeal}
      onDisputeDeal={handleDisputeDeal}
    />
  )

  const renderUsers = () => (
    <UserManagement
      users={users}
      onEditUser={handleEditUser}
      onBlockUser={handleBlockUser}
      onUnblockUser={handleUnblockUser}
      onVerifyUser={handleVerifyUser}
      onViewUser={handleViewUser}
      onCreateUser={handleCreateUser}
    />
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Админ панель</h1>
              <p className="text-sm sm:text-base text-gray-600 truncate">Управление платформой и пользователями</p>
            </div>
            <Button onClick={handleBackToMenu} variant="outline" className="w-full sm:w-auto">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Назад в меню</span>
              <span className="sm:hidden">Назад</span>
            </Button>
          </div>
        </div>
        </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto space-x-2 sm:space-x-8 pb-2 sm:pb-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 whitespace-nowrap min-w-0 ${
                        activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Загрузка данных...</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'messages' && renderMessages()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'deals' && renderDeals()}
            {activeTab === 'users' && renderUsers()}
          </>
        )}
      </div>

      {/* Modals */}
      {showProductModal && (
      <ProductModal
          product={selectedProduct}
          mode={productModalMode}
        onClose={() => setShowProductModal(false)}
        onSave={handleSaveProduct}
      />
      )}

      {showUserModal && (
      <UserModal
          user={selectedUser}
          mode={userModalMode}
        onClose={() => setShowUserModal(false)}
        onSave={handleSaveUser}
      />
      )}

      {showDealModal && selectedDeal && (
      <DealModal
          deal={selectedDeal}
        onClose={() => setShowDealModal(false)}
          onUpdate={async (deal) => {
            try {
              await adminAPI.updateDealStatus(deal.id, deal.status)
              showNotification('Сделка обновлена', 'success')
              setShowDealModal(false)
              loadAdminData()
            } catch (error) {
              showNotification('Ошибка при обновлении сделки', 'error')
            }
          }}
        />
      )}

      {/* Message Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Ответ на сообщение от {selectedMessage.userName}
              </h3>
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">{selectedMessage.message}</p>
              </div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Введите ваш ответ..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
              <div className="flex justify-end space-x-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMessage(null)
                    setReplyText('')
                  }}
                >
                  Отмена
                </Button>
                <Button onClick={handleReplyToMessage} disabled={!replyText.trim()}>
                  Отправить ответ
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  )
}