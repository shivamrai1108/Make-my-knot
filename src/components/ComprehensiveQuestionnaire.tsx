import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { 
  comprehensiveQuestions, 
  saveQuestionnaireResponse, 
  QuestionnaireResponse,
  getQuestionnaireResponseByUser,
  getQuestionnaireResponseByLead
} from '@/lib/questionnaireStore'
import { useUser } from '@/lib/UserContext'
import { ChevronLeft, ChevronRight, CheckCircle, Heart, Brain } from 'lucide-react'

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
  const [progress, setProgress] = useState(0)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    // Load existing response if available
    const existingResponse = userId 
      ? getQuestionnaireResponseByUser(userId)
      : leadId 
        ? getQuestionnaireResponseByLead(leadId)
        : null

    if (existingResponse && !existingResponse.isComplete) {
      setResponses(existingResponse.responses)
      // Find the first unanswered question
      const answeredCount = Object.keys(existingResponse.responses).length
      setCurrentStep(answeredCount)
    }
  }, [userId, leadId])

  useEffect(() => {
    setProgress((currentStep / comprehensiveQuestions.length) * 100)
  }, [currentStep])

  const currentQuestion = comprehensiveQuestions[currentStep]

  const handleAnswer = (questionId: string, answer: any, questionType?: string) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }))
    
    // Auto-advance for single choice and scale questions
    if (questionType === 'single_choice' || questionType === 'scale') {
      setTimeout(() => {
        handleNext()
      }, 300) // Slightly longer delay for comprehensive questionnaire
    }
  }

  const handleNext = () => {
    if (currentStep < comprehensiveQuestions.length - 1) {
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
      console.log('No onComplete callback - showing completion screen')
      setIsComplete(true)
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

  const renderQuestionInput = (question: typeof comprehensiveQuestions[0]) => {
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
            Comprehensive Pre-Marriage Assessment
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Welcome to our detailed compatibility assessment! We&apos;ll ask you 48 comprehensive questions about your personality, values, lifestyle, health, family background, and marriage expectations.
          </p>
          
          <div className="bg-primary-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-primary-900 mb-3">What to expect:</h3>
            <div className="text-left space-y-2 text-primary-800">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                <span>48 detailed compatibility questions</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                <span>Covers personality, health, family, finances & more</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                <span>Takes about 20-25 minutes</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                <span>Essential for accurate AI matchmaking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                <span>Includes health & compatibility factors</span>
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

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-primary-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Assessment Complete! 🎉
          </h2>
          
          <p className="text-xl text-gray-600 mb-8">
            Thank you for completing our comprehensive questionnaire. Your responses will help our AI find the most compatible matches for you.
          </p>
          
          <div className="bg-primary-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">What happens next?</h3>
            <p className="text-primary-800">
              Our AI is now analyzing your responses to find potential matches. You&apos;ll receive curated matches based on compatibility across all dimensions we assessed.
            </p>
          </div>
          
          <button
            onClick={() => {
              console.log('Completion screen button clicked - this should not appear for leads!')
              // This should only be reached for direct questionnaire access, not via assessment flow
              router.push(userId ? '/dashboard' : '/signup')
            }}
            className="btn-primary text-lg px-8 py-4"
          >
            {userId ? 'Go to Dashboard' : 'Create Your Account'}
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
              Question {currentStep + 1} of {comprehensiveQuestions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-600 to-gold-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
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
                {Object.keys(responses).length} of {comprehensiveQuestions.length} answered
              </div>
            </div>

            {/* Only show Next button for multiple choice questions */}
            {currentQuestion.type === 'multiple_choice' ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === comprehensiveQuestions.length - 1 ? 'Complete' : 'Next'}
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
