'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { ArrowLeftIcon, BookOpenIcon, CheckIcon, ClockIcon, DocumentTextIcon, PlayIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Course {
  id: string
  title: string
  description: string
  duration: string
  level: 'beginner' | 'intermediate' | 'advanced'
  type: 'video' | 'article' | 'course'
  completed: boolean
  progress: number
  thumbnail: string
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Основы работы с платформой',
    description: 'Изучите базовые функции и возможности платформы',
    duration: '15 мин',
    level: 'beginner',
    type: 'video',
    completed: true,
    progress: 100,
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '2',
    title: 'Безопасные покупки',
    description: 'Как защитить себя от мошенничества при покупках',
    duration: '8 мин',
    level: 'beginner',
    type: 'video',
    completed: false,
    progress: 60,
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '3',
    title: 'Как стать продавцом',
    description: 'Пошаговое руководство по регистрации продавца',
    duration: '25 мин',
    level: 'intermediate',
    type: 'course',
    completed: false,
    progress: 0,
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '4',
    title: 'Партнерская программа',
    description: 'Как зарабатывать, приглашая друзей',
    duration: '12 мин',
    level: 'beginner',
    type: 'video',
    completed: false,
    progress: 0,
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '5',
    title: 'Правила и условия',
    description: 'Подробное описание пользовательского соглашения',
    duration: '5 мин',
    level: 'beginner',
    type: 'article',
    completed: true,
    progress: 100,
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '6',
    title: 'Продвинутые настройки',
    description: 'Настройка уведомлений, приватности и безопасности',
    duration: '20 мин',
    level: 'advanced',
    type: 'course',
    completed: false,
    progress: 30,
    thumbnail: '/api/placeholder/300/200'
  }
]

const categories = ['Все', 'Видео', 'Статьи', 'Курсы']
const levels = ['Все уровни', 'Начинающий', 'Средний', 'Продвинутый']

export default function AcademyPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [selectedLevel, setSelectedLevel] = useState('Все уровни')

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <VideoCameraIcon className="h-5 w-5" />
      case 'article':
        return <DocumentTextIcon className="h-5 w-5" />
      case 'course':
        return <BookOpenIcon className="h-5 w-5" />
      default:
        return <BookOpenIcon className="h-5 w-5" />
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'video':
        return 'Видео'
      case 'article':
        return 'Статья'
      case 'course':
        return 'Курс'
      default:
        return 'Материал'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Начинающий'
      case 'intermediate':
        return 'Средний'
      case 'advanced':
        return 'Продвинутый'
      default:
        return level
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCourses = courses.filter(course => {
    const categoryMatch = selectedCategory === 'Все' || 
      (selectedCategory === 'Видео' && course.type === 'video') ||
      (selectedCategory === 'Статьи' && course.type === 'article') ||
      (selectedCategory === 'Курсы' && course.type === 'course')
    
    const levelMatch = selectedLevel === 'Все уровни' ||
      (selectedLevel === 'Начинающий' && course.level === 'beginner') ||
      (selectedLevel === 'Средний' && course.level === 'intermediate') ||
      (selectedLevel === 'Продвинутый' && course.level === 'advanced')
    
    return categoryMatch && levelMatch
  })

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Заголовок */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={() => router.back()} className="p-1 -ml-1">
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Академия</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Статистика */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Ваш прогресс</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">2</p>
                <p className="text-blue-100 text-sm">Завершено</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">4</p>
                <p className="text-blue-100 text-sm">В процессе</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">6</p>
                <p className="text-blue-100 text-sm">Всего</p>
              </div>
            </div>
          </div>

          {/* Фильтры */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Тип материала</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Уровень сложности</h4>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedLevel === level
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Список курсов */}
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex">
                  <div className="w-24 h-16 bg-gray-200 flex-shrink-0">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {getTypeIcon(course.type)}
                          <span className="text-xs text-gray-500">{getTypeText(course.type)}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(course.level)}`}>
                            {getLevelText(course.level)}
                          </span>
                        </div>
                        
                        <h3 className="text-sm font-medium text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-xs text-gray-500 mb-2">{course.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="h-3 w-3" />
                            <span>{course.duration}</span>
                          </div>
                          {course.completed && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckIcon className="h-3 w-3" />
                              <span>Завершено</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button className="ml-2 p-2 text-gray-400 hover:text-gray-600">
                        <PlayIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {/* Прогресс бар */}
                    {course.progress > 0 && course.progress < 100 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{course.progress}% завершено</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Призыв к действию */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-900 mb-2">Получите сертификат!</h4>
            <p className="text-sm text-green-800 mb-3">
              Завершите все курсы и получите сертификат о прохождении обучения.
            </p>
            <button className="text-sm text-green-600 font-medium underline">
              Посмотреть требования
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
