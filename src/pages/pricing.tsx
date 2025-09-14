import Head from 'next/head'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Check, Star, Crown, Sparkles, Heart, Users, MessageCircle, Calendar, Gift, Shield, Video, Phone, ChevronRight, Clock, Award, Zap, X } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '₹299',
      period: '/month',
      yearlyPrice: '₹2,999',
      description: 'Ideal for curious singles & budget users exploring matchmaking',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      popular: false,
      trialFeatures: {
        matches: 15,
        introductions: 5,
        videoCalls: 1
      },
      features: [
        'Personalized profile creation wizard',
        'AI basic compatibility matching (6-factor)',
        'Up to 30 matches per month',
        'In-app messaging (text only)',
        'AI message templates (3 starter templates)',
        'Basic privacy controls',
        'Email support (48-hour response)',
        'Photo tips and bio prompts'
      ],
      limitations: [
        'No horoscope/numerology integration',
        'No in-app video calls',
        'Limited premium filters'
      ],
      cta: 'Start Free Trial'
    },
    {
      name: 'Classic',
      price: '₹799',
      period: '/month',
      yearlyPrice: '₹7,999',
      description: 'Most popular - For serious daters ready to meet',
      icon: Star,
      color: 'from-purple-500 to-indigo-500',
      popular: true,
      trialFeatures: {
        matches: 25,
        introductions: 8,
        videoCalls: 2
      },
      features: [
        'Everything in Starter',
        'AI advanced matching (personality + values + lifestyle)',
        '100 matches per month with weekly refresh',
        'In-app video calls (3 per month)',
        'Priority chat support (12-24 hour)',
        'Advanced search filters (education, family, religion)',
        'Compatibility report PDF per match',
        'Date planning suggestions',
        'Horoscope/numerology add-on available'
      ],
      cta: 'Most Popular Choice'
    },
    {
      name: 'Premium',
      price: '₹1,999',
      period: '/month',
      yearlyPrice: '₹19,999',
      description: 'High-intent users wanting curated matches & hands-on help',
      icon: Crown,
      color: 'from-gold-500 to-orange-500',
      popular: false,
      trialFeatures: {
        matches: 50,
        introductions: 15,
        videoCalls: 'unlimited'
      },
      features: [
        'Everything in Classic',
        'Unlimited priority matches (300-500 per month)',
        'Advanced AI with social signal analysis',
        'Unlimited in-app video calls',
        'Dedicated success coach (monthly check-ins)',
        'Basic background check (opt-in)',
        'In-platform introductions service',
        'Wedding planning starter pack',
        'Horoscope/numerology included',
        'Priority support (real-time chat)'
      ],
      cta: 'Premium Experience'
    },
    {
      name: 'Platinum Elite',
      price: '₹7,999',
      period: '/month',
      yearlyPrice: '₹79,999',
      description: 'Full concierge & VIP service with success guarantee',
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-600',
      popular: false,
      isElite: true,
      features: [
        'Everything in Premium',
        'Personal Matchmaker assigned',
        'White-glove outreach to exclusive matches',
        'Offline/virtual introductions arranged',
        'Premium background & reference checks',
        'Full wedding vendor concierge',
        'Professional photoshoot included',
        'Success guarantee (6-month option)',
        '24/7 VIP support + account manager',
        'Custom family presentations'
      ],
      cta: 'VIP Concierge'
    }
  ]

  const addOns = [
    {
      name: 'Professional Photoshoot',
      price: '₹2,999',
      description: 'High-quality profile photos that make you stand out',
      icon: Sparkles
    },
    {
      name: 'Relationship Coaching',
      price: '₹1,999',
      description: 'One-on-one sessions to improve dating confidence',
      icon: MessageCircle
    },
    {
      name: 'Background Verification',
      price: '₹999',
      description: 'Comprehensive background check for safety',
      icon: Shield
    },
    {
      name: 'Wedding Planning Consultation',
      price: '₹4,999',
      description: 'Expert guidance for your perfect wedding',
      icon: Gift
    }
  ]

  return (
    <>
      <Head>
        <title>Pricing & Plans - Make My Knot | Premium Wedding Matchmaking</title>
        <meta name="description" content="Choose the perfect matchmaking plan for your journey to find love. From essential matching to VIP concierge services." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <Navigation variant="white" />

        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 via-white to-gold-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Find Your Perfect
                <span className="block text-primary-600">Match Today</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Choose from our expertly crafted matchmaking plans, each designed to help you find meaningful love with personalized service and proven results.
              </p>
              
              {/* Free Trial Banner */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 mr-2" />
                  <span className="text-2xl font-bold">7-Day Free Trial</span>
                </div>
                <p className="text-green-100 mb-4">
                  Full access to core matching engine during trial • Cancel anytime before day 7 to avoid charges
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="font-semibold">Trial Includes:</div>
                    <div>Up to 15 matches, 5 introductions, 1 video call</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="font-semibold">Guidance:</div>
                    <div>Onboarding checklist, profile tips, sample matches</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="font-semibold">Special Offer:</div>
                    <div>Upgrade within trial for exclusive discount</div>
                  </div>
                </div>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 mb-8">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary-600 mr-2" />
                  <span className="font-semibold">50,000+ Success Stories</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="font-semibold">4.9/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-semibold">100% Verified Profiles</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-6 mb-16">
              {plans.map((plan, index) => {
                const IconComponent = plan.icon
                return (
                  <div
                    key={plan.name}
                    className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                      plan.popular ? 'ring-2 ring-primary-600 scale-105' : ''
                    } ${
                      plan.isElite ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200' : ''
                    } transition-all duration-300 hover:shadow-2xl`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                          Most Popular
                        </div>
                      </div>
                    )}
                    {plan.isElite && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                          Elite VIP
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Plan Header */}
                      <div className="text-center mb-6">
                        <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${plan.color} mb-4`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>
                        
                        <div className="mb-4">
                          <div className="flex items-center justify-center mb-2">
                            <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                            <span className="text-gray-600 ml-1">{plan.period}</span>
                          </div>
                          {plan.yearlyPrice && (
                            <div className="text-sm text-gray-500">
                              or {plan.yearlyPrice}/year (save 17%)
                            </div>
                          )}
                        </div>
                        
                        {plan.trialFeatures && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                            <div className="text-xs text-green-800 font-semibold mb-1">7-Day Trial Includes:</div>
                            <div className="text-xs text-green-700">
                              {plan.trialFeatures.matches} matches, {plan.trialFeatures.introductions} intros, {plan.trialFeatures.videoCalls} video call{typeof plan.trialFeatures.videoCalls === 'number' && plan.trialFeatures.videoCalls !== 1 ? 's' : ''}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 mb-6 text-sm">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Limitations */}
                      {plan.limitations && (
                        <div className="mb-6">
                          <div className="text-xs font-semibold text-gray-500 mb-2">Limitations:</div>
                          <ul className="space-y-1 text-xs text-gray-500">
                            {plan.limitations.map((limitation, limitIndex) => (
                              <li key={limitIndex} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* CTA Button - Disabled */}
                      <div className="w-full py-3 px-4 rounded-lg font-semibold text-center block text-sm bg-gray-300 text-gray-600 cursor-not-allowed opacity-75">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Add-on Services */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Enhance Your Experience
              </h2>
              <p className="text-xl text-gray-600">
                Optional services to supercharge your matchmaking journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOns.map((addon, index) => {
                const IconComponent = addon.icon
                return (
                  <div
                    key={addon.name}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:bg-white border-2 border-transparent hover:border-primary-200"
                  >
                    <div className="text-center">
                      <div className="inline-flex p-3 rounded-full bg-primary-100 mb-4">
                        <IconComponent className="h-6 w-6 text-primary-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{addon.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{addon.description}</p>
                      <div className="text-2xl font-bold text-primary-600 mb-4">{addon.price}</div>
                      <button className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                        Add to Plan
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Compare Plans at a Glance
              </h2>
              <p className="text-xl text-gray-600">
                See what's included in each plan and find the perfect match for your needs
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-pink-600">Starter</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-600">Classic</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-orange-600">Premium</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-indigo-600">Platinum Elite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Monthly Price</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-pink-600">₹299</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-purple-600">₹799</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-orange-600">₹1,999</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-indigo-600">₹7,999</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Matches per Month</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">Up to 30</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">Up to 100</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">300-500</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Video Calls</td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">3 per month</td>
                    <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Personal Success Coach</td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Personal Matchmaker</td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Background Verification</td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">Add-on</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">Basic</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">Premium</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Horoscope/Numerology</td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">Add-on</td>
                    <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Professional Photoshoot</td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about our matchmaking services
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How does the matching process work?
                </h3>
                <p className="text-gray-600">
                  Our AI-powered system analyzes your comprehensive profile, values, and preferences to curate highly compatible matches based on 50+ compatibility factors.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Can I upgrade or downgrade my plan?
                </h3>
                <p className="text-gray-600">
                  Yes! You can change your plan anytime. Upgrades take effect immediately, while downgrades apply at your next billing cycle.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What if I don't find matches?
                </h3>
                <p className="text-gray-600">
                  We offer a satisfaction guarantee. If you don&apos;t receive quality matches within 30 days, we&apos;ll work with you to refine your preferences at no extra cost.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Are all profiles verified?
                </h3>
                <p className="text-gray-600">
                  Yes, we verify all profiles through multiple methods including ID verification, social media checks, and photo verification to ensure authenticity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Find Your Life Partner?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of people who have found meaningful relationships through Make My Knot
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-gray-300 text-gray-600 px-8 py-4 rounded-lg font-semibold cursor-not-allowed opacity-75">
                Coming Soon
              </div>
              <Link
                href="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
