import { Providers } from '@/components/providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Unpacker Clone - Marketplace Platform',
  description: 'Современная платформа для продавцов и блогеров',
  keywords: 'marketplace, advertising, wildberries, telegram, referrals, mobile, twa',
  authors: [{ name: 'Unpacker Clone Team' }],
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Unpacker Clone',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress hydration warnings from browser extensions
              (function() {
                if (typeof window !== 'undefined') {
                  // Store original console methods
                  const originalError = console.error;
                  const originalWarn = console.warn;
                  
                  // Filter function for hydration warnings
                  const shouldSuppress = (message) => {
                    if (typeof message !== 'string') return false;
                    
                    const isHydrationWarning = message.includes('Warning: Extra attributes from the server:') ||
                                             message.includes('Warning: Text content did not match') ||
                                             message.includes('Warning: Prop') ||
                                             message.includes('Warning: Expected server HTML to contain');
                    
                    const isExtensionAttribute = message.includes('bis_skin_checked') ||
                                               message.includes('data-adblock') ||
                                               message.includes('data-extension') ||
                                               message.includes('data-') ||
                                               message.includes('aria-') ||
                                               message.includes('bis_skin_checked');
                    
                    return isHydrationWarning || isExtensionAttribute;
                  };
                  
                  // Override console methods
                  console.error = (...args) => {
                    if (shouldSuppress(args[0])) return;
                    originalError.apply(console, args);
                  };
                  
                  console.warn = (...args) => {
                    if (shouldSuppress(args[0])) return;
                    originalWarn.apply(console, args);
                  };
                  
                  // Remove problematic attributes from DOM
                  const cleanAttributes = () => {
                    const selectors = [
                      '[bis_skin_checked]',
                      '[data-adblock]',
                      '[data-extension]',
                      '[data-*]'
                    ];
                    
                    selectors.forEach(selector => {
                      try {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(el => {
                          el.removeAttribute('bis_skin_checked');
                          el.removeAttribute('data-adblock');
                          el.removeAttribute('data-extension');
                        });
                      } catch (e) {
                        // Ignore selector errors
                      }
                    });
                  };
                  
                  // Run cleanup
                  cleanAttributes();
                  
                  // Run after DOM is ready
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', cleanAttributes);
                  }
                  
                  // Run periodically to catch late-added attributes
                  setInterval(cleanAttributes, 2000);
                }
              })();
            `,
          }}
        />
      </head>
      <body 
        className={`${inter.variable} font-sans antialiased`} 
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
              success: {
                iconTheme: {
                  primary: 'hsl(var(--primary))',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: 'hsl(var(--destructive))',
                  secondary: 'white',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
