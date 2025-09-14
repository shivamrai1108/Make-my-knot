import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function TestLeadFlow() {
  const router = useRouter()
  const [testStep, setTestStep] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const createTestLead = () => {
    const leadId = Date.now().toString()
    const lead = {
      id: leadId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1 555 123 4567',
      answers: {
        online_dating_experience: "I'm new to it",
        relationship_type: 'Serious',
        iam: 'a woman',
        looking_for: 'a man',
        location: 'New York, NY'
      },
      status: 'new'
    }

    // Save lead to localStorage
    const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
    leads.push(lead)
    localStorage.setItem('makemyknot_leads', JSON.stringify(leads))
    
    // Set sessionStorage
    sessionStorage.setItem('leadId', leadId)
    sessionStorage.setItem('leadSubmitted', 'true')

    setTestStep(1)
    return leadId
  }

  const createTestQuestionnaire = () => {
    const leadId = sessionStorage.getItem('leadId')
    if (!leadId) {
      alert('Create test lead first')
      return
    }

    const questionnaire = {
      id: `questionnaire_${Date.now()}`,
      leadId: leadId,
      userEmail: 'test@example.com',
      userName: 'Test User',
      userPhone: '+1 555 123 4567',
      userType: 'lead',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: {
        personality_type: 'Balanced - depends on situation',
        ideal_weekend: 'Mix of social and alone time',
        communication_style: 'Mix of both depending on situation',
        conflict_resolution: 'Seek compromise and middle ground',
        religious_importance: 'Moderately important',
        family_values: 'Very important',
        career_ambition: 'Moderately ambitious'
      },
      completedAt: new Date().toISOString(),
      isComplete: true,
      source: 'lead_assessment',
      completionTime: 10
    }

    // Save questionnaire to localStorage
    const questionnaires = JSON.parse(localStorage.getItem('questionnaire_responses') || '[]')
    questionnaires.push(questionnaire)
    localStorage.setItem('questionnaire_responses', JSON.stringify(questionnaires))

    setTestStep(2)
    return questionnaire.id
  }

  const testLeadSignupRedirect = () => {
    const leadId = sessionStorage.getItem('leadId')
    const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
    const lead = leads.find((l: any) => l.id === leadId)
    
    if (!lead) {
      alert('No test lead found')
      return
    }

    // Store lead data in localStorage for lead-signup page
    const leadSignupData = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      leadId: leadId,
      assessmentCompleted: true,
      timestamp: Date.now()
    }
    
    localStorage.setItem('lead_signup_data', JSON.stringify(leadSignupData))
    console.log('Stored lead signup data:', leadSignupData)
    
    // Open lead signup page
    window.open('/lead-signup', '_blank')
    setTestStep(3)
  }

  const clearAllData = () => {
    localStorage.removeItem('makemyknot_leads')
    localStorage.removeItem('questionnaire_responses')
    localStorage.removeItem('lead_signup_data')
    sessionStorage.removeItem('leadId')
    sessionStorage.removeItem('leadSubmitted')
    setTestStep(0)
  }

  const checkCurrentState = () => {
    const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
    const questionnaires = JSON.parse(localStorage.getItem('questionnaire_responses') || '[]')
    const leadId = sessionStorage.getItem('leadId')
    
    console.log('Current State:', {
      leads,
      questionnaires,
      sessionStorage: { leadId }
    })

    alert(`Current State:
Leads: ${leads.length}
Questionnaires: ${questionnaires.length}
Session Lead ID: ${leadId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Lead Flow Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Progress</h2>
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${testStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>1</div>
            <span className={testStep >= 1 ? 'text-green-600 font-semibold' : 'text-gray-500'}>Lead Created</span>
            
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${testStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>2</div>
            <span className={testStep >= 2 ? 'text-green-600 font-semibold' : 'text-gray-500'}>Assessment Complete</span>
            
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${testStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>3</div>
            <span className={testStep >= 3 ? 'text-green-600 font-semibold' : 'text-gray-500'}>Account Created</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Step 1: Create Test Lead</h2>
            <p className="text-gray-600 mb-4">Create a test lead with sample data</p>
            <button
              onClick={createTestLead}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Create Test Lead
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Step 2: Complete Assessment</h2>
            <p className="text-gray-600 mb-4">Simulate completing the comprehensive questionnaire</p>
            <button
              onClick={createTestQuestionnaire}
              disabled={testStep < 1}
              className={`px-4 py-2 rounded transition-colors ${
                testStep >= 1 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Complete Assessment
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Step 3: Test Lead Signup</h2>
            <p className="text-gray-600 mb-4">Open the lead signup page with pre-filled data</p>
            <button
              onClick={testLeadSignupRedirect}
              disabled={testStep < 2}
              className={`px-4 py-2 rounded transition-colors ${
                testStep >= 2 
                  ? 'bg-purple-500 text-white hover:bg-purple-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Test Lead Signup
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Actions</h2>
            <div className="space-y-2">
              <button
                onClick={checkCurrentState}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
              >
                Check Current State
              </button>
              <button
                onClick={clearAllData}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors w-full"
              >
                Clear All Data
              </button>
              <button
                onClick={() => router.push('/debug-lead')}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors w-full"
              >
                Open Debug Console
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Quick Test Links</h2>
          <div className="space-x-4">
            <button
              onClick={() => window.open('/', '_blank')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Go to Home Page
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.open('/assessment?leadId=' + sessionStorage.getItem('leadId') + '&source=lead', '_blank')
                }
              }}
              disabled={!isClient || !sessionStorage?.getItem?.('leadId')}
              className={`px-4 py-2 rounded transition-colors ${
                isClient && sessionStorage?.getItem?.('leadId')
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Test Assessment Page
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>Click "Create Test Lead" to set up test data</li>
            <li>Click "Complete Assessment" to simulate questionnaire completion</li>
            <li>Click "Test Lead Signup" to test the redirect with pre-filled data</li>
            <li>Check browser console for debug logs</li>
            <li>Use "Check Current State" to view localStorage data</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
