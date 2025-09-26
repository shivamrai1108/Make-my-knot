import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Crimson+Pro:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Cormorant+Garamond:wght@400;500;600;700&family=EB+Garamond:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="/fonts/qasira.css"
          rel="stylesheet"
        />
      </Head>
      <Main />
      <NextScript />
    </Html>
  )
}