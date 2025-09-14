import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, Calendar, Clock, Users, Video, Star, ArrowRight, CheckCircle, X, Mail, Phone, User } from 'lucide-react'
import Footer from '@/components/Footer'

interface Webinar {
  id: string
  title: string
  description: string
  image: string
  speaker: {
    name: string
    credentials: string
    image: string
    rating: number
    experience: string
  }
  date: string
  time: string
  duration: string
  attendees: number
  maxAttendees: number
  price: string
  category: 'couples' | 'marriage' | 'therapy' | 'relationship'
  highlights: string[]
  isPopular?: boolean
}

const webinars: Webinar[] = [
  {
    id: '1',
    title: 'Building Stronger Marriages: Communication That Works',
    description: 'Learn proven communication techniques that strengthen marital bonds and resolve conflicts constructively. Perfect for couples wanting to deepen their connection.',
    image: '/api/placeholder/400/200?text=Communication+Workshop',
    speaker: {
      name: 'Dr. Priya Sharma',
      credentials: 'PhD Clinical Psychology, 15+ years experience',
      image: '/api/placeholder/80/80',
      rating: 4.9,
      experience: 'Helped 1000+ couples'
    },
    date: 'March 25, 2024',
    time: '7:00 PM IST',
    duration: '90 minutes',
    attendees: 180,
    maxAttendees: 200,
    price: 'Free',
    category: 'marriage',
    highlights: [
      'Active listening techniques',
      'Conflict resolution strategies',
      'Building emotional intimacy',
      'Q&A with live examples'
    ],
    isPopular: true
  },
  {
    id: '2',
    title: 'Pre-Marriage Counseling: Starting Right Together',
    description: 'Essential guidance for couples preparing for marriage. Understand expectations, build strong foundations, and create lasting partnerships.',
    image: '/api/placeholder/400/200?text=Pre-Marriage+Counseling',
    speaker: {
      name: 'Dr. Rajesh Mehta',
      credentials: 'Marriage & Family Therapist, 20+ years',
      image: '/api/placeholder/80/80',
      rating: 4.8,
      experience: 'Counseled 2000+ couples'
    },
    date: 'March 28, 2024',
    time: '8:00 PM IST',
    duration: '75 minutes',
    attendees: 95,
    maxAttendees: 150,
    price: '₹299',
    category: 'couples',
    highlights: [
      'Setting realistic expectations',
      'Financial planning together',
      'Family integration strategies',
      'Personal compatibility assessment'
    ]
  },
  {
    id: '3',
    title: 'Healing After Heartbreak: Moving Forward with Hope',
    description: 'A compassionate guide through relationship endings, helping you process emotions healthily and prepare for future meaningful connections.',
    image: '/api/placeholder/400/200?text=Healing+Heartbreak',
    speaker: {
      name: 'Dr. Anita Gupta',
      credentials: 'Relationship Therapist, Trauma Specialist',
      image: '/api/placeholder/80/80',
      rating: 4.9,
      experience: 'Specialized in relationship recovery'
    },
    date: 'March 30, 2024',
    time: '6:30 PM IST',
    duration: '60 minutes',
    attendees: 67,
    maxAttendees: 100,
    price: '₹199',
    category: 'therapy',
    highlights: [
      'Healthy grieving process',
      'Rebuilding self-confidence',
      'Learning from past relationships',
      'Preparing for new love'
    ]
  },
  {
    id: '4',
    title: 'Love Languages: Speaking Your Partner\'s Heart',
    description: 'Discover how to express and receive love in ways that truly resonate. Transform your relationship by understanding love languages deeply.',
    image: '/api/placeholder/400/200?text=Love+Languages',
    speaker: {
      name: 'Dr. Kavita Patel',
      credentials: 'Certified Love Languages Coach',
      image: '/api/placeholder/80/80',
      rating: 4.7,
      experience: 'Trained 500+ couples'
    },
    date: 'April 2, 2024',
    time: '7:30 PM IST',
    duration: '45 minutes',
    attendees: 120,
    maxAttendees: 180,
    price: 'Free',
    category: 'relationship',
    highlights: [
      'Identify your love language',
      'Partner compatibility mapping',
      'Practical daily applications',
      'Interactive exercises'
    ]
  },
  {
    id: '5',
    title: 'Arranged Marriages: Making Modern Connections Work',
    description: 'Navigate the modern arranged marriage process with confidence. Build genuine connections while honoring family traditions.',
    image: '/api/placeholder/400/200?text=Arranged+Marriage',
    speaker: {
      name: 'Mrs. Sunita Agarwal',
      credentials: 'Senior Matchmaker, Cultural Advisor',
      image: '/api/placeholder/80/80',
      rating: 4.8,
      experience: '30+ years in matchmaking'
    },
    date: 'April 5, 2024',
    time: '8:00 PM IST',
    duration: '85 minutes',
    attendees: 205,
    maxAttendees: 250,
    price: '₹399',
    category: 'marriage',
    highlights: [
      'Balancing family & personal choice',
      'Getting to know potential partners',
      'Modern courtship in traditional settings',
      'Success stories and case studies'
    ],
    isPopular: true
  },
  {
    id: '6',
    title: 'Long Distance Relationships: Staying Connected',
    description: 'Proven strategies for maintaining strong emotional bonds across distances. Perfect for couples separated by work, studies, or circumstances.',
    image: '/api/placeholder/400/200?text=Long+Distance',
    speaker: {
      name: 'Dr. Amit Kumar',
      credentials: 'Relationship Psychologist',
      image: '/api/placeholder/80/80',
      rating: 4.6,
      experience: 'LDR specialist, 12+ years'
    },
    date: 'April 8, 2024',
    time: '7:00 PM IST',
    duration: '70 minutes',
    attendees: 78,
    maxAttendees: 120,
    price: '₹249',
    category: 'relationship',
    highlights: [
      'Communication scheduling',
      'Trust building techniques',
      'Planning visits effectively',
      'Technology tools for connection'
    ]
  }
]

