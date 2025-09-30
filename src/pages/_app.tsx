import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@/lib/UserContext'
import { OnlineStatusProvider } from '@/lib/OnlineStatusContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Analytics from '@/components/Analytics'
import SplashScreen from '@/components/SplashScreen'
import { preventLeadDataLoss, syncPendingLeads } from '@/lib/leadStore'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  
  // Only show splash screen on homepage
  const isHomepage = router.pathname === '/'

  useEffect(() => {
    // Initialize lead data protection
    if (typeof window !== 'undefined') {
      preventLeadDataLoss()
      
      // Try to sync any pending leads immediately
      syncPendingLeads().catch(err => {
        console.warn('Initial sync failed:', err)
      })
      
      // Set up periodic sync every 30 seconds
      const syncInterval = setInterval(() => {
        syncPendingLeads().catch(err => {
          console.warn('Periodic sync failed:', err)
        })
      }, 30000)
      
      // Cleanup interval on unmount
      return () => clearInterval(syncInterval)
    }
    
    // Check if this is the first visit
    const hasVisited = sessionStorage.getItem('hasVisited')
    if (hasVisited) {
      setShowSplash(false)
      setIsFirstLoad(false)
    } else {
      sessionStorage.setItem('hasVisited', 'true')
    }
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  return (
    <LanguageProvider>
      <UserProvider>
        <OnlineStatusProvider>
          <Analytics />
          {showSplash && isFirstLoad && isHomepage ? (
            <SplashScreen onComplete={handleSplashComplete} duration={4000} />
          ) : (
            <Component {...pageProps} />
          )}
        </OnlineStatusProvider>
      </UserProvider>
    </LanguageProvider>
  )
}
