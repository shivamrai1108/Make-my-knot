import Link from 'next/link'
import Image from 'next/image'
import { Heart, Users, CheckCircle, Star, ArrowRight, Shield, Clock, Award } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import { generateFAQSchema, generateLocalBusinessSchema } from '@/lib/seo'

export default function IndianMatchmaking() {
  // SEO-optimized FAQ for Indian Matchmaking
  const faqs = [
    {
      question: "What makes Indian matchmaking different from Western dating?",
      answer: "Indian matchmaking emphasizes family values, long-term compatibility, and cultural alignment. It involves family participation and focuses on creating lasting marriages rather than casual dating relationships."
    },
    {
      question: "How does modern Indian matchmaking work?",
      answer: "Modern Indian matchmaking combines traditional values with advanced technology. We use AI-powered compatibility matching, detailed personality assessments, and expert human guidance to find suitable life partners who share your values and lifestyle."
    },
    {
      question: "Is Indian matchmaking only for arranged marriages?",
      answer: "No, modern Indian matchmaking serves both arranged marriage seekers and those looking for love matches. We help individuals find partners who align with their family values while ensuring personal compatibility and mutual attraction."
    },
    {
      question: "What role does family play in Indian matchmaking?",
      answer: "Family involvement varies based on individual preferences. Some clients prefer full family participation, while others want minimal involvement. We customize our approach to match your comfort level while respecting cultural traditions."
    },
    {
      question: "How successful is Indian matchmaking?",
      answer: "Indian matchmaking has a high success rate due to its focus on compatibility, shared values, and family support. Our service has achieved a 91% success rate with over 20,000 successful matches in the past 50 years."
    }
  ]

  const faqSchema = generateFAQSchema(faqs)
  const businessSchema = generateLocalBusinessSchema()

  const seoConfig = {
    title: "Indian Matchmaking Service - Traditional Values, Modern Approach | MakeMyKnot",
    description: "Discover authentic Indian matchmaking with 50+ years of expertise. We blend traditional values with modern technology to help you find your perfect life partner. 91% success rate, verified profiles.",
    keywords: "indian matchmaking, arranged marriage, matrimony, indian wedding, traditional matchmaking, hindu matchmaking, sikh matchmaking, muslim matchmaking, christian matchmaking",
    openGraph: {
      title: "Indian Matchmaking Service - Find Your Perfect Match",
      description: "Trusted Indian matchmaking service combining tradition with modern technology. 50+ years experience, 91% success rate.",
      image: "https://makemyknot.com/images/indian-matchmaking-og.jpg"
    },
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [faqSchema, businessSchema]
    }
  }

  return (
    <>
      <SEO config={seoConfig} page="indian-matchmaking" />

      <main className="min-h-screen bg-white">
        <Navigation variant="white" />

        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center bg-orange-100 px-4 py-2 rounded-full text-sm font-medium text-orange-700 mb-6">
                  <Star className="h-4 w-4 mr-2" />
                  India's Most Trusted Matchmaking Service
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Authentic 
                  <span className="text-orange-600 block">Indian Matchmaking</span>
                  <span className="text-2xl md:text-3xl font-normal text-gray-600 block mt-2">
                    Where Tradition Meets Technology
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Experience the perfect blend of traditional Indian values and modern matchmaking technology. 
                  Our 50+ years of expertise helps you find a life partner who shares your culture, values, and dreams.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link 
                    href="/signup" 
                    className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors inline-flex items-center justify-center"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link 
                    href="/contact" 
                    className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors inline-flex items-center justify-center"
                  >
                    Talk to Expert
                  </Link>
                </div>
                
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">50+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">91%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">20k+</div>
                    <div className="text-sm text-gray-600">Happy Marriages</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop&auto=format"
                    alt="Traditional Indian wedding ceremony showcasing authentic matchmaking values"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                  <div className="flex items-center">
                    <Heart className="h-8 w-8 text-red-500 mr-3" />
                    <div>
                      <div className="font-bold text-gray-900">99.7% Verified</div>
                      <div className="text-sm text-gray-600">Authentic Profiles</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Indian Matchmaking */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Traditional Indian Matchmaking?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Indian matchmaking focuses on creating lifelong partnerships based on shared values, 
                family harmony, and deep compatibility beyond surface-level attraction.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-orange-50 p-8 rounded-2xl">
                <Shield className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Family Values First</h3>
                <p className="text-gray-600">
                  We prioritize candidates who share your family values, cultural background, 
                  and life philosophy for lasting harmony.
                </p>
              </div>
              
              <div className="bg-red-50 p-8 rounded-2xl">
                <Users className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Community Support</h3>
                <p className="text-gray-600">
                  Benefit from family and community involvement that provides guidance 
                  and support throughout your relationship journey.
                </p>
              </div>
              
              <div className="bg-pink-50 p-8 rounded-2xl">
                <CheckCircle className="h-12 w-12 text-pink-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Matches</h3>
                <p className="text-gray-600">
                  All profiles undergo thorough verification including background checks, 
                  education, and family credentials for your safety.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-8 rounded-2xl">
                <Clock className="h-12 w-12 text-yellow-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Time-Tested Process</h3>
                <p className="text-gray-600">
                  Our methodology has successfully created marriages for over 50 years, 
                  adapting traditional wisdom to modern needs.
                </p>
              </div>
              
              <div className="bg-green-50 p-8 rounded-2xl">
                <Award className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Guidance</h3>
                <p className="text-gray-600">
                  Receive personalized advice from experienced matchmakers who understand 
                  Indian culture and relationship dynamics.
                </p>
              </div>
              
              <div className="bg-purple-50 p-8 rounded-2xl">
                <Heart className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Love & Compatibility</h3>
                <p className="text-gray-600">
                  Modern Indian matchmaking balances arranged marriage traditions with 
                  personal choice and romantic compatibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Real Indian Matchmaking Success Stories
              </h2>
              <p className="text-xl text-gray-600">
                Discover how traditional matchmaking created these beautiful love stories
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src="/images/AmanMuskan.jpg"
                      alt="Aman and Muskan - successful Indian matchmaking couple"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Aman & Muskan</h4>
                    <p className="text-sm text-gray-600">Noida, Uttar Pradesh</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "Traditional matchmaking helped us find not just love, but a partner 
                  who truly understands our family values and cultural background."
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src="/images/aishwariyarahul.jpg"
                      alt="Rahul and Aishwarya - traditional Indian marriage success"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Rahul & Aishwarya</h4>
                    <p className="text-sm text-gray-600">Mumbai, Maharashtra</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "The perfect blend of tradition and choice. Our families are happy, 
                  and we found our soulmate through this wonderful process."
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src="/images/Shwatangbarkha.jpg"
                      alt="Shwatang and Barkha - Indian matchmaking love story"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Shwatang & Barkha</h4>
                    <p className="text-sm text-gray-600">Delhi, India</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "Indian matchmaking gave us the foundation for a marriage built on 
                  mutual respect, shared dreams, and family blessings."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions About Indian Matchmaking
              </h2>
              <p className="text-xl text-gray-600">
                Get answers to common questions about traditional Indian matchmaking
              </p>
            </div>

            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
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
        <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Begin Your Indian Matchmaking Journey?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands who found their perfect life partner through traditional Indian matchmaking
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup" 
                className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Start Free Registration
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center"
              >
                Speak with Expert
              </Link>
            </div>

            <div className="mt-8 text-orange-100">
              <p>✓ No hidden fees ✓ 100% confidential ✓ Expert guidance</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}