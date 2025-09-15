import Link from 'next/link'
import Head from 'next/head'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Clock, Heart, ArrowRight } from 'lucide-react'

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Pricing Coming Soon - Make My Knot</title>
        <meta name="description" content="Our pricing plans are coming soon. Join the waitlist to get early access to our matchmaking services." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <Navigation variant="white" />

        {/* Coming Soon Section */}
        <section className="pt-24 pb-20 bg-gradient-to-br from-primary-50 via-white to-gold-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <Clock className="h-16 w-16 text-primary-600 mx-auto mb-6" />
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Pricing Plans
              <span className="block text-primary-600 mt-2">Coming Soon</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              We're putting the finishing touches on our pricing plans to offer you the best value for finding your perfect match. Our matchmaking services will be available soon!
            </p>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-primary-600 mr-3" />
                <span className="text-2xl font-bold text-gray-900">Get Early Access</span>
              </div>
              <p className="text-gray-600 mb-6">
                Join our waitlist to be the first to know when our pricing plans are available. Plus, get exclusive early-bird discounts!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
                >
                  Join Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/about"
                  className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors inline-flex items-center justify-center"
                >
                  Learn About Us
                </Link>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                <div className="text-gray-600">Years of Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">20,000+</div>
                <div className="text-gray-600">Success Stories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">89%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
