'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Test404Page() {
  const router = useRouter()

  useEffect(() => {
    // Перенаправляем на несуществующую страницу для тестирования 404
    router.push('/non-existent-page')
  }, [router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Перенаправление на 404 страницу...</p>
      </div>
    </div>
  )
}
