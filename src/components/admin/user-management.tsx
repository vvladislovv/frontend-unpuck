'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AdminUser } from '@/types'
import {
    EyeIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    ShieldCheckIcon,
    ShieldExclamationIcon,
    UserPlusIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

// Моковые данные пользователей
const mockUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Анна Петрова',
    email: 'anna.petrova@email.com',
    phone: '+7 (999) 123-45-67',
    avatar: '/avatars/user1.jpg',
    bio: 'Продавец одежды и аксессуаров',
    role: 'seller',
    verified: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    lastLogin: '2024-01-15T14:30:00Z',
    totalSpent: 45670,
    totalEarned: 123400,
    dealsCount: 45,
    productsCount: 23,
    isBlocked: false,
  },
  {
    id: '2',
    name: 'Михаил Иванов',
    email: 'mikhail.ivanov@email.com',
    phone: '+7 (999) 234-56-78',
    avatar: '/avatars/user2.jpg',
    bio: 'Блогер о технологиях',
    role: 'blogger',
    verified: true,
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-01-14T09:15:00Z',
    lastLogin: '2024-01-14T09:15:00Z',
    totalSpent: 23400,
    totalEarned: 67800,
    dealsCount: 12,
    productsCount: 0,
    isBlocked: false,
  },
  {
    id: '3',
    name: 'Елена Смирнова',
    email: 'elena.smirnova@email.com',
    phone: '+7 (999) 345-67-89',
    avatar: '/avatars/user3.jpg',
    bio: 'Покупатель',
    role: 'buyer',
    verified: false,
    createdAt: '2024-01-10T16:20:00Z',
    updatedAt: '2024-01-16T11:45:00Z',
    lastLogin: '2024-01-16T11:45:00Z',
    totalSpent: 15600,
    totalEarned: 0,
    dealsCount: 8,
    productsCount: 0,
    isBlocked: false,
  },
  {
    id: '4',
    name: 'Дмитрий Козлов',
    email: 'dmitry.kozlov@email.com',
    phone: '+7 (999) 456-78-90',
    avatar: '/avatars/user4.jpg',
    bio: 'Продавец электроники',
    role: 'seller',
    verified: true,
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-12T10:30:00Z',
    lastLogin: '2024-01-12T10:30:00Z',
    totalSpent: 8900,
    totalEarned: 234500,
    dealsCount: 67,
    productsCount: 45,
    isBlocked: true,
    blockReason: 'Нарушение правил платформы',
  },
]

interface UserManagementProps {
  onEditUser: (user: AdminUser) => void
  onBlockUser: (userId: string, reason: string) => void
  onUnblockUser: (userId: string) => void
  onVerifyUser: (userId: string) => void
  onViewUser: (user: AdminUser) => void
  onCreateUser: () => void
}

export function UserManagement({ 
  onEditUser, 
  onBlockUser, 
  onUnblockUser, 
  onVerifyUser, 
  onViewUser,
  onCreateUser
}: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [showFilters, setShowFilters] = useState(false)

  const roles = [
    { value: 'all', label: 'Все роли' },
    { value: 'seller', label: 'Продавцы' },
    { value: 'blogger', label: 'Блогеры' },
    { value: 'buyer', label: 'Покупатели' },
    { value: 'manager', label: 'Менеджеры' },
  ]

  const statuses = [
    { value: 'all', label: 'Все статусы' },
    { value: 'verified', label: 'Верифицированные' },
    { value: 'unverified', label: 'Не верифицированные' },
    { value: 'blocked', label: 'Заблокированные' },
  ]

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone?.includes(searchQuery)
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'verified' && user.verified) ||
                         (selectedStatus === 'unverified' && !user.verified) ||
                         (selectedStatus === 'blocked' && user.isBlocked)
    return matchesSearch && matchesRole && matchesStatus
  })

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'spent':
        return b.totalSpent - a.totalSpent
      case 'earned':
        return b.totalEarned - a.totalEarned
      case 'deals':
        return b.dealsCount - a.dealsCount
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'seller': return 'default'
      case 'blogger': return 'secondary'
      case 'buyer': return 'outline'
      case 'manager': return 'destructive'
      default: return 'outline'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'seller': return 'Продавец'
      case 'blogger': return 'Блогер'
      case 'buyer': return 'Покупатель'
      case 'manager': return 'Менеджер'
      default: return role
    }
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и действия */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление пользователями</h2>
          <p className="text-gray-600">Всего пользователей: {mockUsers.length}</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={onCreateUser}>
          <UserPlusIcon className="h-4 w-4 mr-2" />
          Добавить пользователя
        </Button>
      </div>

      {/* Поиск и фильтры */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск пользователей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">По дате регистрации</option>
              <option value="name">По имени</option>
              <option value="spent">По потраченному</option>
              <option value="earned">По заработанному</option>
              <option value="deals">По количеству сделок</option>
            </select>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Потрачено от
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Заработано от
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сделок от
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Список пользователей */}
      <div className="space-y-4">
        {sortedUsers.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-medium text-gray-600">
                    {user.name.charAt(0)}
                  </span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    {user.verified && (
                      <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                    )}
                    {user.isBlocked && (
                      <ShieldExclamationIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                    {user.isBlocked && (
                      <Badge variant="destructive">Заблокирован</Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Телефон</p>
                    <p className="text-sm font-medium">{user.phone || 'Не указан'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Потрачено</p>
                    <p className="text-sm font-medium">{user.totalSpent.toLocaleString()} ₽</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Заработано</p>
                    <p className="text-sm font-medium">{user.totalEarned.toLocaleString()} ₽</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Сделок</p>
                    <p className="text-sm font-medium">{user.dealsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Товаров</p>
                    <p className="text-sm font-medium">{user.productsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Последний вход</p>
                    <p className="text-sm font-medium">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ru-RU') : 'Никогда'}
                    </p>
                  </div>
                </div>
                
                {user.isBlocked && user.blockReason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Причина блокировки:</strong> {user.blockReason}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewUser(user)}
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Просмотр
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditUser(user)}
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Редактировать
                  </Button>
                  {!user.verified && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onVerifyUser(user.id)}
                    >
                      <ShieldCheckIcon className="h-4 w-4 mr-1" />
                      Верифицировать
                    </Button>
                  )}
                  {user.isBlocked ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUnblockUser(user.id)}
                    >
                      Разблокировать
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onBlockUser(user.id, '')}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ShieldExclamationIcon className="h-4 w-4 mr-1" />
                      Заблокировать
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sortedUsers.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Пользователи не найдены</h3>
          <p className="text-gray-600">Попробуйте изменить параметры поиска или фильтры</p>
        </Card>
      )}
    </div>
  )
}
