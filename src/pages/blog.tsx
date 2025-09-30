import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, ArrowRight, Heart, Users, MessageCircle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import { pageConfigs, generateFAQSchema } from '@/lib/seo'

// Sample blog posts - In real app, these would come from CMS/API
const blogPosts = [
  {
    id: 1,
    slug: 'finding-love-in-arranged-marriages',
    title: 'Finding Love in Arranged Marriages: A Modern Approach',
    excerpt: 'Discover how modern arranged marriages blend tradition with personal choice to create lasting relationships.',
    content: 'Modern arranged marriages are evolving to include more personal choice and compatibility matching...',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=400&fit=crop&auto=format',
    author: 'Dr. Priya Sharma',
    publishedAt: '2024-01-15',
    readTime: '5 min read',
    category: 'Relationship Advice',
    tags: ['arranged marriage', 'love', 'compatibility', 'indian weddings']
  },
  {
    id: 2,
    slug: 'pre-marriage-counseling-benefits',
    title: 'Pre-Marriage Counseling: Building Strong Foundations',
    excerpt: 'Learn why pre-marriage counseling is essential for creating a healthy, long-lasting relationship.',
    content: 'Pre-marriage counseling helps couples understand each other better before taking the big step...',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&auto=format',
    author: 'Moulik Goyal',
    publishedAt: '2024-01-12',
    readTime: '7 min read',
    category: 'Marriage Preparation',
    tags: ['counseling', 'marriage preparation', 'relationship', 'communication']
  },
  {
    id: 3,
    slug: 'navigating-cultural-differences-in-relationships',
    title: 'Navigating Cultural Differences in Inter-Cultural Marriages',
    excerpt: 'Tips for couples from different cultural backgrounds to build understanding and harmony.',
    content: 'Inter-cultural marriages bring unique challenges but also incredible opportunities for growth...',
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=400&fit=crop&auto=format',
    author: 'Anil Goyal',
    publishedAt: '2024-01-10',
    readTime: '6 min read',
    category: 'Cultural Harmony',
    tags: ['inter-cultural', 'diversity', 'marriage', 'traditions']
  },
  {
    id: 4,
    slug: 'red-flags-in-early-dating',
    title: '10 Red Flags to Watch Out for in Early Dating',
    excerpt: 'Recognize warning signs early to make better relationship choices and protect your emotional well-being.',
    content: 'Early dating is exciting, but its important to watch for these warning signs...',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=400&fit=crop&auto=format',
    author: 'Dr. Priya Sharma',
    publishedAt: '2024-01-08',
    readTime: '4 min read',
    category: 'Dating Tips',
    tags: ['dating', 'red flags', 'relationship advice', 'safety']
  },
  {
    id: 5,
    slug: 'maintaining-relationships-in-digital-age',
    title: 'Maintaining Authentic Relationships in the Digital Age',
    excerpt: 'How to build genuine connections when technology dominates our communication patterns.',
    content: 'In todays digital world, maintaining authentic relationships requires intentional effort...',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=400&fit=crop&auto=format',
    author: 'Moulik Goyal',
    publishedAt: '2024-01-05',
    readTime: '8 min read',
    category: 'Modern Romance',
    tags: ['digital dating', 'technology', 'authentic relationships', 'communication']
  },
  {
    id: 6,
    slug: 'family-involvement-in-indian-marriages',
    title: 'The Role of Family in Indian Marriages: Balance is Key',
    excerpt: 'Understanding how to balance family involvement with personal autonomy in Indian marriage decisions.',
    content: 'Family plays a significant role in Indian marriages, but finding the right balance is crucial...',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=400&fit=crop&auto=format',
    author: 'Anil Goyal',
    publishedAt: '2024-01-03',
    readTime: '6 min read',
    category: 'Family Dynamics',
    tags: ['family', 'indian culture', 'marriage decisions', 'autonomy']
  }
]

const categories = ['All', 'Relationship Advice', 'Marriage Preparation', 'Cultural Harmony', 'Dating Tips', 'Modern Romance', 'Family Dynamics']

export default function Blog() {
  // FAQ data for structured data
  const faqs = [
    {
      question: "How often should I read relationship advice?",
      answer: "Reading relationship advice regularly, such as once a week, can help you stay informed about healthy relationship practices and communication strategies."
    },
    {
      question: "Are the authors qualified relationship experts?",
      answer: "Yes, our blog features content from certified relationship counselors, marriage therapists, and the MakeMyKnot team with over 50 years of matchmaking experience."
    },
    {
      question: "Can I suggest topics for future blog posts?",
      answer: "Absolutely! We welcome suggestions from our community. Contact us through our contact form with your topic ideas."
    }
  ]

  const faqSchema = generateFAQSchema(faqs)

  return (
    <>
      <SEO 
        config={{
          ...pageConfigs.blog,
          jsonLd: faqSchema
        }} 
        page="blog" 
      />

      <main className="min-h-screen bg-gray-50">
        <Navigation variant="white" />

        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-primary-50 via-white to-gold-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Relationship Advice & Marriage Tips
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert insights on love, relationships, and marriage from India's most trusted matchmaking professionals
            </p>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === 'All' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <User className="h-4 w-4 mr-1" />
                      <span className="mr-4">{post.author}</span>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-4">{new Date(post.publishedAt).toLocaleDateString()}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Load More Articles
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-16 bg-primary-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Heart className="h-12 w-12 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Get Relationship Tips Delivered
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Subscribe to our weekly newsletter for expert advice on love and relationships
            </p>
            
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary-300"
              />
              <button className="bg-gold-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* Related Topics */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Popular Topics
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <Heart className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Finding Love</h3>
                <p className="text-gray-600 mb-4">
                  Learn how to open your heart and find meaningful connections
                </p>
                <Link href="/blog?category=relationship-advice" className="text-primary-600 font-medium">
                  Read Articles →
                </Link>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Marriage Prep</h3>
                <p className="text-gray-600 mb-4">
                  Essential guidance for preparing for a successful marriage
                </p>
                <Link href="/blog?category=marriage-preparation" className="text-primary-600 font-medium">
                  Read Articles →
                </Link>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <MessageCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Communication</h3>
                <p className="text-gray-600 mb-4">
                  Master the art of healthy relationship communication
                </p>
                <Link href="/blog?category=communication" className="text-primary-600 font-medium">
                  Read Articles →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}