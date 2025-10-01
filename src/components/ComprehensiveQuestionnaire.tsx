import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { 
  essentialQuestions, 
  QuestionnaireResponse,
  getQuestionnaireResponseByUser,
  getQuestionnaireResponseByLead
} from '@/lib/questionnaireStore'
import { useUser } from '@/lib/UserContext'
import { ChevronLeft, ChevronRight, CheckCircle, Heart, Brain, Sparkles } from 'lucide-react'

interface Props {
  userId?: string
  leadId?: string
  onComplete?: (response: QuestionnaireResponse) => void
  showIntro?: boolean
  source?: string
}

export default function ComprehensiveQuestionnaire({ userId, leadId, onComplete, showIntro = true, source }: Props) {
  const router = useRouter()
  const { user, saveQuestionnaireResponse: saveToUserContext } = useUser()
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [showWelcome, setShowWelcome] = useState(showIntro)
  const [isComplete, setIsComplete] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const [progress, setProgress] = useState(0)
  const [startTime] = useState(Date.now())
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionProgress, setSubmissionProgress] = useState(0)
  const [lastSaveTime, setLastSaveTime] = useState<number>(0)
  const [isSaving, setIsSaving] = useState(false)
  
  // Email confirmation state
  const [showEmailConfirm, setShowEmailConfirm] = useState(true)
  const [confirmedEmail, setConfirmedEmail] = useState('')
  const [confirmedName, setConfirmedName] = useState('')
  const [confirmedPhone, setConfirmedPhone] = useState('')

  useEffect(() => {
    // Always start fresh - no automatic loading of previous incomplete responses
    // Users who want to continue can be handled through a separate "Continue Previous" button
    // This ensures users get a clean experience every time they start the questionnaire
    console.log('Questionnaire initialized - starting fresh')
    
    // Pre-populate email confirmation with user/lead data
    let userEmail = user?.email || ''
    let userName = user?.name || ''
    let userPhone = user?.phone || ''
    
    if (leadId && typeof window !== 'undefined') {
      try {
        const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
        const lead = leads.find((l: any) => l.id === leadId)
        if (lead) {
          userEmail = lead.email || userEmail
          userName = lead.name || userName
          userPhone = lead.phone || userPhone
        }
      } catch (error) {
        console.warn('Could not retrieve lead information for pre-population:', error)
      }
    }
    
    // Pre-populate the confirmation fields
    setConfirmedEmail(userEmail)
    setConfirmedName(userName)
    setConfirmedPhone(userPhone)
    
    console.log('📧 Pre-populated email confirmation:', { email: userEmail, name: userName })
  }, [userId, leadId, user])

  useEffect(() => {
    setProgress((currentStep / essentialQuestions.length) * 100)
  }, [currentStep])

  const currentQuestion = essentialQuestions[currentStep]
  
  // Auto-save function for partial progress
  const savePartialProgress = async (currentResponses: Record<string, any>) => {
    // Throttle saves to prevent too many API calls (max once every 2 seconds)
    const now = Date.now()
    if (now - lastSaveTime < 2000 || isSaving) {
      return
    }
    
    setIsSaving(true)
    setLastSaveTime(now)
    
    try {
      // Use confirmed email from confirmation step
      const userEmail = confirmedEmail || user?.email || ''
      const userName = confirmedName || user?.name || ''
      const userPhone = confirmedPhone || user?.phone || ''
      
      // Only save if we have essential info
      if (!userEmail) {
        console.log('No email available, skipping auto-save')
        setIsSaving(false)
        return
      }
      
      // Only include leadId if it looks like a valid MongoDB ObjectId
      const isValidLeadId = leadId && /^[a-f\d]{24}$/i.test(leadId)
      
      // Prepare partial assessment data
      const partialData: any = {
        name: userName,
        email: userEmail,
        phone: userPhone,
        responses: currentResponses,
        userId: userId || null,
        source: source === 'lead' ? 'lead_assessment' : (source || (leadId ? 'lead_assessment' : 'user_assessment')),
        sessionId: `session_${Date.now()}`
      }
      
      // Only add leadId if it's valid
      if (isValidLeadId) {
        partialData.leadId = leadId
      }
      
      console.log('💾 Auto-saving assessment progress:', {
        email: userEmail,
        answeredQuestions: Object.keys(currentResponses).length,
        totalQuestions: essentialQuestions.length
      })
      
      // Save to backend API
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://make-my-knot-production.up.railway.app/api'
      const response = await fetch(`${API_URL}/assessments/public/partial`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partialData)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Auto-save successful:', {
          progress: result.data.assessment.completionPercentage,
          status: result.data.assessment.status
        })
      } else {
        console.warn('⚠️ Auto-save failed:', response.status, response.statusText)
      }
      
    } catch (error) {
      console.error('❌ Auto-save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAnswer = (questionId: string, answer: any, questionType?: string) => {
    if (isSubmitting) return
    // Update responses state
    const newResponses = { ...responses, [questionId]: answer }
    setResponses(newResponses)
    
    // Auto-save progress after each answer
    savePartialProgress(newResponses)
    
    // Auto-advance for single choice and scale questions with minimal delay
    if (questionType === 'single_choice' || questionType === 'scale') {
      // If it's the last question, complete immediately to avoid multi-clicks
      if (currentStep === essentialQuestions.length - 1) {
        handleComplete(questionId, answer)
        return
      }
      setIsTransitioning(true)
      setTimeout(() => {
        handleNext()
        setIsTransitioning(false)
      }, 150)
    }
  }

  const handleNext = () => {
    if (currentStep < essentialQuestions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      if (!isSubmitting) {
        setIsSubmitting(true)
        handleComplete() // No parameters when called through normal flow
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async (finalQuestionId?: string, finalAnswer?: any) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setSubmissionProgress(10) // Start progress
    const completionTime = Math.round((Date.now() - startTime) / (1000 * 60)) // in minutes
    
    // Ensure the final answer is included in responses if provided
    const finalResponses = finalQuestionId && finalAnswer 
      ? { ...responses, [finalQuestionId]: finalAnswer }
      : responses
    
    console.log('🔄 Completing questionnaire with responses:', finalResponses)
    console.log('📊 Total questions answered:', Object.keys(finalResponses).length, 'out of', essentialQuestions.length)
    setSubmissionProgress(25) // Processing responses
    
    // Use confirmed email from the confirmation step
    const userEmail = confirmedEmail || user?.email || ''
    const userName = confirmedName || user?.name || ''
    const userPhone = confirmedPhone || user?.phone || ''
    
    const response: QuestionnaireResponse = {
      id: userId || leadId || `questionnaire_${Date.now()}`,
      userId,
      leadId,
      userName,
      userEmail,
      userPhone,
      userType: userId ? 'user' : 'lead',
      source: source || (leadId ? 'lead_assessment' : 'user_questionnaire'),
      completionTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      responses: finalResponses,
      isComplete: true
    }

    // Save to localStorage and backend API using Assessment API directly
    setSubmissionProgress(50) // Saving data
    try {
      // Save directly to Assessment API
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://make-my-knot-production.up.railway.app/api'
      // Only include leadId if it looks like a valid MongoDB ObjectId (24 hex chars)
      const isValidLeadId = leadId && /^[a-f\d]{24}$/i.test(leadId)
      
      const assessmentData: any = {
        name: userName,
        email: userEmail,
        phone: userPhone,
        responses: finalResponses,
        userId: userId,
        completionTime,
        source: source === 'lead' ? 'lead_assessment' : (source || (leadId ? 'lead_assessment' : 'user_assessment'))
      }
      
      // Only add leadId if it's valid to prevent 500 errors
      if (isValidLeadId) {
        assessmentData.leadId = leadId
      }
      
      console.log('🔄 Submitting assessment to backend API:', {
        email: userEmail,
        answeredQuestions: Object.keys(finalResponses).length,
        source: assessmentData.source,
        includesLeadId: isValidLeadId,
        leadId: isValidLeadId ? leadId : 'excluded (invalid format)'
      })
      
      const response_api = await fetch(`${API_URL}/assessments/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData)
      })
      
      if (!response_api.ok) {
        const errorData = await response_api.text()
        throw new Error(`Assessment API Error: ${response_api.status} - ${errorData}`)
      }
      
      const result = await response_api.json()
      console.log('✅ Assessment saved successfully to backend!', result.data.assessment.id)
      setSubmissionProgress(75) // Data saved
    } catch (error) {
      console.error('❌ Error saving assessment:', error)
      setSubmissionProgress(60) // Partial save
      // Continue with local save already done
    }
    
    // Mark assessment as completed immediately to prevent any race conditions
    const effectiveLeadId = leadId || (typeof window !== 'undefined' ? sessionStorage.getItem('leadId') : null)
    if (effectiveLeadId) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`assessment_completed_${effectiveLeadId}`, 'true')
        console.log('Marked assessment as completed for leadId:', effectiveLeadId)
      }
    }
    setSubmissionProgress(90) // Finalizing
    
    // If user is authenticated, also save to UserContext and update questionnaireComplete flag
    if (user && userId === user.id) {
      try {
        // Create QuestionnaireResponse for UserContext
        const userContextResponse: QuestionnaireResponse = {
          id: `user_${user.id}_${Date.now()}`,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone,
          userType: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          responses: finalResponses,
          completedAt: new Date().toISOString(),
          isComplete: true,
          source: source || 'user_questionnaire',
          completionTime: completionTime
        }
        await saveToUserContext(userContextResponse)
      } catch (error) {
        console.error('Error saving to UserContext:', error)
      }
    }
    
    // If onComplete callback is provided (assessment flow), use it instead of showing completion screen
    setSubmissionProgress(100) // Complete
    if (onComplete) {
      console.log('Using onComplete callback for assessment flow')
      setTimeout(() => onComplete(response), 500) // Small delay to show 100% progress
    } else {
      console.log('No onComplete callback - showing congratulations screen')
      setTimeout(() => {
        setShowCongrats(true)
        setTimeout(() => {
          setIsComplete(true)
        }, 3000) // Show congrats for 3 seconds before final screen
      }, 500) // Small delay to show 100% progress
    }
  }

  const canProceed = () => {
    const answer = responses[currentQuestion?.id]
    if (!currentQuestion) return false
    
    if (currentQuestion.type === 'multiple_choice') {
      return answer && answer.length > 0
    }
    return answer !== undefined && answer !== ''
  }

  const handleFinalRedirect = () => {
    // Handle the final redirect based on the context
    const sessionLeadId = typeof window !== 'undefined' ? sessionStorage.getItem('leadId') : null
    const effectiveLeadId = leadId || sessionLeadId
    
    // Check if this is a lead flow
    if ((source === 'lead' || source === 'lead_assessment' || sessionLeadId) && effectiveLeadId) {
      console.log('Processing lead flow with leadId:', effectiveLeadId)
      // For leads, get the lead data and redirect to signup with pre-filled info
      try {
        const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
        const lead = leads.find((l: any) => l.id === effectiveLeadId)
        
        if (lead) {
          // Store lead data for signup
          const leadSignupData = {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            leadId: effectiveLeadId,
            assessmentCompleted: true,
            timestamp: Date.now()
          }
          
          localStorage.setItem('lead_signup_data', JSON.stringify(leadSignupData))
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('leadId', effectiveLeadId)
            sessionStorage.setItem(`assessment_completed_${effectiveLeadId}`, 'true')
            window.location.href = '/lead-signup'
          }
        } else {
          router.push('/signup?fromAssessment=true')
        }
      } catch (error) {
        console.error('Error retrieving lead data:', error)
        router.push('/signup?fromAssessment=true')
      }
    } else if (userId) {
      // For existing users, redirect to dashboard
      router.push('/dashboard')
    } else {
      // Default fallback to signup
      router.push('/signup')
    }
  }

  const getNextStepButtonText = () => {
    const sessionLeadId = typeof window !== 'undefined' ? sessionStorage.getItem('leadId') : null
    const effectiveLeadId = leadId || sessionLeadId
    
    if ((source === 'lead' || source === 'lead_assessment' || sessionLeadId) && effectiveLeadId) {
      return 'Complete Setup & Find Matches'
    } else if (userId) {
      return 'Go to Dashboard'
    } else {
      return 'Create Your Account'
    }
  }

  const renderQuestionInput = (question: typeof essentialQuestions[0]) => {
    const answer = responses[question.id]

    switch (question.type) {
      case 'single_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(question.id, option, 'single_choice')}
                className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-200 ${
                  answer === option
                    ? 'border-primary-600 bg-primary-50 text-primary-900'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    answer === option 
                      ? 'border-primary-600 bg-primary-600' 
                      : 'border-gray-300'
                  }`}>
                    {answer === option && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>
        )

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <button
                key={option}
                onClick={() => {
                  const current = answer || []
                  const updated = current.includes(option)
                    ? current.filter((a: string) => a !== option)
                    : [...current, option]
                  handleAnswer(question.id, updated)
                }}
                className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-200 ${
                  answer?.includes(option)
                    ? 'border-primary-600 bg-primary-50 text-primary-900'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                    answer?.includes(option)
                      ? 'border-primary-600 bg-primary-600'
                      : 'border-gray-300'
                  }`}>
                    {answer?.includes(option) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>
        )

      case 'scale':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {question.options?.map((option, index) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(question.id, index.toString(), 'scale')}
                  className={`text-left p-4 border-2 rounded-xl transition-all duration-200 ${
                    answer === index.toString()
                      ? 'border-primary-600 bg-primary-50 text-primary-900'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full border-2 mr-3 flex items-center justify-center text-sm font-semibold ${
                      answer === index.toString()
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    {option}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
              <Brain className="w-8 h-8 text-primary-600" />
            </div>
            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-gold-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Matchmaking Assessment
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Welcome to our streamlined compatibility assessment! We&apos;ll ask you 15 essential questions about your personality, values, lifestyle, and relationship preferences.
          </p>
          
          <div className="bg-primary-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-primary-900 mb-3">What to expect:</h3>
            <div className="text-left space-y-2 text-primary-800">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                <span>15 carefully selected compatibility questions</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                <span>Covers core personality, values & lifestyle factors</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                <span>Takes only 5-7 minutes to complete</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                <span>Optimized for accurate AI matchmaking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                <span>Smooth, animated question flow</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                <span>All information is kept confidential</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowWelcome(false)}
            className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
          >
            Let&apos;s Get Started
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    )
  }

  // Email confirmation screen
  if (showEmailConfirm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Confirm Your Information
            </h2>
            <p className="text-lg text-gray-600">
              Please confirm your details to ensure we save your assessment correctly.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={confirmedName}
                onChange={(e) => setConfirmedName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={confirmedEmail}
                onChange={(e) => setConfirmedEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={confirmedPhone}
                onChange={(e) => setConfirmedPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div className="bg-primary-50 rounded-lg p-4 mt-6">
            <p className="text-sm text-primary-800">
              <strong>Privacy Note:</strong> This information is used to save your assessment and notify you of matches. We never share your data with third parties.
            </p>
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setShowWelcome(true)}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            <button
              onClick={() => {
                if (!confirmedName.trim() || !confirmedEmail.trim() || !confirmedPhone.trim()) {
                  alert('Please fill in all required fields.');
                  return;
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(confirmedEmail)) {
                  alert('Please enter a valid email address.');
                  return;
                }
                console.log('✅ Email confirmation completed:', { name: confirmedName, email: confirmedEmail, phone: confirmedPhone });
                setShowEmailConfirm(false);
              }}
              disabled={!confirmedName.trim() || !confirmedEmail.trim() || !confirmedPhone.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Assessment
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Animated congratulations screen
  if (showCongrats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-primary-50 to-gold-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-gold-100/20 animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6 animate-bounce">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-gold-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white animate-spin" />
              </div>
            </div>
            
            <h2 className="text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
              Congratulations! 🎉
            </h2>
            
            <p className="text-2xl text-primary-600 mb-8 font-medium animate-fade-in-delay">
              Your compatibility profile is now complete!
            </p>
            
            <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-2xl p-6 mb-6 animate-slide-up">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">🤖 AI Matchmaker is now working for you!</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our advanced AI is analyzing your responses and will notify you when compatible matches are found. 
                Get ready to meet your perfect match!
              </p>
              
              {/* Notification Methods */}
              <div className="bg-white/70 rounded-xl p-4 mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">📱 We'll notify you via:</h4>
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">📱</span>
                    </div>
                    <span className="font-medium">WhatsApp</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">📧</span>
                    </div>
                    <span className="font-medium">Email</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Okay Button */}
            <button
              onClick={() => {
                // Keep lead data in CRM permanently - do NOT clear lead storage
                const sessionLeadId = sessionStorage.getItem('leadId')
                if (sessionLeadId) {
                  // Mark assessment as completed but preserve lead data
                  sessionStorage.setItem(`assessment_completed_${sessionLeadId}`, 'true')
                  console.log('Assessment completed for lead:', sessionLeadId, '- Lead data preserved in CRM permanently')
                }
                
                console.log('Redirecting to home page - lead data remains in CRM for admin access')
                
                // Redirect to home page
                window.location.href = '/'
              }}
              className="bg-gradient-to-r from-primary-600 to-gold-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-primary-700 hover:to-gold-600 transition-all duration-300 transform hover:scale-105 shadow-lg animate-slide-up"
            >
              Okay! Take me to Home 🏠
            </button>
            
            <div className="flex items-center justify-center space-x-2 text-primary-600 animate-pulse mt-6">
              <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-primary-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Assessment Complete!
          </h2>
          
          <p className="text-xl text-gray-600 mb-8">
            Thank you for completing our questionnaire. Our AI Matchmaker will now handle finding your perfect match.
          </p>
          
          <div className="bg-primary-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">What happens next?</h3>
            <p className="text-primary-800">
              You&apos;ll be notified when our AI finds compatible matches based on your responses. 
              The matchmaking process runs continuously in the background.
            </p>
          </div>
          
          <button
            onClick={() => {
              handleFinalRedirect()
            }}
            className="btn-primary text-lg px-8 py-4"
          >
            {getNextStepButtonText()}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 p-4 relative">
      {/* Special Loading Overlay for Q14 Submission */}
      {isSubmitting && currentStep === essentialQuestions.length - 1 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Assessment</h3>
              <p className="text-gray-600">Saving your responses and preparing matches...</p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-medium text-primary-600">{submissionProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary-600 to-gold-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${submissionProgress}%` }}
                />
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="space-y-2 text-left">
              <div className={`flex items-center text-sm ${
                submissionProgress >= 25 ? 'text-primary-600' : 'text-gray-400'
              }`}>
                <CheckCircle className={`w-4 h-4 mr-2 ${
                  submissionProgress >= 25 ? 'text-primary-600' : 'text-gray-300'
                }`} />
                Processing your responses
              </div>
              <div className={`flex items-center text-sm ${
                submissionProgress >= 50 ? 'text-primary-600' : 'text-gray-400'
              }`}>
                <CheckCircle className={`w-4 h-4 mr-2 ${
                  submissionProgress >= 50 ? 'text-primary-600' : 'text-gray-300'
                }`} />
                Saving to secure database
              </div>
              <div className={`flex items-center text-sm ${
                submissionProgress >= 75 ? 'text-primary-600' : 'text-gray-400'
              }`}>
                <CheckCircle className={`w-4 h-4 mr-2 ${
                  submissionProgress >= 75 ? 'text-primary-600' : 'text-gray-300'
                }`} />
                Activating AI matchmaker
              </div>
              <div className={`flex items-center text-sm ${
                submissionProgress >= 100 ? 'text-primary-600' : 'text-gray-400'
              }`}>
                <CheckCircle className={`w-4 h-4 mr-2 ${
                  submissionProgress >= 100 ? 'text-primary-600' : 'text-gray-300'
                }`} />
                Assessment complete!
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentStep + 1} of {essentialQuestions.length}
            </span>
            <div className="flex items-center gap-3">
              {isSaving && (
                <div className="flex items-center text-xs text-primary-600">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600 mr-1"></div>
                  Saving...
                </div>
              )}
              <span className="text-sm font-medium text-gray-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-600 to-gold-500 h-3 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className={`bg-white rounded-3xl shadow-2xl p-8 transition-all duration-500 ${isTransitioning ? 'opacity-50 transform scale-95' : 'opacity-100 transform scale-100'}`}>
          {/* Question Category */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm font-semibold rounded-full">
              {currentQuestion.category}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 leading-tight">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="mb-8">
            {renderQuestionInput(currentQuestion)}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-500">
                {Object.keys(responses).length} of {essentialQuestions.length} answered
              </div>
            </div>

            {/* Only show Next button for multiple choice questions */}
            {currentQuestion.type === 'multiple_choice' ? (
              <button
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {isSubmitting && currentStep === essentialQuestions.length - 1 ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Completing...
                  </div>
                ) : (
                  <>
                    {currentStep === essentialQuestions.length - 1 ? 'Complete Assessment' : 'Next'}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            ) : (
              <div className="text-sm text-gray-400 italic">
                {isSubmitting && currentStep === essentialQuestions.length - 1 ? (
                  <div className="flex items-center text-primary-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                    Completing assessment...
                  </div>
                ) : (
                  currentQuestion.type === 'single_choice' || currentQuestion.type === 'scale' 
                    ? (currentStep === essentialQuestions.length - 1 ? 'Click an option to complete assessment' : 'Click an option to continue')
                    : 'Select to proceed'
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
