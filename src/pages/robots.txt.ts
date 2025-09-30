import { GetServerSideProps } from 'next'

const RobotsTxt = () => {
  // This component doesn't render anything, it only generates the robots.txt
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://makemyknot.com'
  
  const robotsTxt = `# *
User-agent: *
Allow: /

# Host
Host: ${baseUrl}

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow private areas
Disallow: /admin
Disallow: /dashboard
Disallow: /api/
Disallow: /_next/
Disallow: /matches
Disallow: /conversations
Disallow: /onboarding

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Allow important pages
Allow: /
Allow: /about
Allow: /pricing
Allow: /contact
Allow: /assessment
Allow: /blog
Allow: /blog/*
Allow: /signup
Allow: /login

# Google-specific directives
User-agent: Googlebot
Allow: /
Crawl-delay: 1

# Bing-specific directives  
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Block bad bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /`

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400') // Cache for 24 hours
  res.write(robotsTxt)
  res.end()

  return {
    props: {}
  }
}

export default RobotsTxt