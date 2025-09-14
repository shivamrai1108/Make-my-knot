import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@/lib/UserContext'
import { OnlineStatusProvider } from '@/lib/OnlineStatusContext'
import KnotCounsellor from '@/components/KnotCounsellor'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <OnlineStatusProvider>
        <Component {...pageProps} />
        <KnotCounsellor />
      </OnlineStatusProvider>
    </UserProvider>
  )
}
