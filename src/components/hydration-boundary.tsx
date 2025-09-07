'use client'

import { useEffect, useState } from 'react'

interface HydrationBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Component that handles hydration mismatches gracefully
 * Specifically designed to handle external attributes added by browser extensions
 */
export function HydrationBoundary({ children, fallback = null }: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Clean up any problematic attributes that might cause hydration mismatches
    const cleanupAttributes = () => {
      const elements = document.querySelectorAll('[bis_skin_checked], [data-adblock], [data-extension]')
      elements.forEach(el => {
        el.removeAttribute('bis_skin_checked')
        el.removeAttribute('data-adblock')
        el.removeAttribute('data-extension')
      })
    }

    // Run cleanup immediately
    cleanupAttributes()

    // Set hydrated state
    setIsHydrated(true)

    // Run cleanup again after a short delay to catch any late-added attributes
    const timeoutId = setTimeout(cleanupAttributes, 100)
    
    // Also run cleanup periodically
    const intervalId = setInterval(cleanupAttributes, 500)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [])

  if (!isHydrated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
