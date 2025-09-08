'use client'

import {
    BellIcon,
    ChatBubbleLeftRightIcon,
    ChevronRightIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

const otherItems = [
  {
    id: 'support',
    title: 'Поддержка',
    description: 'Помощь и контакты',
    icon: ChatBubbleLeftRightIcon,
    href: '/support',
  },
  {
    id: 'notifications',
    title: 'Уведомления',
    description: 'Настройки уведомлений',
    icon: BellIcon,
    href: '/notifications',
  },
  {
    id: 'affiliate',
    title: 'Партнерская программа',
    description: 'Зарабатывайте с нами',
    icon: UserGroupIcon,
    href: '/affiliate',
  },
]

const links = [
  {
    title: 'Пользовательское соглашение',
    href: '/terms',
  },
]

export function OtherSection() {
  const router = useRouter()

  const handleItemClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="space-y-4">
      {/* Другое */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Другое</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {otherItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.href)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Ссылки */}
      <div className="space-y-2">
        {links.map((link) => (
          <button
            key={link.href}
            onClick={() => handleItemClick(link.href)}
            className="w-full text-left text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {link.title}
          </button>
        ))}
      </div>
    </div>
  )
}

