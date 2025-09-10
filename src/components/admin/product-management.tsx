'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Product } from '@/types'
import {
    EyeIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

// Моковые данные товаров
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Кроссовки Nike Air Max 270',
    description: 'Стильные и удобные кроссовки для повседневной носки',
    price: 8999,
    originalPrice: 12999,
    category: 'Обувь',
    subcategory: 'Кроссовки',
    images: ['/products/nike1.jpg', '/products/nike2.jpg'],
    rating: 4.8,
    reviewsCount: 156,
    seller: {
      id: 'seller1',
      name: 'СпортМир',
      avatar: '/avatars/seller1.jpg',
      verified: true,
    },
    inStock: true,
    tags: ['nike', 'кроссовки', 'спорт'],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    title: 'Платье летнее в цветочек',
    description: 'Легкое платье из хлопка для жаркой погоды',
    price: 2499,
    category: 'Одежда',
    subcategory: 'Платья',
    images: ['/products/dress1.jpg'],
    rating: 4.5,
    reviewsCount: 89,
    seller: {
      id: 'seller2',
      name: 'Модный стиль',
      avatar: '/avatars/seller2.jpg',
      verified: true,
    },
    inStock: true,
    tags: ['платье', 'лето', 'хлопок'],
    createdAt: '2024-01-12T16:20:00Z',
    updatedAt: '2024-01-14T09:15:00Z',
  },
  {
    id: '3',
    title: 'Смартфон iPhone 14',
    description: 'Новейший iPhone с отличной камерой',
    price: 89999,
    originalPrice: 99999,
    category: 'Электроника',
    subcategory: 'Телефоны',
    images: ['/products/iphone1.jpg', '/products/iphone2.jpg'],
    rating: 4.9,
    reviewsCount: 234,
    seller: {
      id: 'seller3',
      name: 'ТехноМир',
      avatar: '/avatars/seller3.jpg',
      verified: true,
    },
    inStock: false,
    tags: ['iphone', 'смартфон', 'apple'],
    createdAt: '2024-01-08T12:00:00Z',
    updatedAt: '2024-01-16T11:45:00Z',
  },
]

interface ProductManagementProps {
  onEditProduct: (product: Product) => void
  onDeleteProduct: (productId: string) => void
  onViewProduct: (product: Product) => void
  onCreateProduct: () => void
}

export function ProductManagement({ onEditProduct, onDeleteProduct, onViewProduct, onCreateProduct }: ProductManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['all', 'Одежда', 'Обувь', 'Электроника', 'Красота', 'Дом']

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price
      case 'name':
        return a.title.localeCompare(b.title)
      case 'rating':
        return b.rating - a.rating
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return (
    <div className="space-y-6">
      {/* Заголовок и действия */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление товарами</h2>
          <p className="text-gray-600">Всего товаров: {mockProducts.length}</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={onCreateProduct}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Добавить товар
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
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Все категории' : category}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">По дате</option>
              <option value="name">По названию</option>
              <option value="price">По цене</option>
              <option value="rating">По рейтингу</option>
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
                  Наличие
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="all">Все</option>
                  <option value="inStock">В наличии</option>
                  <option value="outOfStock">Нет в наличии</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена от
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена до
                </label>
                <input
                  type="number"
                  placeholder="100000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Список товаров */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-100 relative">
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Нет изображения
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={product.inStock ? 'default' : 'destructive'}>
                  {product.inStock ? 'В наличии' : 'Нет в наличии'}
                </Badge>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                {product.title}
              </h3>
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <span className="text-lg font-bold text-blue-600">
                    {product.price.toLocaleString()} ₽
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.originalPrice.toLocaleString()} ₽
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">★</span>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviewsCount})</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>{product.category}</span>
                <span>{product.seller.name}</span>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewProduct(product)}
                  className="flex-1"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Просмотр
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditProduct(product)}
                  className="flex-1"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Редактировать
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeleteProduct(product.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Товары не найдены</h3>
          <p className="text-gray-600">Попробуйте изменить параметры поиска или фильтры</p>
        </Card>
      )}
    </div>
  )
}
