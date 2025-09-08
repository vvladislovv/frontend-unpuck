'use client'

import { MainLayout } from '@/components/layouts/main-layout'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const mockTransactions = [
  {
    id: '1',
    type: 'payment',
    amount: 2500,
    description: 'Покупка товара #12345',
    date: '2024-01-18T10:30:00Z',
    status: 'completed',
  },
  {
    id: '2',
    type: 'refund',
    amount: -500,
    description: 'Возврат по заказу #12340',
    date: '2024-01-17T14:20:00Z',
    status: 'completed',
  },
  {
    id: '3',
    type: 'payment',
    amount: 1800,
    description: 'Покупка товара #12338',
    date: '2024-01-16T09:15:00Z',
    status: 'pending',
  },
  {
    id: '4',
    type: 'payment',
    amount: 3200,
    description: 'Покупка товара #12335',
    date: '2024-01-15T16:45:00Z',
    status: 'completed',
  },
  {
    id: '5',
    type: 'refund',
    amount: -1200,
    description: 'Возврат по заказу #12330',
    date: '2024-01-14T11:20:00Z',
    status: 'completed',
  },
  {
    id: '6',
    type: 'payment',
    amount: 4500,
    description: 'Покупка товара #12325',
    date: '2024-01-13T08:30:00Z',
    status: 'completed',
  },
]

export default function PaymentsPage() {
  const router = useRouter()
  const [transactions] = useState(mockTransactions)

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Заголовок */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={() => router.back()} className="p-1 -ml-1">
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">История платежей</h1>
          </div>
        </div>

        <div className="px-4 py-6">
          {/* История транзакций */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Все транзакции</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
                      </p>
                      <p className={`text-xs ${
                        transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {transaction.status === 'completed' ? 'Завершено' : 'В обработке'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
