'use client'

import { HydrationBoundary } from '@/components/hydration-boundary'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Перенаправляем на каталог как главную страницу
    router.push('/catalog')
  }, [router])

  return (
    <HydrationBoundary>
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    </HydrationBoundary>
  )
}
