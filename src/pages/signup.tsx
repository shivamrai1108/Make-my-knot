import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Heart, Mail, Lock, Eye, EyeOff, User, Phone, Loader } from 'lucide-react'
import { useUser } from '@/lib/UserContext'
import Navigation from '@/components/Navigation'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const { signup, isAuthenticated, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  // Pre-fill form data from URL query parameters
  useEffect(() => {
    if (router.isReady) {
      const { name, email, phone, fromAssessment } = router.query
      
      if (name || email || phone) {
        setFormData(prev => ({
          ...prev,
          name: (name as string) || prev.name,
          email: (email as string) || prev.email,
          phone: (phone as string) || prev.phone
        }))
        
        // Show success message for pre-filled data
        if (fromAssessment === 'true') {
          setShowSuccessToast(true)
          setTimeout(() => setShowSuccessToast(false), 5000) // Hide after 5 seconds
        }
      }
    }
  }, [router.isReady, router.query])

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        if (!value) return 'Name is required'
        if (value.length < 2) return 'Name must be at least 2 characters'
        if (value.length > 100) return 'Name is too long (max 100 characters)'
        if (!/^[a-zA-Z\s'.-]+$/.test(value)) return 'Name can only contain letters, spaces, apostrophes, periods, and hyphens'
        return ''
      
      case 'email':
        if (!value) return 'Email is required'
        if (value.length > 254) return 'Email address is too long'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address (e.g., john@example.com)'
        return ''
      
      case 'phone':
        if (!value) return 'Phone number is required'
        const cleanPhone = value.replace(/[\s\-\(\)\.]/g, '')
        if (cleanPhone.length < 10) return 'Phone number must be at least 10 digits'
        if (cleanPhone.length > 15) return 'Phone number is too long'
        const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/
        if (!phoneRegex.test(cleanPhone)) return 'Please enter a valid phone number (e.g., +1 555-123-4567)'
        return ''
      
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters long'
        if (value.length > 128) return 'Password is too long (max 128 characters)'
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter'
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number'
        return ''
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== formData.password) return 'Passwords do not match'
        return ''
      
      default:
        return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear general error when user starts typing
    if (error) {
      setError('')
    }
    
    // Real-time validation for better UX (only show errors after user has started typing)
    if (value.length > 0 || fieldErrors[name]) {
      const fieldError = validateField(name, value)
      setFieldErrors(prev => ({
        ...prev,
        [name]: fieldError
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Validate all fields
    const newFieldErrors: {[key: string]: string} = {}
    Object.keys(formData).forEach(field => {
      const fieldError = validateField(field, (formData as any)[field])
      if (fieldError) {
        newFieldErrors[field] = fieldError
      }
    })

    // Check for any field errors
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors)
      setError('Please fix the errors above before submitting')
      setIsSubmitting(false)
      return
    }

    setFieldErrors({})

    try {
      const success = await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
      
      if (success) {
        // Check if user came from assessment completion to avoid duplicate questionnaire
        const { fromAssessment } = router.query
        if (fromAssessment === 'true') {
          // User already completed assessment as lead, go straight to dashboard
          router.push('/dashboard')
        } else {
          // Regular signup, redirect to questionnaire
          router.push('/questionnaire?source=registration')
        }
      } else {
        setError('An account with this email already exists')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Sign Up - Make My Knot</title>
        <meta name="description" content="From Handshakes to Pheras - Join Make My Knot to find your perfect life partner through our trusted matchmaking service." />
      </Head>

      <Navigation variant="white" />
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-slide-in-from-right">
          <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
          <span className="text-sm font-medium">Assessment completed! Information pre-filled ✨</span>
          <button 
            onClick={() => setShowSuccessToast(false)}
            className="ml-3 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}
      
      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Join Make My Knot</h1>
            <p className="text-gray-600">
              {router.query.name ? 
                `Hi ${router.query.name}! Complete your registration to unlock your matches` :
                'Start your journey to finding your perfect life partner'
              }
            </p>
            {router.query.fromAssessment && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">Assessment Completed Successfully! ✨</span>
                </div>
                <p className="text-xs text-green-700">
                  Your information has been pre-filled. Just add a password to create your account and unlock your matches!
                </p>
              </div>
            )}
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors ${
                      fieldErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Your full name"
                    required
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors ${
                      fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors ${
                      fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors ${
                      fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Create a strong password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                  )}
                  {!fieldErrors.password && formData.password && (
                    <div className="mt-1 text-xs text-gray-500">
                      <p>Password must contain:</p>
                      <ul className="list-disc list-inside ml-2 space-y-0.5">
                        <li className={formData.password.length >= 6 ? 'text-green-600' : 'text-gray-500'}>
                          At least 6 characters
                        </li>
                        <li className={/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                          One lowercase letter
                        </li>
                        <li className={/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                          One number
                        </li>
                      </ul>
                    </div>
                  )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors ${
                      fieldErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-600 border-gray-300 rounded mt-1"
                  required
                />
                <label className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-500 font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
