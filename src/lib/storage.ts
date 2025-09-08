import { Deal } from '@/types'

const STORAGE_KEY = 'deals_data'

// Получить сделки из localStorage
export function getDealsFromStorage(): Deal[] | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Ошибка при чтении из localStorage:', error)
    return null
  }
}

// Сохранить сделки в localStorage
export function saveDealsToStorage(deals: Deal[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals))
  } catch (error) {
    console.error('Ошибка при сохранении в localStorage:', error)
  }
}

// Обновить статус сделки
export function updateDealStatus(dealId: string, status: Deal['status'], reason?: string): void {
  const deals = getDealsFromStorage()
  if (!deals) return
  
  const updatedDeals = deals.map(deal => 
    deal.id === dealId 
      ? { 
          ...deal, 
          status, 
          updatedAt: new Date().toISOString(),
          ...(reason && { cancelReason: reason })
        }
      : deal
  )
  
  saveDealsToStorage(updatedDeals)
}

// Получить сделку по ID
export function getDealById(dealId: string): Deal | null {
  const deals = getDealsFromStorage()
  if (!deals) return null
  
  return deals.find(deal => deal.id === dealId) || null
}
