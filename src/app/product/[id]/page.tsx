'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Моковые данные товара (в реальном приложении будут загружаться по ID)
const mockProduct = {
  id: '1',
  title: 'Электрические МЕЛЬНИЦЫ',
  description: 'Современные электрические мельницы для дома и офиса. Высокое качество сборки, долговечность и стильный дизайн. Идеально подходят для ежедневного использования.',
  price: 2500,
  originalPrice: 3000,
  category: 'home',
  subcategory: 'kitchen',
  images: [
    '/api/placeholder/400/400',
    '/api/placeholder/400/400',
    '/api/placeholder/400/400',
  ],
  rating: 4.5,
  reviewsCount: 23,
  seller: {
    id: '1',
    name: 'KitchenPro',
    avatar: '/api/placeholder/40/40',
    verified: true,
  },
  inStock: true,
  tags: ['новинка', 'скидка'],
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15',
  isFavorite: false,
}

export default function ProductPage() {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)

  const handleBack = () => {
    router.back()
  }

  const discountPercentage = mockProduct.originalPrice 
    ? Math.round(((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100)
    : 0

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Заголовок с кнопкой назад */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Назад</span>
            </button>
          </div>
        </div>

        {/* Изображения товара */}
        <div className="px-4 py-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={mockProduct.images[selectedImage]}
              alt={mockProduct.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            
            {/* Теги */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {mockProduct.tags.includes('новинка') && (
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  NEW
                </div>
              )}
              {discountPercentage > 0 && (
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  -{discountPercentage}%
                </div>
              )}
            </div>
          </div>

          {/* Миниатюры изображений */}
          <div className="flex space-x-2 mt-3 overflow-x-auto">
            {mockProduct.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <Image
                  src={image}
                  alt={`${mockProduct.title} ${index + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Информация о товаре */}
        <div className="px-4 pb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {mockProduct.title}
          </h1>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {mockProduct.description}
          </p>

          {/* Рейтинг и отзывы */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <StarIcon className="h-4 w-4 text-yellow-400" />
              <span className="ml-1 text-sm font-medium text-gray-900">
                {mockProduct.rating}
              </span>
              <span className="ml-1 text-sm text-gray-500">
                ({mockProduct.reviewsCount} отзывов)
              </span>
            </div>
            
            <div className="text-sm text-gray-500">
              Продавец: {mockProduct.seller.name}
              {mockProduct.seller.verified && (
                <span className="ml-1 text-green-500">✓</span>
              )}
            </div>
          </div>

          {/* Цена */}
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-gray-900">
                {mockProduct.price.toLocaleString()} ₽
              </div>
              {mockProduct.originalPrice && (
                <div className="text-lg text-gray-400 line-through">
                  {mockProduct.originalPrice.toLocaleString()} ₽
                </div>
              )}
            </div>
            {discountPercentage > 0 && (
              <div className="text-sm text-red-500 font-medium mt-1">
                Экономия {discountPercentage}%
              </div>
            )}
          </div>

          {/* Кнопка покупки */}
          <button
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              mockProduct.inStock
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!mockProduct.inStock}
          >
            {mockProduct.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
          </button>
        </div>
      </div>
    </MainLayout>
  )
}
