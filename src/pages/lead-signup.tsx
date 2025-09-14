import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Heart, Lock, Eye, EyeOff, CheckCircle, Loader } from 'lucide-react'
import { useUser } from '@/lib/UserContext'
import Navigation from '@/components/Navigation'

export default function LeadSignup() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [leadData, setLeadData] = useState<any>(null)
  const { signup, login, isAuthenticated, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
      return
    }

    // Get lead data from localStorage (stored by assessment completion)
    try {
      const leadSignupData = localStorage.getItem('lead_signup_data')
      console.log('Checking for lead_signup_data in localStorage:', leadSignupData)
      
      if (leadSignupData) {
        const parsedData = JSON.parse(leadSignupData)
        console.log('Found lead signup data:', parsedData)
        
        // Check if data is recent (within last hour)
        const isRecent = parsedData.timestamp && (Date.now() - parsedData.timestamp) < 3600000
        
        if (isRecent && parsedData.name && parsedData.email && parsedData.phone) {
          setLeadData({
            id: parsedData.leadId,
            name: parsedData.name,
            email: parsedData.email,
            phone: parsedData.phone,
            assessmentCompleted: parsedData.assessmentCompleted
          })
          console.log('Lead data set from localStorage')
          return
        } else {
          console.log('Lead signup data is stale or incomplete, removing it')
          localStorage.removeItem('lead_signup_data')
        }
      }
      
      console.log('No valid lead signup data found, redirecting to regular signup')
      router.push('/signup')
    } catch (error) {
      console.error('Error loading lead signup data:', error)
      router.push('/signup')
    }
  }, [isAuthenticated, isLoading, router])

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters long'
        if (value.length > 128) return 'Password is too long (max 128 characters)'
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter'
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number'
        return ''
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== password) return 'Passwords do not match'
        return ''
      
      default:
        return ''
    }
  }

  const handleChange = (field: string, value: string) => {
    if (field === 'password') setPassword(value)
    if (field === 'confirmPassword') setConfirmPassword(value)
    
    // Clear general error when user starts typing
    if (error) setError('')
    
    // Real-time validation
    if (value.length > 0 || fieldErrors[field]) {
      const fieldError = validateField(field, value)
      setFieldErrors(prev => ({
        ...prev,
        [field]: fieldError
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Validate all fields
    const newFieldErrors: Record<string, string> = {}
    const passwordError = validateField('password', password)
    const confirmPasswordError = validateField('confirmPassword', confirmPassword)
    
    if (passwordError) newFieldErrors.password = passwordError
    if (confirmPasswordError) newFieldErrors.confirmPassword = confirmPasswordError

    // Check for any field errors
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors)
      setError('Please fix the errors above before submitting')
      setIsSubmitting(false)
      return
    }

    setFieldErrors({})

    try {
      // Get additional lead info from localStorage
      let fullLeadData = leadData
      if (leadData?.id) {
        try {
          const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
          const lead = leads.find((l: any) => l.id === leadData.id)
          if (lead) {
            fullLeadData = { ...leadData, ...lead }
          }
        } catch (error) {
          console.error('Error loading full lead data:', error)
        }
      }

      // Ensure questionnaire completion is transferred from lead to user
      try {
        const questionnaireData = JSON.parse(localStorage.getItem('questionnaire_responses') || '[]')
        const leadQuestionnaire = questionnaireData.find((q: any) => q.leadId === fullLeadData.id)
        
        if (leadQuestionnaire) {
          console.log('Found lead questionnaire, preparing transfer:', leadQuestionnaire.id)
          // Update questionnaire to point to user email for later linking
          leadQuestionnaire.userEmail = fullLeadData.email
          leadQuestionnaire.userName = fullLeadData.name
          leadQuestionnaire.userPhone = fullLeadData.phone
          leadQuestionnaire.userType = 'user'
          localStorage.setItem('questionnaire_responses', JSON.stringify(questionnaireData))
        } else {
          console.log('No questionnaire found for lead:', fullLeadData.id)
        }
      } catch (error) {
        console.error('Error preparing questionnaire transfer:', error)
      }

      // Create user account with lead data
      const success = await signup({
        name: fullLeadData.name,
        email: fullLeadData.email,
        phone: fullLeadData.phone,
        password: password,
        // Add additional profile data from lead questionnaire
        age: 25, // Default age, can be updated later
        location: fullLeadData.answers?.location || '',
        values: getValuesFromAnswers(fullLeadData.answers || {}),
        partnerPreferences: getPartnerPreferencesFromAnswers(fullLeadData.answers || {}),
        // Mark questionnaire as complete since lead already completed it
        questionnaireComplete: true
      })
      
      if (success) {
        // Account created successfully, now log them in
        const loginSuccess = await login(fullLeadData.email, password)
        
        if (loginSuccess) {
          // Mark lead as converted to prevent re-processing
          try {
            const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
            const updatedLeads = leads.map((l: any) => 
              l.id === fullLeadData.id ? { ...l, status: 'converted', convertedAt: new Date().toISOString() } : l
            )
            localStorage.setItem('makemyknot_leads', JSON.stringify(updatedLeads))
            sessionStorage.removeItem('leadId')
            
            // Clean up lead signup data
            localStorage.removeItem('lead_signup_data')
            console.log('Lead signup data cleaned up after successful account creation')
          } catch (error) {
            console.error('Error updating lead status:', error)
          }

          // Redirect to onboarding to complete profile
          router.push('/onboarding')
        } else {
          setError('Account created but login failed. Please try logging in manually.')
        }
      } else {
        setError('An account with this email may already exist. Try logging in instead.')
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper functions to extract user preferences from lead answers
  const getValuesFromAnswers = (answers: Record<string, any>): string => {
    const values = []
    if (answers.relationship_type === 'Serious') values.push('Commitment-focused')
    if (answers.relationship_type === 'Casual') values.push('Flexible approach')
    if (answers.online_dating_experience === "I'm new to it") values.push('Traditional values')
    return values.join(', ') || 'Open to different values'
  }

  const getPartnerPreferencesFromAnswers = (answers: Record<string, any>): string => {
    const prefs = []
    if (answers.looking_for) prefs.push(`Looking for ${answers.looking_for}`)
    if (answers.relationship_type) prefs.push(`Interested in ${answers.relationship_type.toLowerCase()} relationships`)
    if (answers.location) prefs.push(`Preferably in ${answers.location} area`)
    return prefs.join('. ') || 'Open to meeting compatible partners'
  }

  if (isLoading || !leadData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Complete Your Account - Make My Knot</title>
        <meta name="description" content="Complete your account setup and start finding your perfect match." />
      </Head>

      <Navigation variant="white" />
      
      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-gold-500 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Almost Done, {leadData.name.split(' ')[0]}! 🎉</h1>
            <p className="text-gray-600">
              Your assessment is complete! Just set a password to secure your account and start discovering your matches.
            </p>
            
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">Assessment Completed Successfully! ✨</span>
              </div>
              <p className="text-xs text-green-700">
                Your information has been pre-filled. Just add a password to create your account and unlock your matches!
              </p>
            </div>
          </div>

          {/* Account Setup Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Secure Your Account</h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Your Pre-filled Information:</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div><span className="font-medium">Name:</span> {leadData.name}</div>
                  <div><span className="font-medium">Email:</span> {leadData.email}</div>
                  <div><span className="font-medium">Phone:</span> {leadData.phone}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                All set! Just create a password to complete your account setup.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Create Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handleChange('password', e.target.value)}
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
                {!fieldErrors.password && password && (
                  <div className="mt-1 text-xs text-gray-500">
                    <p>Password must contain:</p>
                    <ul className="list-disc list-inside ml-2 space-y-0.5">
                      <li className={password.length >= 6 ? 'text-green-600' : 'text-gray-500'}>
                        At least 6 characters
                      </li>
                      <li className={/(?=.*[a-z])/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                        One lowercase letter
                      </li>
                      <li className={/(?=.*\d)/.test(password) ? 'text-green-600' : 'text-gray-500'}>
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
                    value={confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary-600 to-gold-500 text-white py-3 px-4 rounded-lg hover:from-primary-700 hover:to-gold-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin mr-2 inline" />
                    Creating Your Account...
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 mr-2 inline" />
                    Complete Setup & Find Matches
                  </>
                )}
              </button>
            </form>

            {/* Features Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">What's next?</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  View your personalized compatibility matches
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Start meaningful conversations with compatible people
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Access exclusive relationship resources and webinars
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
