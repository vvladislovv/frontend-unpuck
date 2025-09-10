'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Product } from '@/types'
import {
    PhotoIcon,
    PlusIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void
  product?: Product | null
  mode: 'create' | 'edit'
}

export function ProductModal({ isOpen, onClose, onSave, product, mode }: ProductModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    inStock: true,
    tags: [] as string[],
    images: [] as string[],
  })
  const [newTag, setNewTag] = useState('')
  const [newImage, setNewImage] = useState('')

  const categories = [
    'Одежда', 'Обувь', 'Электроника', 'Красота', 'Дом', 'Спорт', 'Книги', 'Игрушки'
  ]

  const subcategories = {
    'Одежда': ['Платья', 'Блузы', 'Брюки', 'Юбки', 'Куртки', 'Пальто'],
    'Обувь': ['Кроссовки', 'Туфли', 'Сапоги', 'Сандалии', 'Ботинки'],
    'Электроника': ['Телефоны', 'Ноутбуки', 'Планшеты', 'Наушники', 'Камеры'],
    'Красота': ['Косметика', 'Парфюмерия', 'Уход за кожей', 'Уход за волосами'],
    'Дом': ['Мебель', 'Декор', 'Кухня', 'Спальня', 'Гостиная'],
    'Спорт': ['Фитнес', 'Тренажеры', 'Одежда для спорта', 'Аксессуары'],
    'Книги': ['Художественная литература', 'Научная литература', 'Детские книги'],
    'Игрушки': ['Для малышей', 'Конструкторы', 'Куклы', 'Машинки'],
  }

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category,
        subcategory: product.subcategory || '',
        inStock: product.inStock,
        tags: product.tags,
        images: product.images,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        subcategory: '',
        inStock: true,
        tags: [],
        images: [],
      })
    }
  }, [product, mode, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      alert('Пожалуйста, заполните все обязательные поля')
      return
    }

    const productData = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      inStock: formData.inStock,
      tags: formData.tags,
      images: formData.images,
      rating: product?.rating || 0,
      reviewsCount: product?.reviewsCount || 0,
      seller: product?.seller || {
        id: 'current-seller',
        name: 'Текущий продавец',
        avatar: '',
        verified: true,
      },
    }

    onSave(productData)
    onClose()
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }))
      setNewImage('')
    }
  }

  const removeImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(image => image !== imageToRemove)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {mode === 'create' ? 'Создать товар' : 'Редактировать товар'}
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название товара *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите название товара"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Введите описание товара"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цена *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Первоначальная цена
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Категории */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Категории</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Категория *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, subcategory: '' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Подкатегория
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formData.category}
                  >
                    <option value="">Выберите подкатегорию</option>
                    {formData.category && subcategories[formData.category as keyof typeof subcategories]?.map(subcategory => (
                      <option key={subcategory} value={subcategory}>{subcategory}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Теги */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Теги</h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Добавить тег"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Изображения */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Изображения</h3>
              
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="URL изображения"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                />
                <Button type="button" onClick={addImage}>
                  <PhotoIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Изображение ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Нет изображения</text></svg>'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Наличие */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Наличие</h3>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Товар в наличии</span>
              </label>
            </div>

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
                {mode === 'create' ? 'Создать товар' : 'Сохранить изменения'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}



