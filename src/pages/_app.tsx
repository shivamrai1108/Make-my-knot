import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@/lib/UserContext'
import { OnlineStatusProvider } from '@/lib/OnlineStatusContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Analytics from '@/components/Analytics'
import SplashScreen from '@/components/SplashScreen'
import { useState, useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [showSplash, setShowSplash] = useState(true)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
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
          {showSplash && isFirstLoad ? (
            <SplashScreen onComplete={handleSplashComplete} duration={4000} />
          ) : (
            <Component {...pageProps} />
          )}
        </OnlineStatusProvider>
      </UserProvider>
    </LanguageProvider>
  )
}
