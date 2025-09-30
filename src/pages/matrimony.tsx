import Link from 'next/link'
import Image from 'next/image'
import { Heart, Users, CheckCircle, Star, ArrowRight, Shield, MapPin, Phone } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import { generateFAQSchema, generateServiceSchema } from '@/lib/seo'

export default function Matrimony() {
  const faqs = [
    {
      question: "What is online matrimony and how does it work?",
      answer: "Online matrimony is a digital platform that helps individuals find life partners through detailed profiles, compatibility matching, and communication tools. It combines traditional matchmaking with modern technology for efficient partner search."
    },
    {
      question: "How safe and secure is online matrimony?",
      answer: "Reputable matrimony services implement strict verification processes, secure communication channels, and privacy protection measures. All profiles are screened and verified before approval to ensure authenticity and safety."
    },
    {
      question: "What information should I include in my matrimony profile?",
      answer: "Include honest details about your education, profession, family background, interests, and partner preferences. High-quality photos and a well-written bio help create a compelling profile that attracts compatible matches."
    },
    {
      question: "How long does it take to find a match through matrimony services?",
      answer: "The timeframe varies based on individual preferences and requirements. Most serious users find compatible matches within 3-6 months, with many connecting with their life partner within the first year."
    },
    {
      question: "Are matrimony services suitable for all communities?",
      answer: "Yes, modern matrimony platforms cater to all communities, religions, castes, and preferences. They offer specialized search filters to help you find partners from your preferred community and background."
    }
  ]

  const faqSchema = generateFAQSchema(faqs)
  const serviceSchema = generateServiceSchema()

  const seoConfig = {
    title: "Best Matrimony Service in India - Find Your Perfect Life Partner | MakeMyKnot",
    description: "India's most trusted matrimony service with 50+ years of experience. Find your perfect match from thousands of verified profiles. Free registration, expert guidance, and 91% success rate.",
    keywords: "matrimony, matrimonial, indian matrimony, online matrimony, marriage bureau, bride groom search, matrimonial site, wedding matchmaking",
    openGraph: {
      title: "Best Matrimony Service - Find Your Perfect Match",
      description: "Trusted matrimony service with verified profiles and expert guidance. Join thousands who found love through our platform.",
      image: "https://makemyknot.com/images/matrimony-og.jpg"
    },
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [faqSchema, serviceSchema]
    }
  }

  return (
    <>
      <SEO config={seoConfig} page="matrimony" />

      <main className="min-h-screen bg-white">
        <Navigation variant="white" />

        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center bg-blue-100 px-4 py-2 rounded-full text-sm font-medium text-blue-700 mb-6">
                <Heart className="h-4 w-4 mr-2" />
                India's Most Trusted Matrimony Service
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find Your Perfect
                <span className="text-blue-600 block">Life Partner</span>
                <span className="text-2xl md:text-3xl font-normal text-gray-600 block mt-2">
                  Through India's Premier Matrimony Service
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
                Join over 50,000 couples who found their soulmate through our matrimony platform. 
                With 50+ years of matchmaking expertise and advanced compatibility algorithms, 
                we help you discover your perfect match.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link 
                  href="/signup" 
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                >
                  Start Free Registration
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/assessment" 
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                >
                  Take Compatibility Test
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">91%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">100k+</div>
                  <div className="text-sm text-gray-600">Active Profiles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Matrimony Service?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We combine traditional matchmaking wisdom with cutting-edge technology to help you find your ideal life partner.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-blue-50 rounded-2xl">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">100% Verified Profiles</h3>
                <p className="text-gray-600">
                  Every profile undergoes thorough verification including ID proof, education certificates, and background checks for your safety.
                </p>
              </div>
              
              <div className="text-center p-8 bg-purple-50 rounded-2xl">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Matching Algorithm</h3>
                <p className="text-gray-600">
                  Our AI-powered compatibility system analyzes 150+ factors to suggest highly compatible matches based on your preferences.
                </p>
              </div>
              
              <div className="text-center p-8 bg-pink-50 rounded-2xl">
                <Heart className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Personal Matchmaker</h3>
                <p className="text-gray-600">
                  Get dedicated support from experienced matchmakers who understand your requirements and guide you throughout your journey.
                </p>
              </div>
              
              <div className="text-center p-8 bg-green-50 rounded-2xl">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy Protection</h3>
                <p className="text-gray-600">
                  Advanced privacy controls let you manage who sees your profile and contact details, ensuring complete confidentiality.
                </p>
              </div>
              
              <div className="text-center p-8 bg-yellow-50 rounded-2xl">
                <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Features</h3>
                <p className="text-gray-600">
                  Access advanced search filters, unlimited messaging, video calls, and priority customer support for faster results.
                </p>
              </div>
              
              <div className="text-center p-8 bg-indigo-50 rounded-2xl">
                <MapPin className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Global Reach</h3>
                <p className="text-gray-600">
                  Connect with potential partners across India and worldwide, with members from all major cities and countries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Our Matrimony Service Works
              </h2>
              <p className="text-xl text-gray-600">
                Simple steps to find your perfect life partner
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Create Profile</h3>
                <p className="text-gray-600">Register and create your detailed matrimony profile with photos and preferences.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Get Matches</h3>
                <p className="text-gray-600">Receive compatible profile suggestions based on your preferences and compatibility.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Connect</h3>
                <p className="text-gray-600">Communicate with interested matches through secure messaging and video calls.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Find Love</h3>
                <p className="text-gray-600">Meet your perfect match and begin your journey towards a happy marriage.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Matrimony Success Stories
              </h2>
              <p className="text-xl text-gray-600">
                Real couples who found their perfect match through our matrimony service
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src="/images/AmanMuskan.jpg"
                      alt="Aman and Muskan matrimony success story"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Aman & Muskan</h4>
                    <p className="text-sm text-gray-600">Found love in 2 months</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "The matrimony service helped us find each other despite being in different cities. 
                  The compatibility matching was perfect!"
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-red-50 p-8 rounded-2xl">
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src="/images/aishwariyarahul.jpg"
                      alt="Rahul and Aishwarya matrimonial success"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Rahul & Aishwarya</h4>
                    <p className="text-sm text-gray-600">Married after 4 months</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "We were both skeptical about online matrimony, but the detailed profiles 
                  and expert guidance made all the difference."
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl">
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src="/images/Shwatangbarkha.jpg"
                      alt="Shwatang and Barkha matrimony journey"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Shwatang & Barkha</h4>
                    <p className="text-sm text-gray-600">Connected in 3 weeks</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "The personal matchmaker service was incredible. They understood exactly 
                  what we were looking for and introduced us to our soulmate."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Matrimony Service FAQs
              </h2>
              <p className="text-xl text-gray-600">
                Get answers to common questions about our matrimony platform
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join India's most trusted matrimony service and start your journey to find true love
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link 
                href="/signup" 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Register Free Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Expert
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-100 text-sm">
              <div>✓ 100% Free Registration</div>
              <div>✓ Verified Profiles Only</div>
              <div>✓ Expert Guidance Included</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}