interface RegistrationForm {
  name: string
  email: string
  phone: string
  relationshipStatus: string
  interests: string
  marketingConsent: boolean
}

export default function Webinars() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [registrationModal, setRegistrationModal] = useState<string | null>(null)
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    name: '',
    email: '',
    phone: '',
    relationshipStatus: '',
    interests: '',
    marketingConsent: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<RegistrationForm>>({})

  const categories = [
    { id: 'all', label: 'All Webinars' },
    { id: 'couples', label: 'For Couples' },
    { id: 'marriage', label: 'Marriage' },
    { id: 'therapy', label: 'Therapy' },
    { id: 'relationship', label: 'Relationships' }
  ]

  const filteredWebinars = selectedCategory === 'all' 
    ? webinars 
    : webinars.filter(webinar => webinar.category === selectedCategory)

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationForm> = {}
    
    if (!registrationForm.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!registrationForm.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(registrationForm.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!registrationForm.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[+]?[1-9][\d\s\-()]{7,}$/.test(registrationForm.phone)) {
      newErrors.phone = 'Phone number is invalid'
    }
    
    if (!registrationForm.relationshipStatus) {
      newErrors.relationshipStatus = 'Please select your relationship status'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real implementation, this would be an API call
      console.log('Registration data:', {
        webinarId: registrationModal,
        ...registrationForm
      })
      
      // Show success message
      alert(`Registration successful! You'll receive a confirmation email at ${registrationForm.email}`)
      
      // Reset form and close modal
      setRegistrationForm({
        name: '',
        email: '',
        phone: '',
        relationshipStatus: '',
        interests: '',
        marketingConsent: false
      })
      closeModal()
    } catch (error) {
      alert('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleInputChange = (field: keyof RegistrationForm, value: string | boolean) => {
    setRegistrationForm(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleRegister = (webinarId: string) => {
    setRegistrationModal(webinarId)
    // Reset form when opening modal
    setRegistrationForm({
      name: '',
      email: '',
      phone: '',
      relationshipStatus: '',
      interests: '',
      marketingConsent: false
    })
    setErrors({})
  }

  const closeModal = () => {
    setRegistrationModal(null)
    setErrors({})
  }

  return (
    <>
      <Head>
        <title>Expert Webinars - Make My Knot | Relationship & Marriage Counseling</title>
        <meta name="description" content="Join expert-led webinars on relationships, marriage, and love. Learn from certified therapists and counselors. Free and paid sessions available." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center">
                <Heart className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Make My Knot</span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/#how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors">How It Works</Link>
                <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">Our Story</Link>
                <Link href="/login" className="btn-secondary text-sm">Sign In</Link>
                <Link href="/signup" className="btn-primary text-sm">Get Started</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-gold-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <Video className="h-12 w-12 text-primary-600 mr-4" />
              <span className="text-2xl font-semibold text-primary-600">Expert Webinars</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Learn from Relationship <span className="text-primary-600">Experts</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join certified therapists, marriage counselors, and relationship experts in live interactive sessions. 
              Build stronger connections, resolve conflicts, and create lasting love.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Live Q&A Sessions
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Expert Guidance
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Interactive Learning
              </div>
            </div>
          </div>
        </section>

        {/* Filter Categories */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Webinars Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {filteredWebinars.map((webinar) => (
                <div key={webinar.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {webinar.isPopular && (
                    <div className="bg-gold-600 text-white text-center py-2 text-sm font-medium">
                      🔥 Most Popular
                    </div>
                  )}
                  
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{webinar.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{webinar.description}</p>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-2xl font-bold text-primary-600">{webinar.price}</div>
                      </div>
                    </div>

                    {/* Speaker Info */}
                    <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
                      <img 
                        src={webinar.speaker.image} 
                        alt={webinar.speaker.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="font-semibold text-gray-900">{webinar.speaker.name}</h4>
                        <p className="text-sm text-gray-600">{webinar.speaker.credentials}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-700 ml-1">{webinar.speaker.rating}</span>
                          </div>
                          <span className="text-gray-400 mx-2">•</span>
                          <span className="text-sm text-gray-600">{webinar.speaker.experience}</span>
                        </div>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">{webinar.date}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">{webinar.time}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Video className="h-4 w-4 mr-2" />
                        <span className="text-sm">{webinar.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">{webinar.attendees}/{webinar.maxAttendees} registered</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">What you'll learn:</h4>
                      <ul className="space-y-2">
                        {webinar.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                            <span className="text-sm">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Registration Button */}
                    <button
                      onClick={() => handleRegister(webinar.id)}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center ${
                        webinar.attendees >= webinar.maxAttendees
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'btn-primary hover:bg-primary-700'
                      }`}
                      disabled={webinar.attendees >= webinar.maxAttendees}
                    >
                      {webinar.attendees >= webinar.maxAttendees ? (
                        'Fully Booked'
                      ) : (
                        <>
                          Register Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Relationship?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join our community of learners and start building stronger, more fulfilling relationships today.
            </p>
            <Link href="/signup" className="btn-gold text-lg px-8 py-4 inline-flex items-center">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Registration Modal */}
        {registrationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Register for Webinar</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {webinars.find(w => w.id === registrationModal)?.title}
                  </p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={registrationForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={registrationForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={registrationForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Relationship Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship Status *
                  </label>
                  <select
                    value={registrationForm.relationshipStatus}
                    onChange={(e) => handleInputChange('relationshipStatus', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.relationshipStatus ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your status</option>
                    <option value="single">Single</option>
                    <option value="dating">Dating</option>
                    <option value="engaged">Engaged</option>
                    <option value="married">Married</option>
                    <option value="separated">Separated</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                  {errors.relationshipStatus && (
                    <p className="text-red-500 text-xs mt-1">{errors.relationshipStatus}</p>
                  )}
                </div>

                {/* Interests/Goals */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What interests you most about this webinar?
                  </label>
                  <textarea
                    value={registrationForm.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Optional: Share what you hope to learn or achieve..."
                  />
                </div>

                {/* Marketing Consent */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="marketing-consent"
                    checked={registrationForm.marketingConsent}
                    onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="marketing-consent" className="text-sm text-gray-600">
                    I'd like to receive updates about future webinars and relationship resources from Make My Knot
                  </label>
                </div>

                {/* Webinar Details Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Webinar Details:</h4>
                  {(() => {
                    const webinar = webinars.find(w => w.id === registrationModal)
                    if (!webinar) return null
                    return (
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{webinar.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{webinar.time} ({webinar.duration})</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold">Price: {webinar.price}</span>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="flex-1 btn-secondary"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Registering...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
