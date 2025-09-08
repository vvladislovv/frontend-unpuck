'use client'

import {
    ChartBarIcon,
    ChevronRightIcon,
    QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

const toolsItems = [
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Часто задаваемые вопросы',
    icon: QuestionMarkCircleIcon,
    href: '/faq',
  },
  {
    id: 'statistics',
    title: 'Статистика',
    description: 'Аналитика и отчеты',
    icon: ChartBarIcon,
    href: '/statistics',
  },
]

export function ToolsSection() {
  const router = useRouter()

  const handleItemClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Инструменты</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {toolsItems.map((item) => {
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

