import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Google Analytics tracking ID - replace with your actual GA4 measurement ID
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'G-XXXXXXXXXX'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url.pathname,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Custom events for Make My Knot
export const trackUserSignup = (method: string) => {
  event({
    action: 'signup',
    category: 'authentication',
    label: method
  })
}

export const trackUserLogin = (method: string) => {
  event({
    action: 'login',
    category: 'authentication',
    label: method
  })
}

export const trackQuestionnaireComplete = () => {
  event({
    action: 'questionnaire_complete',
    category: 'engagement',
    label: 'compatibility_quiz'
  })
}

export const trackMatchView = (matchId: string) => {
  event({
    action: 'match_view',
    category: 'matching',
    label: matchId
  })
}

export const trackPricingView = (plan: string) => {
  event({
    action: 'pricing_view',
    category: 'conversion',
    label: plan
  })
}

export const trackLeadGeneration = (source: string) => {
  event({
    action: 'lead_generated',
    category: 'conversion',
    label: source
  })
}

// Analytics component to be added to _app.tsx
export default function Analytics() {
  const router = useRouter()

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && GA_TRACKING_ID) {
      const handleRouteChange = (url: string) => {
        pageview(new URL(url, window.location.origin))
      }

      router.events.on('routeChangeComplete', handleRouteChange)
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange)
      }
    }
  }, [router.events])

  // Only render in production
  if (process.env.NODE_ENV !== 'production' || !GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
