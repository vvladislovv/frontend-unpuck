'use client'

import {
    ChevronRightIcon,
    CreditCardIcon,
    ShareIcon,
    ShieldCheckIcon,
    UserIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

const profileItems = [
  {
    id: 'profile',
    title: 'Профиль',
    description: 'Личная информация',
    icon: UserIcon,
    href: '/profile/edit',
  },
  {
    id: 'payments',
    title: 'Платежи',
    description: 'Способы оплаты и история',
    icon: CreditCardIcon,
    href: '/profile/payments',
  },
  {
    id: 'social',
    title: 'Соцсети',
    description: 'Связанные аккаунты',
    icon: ShareIcon,
    href: '/profile/social',
  },
  {
    id: 'verification',
    title: 'Верификация',
    description: 'Подтверждение личности',
    icon: ShieldCheckIcon,
    href: '/profile/verification',
  },
]

export function ProfileSection() {
  const router = useRouter()

  const handleItemClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Профиль</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {profileItems.map((item, index) => {
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
  )
}

