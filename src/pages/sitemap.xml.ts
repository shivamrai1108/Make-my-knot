import { GetServerSideProps } from 'next'

const Sitemap = () => {
  // This component doesn't render anything, it only generates XML
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://makemyknot.com'
  
  // Static pages
  const staticPages = [
    {
      url: '',
      changefreq: 'daily',
      priority: '1.0',
      lastmod: new Date().toISOString()
    },
    {
      url: '/about',
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: new Date().toISOString()
    },
    {
      url: '/pricing',
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: new Date().toISOString()
    },
    {
      url: '/contact',
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: new Date().toISOString()
    },
    {
      url: '/assessment',
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: new Date().toISOString()
    },
    {
      url: '/blog',
      changefreq: 'daily',
      priority: '0.8',
      lastmod: new Date().toISOString()
    },
    {
      url: '/signup',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: new Date().toISOString()
    },
    {
      url: '/login',
      changefreq: 'monthly',
      priority: '0.5',
      lastmod: new Date().toISOString()
    }
  ]

  // Fetch blog posts from API
  let blogPosts: any[] = []
  try {
    const blogResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog?limit=1000`)
    if (blogResponse.ok) {
      const blogData = await blogResponse.json()
      blogPosts = blogData.data?.blogs || []
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  // Add blog posts to sitemap
  const blogPages = blogPosts.map(post => ({
    url: `/blog/${post.slug}`,
    changefreq: 'weekly',
    priority: '0.7',
    lastmod: post.publishedAt || post.updatedAt || new Date().toISOString()
  }))

  // Combine all pages
  const allPages = [...staticPages, ...blogPages]

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml" 
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600') // Cache for 1 hour
  res.write(sitemap)
  res.end()

  return {
    props: {}
  }
}

export default Sitemap