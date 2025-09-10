'use client'

import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { DealManagement } from '@/components/admin/deal-management'
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
import { AdminMessage, AdminStats, AdminUser, Deal, DealStatus, Product } from '@/types'
import {
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    PlusIcon,
    ShoppingBagIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// Моковые данные для демонстрации
const mockStats: AdminStats = {
  totalUsers: 1247,
  totalProducts: 3421,
  totalDeals: 892,
  pendingMessages: 23,
  revenue: 45670,
  newUsersToday: 45,
  newProductsToday: 12,
  completedDealsToday: 8,
}

const mockMessages: AdminMessage[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Анна Петрова',
    userAvatar: '/avatars/user1.jpg',
    message: 'Не могу найти свой заказ, помогите пожалуйста',
    type: 'support',
    status: 'new',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Михаил Иванов',
    userAvatar: '/avatars/user2.jpg',
    message: 'Продавец не отвечает уже 3 дня',
    type: 'complaint',
    status: 'in_progress',
    adminReply: 'Разбираемся с ситуацией, свяжемся с продавцом',
    createdAt: '2024-01-14T15:45:00Z',
    updatedAt: '2024-01-15T09:20:00Z',
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Елена Смирнова',
    userAvatar: '/avatars/user3.jpg',
    message: 'Предлагаю добавить фильтр по размеру одежды',
    type: 'suggestion',
    status: 'resolved',
    adminReply: 'Отличная идея! Добавим в следующем обновлении',
    createdAt: '2024-01-13T12:15:00Z',
    updatedAt: '2024-01-14T16:30:00Z',
  },
]

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
  const [productModalMode, setProductModalMode] = useState<'create' | 'edit'>('create')
  const [userModalMode, setUserModalMode] = useState<'create' | 'edit'>('create')
  const [stats, setStats] = useState<AdminStats>(mockStats)
  const [messages, setMessages] = useState<AdminMessage[]>(mockMessages)
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
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      
      // Загружаем статистику
      const statsResponse = await adminAPI.getStats()
      if (statsResponse.data) {
        setStats(statsResponse.data.data || statsResponse.data)
      }
      
      // Загружаем сообщения
      const messagesResponse = await adminAPI.getMessages({ limit: 50 })
      if (messagesResponse.data) {
        setMessages(messagesResponse.data.data || messagesResponse.data)
      }
    } catch (error: any) {
      console.error('Ошибка загрузки админ данных:', error)
      toast.error('Ошибка загрузки данных админки')
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
  }

  const showConfirmDialog = (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    type: 'warning' | 'danger' | 'info' = 'warning'
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
      type
    })
  }

  const handleReply = async (messageId: string) => {
    if (replyText.trim()) {
      try {
        await adminAPI.replyToMessage(messageId, { reply: replyText })
        
        // Обновляем локальное состояние
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: 'in_progress' as const, adminReply: replyText }
            : msg
        ))
        
        setReplyText('')
        setSelectedMessage(null)
        showNotification('Ответ отправлен пользователю!', 'success')
      } catch (error: any) {
        console.error('Ошибка отправки ответа:', error)
        showNotification('Ошибка отправки ответа', 'error')
      }
    } else {
      showNotification('Пожалуйста, введите текст ответа', 'warning')
    }
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setProductModalMode('edit')
    setShowProductModal(true)
  }

  const handleCreateProduct = () => {
    setSelectedProduct(null)
    setProductModalMode('create')
    setShowProductModal(true)
  }

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Сохранение товара:', productData)
    // Здесь будет логика сохранения товара
    showNotification(
      productModalMode === 'create' ? 'Товар создан!' : 'Товар обновлен!', 
      'success'
    )
  }

  const handleDeleteProduct = (productId: string) => {
    showConfirmDialog(
      'Удаление товара',
      'Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить.',
      () => {
        console.log('Удаление товара:', productId)
        showNotification('Товар удален!', 'success')
      },
      'danger'
    )
  }

  const handleViewProduct = (product: Product) => {
    // Открываем модальное окно в режиме просмотра
    setSelectedProduct(product)
    setProductModalMode('edit')
    setShowProductModal(true)
  }

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user)
    setUserModalMode('edit')
    setShowUserModal(true)
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setUserModalMode('create')
    setShowUserModal(true)
  }

  const handleSaveUser = (userData: Partial<AdminUser>) => {
    console.log('Сохранение пользователя:', userData)
    // Здесь будет логика сохранения пользователя
    showNotification(
      userModalMode === 'create' ? 'Пользователь создан!' : 'Пользователь обновлен!', 
      'success'
    )
  }

  const handleBlockUser = (userId: string, reason: string) => {
    const blockReason = prompt('Укажите причину блокировки:', reason)
    if (blockReason !== null) {
      console.log('Блокировка пользователя:', userId, blockReason)
      showNotification('Пользователь заблокирован!', 'success')
    }
  }

  const handleUnblockUser = (userId: string) => {
    showConfirmDialog(
      'Разблокировка пользователя',
      'Вы уверены, что хотите разблокировать этого пользователя?',
      () => {
        console.log('Разблокировка пользователя:', userId)
        showNotification('Пользователь разблокирован!', 'success')
      },
      'warning'
    )
  }

  const handleVerifyUser = (userId: string) => {
    showConfirmDialog(
      'Верификация пользователя',
      'Вы уверены, что хотите верифицировать этого пользователя?',
      () => {
        console.log('Верификация пользователя:', userId)
        showNotification('Пользователь верифицирован!', 'success')
      },
      'info'
    )
  }

  const handleViewUser = (user: AdminUser) => {
    // Открываем модальное окно в режиме просмотра
    setSelectedUser(user)
    setUserModalMode('edit')
    setShowUserModal(true)
  }

  const handleViewDeal = (deal: Deal) => {
    setSelectedDeal(deal)
    setShowDealModal(true)
  }

  const handleUpdateDealStatus = (dealId: string, status: DealStatus) => {
    const statusLabels = {
      pending: 'Ожидает подтверждения',
      confirmed: 'Подтверждена',
      shipped: 'Отправлена',
      delivered: 'Доставлена',
      cancelled: 'Отменена'
    }
    
    showConfirmDialog(
      'Изменение статуса сделки',
      `Вы уверены, что хотите изменить статус сделки на "${statusLabels[status]}"?`,
      () => {
        console.log('Обновление статуса сделки:', dealId, status)
        showNotification('Статус сделки обновлен!', 'success')
      },
      'warning'
    )
  }

  const handleResolveDispute = (dealId: string, resolution: string) => {
    console.log('Разрешение спора:', dealId, resolution)
    showNotification('Спор разрешен!', 'success')
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Пользователи</p>
              <p className="text-2xl font-bold text-blue-600">{mockStats.totalUsers}</p>
              <p className="text-xs text-green-600">+{mockStats.newUsersToday} сегодня</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Товары</p>
              <p className="text-2xl font-bold text-green-600">{mockStats.totalProducts}</p>
              <p className="text-xs text-green-600">+{mockStats.newProductsToday} сегодня</p>
            </div>
            <ShoppingBagIcon className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Сделки</p>
              <p className="text-2xl font-bold text-purple-600">{mockStats.totalDeals}</p>
              <p className="text-xs text-green-600">+{mockStats.completedDealsToday} сегодня</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Сообщения</p>
              <p className="text-2xl font-bold text-orange-600">{mockStats.pendingMessages}</p>
              <p className="text-xs text-orange-600">требуют ответа</p>
            </div>
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Последние сообщения</h3>
          <div className="space-y-3">
            {mockMessages.slice(0, 3).map((message) => (
              <div 
                key={message.id} 
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setActiveTab('messages')
                  setSelectedMessage(message)
                }}
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {message.userName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{message.userName}</p>
                    <Badge 
                      variant={message.status === 'new' ? 'destructive' : message.status === 'in_progress' ? 'default' : 'secondary'}
                    >
                      {message.status === 'new' ? 'Новое' : message.status === 'in_progress' ? 'В работе' : 'Решено'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleCreateProduct}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Добавить товар
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => {
                setActiveTab('messages')
                // Автоматически выбираем первое новое сообщение
                const newMessage = mockMessages.find(msg => msg.status === 'new')
                if (newMessage) {
                  setSelectedMessage(newMessage)
                }
              }}
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Ответить на сообщения
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleCreateUser}
            >
              <UserGroupIcon className="h-4 w-4 mr-2" />
              Добавить пользователя
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Сообщения пользователей</h2>
        <Badge variant="destructive">{mockStats.pendingMessages} новых</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {mockMessages.map((message) => (
            <Card 
              key={message.id} 
              className={`p-4 cursor-pointer transition-colors ${
                selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {message.userName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">{message.userName}</p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={message.status === 'new' ? 'destructive' : message.status === 'in_progress' ? 'default' : 'secondary'}
                      >
                        {message.status === 'new' ? 'Новое' : message.status === 'in_progress' ? 'В работе' : 'Решено'}
                      </Badge>
                      <Badge variant="outline">
                        {message.type === 'support' ? 'Поддержка' : message.type === 'complaint' ? 'Жалоба' : message.type === 'suggestion' ? 'Предложение' : 'Другое'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(message.createdAt).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {selectedMessage && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Ответ пользователю</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Сообщение от {selectedMessage.userName}:</p>
                <p className="text-sm">{selectedMessage.message}</p>
              </div>

              {selectedMessage.adminReply && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 mb-2">Ваш ответ:</p>
                  <p className="text-sm">{selectedMessage.adminReply}</p>
                </div>
              )}

              <div className="space-y-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Введите ответ пользователю..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={4}
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleReply(selectedMessage.id)}
                    disabled={!replyText.trim()}
                  >
                    Отправить ответ
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setReplyText('')}
                  >
                    Очистить
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )

  const renderProducts = () => (
    <ProductManagement
      onEditProduct={handleEditProduct}
      onDeleteProduct={handleDeleteProduct}
      onViewProduct={handleViewProduct}
      onCreateProduct={handleCreateProduct}
    />
  )

  const renderDeals = () => (
    <DealManagement
      onViewDeal={handleViewDeal}
      onUpdateDealStatus={handleUpdateDealStatus}
      onResolveDispute={handleResolveDispute}
    />
  )

  const renderUsers = () => (
    <UserManagement
      onEditUser={handleEditUser}
      onBlockUser={handleBlockUser}
      onUnblockUser={handleUnblockUser}
      onVerifyUser={handleVerifyUser}
      onViewUser={handleViewUser}
      onCreateUser={handleCreateUser}
    />
  )


  const tabs = [
    { id: 'dashboard', label: 'Панель', icon: ChartBarIcon },
    { id: 'messages', label: 'Сообщения', icon: ChatBubbleLeftRightIcon },
    { id: 'products', label: 'Товары', icon: ShoppingBagIcon },
    { id: 'deals', label: 'Сделки', icon: ChartBarIcon },
    { id: 'users', label: 'Пользователи', icon: UserGroupIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Админ панель</h1>
          <p className="text-gray-600 mt-2">Управление платформой и пользователями</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64">
            <Card className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as AdminTab)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </Card>
          </div>

          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'messages' && renderMessages()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'deals' && renderDeals()}
            {activeTab === 'users' && renderUsers()}
          </div>
        </div>
      </div>

      {/* Модальные окна */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        mode={productModalMode}
      />

      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={userModalMode}
      />

      <DealModal
        isOpen={showDealModal}
        onClose={() => setShowDealModal(false)}
        deal={selectedDeal}
      />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={() => {
          confirmDialog.onConfirm()
          setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        }}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        type={confirmDialog.type}
      />
    </div>
  )
}
