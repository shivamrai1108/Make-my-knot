import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { 
  essentialQuestions, 
  saveQuestionnaireResponse, 
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

  useEffect(() => {
    // Always start fresh - no automatic loading of previous incomplete responses
    // Users who want to continue can be handled through a separate "Continue Previous" button
    // This ensures users get a clean experience every time they start the questionnaire
    console.log('Questionnaire initialized - starting fresh')
  }, [userId, leadId])

  useEffect(() => {
    setProgress((currentStep / essentialQuestions.length) * 100)
  }, [currentStep])

  const currentQuestion = essentialQuestions[currentStep]

  const handleAnswer = (questionId: string, answer: any, questionType?: string) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }))
    
    // Auto-advance for single choice and scale questions with smooth transition
    if (questionType === 'single_choice' || questionType === 'scale') {
      setTimeout(() => {
        setIsTransitioning(true)
        setTimeout(() => {
          handleNext()
          setIsTransitioning(false)
        }, 200)
      }, 400)
    }
  }

  const handleNext = () => {
    if (currentStep < essentialQuestions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    const completionTime = Math.round((Date.now() - startTime) / (1000 * 60)) // in minutes
    
    const response: QuestionnaireResponse = {
      id: userId || leadId || `questionnaire_${Date.now()}`,
      userId,
      leadId,
      source: source || (leadId ? 'lead_assessment' : 'user_questionnaire'),
      completionTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      responses,
      isComplete: true
    }

    // Save to localStorage
    saveQuestionnaireResponse(response)
    
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
          responses: responses,
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
    if (onComplete) {
      console.log('Using onComplete callback for assessment flow')
      onComplete(response)
    } else {
      console.log('No onComplete callback - showing congratulations screen')
      setShowCongrats(true)
      setTimeout(() => {
        setIsComplete(true)
      }, 3000) // Show congrats for 3 seconds before final screen
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
            
            <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-2xl p-6 mb-8 animate-slide-up">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">🤖 AI Matchmaker is now working for you!</h3>
              <p className="text-gray-700 leading-relaxed">
                Our advanced AI is analyzing your responses and will notify you when compatible matches are found. 
                Get ready to meet your perfect match!
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-primary-600 animate-pulse">
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentStep + 1} of {essentialQuestions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
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
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === essentialQuestions.length - 1 ? 'Complete' : 'Next'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <div className="text-sm text-gray-400 italic">
                {currentQuestion.type === 'single_choice' || currentQuestion.type === 'scale' 
                  ? 'Click an option to continue'
                  : 'Select to proceed'
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
