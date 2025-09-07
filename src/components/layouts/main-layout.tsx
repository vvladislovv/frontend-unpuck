'use client'

import { BottomNav } from '@/components/navigation/bottom-nav'
import { TabType } from '@/types'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [currentTab, setCurrentTab] = useState<TabType>('catalog')
  const pathname = usePathname()

  // Определяем текущую вкладку на основе пути
  useEffect(() => {
    if (pathname.startsWith('/catalog')) {
      setCurrentTab('catalog')
    } else if (pathname.startsWith('/deals')) {
      setCurrentTab('deals')
    } else if (pathname.startsWith('/profile')) {
      setCurrentTab('profile')
    }
  }, [pathname])

  return (
    <div className="min-h-screen bg-white">
      {/* Основной контент */}
      <main className="pb-16">
        {children}
      </main>

      {/* Нижняя навигация */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  )
}
