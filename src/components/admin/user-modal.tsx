'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AdminUser } from '@/types'
import {
    ShieldCheckIcon,
    ShieldExclamationIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (user: Partial<AdminUser>) => void
  user?: AdminUser | null
  mode: 'create' | 'edit'
}

export function UserModal({ isOpen, onClose, onSave, user, mode }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    role: 'buyer' as 'seller' | 'blogger' | 'manager' | 'buyer',
    verified: false,
    isBlocked: false,
    blockReason: '',
  })

  const roles = [
    { value: 'buyer', label: 'Покупатель' },
    { value: 'seller', label: 'Продавец' },
    { value: 'blogger', label: 'Блогер' },
    { value: 'manager', label: 'Менеджер' },
  ]

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        bio: user.bio || '',
        role: user.role,
        verified: user.verified,
        isBlocked: user.isBlocked,
        blockReason: user.blockReason || '',
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        bio: '',
        role: 'buyer',
        verified: false,
        isBlocked: false,
        blockReason: '',
      })
    }
  }, [user, mode, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      alert('Пожалуйста, заполните все обязательные поля')
      return
    }

    const userData = {
      ...formData,
      id: user?.id || '',
      createdAt: user?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: user?.lastLogin,
      totalSpent: user?.totalSpent || 0,
      totalEarned: user?.totalEarned || 0,
      dealsCount: user?.dealsCount || 0,
      productsCount: user?.productsCount || 0,
      avatar: user?.avatar,
    }

    onSave(userData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {mode === 'create' ? 'Создать пользователя' : 'Редактировать пользователя'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Основная информация */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Основная информация</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Имя *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Введите имя пользователя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Введите email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  О себе
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Краткое описание пользователя"
                />
              </div>
            </div>

            {/* Роль и статус */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Роль и статус</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Роль
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <ShieldCheckIcon className="h-4 w-4 mr-1" />
                    Верифицированный пользователь
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isBlocked}
                    onChange={(e) => setFormData(prev => ({ ...prev, isBlocked: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <ShieldExclamationIcon className="h-4 w-4 mr-1" />
                    Заблокированный пользователь
                  </span>
                </label>
              </div>

              {formData.isBlocked && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Причина блокировки
                  </label>
                  <textarea
                    value={formData.blockReason}
                    onChange={(e) => setFormData(prev => ({ ...prev, blockReason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    placeholder="Укажите причину блокировки пользователя"
                  />
                </div>
              )}
            </div>

            {/* Статистика (только для редактирования) */}
            {mode === 'edit' && user && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Статистика</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{user.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Потрачено</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{user.totalEarned.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Заработано</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{user.dealsCount}</p>
                    <p className="text-sm text-gray-600">Сделок</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{user.productsCount}</p>
                    <p className="text-sm text-gray-600">Товаров</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Дата регистрации</p>
                    <p className="text-sm font-medium">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Последний вход</p>
                    <p className="text-sm font-medium">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ru-RU') : 'Никогда'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Отмена
              </Button>
              <Button type="submit">
                {mode === 'create' ? 'Создать пользователя' : 'Сохранить изменения'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}



