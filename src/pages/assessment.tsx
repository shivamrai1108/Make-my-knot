import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ComprehensiveQuestionnaire from '@/components/ComprehensiveQuestionnaire'
import { QuestionnaireResponse } from '@/lib/questionnaireStore'
import SEO from '@/components/SEO'
import { pageConfigs } from '@/lib/seo'

export default function AssessmentPage() {
  const router = useRouter()
  const { leadId, userId, source } = router.query
  const [isReady, setIsReady] = useState(false)
  const [shouldSkipAssessment, setShouldSkipAssessment] = useState(false)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🔍 Assessment page useEffect:', {
      routerIsReady: router.isReady,
      leadId,
      userId,
      source,
      query: router.query
    })
    
    // Ensure router is ready before proceeding
    if (router.isReady) {
      // Check if assessment was already completed to prevent double loading
      const sessionLeadId = sessionStorage.getItem('leadId')
      const effectiveLeadId = (Array.isArray(leadId) ? leadId[0] : leadId) || sessionLeadId
      
      console.log('📋 Lead ID resolution:', {
        urlLeadId: leadId,
        sessionLeadId,
        effectiveLeadId,
        source
      })
      
      // Check if assessment is already completed for this lead
      if (effectiveLeadId) {
        // Check session flag first (fastest check)
        const assessmentCompleted = sessionStorage.getItem(`assessment_completed_${effectiveLeadId}`)
        
        if (assessmentCompleted === 'true') {
          console.log('Assessment already completed (session check), redirecting to signup')
          setShouldSkipAssessment(true)
          
          // Get lead data and redirect directly
          try {
            const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
            const lead = leads.find((l: any) => l.id === effectiveLeadId)
            
            if (lead) {
              const leadSignupData = {
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                leadId: effectiveLeadId,
                assessmentCompleted: true,
                timestamp: Date.now()
              }
              
              localStorage.setItem('lead_signup_data', JSON.stringify(leadSignupData))
              window.location.href = '/lead-signup'
            } else {
              router.push('/signup?fromAssessment=true')
            }
          } catch (error) {
            router.push('/signup?fromAssessment=true')
          }
          return
        }
        
        // Also check localStorage for completed assessments
        try {
          const completedAssessments = JSON.parse(localStorage.getItem('makemyknot_questionnaire_responses') || '[]')
          const existingAssessment = completedAssessments.find((response: any) => 
            response.leadId === effectiveLeadId && response.isComplete
          )
          
          console.log('Assessment check:', {
            leadId: effectiveLeadId,
            existingAssessment: !!existingAssessment,
            completedAssessments: completedAssessments.length
          })
          
          if (existingAssessment) {
            console.log('Assessment already completed (localStorage check), redirecting to signup')
            setShouldSkipAssessment(true)
            sessionStorage.setItem(`assessment_completed_${effectiveLeadId}`, 'true')
            // Redirect directly to signup
            handleQuestionnaireComplete(existingAssessment)
            return
          }
        } catch (error) {
          console.error('Error checking existing assessments:', error)
        }
      }
      
      setIsReady(true)
      console.log('✅ Assessment ready to load')
    } else {
      console.log('⏳ Waiting for router to be ready...')
    }
  }, [router.isReady, leadId])
  
  // Add timeout mechanism to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isReady && !shouldSkipAssessment) {
        console.log('⚠️ Assessment loading timeout - forcing ready state')
        setIsReady(true)
        setLoadingError('Loading took longer than expected, but continuing...')
      }
    }, 5000) // 5 second timeout
    
    return () => clearTimeout(timeout)
  }, [])

  const handleQuestionnaireComplete = (response: QuestionnaireResponse) => {
    console.log('Assessment completed! Debug info:', {
      source,
      leadId,
      userId,
      responseId: response.id,
      queryParams: router.query,
      alreadyCompleted: response.isComplete
    })
    
    // Mark assessment as completed to prevent re-entry
    const sessionLeadId = sessionStorage.getItem('leadId')
    const effectiveLeadId = (Array.isArray(leadId) ? leadId[0] : leadId) || sessionLeadId
    
    if (effectiveLeadId) {
      sessionStorage.setItem(`assessment_completed_${effectiveLeadId}`, 'true')
      // Keep leadSubmitted flag but mark assessment as completed to prevent countdown
      console.log('Marked assessment as completed - lead data preserved in CRM')
    }
    
    console.log('Lead detection:', {
      urlLeadId: leadId,
      sessionLeadId,
      effectiveLeadId,
      source,
      isLeadFlow: (source === 'lead' || source === 'lead_assessment') && effectiveLeadId
    })
    
    // After completion, redirect based on source or presence of leadId
    if ((source === 'lead' || source === 'lead_assessment' || sessionLeadId) && effectiveLeadId) {
      console.log('Processing lead flow with leadId:', effectiveLeadId)
      // For leads, get the lead data and redirect to signup with pre-filled info
      try {
        const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
        console.log('Found leads in storage:', leads)
        const lead = leads.find((l: any) => l.id === effectiveLeadId)
        console.log('Found matching lead:', lead)
        
        if (lead) {
          // Store lead data directly in localStorage for reliable access
          const leadSignupData = {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            leadId: effectiveLeadId,
            assessmentCompleted: true,
            timestamp: Date.now()
          }
          
          localStorage.setItem('lead_signup_data', JSON.stringify(leadSignupData))
          sessionStorage.setItem('leadId', effectiveLeadId)
          
          console.log('Stored lead signup data:', leadSignupData)
          console.log('Redirecting to lead-signup page')
          
          // Simple redirect without URL parameters
          window.location.href = '/lead-signup'
        } else {
          console.log('No lead found, redirecting to regular signup')
          router.push('/signup?fromAssessment=true')
        }
      } catch (error) {
        console.error('Error retrieving lead data:', error)
        router.push('/signup?fromAssessment=true')
      }
    } else if (userId) {
      console.log('User flow - redirecting to dashboard')
      // For existing users, redirect to dashboard
      router.push('/dashboard')
    } else {
      console.log('Default fallback - redirecting to signup')
      // Default fallback
      router.push('/signup')
    }
  }

  if (!isReady || shouldSkipAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {!shouldSkipAssessment && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 mb-4">
                Loading your assessment...
              </p>
              {loadingError && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-yellow-800 text-sm">{loadingError}</p>
                  <button
                    onClick={() => setIsReady(true)}
                    className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  >
                    Continue Anyway
                  </button>
                </div>
              )}
              <div className="text-xs text-gray-500 mt-2">
                Router Ready: {router.isReady ? '✅' : '⏳'} | Lead ID: {leadId || 'None'}
              </div>
            </>
          )}
          {shouldSkipAssessment && (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-600">Assessment completed! Redirecting...</p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO config={pageConfigs.assessment} page="assessment" />
      <ComprehensiveQuestionnaire
        userId={userId as string}
        leadId={leadId as string}
        showIntro={true}
        source={source as string || (leadId ? 'lead_assessment' : 'user_assessment')}
      />
    </>
  )
}
