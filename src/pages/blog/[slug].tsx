import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import { Calendar, User, Eye, Tag, ArrowLeft, Share2 } from 'lucide-react'

interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  category: string
  status: string
  tags: string[]
  author: string
  publishDate: string
  createdAt: string
  updatedAt: string
  seoTitle?: string
  seoDescription?: string
  featuredImage?: string
  views?: number
}

interface BlogPageProps {
  blog: Blog | null
  error?: string
}

export default function BlogPage({ blog, error }: BlogPageProps) {
  if (error || !blog) {
    return (
      <>
        <SEO 
          config={{
            title: "Blog Not Found - MakeMyKnot",
            description: "The requested blog post could not be found."
          }}
        />
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="pt-20">
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
              <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </>
    )
  }

  const publishDate = new Date(blog.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const shareUrl = `https://makemyknot.com/blog/${blog.slug}`
  const shareText = `${blog.title} - ${blog.excerpt}`

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: shareUrl
      })
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Blog URL copied to clipboard!')
      })
    }
  }

  return (
    <>
      <SEO
        config={{
          title: blog.seoTitle || blog.title,
          description: blog.seoDescription || blog.excerpt,
          canonical: `https://makemyknot.com/blog/${blog.slug}`,
          openGraph: {
            title: blog.title,
            description: blog.excerpt,
            image: blog.featuredImage || 'https://makemyknot.com/images/og-blog.jpg',
            url: shareUrl,
            type: 'article'
          },
          twitter: {
            card: 'summary_large_image',
            title: blog.title,
            description: blog.excerpt,
            image: blog.featuredImage || 'https://makemyknot.com/images/twitter-blog.jpg'
          },
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.excerpt,
            "image": blog.featuredImage,
            "author": {
              "@type": "Person",
              "name": blog.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "MakeMyKnot",
              "logo": {
                "@type": "ImageObject",
                "url": "https://makemyknot.com/images/logo.png"
              }
            },
            "datePublished": blog.publishDate,
            "dateModified": blog.updatedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": shareUrl
            }
          }
        }}
      />
      
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <main className="pt-20">
          {/* Blog Header */}
          <div className="bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
              <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Link href="/blog" className="hover:text-primary-600 transition-colors">
                  Blog
                </Link>
                <span>/</span>
                <span className="text-gray-400">{blog.title}</span>
              </nav>
              
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-4">
                  {blog.category}
                </span>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {blog.title}
                </h1>
                
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {blog.excerpt}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>By {blog.author}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{publishDate}</span>
                  </div>
                  
                  {blog.views && (
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{blog.views} views</span>
                    </div>
                  )}
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="max-w-4xl mx-auto px-4 py-8">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          )}
          
          {/* Blog Content */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <article className="prose prose-lg max-w-none">
              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </article>
            
            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 mr-2">Tags:</span>
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <div className="max-w-4xl mx-auto px-4 py-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Share Article
                </button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
      
      <style jsx global>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 600;
          line-height: 1.3;
        }
        
        .blog-content h1 { font-size: 2rem; }
        .blog-content h2 { font-size: 1.75rem; }
        .blog-content h3 { font-size: 1.5rem; }
        .blog-content h4 { font-size: 1.25rem; }
        
        .blog-content p {
          margin-bottom: 1.5rem;
          line-height: 1.7;
        }
        
        .blog-content img {
          margin: 2rem 0;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        
        .blog-content blockquote {
          border-left: 4px solid #3B82F6;
          margin: 2rem 0;
          padding-left: 1.5rem;
          font-style: italic;
          background: #F8FAFC;
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
        }
        
        .blog-content ul,
        .blog-content ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        
        .blog-content a {
          color: #3B82F6;
          text-decoration: underline;
        }
        
        .blog-content a:hover {
          color: #1D4ED8;
        }
        
        .blog-content code {
          background: #F1F5F9;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: ui-monospace, monospace;
        }
        
        .blog-content pre {
          background: #1E293B;
          color: #F1F5F9;
          padding: 1.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 2rem 0;
        }
        
        .blog-content pre code {
          background: transparent;
          padding: 0;
        }
      `}</style>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params!
  
  try {
    // In production, you'd fetch from your database
    // For now, we'll simulate this with a client-side approach
    
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blogs?slug=${slug}`)
    
    if (!response.ok) {
      return {
        props: {
          blog: null,
          error: 'Blog not found'
        }
      }
    }
    
    const data = await response.json()
    
    // Only show published blogs to public
    if (!data.success || data.data.blog.status !== 'published') {
      return {
        props: {
          blog: null,
          error: 'Blog not found'
        }
      }
    }
    
    return {
      props: {
        blog: data.data.blog
      }
    }
  } catch (error) {
    console.error('Error fetching blog:', error)
    return {
      props: {
        blog: null,
        error: 'Failed to load blog'
      }
    }
  }
}