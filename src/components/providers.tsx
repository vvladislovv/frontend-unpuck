'use client'

import { queryConfig } from '@/hooks/use-cache'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'
import { TelegramProvider } from './providers/telegram-provider'
import { TWAProvider } from './providers/twa-provider'
import { SuppressWarnings } from './suppress-warnings'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient(queryConfig)
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <TWAProvider>
          <TelegramProvider>
            <SuppressWarnings />
            {children}
          </TelegramProvider>
        </TWAProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
