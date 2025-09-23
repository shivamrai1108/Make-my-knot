import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { 
  Heart, 
  Clock, 
  Users, 
  Award, 
  ArrowRight, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  MessageCircle,
  User,
  FileText
} from 'lucide-react'
import Footer from '@/components/Footer'
import BrandLogo from '@/components/BrandLogo'
import ProfileCard from '@/components/ProfileCard'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  preferredContactMethod: 'email' | 'phone'
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  preferredContactMethod?: string
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContactMethod: 'email'
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Here you would normally send the data to your API
      // For now, we'll simulate the API call
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          source: 'contact-form'
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          preferredContactMethod: 'email'
        })
        formRef.current?.reset()
      } else {
        throw new Error('Failed to submit form')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof FormErrors]: undefined }))
    }
  }

  const handleContactClick = () => {
    // Scroll to contact form or focus first input
    const firstInput = formRef.current?.querySelector('input[name="name"]') as HTMLInputElement
    firstInput?.focus()
  }

  return (
    <>
      <Head>
        <title>Contact Us - Make My Knot | Get in Touch for Your Perfect Match</title>
        <meta 
          name="description" 
          content="From Handshakes to Pheras - Contact Make My Knot for personalized matchmaking services. Get in touch with our CEO Moulik Goyal and our expert team to find your perfect life partner." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              <Link href="/" className="flex items-center">
                <BrandLogo size="sm" className="mr-2" />
                <span className="text-xl font-bold text-gray-900">Make My Knot</span>
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 px-3 py-2 rounded-md font-semibold text-sm">Home</Link>
                <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 px-3 py-2 rounded-md font-semibold text-sm">About</Link>
                <Link href="/contact" className="text-primary-600 bg-primary-50 px-3 py-2 rounded-md font-semibold text-sm">Contact</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary-50 via-white to-gold-50">
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <MessageCircle className="h-12 w-12 text-primary-600 mr-4" />
              <span className="text-4xl font-bold text-primary-600">Get in Touch</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Contact <span className="text-primary-600">Make My Knot</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
              Ready to begin your journey to find your perfect life partner? Our expert team is here to help you 
              every step of the way. Reach out to us and let's start creating your beautiful love story together.
            </p>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-primary-200/50 shadow-lg">
              <p className="text-lg text-primary-700 font-medium italic">
                "Your happiness is our mission. Let's find your perfect match together."
              </p>
              <p className="text-sm text-gray-600 mt-2">- The Make My Knot Team</p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <p className="text-green-800 font-medium">
                        Thank you! Your message has been sent successfully. We'll get back to you soon.
                      </p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">
                      Sorry, there was an error sending your message. Please try again.
                    </p>
                  </div>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="inline h-4 w-4 mr-1" />
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                        errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a subject</option>
                      <option value="general-inquiry">General Inquiry</option>
                      <option value="matchmaking-services">Matchmaking Services</option>
                      <option value="premium-membership">Premium Membership</option>
                      <option value="profile-assistance">Profile Assistance</option>
                      <option value="technical-support">Technical Support</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="partnership">Business Partnership</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="text-red-600 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageCircle className="inline h-4 w-4 mr-1" />
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-vertical ${
                        errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && (
                      <p className="text-red-600 text-sm mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContactMethod"
                          value="email"
                          checked={formData.preferredContactMethod === 'email'}
                          onChange={(e) => handleInputChange('preferredContactMethod', e.target.value)}
                          className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContactMethod"
                          value="phone"
                          checked={formData.preferredContactMethod === 'phone'}
                          onChange={(e) => handleInputChange('preferredContactMethod', e.target.value)}
                          className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Phone</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-primary-600 hover:bg-primary-700 hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </div>
                    )}
                  </button>
                </form>
              </div>

              {/* Profile Card and Contact Info */}
              <div className="space-y-8">
                {/* CEO Profile Card */}
                <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900 rounded-2xl p-6 overflow-hidden">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Meet Our CEO</h3>
                    <p className="text-primary-200">
                      Connect directly with our founder and matchmaking expert
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <ProfileCard
                      name="Moulik Goyal"
                      title="CEO & Founder"
                      handle="moulikgoyal"
                      status="Available"
                      contactText="Contact Me"
                      avatarUrl="/images/maulik-goyal.jpg"
                      miniAvatarUrl="/images/maulik-goyal.jpg"
                      showUserInfo={true}
                      enableTilt={true}
                      enableMobileTilt={false}
                      behindGradient={undefined}
                      innerGradient={undefined}
                      onContactClick={handleContactClick}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-lg font-semibold text-gray-900">+91 98765 43210</p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-lg font-semibold text-gray-900">info@makemyknot.com</p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p className="text-lg font-semibold text-gray-900">New Delhi, India</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Business Hours</h4>
                    <div className="text-sm text-primary-800 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday: 10:00 AM - 5:00 PM</p>
                      <p>Sunday: 11:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}