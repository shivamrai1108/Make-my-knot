import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { saveLead, Lead } from '@/lib/leadStore'
import { Heart, ArrowRight, CheckCircle, Calendar, Upload, X } from 'lucide-react'

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
  { id: 'online_dating_experience', question: 'Have you tried online dating before?', type: 'choice', options: ["I'm new to it", 'Once or twice', "I'm an online dating pro"] },
  { id: 'relationship_type', question: 'What kind of relationship are you looking for?', type: 'choice', options: ['Casual', 'Serious', 'Not sure, just browsing'] },
  { id: 'iam', question: 'I am', type: 'choice', options: ['a woman', 'a man', 'nonbinary'] },
  { id: 'looking_for', question: 'I am looking for', type: 'choice', options: ['a woman', 'a man', 'nonbinary', 'people'] },
  { id: 'location', question: 'Where do you live?', type: 'input', placeholder: 'City, State/Country' },
  { id: 'age_range', question: 'What age range are you interested in?', type: 'choice', options: ['18-25', '26-30', '31-35', '36-40', '41-50', '50+'] },
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
    const alreadySubmitted = sessionStorage.getItem('leadSubmitted')
    const storedLeadId = sessionStorage.getItem('leadId')
    
    // Check if assessment was already completed for this lead
    if (alreadySubmitted && storedLeadId) {
      const assessmentCompleted = sessionStorage.getItem(`assessment_completed_${storedLeadId}`)
      
      if (assessmentCompleted === 'true') {
        // Assessment is completed, clear the lead submission state to allow fresh start
        console.log('Assessment already completed, clearing lead submission state')
        sessionStorage.removeItem('leadSubmitted')
        sessionStorage.removeItem('leadId')
        return // Don't show the countdown screen
      }
      
      // Assessment not completed yet, show countdown
      setSubmitted(true)
      setLeadId(storedLeadId)
    }
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

  const handleNextFromInput = () => {
    if (!answers[current.id] || answers[current.id].trim() === '') return
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

  const canSubmitContact = contact.name && contact.email && validatePhone(contact.phone) && validateAge(contact.dateOfBirth)

  const handleSubmitLead = async () => {
    if (!canSubmitContact || isProcessing) return
    
    setIsProcessing(true)
    const leadId = Date.now().toString()
    
    // Include additional profile data in answers
    const enhancedAnswers = {
      ...answers,
      dateOfBirth: contact.dateOfBirth,
      countryCode: contact.countryCode,
      fullPhoneNumber: contact.countryCode + contact.phone,
      biodataFileName: biodataFile?.name || null,
      hasBiodata: !!biodataFile
    }
    
    const lead: Lead = {
      id: leadId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: contact.name,
      email: contact.email,
      phone: contact.countryCode + contact.phone, // Store full international phone number
      answers: enhancedAnswers,
      status: 'new',
      biodataFile: biodataFile // Store file for admin access
    }
    
    try {
      // Properly await the saveLead function
      const savedLead = await saveLead(lead)
      console.log('Lead saved successfully:', savedLead)
      
      sessionStorage.setItem('leadSubmitted', 'true')
      sessionStorage.setItem('leadId', leadId)
      
      setSubmitted(true)
      setLeadId(leadId)
      onSubmitted?.()
      
    } catch (error) {
      console.error('Error saving lead:', error)
      setIsProcessing(false)
      // Show error message to user
      alert('Error saving your information. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="backdrop-blur-md bg-white/90 border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Great start! 🎉</h3>
        <p className="text-gray-600 mb-6">Thanks {contact.name.split(' ')[0]}! Ready for your comprehensive assessment?</p>
        
        <div className="bg-primary-50 rounded-lg p-4 mb-6">
          <p className="text-primary-800 text-sm mb-2">Starting assessment in...</p>
          <div className="text-3xl font-bold text-primary-600">{countdown}</div>
        </div>
        
        <button
          onClick={redirectToAssessment}
          className="w-full bg-gradient-to-r from-primary-600 to-gold-500 text-white py-3 px-6 rounded-lg hover:from-primary-700 hover:to-gold-600 transition-all duration-200 font-semibold mb-4"
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
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg">
          Have you tried online dating before?
        </h3>

      {step < steps.length ? (
        <div>
          <p className="text-2xl md:text-3xl font-bold text-white mb-6 drop-shadow-lg">{current.question}</p>

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
                  <span className="ml-3 text-white font-medium text-lg">{opt}</span>
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

          <div className="text-sm text-white/70 mt-3">Step {step+1} of {steps.length+1}</div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <p className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Almost there! How can we reach you?</p>
          
          {/* Name and Email */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70"
                placeholder="Full name *"
                value={contact.name}
                onChange={(e)=>setContact({...contact, name: e.target.value})}
              />
            </div>
            <div>
              <input
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70"
                placeholder="Email address *"
                type="email"
                value={contact.email}
                onChange={(e)=>setContact({...contact, email: e.target.value})}
              />
            </div>
          </div>

          {/* Phone Number with Country Code */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/90 mb-2">Phone Number *</label>
            <div className="flex">
              <select
                className="px-3 py-3 bg-white/20 border border-white/30 rounded-l-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white"
                value={contact.countryCode}
                onChange={(e) => setContact({...contact, countryCode: e.target.value})}
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.code} {country.country}
                  </option>
                ))}
              </select>
              <input
                className={`flex-1 px-4 py-3 border border-l-0 rounded-r-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent ${
                  contact.phone && !validatePhone(contact.phone) ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="10-digit phone number"
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
              <p className="text-red-500 text-xs mt-1">Please enter exactly 10 digits</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date of Birth *
            </label>
            <input
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent ${
                contact.dateOfBirth && !validateAge(contact.dateOfBirth) ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              type="date"
              value={contact.dateOfBirth}
              onChange={(e) => setContact({...contact, dateOfBirth: e.target.value})}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
            />
            {contact.dateOfBirth && !validateAge(contact.dateOfBirth) && (
              <p className="text-red-500 text-xs mt-1">You must be at least 18 years old</p>
            )}
          </div>

          {/* Optional Biodata Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="w-4 h-4 inline mr-1" />
              Upload Biodata (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Upload your biodata in PDF or JPEG format (max 5MB) to help us serve you better
            </p>
            
            {!biodataFile ? (
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpeg,.jpg"
                  onChange={handleBiodataUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="biodata-upload"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 hover:bg-primary-50 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Click to upload biodata</p>
                  <p className="text-xs text-gray-500">PDF or JPEG files only</p>
                </div>
              </div>
            ) : (
              <div className="border border-primary-200 bg-primary-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{biodataFile.name}</p>
                    <p className="text-xs text-gray-500">{(biodataFile.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeBiodataFile}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            
            {uploadError && (
              <p className="text-red-500 text-xs mt-2">{uploadError}</p>
            )}
          </div>

          <button 
            disabled={!canSubmitContact || isProcessing} 
            onClick={handleSubmitLead} 
            className={`w-full py-4 rounded-lg font-semibold transition-all duration-200 ${
              canSubmitContact && !isProcessing
                ? 'bg-gradient-to-r from-primary-600 to-gold-500 text-white hover:from-primary-700 hover:to-gold-600 transform hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                Get My Perfect Matches
                <ArrowRight className="h-5 w-5 ml-2" />
              </div>
            )}
          </button>
          
          <div className="text-xs text-gray-500 mt-3 text-center">
            We&apos;ll contact you with curated matches. No spam, promise! 🤝
          </div>
          <div className="text-sm text-gray-500 mt-2 text-center">
            Step {steps.length+1} of {steps.length+1}
          </div>
        </div>
        </div>
      )}
    </div>
  )
}

