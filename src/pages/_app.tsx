import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@/lib/UserContext'
import { OnlineStatusProvider } from '@/lib/OnlineStatusContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Analytics from '@/components/Analytics'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <UserProvider>
        <OnlineStatusProvider>
          <Analytics />
          <Component {...pageProps} />
        </OnlineStatusProvider>
      </UserProvider>
    </LanguageProvider>
  )
}
