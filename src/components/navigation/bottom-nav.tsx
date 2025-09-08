'use client'

import { cn } from '@/lib/utils'
import { TabType } from '@/types'
import {
    ShoppingBagIcon,
    Squares2X2Icon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'

interface BottomNavProps {
  currentTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs = [
  {
    id: 'catalog' as TabType,
    label: 'Каталог',
    icon: Squares2X2Icon,
    href: '/catalog',
  },
  {
    id: 'deals' as TabType,
    label: 'Сделки',
    icon: ShoppingBagIcon,
    href: '/deals',
  },
  {
    id: 'profile' as TabType,
    label: 'Профиль',
    icon: UserIcon,
    href: '/profile',
  },
]

export function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleTabClick = (tab: TabType, href: string) => {
    onTabChange(tab)
    router.push(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex h-16 items-center justify-around px-4">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.href)}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <div className="relative">
                <Icon className={cn('h-6 w-6', isActive && 'text-blue-600')} />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg bg-blue-50 -z-10"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  isActive ? 'text-blue-600' : 'text-gray-500'
                )}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

