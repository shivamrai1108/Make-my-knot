import Head from 'next/head'
import { SEOConfig, defaultSEO, generateJsonLd } from '@/lib/seo'

interface SEOProps {
  config?: Partial<SEOConfig>
  page?: string
}

export default function SEO({ config = {}, page }: SEOProps) {
  // Merge with default config
  const seoConfig: SEOConfig = {
    ...defaultSEO,
    ...config,
    openGraph: {
      ...defaultSEO.openGraph,
      ...config.openGraph
    },
    twitter: {
      ...defaultSEO.twitter,
      ...config.twitter
    }
  }

  const jsonLd = generateJsonLd(seoConfig)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://makemyknot.com'

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoConfig.title}</title>
      <meta name="description" content={seoConfig.description} />
      {seoConfig.keywords && <meta name="keywords" content={seoConfig.keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL */}
      {seoConfig.canonical && <link rel="canonical" href={seoConfig.canonical} />}
      
      {/* Language and Character Set */}
      <meta httpEquiv="content-language" content="en-IN" />
      <meta charSet="utf-8" />
      
      {/* Robots Meta */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Author and Publisher */}
      <meta name="author" content="MakeMyKnot" />
      <meta name="publisher" content="MakeMyKnot" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={seoConfig.openGraph?.title || seoConfig.title} />
      <meta property="og:description" content={seoConfig.openGraph?.description || seoConfig.description} />
      <meta property="og:type" content={seoConfig.openGraph?.type || 'website'} />
      <meta property="og:url" content={seoConfig.openGraph?.url || `${baseUrl}${page ? `/${page}` : ''}`} />
      <meta property="og:site_name" content="MakeMyKnot" />
      <meta property="og:locale" content="en_IN" />
      {seoConfig.openGraph?.image && (
        <>
          <meta property="og:image" content={seoConfig.openGraph.image} />
          <meta property="og:image:alt" content={seoConfig.openGraph?.title || seoConfig.title} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:type" content="image/jpeg" />
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={seoConfig.twitter?.card || 'summary_large_image'} />
      <meta name="twitter:title" content={seoConfig.twitter?.title || seoConfig.title} />
      <meta name="twitter:description" content={seoConfig.twitter?.description || seoConfig.description} />
      <meta name="twitter:site" content="@makemyknot" />
      <meta name="twitter:creator" content="@makemyknot" />
      {seoConfig.twitter?.image && (
        <>
          <meta name="twitter:image" content={seoConfig.twitter.image} />
          <meta name="twitter:image:alt" content={seoConfig.twitter?.title || seoConfig.title} />
        </>
      )}
      
      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#8B5A3C" />
      <meta name="msapplication-TileColor" content="#8B5A3C" />
      
      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=yes" />
      <meta name="format-detection" content="address=yes" />
      <meta name="format-detection" content="email=yes" />
      
      {/* Geo Meta Tags */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.country" content="India" />
      <meta name="geo.placename" content="New Delhi, India" />
      
      {/* Business/Service Meta Tags */}
      <meta name="category" content="Matchmaking" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="revisit-after" content="1 day" />
      
      {/* Structured Data (JSON-LD) */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd}
        />
      )}
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Head>
  )
}