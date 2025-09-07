'use client'

import { useEffect } from 'react'

/**
 * Component that suppresses specific React warnings
 * Should be placed at the root of the application
 */
export function SuppressWarnings() {
  useEffect(() => {
    // Store original console methods
    const originalError = console.error
    const originalWarn = console.warn
    const originalLog = console.log

    // Create a filter function for warnings
    const shouldSuppress = (message: string) => {
      return (
        message.includes('Warning: Extra attributes from the server:') ||
        message.includes('Warning: Text content did not match') ||
        message.includes('Warning: Prop') ||
        message.includes('Warning: Expected server HTML to contain')
      ) && (
        message.includes('bis_skin_checked') ||
        message.includes('data-adblock') ||
        message.includes('data-extension') ||
        message.includes('data-') ||
        message.includes('aria-')
      )
    }

    // Override console methods
    console.error = (...args) => {
      const message = args[0]
      if (typeof message === 'string' && shouldSuppress(message)) {
        return // Suppress this warning
      }
      originalError.apply(console, args)
    }

    console.warn = (...args) => {
      const message = args[0]
      if (typeof message === 'string' && shouldSuppress(message)) {
        return // Suppress this warning
      }
      originalWarn.apply(console, args)
    }

    console.log = (...args) => {
      const message = args[0]
      if (typeof message === 'string' && shouldSuppress(message)) {
        return // Suppress this warning
      }
      originalLog.apply(console, args)
    }

    // Cleanup function
    return () => {
      console.error = originalError
      console.warn = originalWarn
      console.log = originalLog
    }
  }, [])

  return null
}
