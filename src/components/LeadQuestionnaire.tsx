import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { saveLead, Lead } from '@/lib/leadStore'
import { getQuestionnaireResponseByLead } from '@/lib/questionnaireStore'
import { Heart, ArrowRight, CheckCircle, Calendar, Upload, X, Lock } from 'lucide-react'

interface Props {
  onSubmitted?: () => void
}

// Country codes for phone numbers
const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
]

const steps = [
  { id: 'matchmaking_experience', question: 'Have you used matchmaking platforms or matrimonial services before?', type: 'choice', options: ['Yes', 'No'] },
  { id: 'gender_identity', question: 'Which gender(s) best describe you?', type: 'choice', options: ['Man', 'Woman', 'Non-binary', 'Prefer not to say'] },
  { id: 'open_to_meeting', question: 'Who are you open to meeting?', type: 'choice', options: ['Men', 'Women', 'Non-binary', 'All genders'] },
  { id: 'preferred_age_range', question: 'What is your preferred age range for a partner?', type: 'input', placeholder: 'e.g., 25-35' },
  { id: 'current_location', question: 'Where do you currently live?', type: 'input', placeholder: 'City, State/Country' },
]

export default function LeadQuestionnaire({ onSubmitted }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [contact, setContact] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    dateOfBirth: '',
    password: '',
    countryCode: '+91' // Default to India
  })
  const [biodataFile, setBiodataFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [leadId, setLeadId] = useState<string>('')

  // Check if already submitted to prevent double submissions
  useEffect(() => {
    const checkSubmissionState = async () => {
      const alreadySubmitted = sessionStorage.getItem('leadSubmitted')
      const storedLeadId = sessionStorage.getItem('leadId')
      
      console.log('LeadQuestionnaire useEffect - Checking submission state:', {
        alreadySubmitted,
        storedLeadId
      })
      
      // Enhanced check - look for assessment completion in multiple places
      if (storedLeadId) {
        // Check if assessment was already completed for this lead
        const assessmentCompleted = sessionStorage.getItem(`assessment_completed_${storedLeadId}`)
        
        // Also check localStorage for completed questionnaire responses
        let hasCompletedAssessment = assessmentCompleted === 'true'
        
        if (!hasCompletedAssessment) {
          try {
            // Use helper function for more reliable check
            const leadAssessment = await getQuestionnaireResponseByLead(storedLeadId)
            hasCompletedAssessment = leadAssessment?.isComplete === true
            
            if (hasCompletedAssessment) {
              // Update session storage for faster future checks
              sessionStorage.setItem(`assessment_completed_${storedLeadId}`, 'true')
              console.log('🎯 Found completed assessment in MongoDB for lead:', storedLeadId)
            }
          } catch (error) {
            console.error('Error checking questionnaire responses:', error)
          }
        }
        
        console.log('Enhanced completion check:', {
          leadId: storedLeadId,
          sessionFlag: assessmentCompleted === 'true',
          hasCompletedAssessment,
          alreadySubmitted
        })
        
        if (hasCompletedAssessment) {
          // Assessment is completed - lead data remains in CRM permanently
          console.log('✅ Assessment already completed for lead:', storedLeadId, '- Showing fresh questionnaire')
          // DO NOT show countdown screen - user has completed everything
          return // Don't show the countdown screen - stay on normal home page
        }
        
        // Only show countdown if lead was submitted but assessment not completed
        if (alreadySubmitted && !hasCompletedAssessment) {
          console.log('⏳ Lead submitted but assessment not completed - showing countdown screen')
          setSubmitted(true)
          setLeadId(storedLeadId)
        } else if (alreadySubmitted && hasCompletedAssessment) {
          console.log('🎯 Both lead and assessment completed - no countdown needed')
        }
      } else {
        console.log('🆕 No existing lead found, showing fresh questionnaire')
      }
    }
    
    checkSubmissionState()
  }, [])

  // Countdown timer for success screen
  useEffect(() => {
    if (submitted && leadId) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            redirectToAssessment()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [submitted, leadId])

  // Redirect function
  const redirectToAssessment = () => {
    if (!leadId) return
    
    const assessmentUrl = `/assessment?leadId=${leadId}&source=lead`
    console.log('Redirecting to:', assessmentUrl)
    
    // Try Next.js router first
    try {
      router.push(assessmentUrl)
    } catch (error) {
      console.error('Router push failed, using window.location:', error)
      // Fallback to window.location
      window.location.href = assessmentUrl
    }
  }

  const current = steps[step]

  const handleSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [current.id]: value }))
    // Auto-advance to next step with a slight delay for better UX
    setTimeout(() => {
      if (step < steps.length) setStep(step + 1)
    }, 200)
  }

  // Validate age range format (e.g., "25-35")
  const validateAgeRange = (range: string) => {
    if (!range || range.trim() === '') return false
    // Match format: two digits, hyphen, two digits (e.g., "25-35")
    return /^\d{2}-\d{2}$/.test(range.trim())
  }

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleNextFromInput = () => {
    const value = answers[current.id]?.trim()
    if (!value) return
    
    // Special validation for age range
    if (current.id === 'preferred_age_range' && !validateAgeRange(value)) {
      alert('Please enter age range in format "25-35" (two digits, hyphen, two digits)')
      return
    }
    
    if (step < steps.length) {
      setStep(step + 1)
    }
  }

  // Phone validation - only digits, exactly 10 digits
  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '')
    return digits.length === 10
  }

  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '')
    return digits.slice(0, 10) // Limit to 10 digits
  }

  // Date validation - must be 18+ years old
  const validateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return false
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18
    }
    return age >= 18
  }

  // Password validation - minimum length requirement
  const validatePassword = (password: string) => {
    if (!password) return false
    // Require at least 8 characters
    return password.length >= 8
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return 'Very Weak'
      case 2:
        return 'Weak'
      case 3:
        return 'Fair'
      case 4:
        return 'Good'
      case 5:
        return 'Strong'
      default:
        return ''
    }
  }

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return 'text-red-400'
      case 2:
        return 'text-orange-400'
      case 3:
        return 'text-yellow-400'
      case 4:
        return 'text-blue-400'
      case 5:
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  // File validation for biodata
  const validateBiodataFile = (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload only PDF or JPEG files'
    }
    
    if (file.size > maxSize) {
      return 'File size must be less than 5MB'
    }
    
    return null
  }

  const handleBiodataUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validationError = validateBiodataFile(file)
      if (validationError) {
        setUploadError(validationError)
        setBiodataFile(null)
      } else {
        setUploadError('')
        setBiodataFile(file)
      }
    }
  }

  const removeBiodataFile = () => {
    setBiodataFile(null)
    setUploadError('')
  }

  const canSubmitContact = contact.name && contact.email && validateEmail(contact.email) && validatePhone(contact.phone) && validateAge(contact.dateOfBirth) && validatePassword(contact.password)

  const handleSubmitLead = async () => {
    console.log('🔍 FORM DEBUG: handleSubmitLead called');
    console.log('🔍 FORM DEBUG: canSubmitContact:', canSubmitContact);
    console.log('🔍 FORM DEBUG: isProcessing:', isProcessing);
    console.log('🔍 FORM DEBUG: API URL from env:', process.env.NEXT_PUBLIC_API_URL);
    console.log('🔍 FORM DEBUG: Contact data:', contact);
    console.log('🔍 FORM DEBUG: Answers data:', answers);
    
    if (!canSubmitContact || isProcessing) {
      console.log('❌ FORM DEBUG: Submission blocked - validation failed or already processing');
      
      // Show specific validation errors
      if (!contact.name) alert('Please enter your full name')
      else if (!validateEmail(contact.email)) alert('Please enter a valid email address')
      else if (!validatePhone(contact.phone)) alert('Please enter a valid 10-digit phone number')
      else if (!validateAge(contact.dateOfBirth)) alert('You must be at least 18 years old')
      else if (!validatePassword(contact.password)) alert('Password must be at least 8 characters long')
      
      return;
    }
    
    // Validate age range if provided
    if (answers.preferred_age_range && !validateAgeRange(answers.preferred_age_range)) {
      alert('Please enter age range in correct format (e.g., "25-35")');
      setIsProcessing(false);
      return;
    }
    
    setIsProcessing(true)
    const leadId = Date.now().toString()
    console.log('🔍 FORM DEBUG: Generated leadId:', leadId);
    
    // Include additional profile data in answers
    const enhancedAnswers = {
      ...answers,
      dateOfBirth: contact.dateOfBirth,
      countryCode: contact.countryCode,
      fullPhoneNumber: contact.countryCode + contact.phone,
      biodataFileName: biodataFile?.name || null,
      hasBiodata: !!biodataFile,
      hasPassword: true // Password will be saved separately for security
    }
    
    const lead: Lead = {
      id: leadId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: contact.name,
      email: contact.email,
      phone: contact.phone, // Store just the phone number
      password: contact.password, // Store password for account creation
      dateOfBirth: contact.dateOfBirth, // Set as direct field
      countryCode: contact.countryCode, // Set as direct field
      answers: enhancedAnswers,
      status: 'new',
      biodataFile: biodataFile // Store file for admin access
    }
    
    console.log('🔍 FORM DEBUG: Lead object created:', lead);
    
    try {
      console.log('📦 FORM DEBUG: About to call saveLead with:', lead);
      // Use local-first saving approach - this will save to localStorage immediately
      const savedLead = await saveLead(lead)
      console.log('✅ FORM DEBUG: Lead saved successfully:', savedLead);
      
      sessionStorage.setItem('leadSubmitted', 'true')
      sessionStorage.setItem('leadId', leadId)
      
      setSubmitted(true)
      setLeadId(leadId)
      onSubmitted?.()
      
    } catch (error) {
      console.error('Error saving lead locally:', error)
      // Even if there's an error, we'll still proceed since local saving should work
      // The background sync will handle database saving
      sessionStorage.setItem('leadSubmitted', 'true')
      sessionStorage.setItem('leadId', leadId)
      
      setSubmitted(true)
      setLeadId(leadId)
      onSubmitted?.()
    }
  }

  if (submitted) {
    return (
      <div className="backdrop-blur-md bg-white/90 border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Great start! 🎉</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6">Thanks {contact.name.split(' ')[0]}! Ready for your comprehensive assessment?</p>
        
        <div className="bg-primary-50 rounded-lg p-4 mb-6">
          <p className="text-primary-800 text-xs sm:text-sm mb-2">Starting assessment in...</p>
          <div className="text-2xl sm:text-3xl font-bold text-primary-600">{countdown}</div>
        </div>
        
        <button
          onClick={redirectToAssessment}
          className="w-full bg-gradient-to-r from-primary-600 to-gold-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-primary-700 hover:to-gold-600 transition-all duration-200 font-semibold mb-4 text-sm sm:text-base"
        >
          Continue Now
          <ArrowRight className="h-5 w-5 ml-2 inline" />
        </button>
        
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          <span className="text-xs text-gray-500">Your information has been saved</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 mb-12">
      {step < steps.length ? (
        <div>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-6 drop-shadow-lg">{current.question}</p>

          {current.type === 'choice' && (
            <div className="space-y-3">
              {current.options?.map((opt, index) => (
                <label 
                  key={opt} 
                  className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/20 hover:border-white/40"
                >
                  <input
                    type="radio"
                    name={current.id}
                    value={opt}
                    checked={answers[current.id] === opt}
                    onChange={() => handleSelect(opt)}
                    className="w-5 h-5 text-white border-white/30 focus:ring-white/50 bg-transparent"
                  />
                  <span className="ml-3 text-white font-medium text-sm sm:text-base">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {current.type === 'input' && (
            <div className="space-y-3">
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder={current.placeholder}
                value={answers[current.id] || ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, [current.id]: e.target.value }))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleNextFromInput()
                  }
                }}
              />
              {current.id === 'preferred_age_range' && answers[current.id] && !validateAgeRange(answers[current.id]) && (
                <p className="text-red-300 text-sm">Please enter age range in format "25-35"</p>
              )}
              <button 
                onClick={handleNextFromInput} 
                disabled={!answers[current.id] || answers[current.id].trim() === ''}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  answers[current.id] && answers[current.id].trim() !== ''
                    ? 'bg-gradient-to-r from-primary-600 to-gold-500 text-white hover:from-primary-700 hover:to-gold-600 transform hover:scale-105 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next <ArrowRight className="h-4 w-4 ml-2 inline" />
              </button>
            </div>
          )}

          <div className="text-xs sm:text-sm text-white/70 mt-3">Step {step+1} of {steps.length+1}</div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/20 mb-6 sm:mb-8 max-w-2xl mx-auto overflow-hidden">
          <p className="text-base sm:text-lg md:text-xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">Almost there! How can we reach you?</p>
          
          {/* Name and Email - Stack on mobile for better spacing */}
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
            <div className="min-w-0"> {/* Prevent flex item overflow */}
              <label className="block text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2">Full Name *</label>
              <input
                className="w-full px-2 sm:px-3 py-2 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 text-sm min-w-0"
                placeholder="Enter your full name"
                value={contact.name}
                onChange={(e)=>setContact({...contact, name: e.target.value})}
              />
            </div>
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2">Email Address *</label>
              <input
                className={`w-full px-2 sm:px-3 py-2 bg-white/20 border rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 text-sm min-w-0 ${
                  contact.email && !validateEmail(contact.email) 
                    ? 'border-red-400 focus:border-red-400' 
                    : 'border-white/30'
                }`}
                placeholder="Enter your email"
                type="email"
                value={contact.email}
                onChange={(e)=>setContact({...contact, email: e.target.value})}
              />
              {contact.email && !validateEmail(contact.email) && (
                <p className="text-red-300 text-xs mt-1">Please enter a valid email address</p>
              )}
            </div>
          </div>

          {/* Password and Phone Number - Stack on mobile */}
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
            {/* Password Field */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Create Password *
              </label>
              <input
                className={`w-full px-2 sm:px-3 py-2 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 text-sm min-w-0 ${
                  contact.password && !validatePassword(contact.password) ? 'border-red-300 bg-red-50/20' : ''
                }`}
                placeholder="Create a secure password"
                type="password"
                value={contact.password}
                onChange={(e) => setContact({...contact, password: e.target.value})}
              />
              {contact.password && (
                <div className="mt-1 sm:mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Password strength:</span>
                    <span className={`text-xs font-medium ${getPasswordStrengthColor(getPasswordStrength(contact.password))}`}>
                      {getPasswordStrengthText(getPasswordStrength(contact.password))}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2 mt-1">
                    <div 
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                        getPasswordStrength(contact.password) <= 1 ? 'bg-red-400' :
                        getPasswordStrength(contact.password) === 2 ? 'bg-orange-400' :
                        getPasswordStrength(contact.password) === 3 ? 'bg-yellow-400' :
                        getPasswordStrength(contact.password) === 4 ? 'bg-blue-400' : 'bg-green-400'
                      }`}
                      style={{ width: `${(getPasswordStrength(contact.password) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {contact.password && !validatePassword(contact.password) && (
                <p className="text-red-400 text-xs mt-1">
                  Password must be at least 8 characters long
                </p>
              )}
            </div>
            
            {/* Phone Number */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2">Phone Number *</label>
              <div className="flex min-w-0">
                <select
                  className="px-1 sm:px-2 py-2 bg-white/20 border border-white/30 rounded-l-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white text-xs flex-shrink-0 max-w-[90px] sm:max-w-none"
                  value={contact.countryCode}
                  onChange={(e) => setContact({...contact, countryCode: e.target.value})}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code} className="text-gray-900">
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <input
                  className={`flex-1 px-2 sm:px-3 py-2 bg-white/20 border border-l-0 border-white/30 rounded-r-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 text-sm min-w-0 ${
                    contact.phone && !validatePhone(contact.phone) ? 'border-red-300 bg-red-50/20' : ''
                  }`}
                  placeholder="10-digit number"
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value)
                    setContact({...contact, phone: formatted})
                  }}
                  maxLength={10}
                />
              </div>
              {contact.phone && !validatePhone(contact.phone) && (
                <p className="text-red-400 text-xs mt-1">Please enter exactly 10 digits</p>
              )}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              Date of Birth *
            </label>
            <input
              className={`w-full px-2 sm:px-3 py-2 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 text-sm min-w-0 ${
                contact.dateOfBirth && !validateAge(contact.dateOfBirth) ? 'border-red-300 bg-red-50/20' : ''
              }`}
              type="date"
              value={contact.dateOfBirth}
              onChange={(e) => setContact({...contact, dateOfBirth: e.target.value})}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
            />
            {contact.dateOfBirth && !validateAge(contact.dateOfBirth) && (
              <p className="text-red-400 text-xs mt-1">You must be at least 18 years old</p>
            )}
          </div>

          {/* Optional Biodata Upload */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2">
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              Upload Biodata (Optional)
            </label>
            <p className="text-xs text-white/70 mb-2 sm:mb-3">
              Upload your biodata in PDF or JPEG format (max 5MB) to help us serve you better
            </p>
            
            {!biodataFile ? (
              <div className="relative min-w-0">
                <input
                  type="file"
                  accept=".pdf,.jpeg,.jpg"
                  onChange={handleBiodataUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="biodata-upload"
                />
                <div className="border-2 border-dashed border-white/30 rounded-lg p-2 sm:p-3 text-center hover:border-white/50 hover:bg-white/10 transition-colors">
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-white/70 mx-auto mb-1" />
                  <p className="text-xs text-white/80 mb-0.5">Click to upload biodata</p>
                  <p className="text-xs text-white/60">PDF or JPEG files only</p>
                </div>
              </div>
            ) : (
              <div className="border border-white/30 bg-white/10 rounded-lg p-3 flex items-center justify-between min-w-0">
                <div className="flex items-center min-w-0 flex-1">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-2 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-white truncate">{biodataFile.name}</p>
                    <p className="text-xs text-white/70">{(biodataFile.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeBiodataFile}
                  className="text-white/60 hover:text-white/90 transition-colors flex-shrink-0 ml-2"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            )}
            
            {uploadError && (
              <p className="text-red-400 text-xs mt-1 sm:mt-2">{uploadError}</p>
            )}
          </div>

          <button 
            disabled={!canSubmitContact || isProcessing} 
            onClick={handleSubmitLead} 
            className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base min-w-0 ${
              canSubmitContact && !isProcessing
                ? 'bg-gradient-to-r from-primary-600 to-gold-500 text-white hover:from-primary-700 hover:to-gold-600 transform hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                <span className="text-sm sm:text-base">Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="text-sm sm:text-base">Get My Perfect Matches</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </div>
            )}
          </button>
          
          <div className="text-xs text-white/70 mt-3 sm:mt-4 text-center px-2">
            We&apos;ll contact you with curated matches. No spam, promise! 🤝
          </div>
          <div className="text-xs sm:text-sm text-white/70 mt-1 sm:mt-2 text-center">
            Step {steps.length+1} of {steps.length+1}
          </div>
        </div>
      )}
    </div>
  )
}

