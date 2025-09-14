import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function DebugLead() {
  const [leadData, setLeadData] = useState<any>(null)
  const [questionnaireData, setQuestionnaireData] = useState<any[]>([])
  const [sessionData, setSessionData] = useState<any>({})
  const [urlParams, setUrlParams] = useState<any>({})
  const [leadSignupData, setLeadSignupData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      // Get URL parameters
      setUrlParams(router.query)

      // Get sessionStorage data
      const session = {
        leadId: sessionStorage.getItem('leadId'),
        leadSubmitted: sessionStorage.getItem('leadSubmitted')
      }
      setSessionData(session)

      // Get localStorage data
      try {
        const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
        setLeadData(leads)
        
        const questionnaires = JSON.parse(localStorage.getItem('questionnaire_responses') || '[]')
        setQuestionnaireData(questionnaires)
        
        const leadSignup = localStorage.getItem('lead_signup_data')
        setLeadSignupData(leadSignup ? JSON.parse(leadSignup) : null)
      } catch (error) {
        console.error('Error parsing localStorage:', error)
      }
    }
  }, [router.isReady, router.query])

  const clearAll = () => {
    localStorage.removeItem('makemyknot_leads')
    localStorage.removeItem('questionnaire_responses')
    localStorage.removeItem('lead_signup_data')
    sessionStorage.removeItem('leadId')
    sessionStorage.removeItem('leadSubmitted')
    window.location.reload()
  }

  const goToLeadSignup = (lead: any) => {
    const params = new URLSearchParams({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      leadId: lead.id
    })
    router.push(`/lead-signup?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Lead Debug Console</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* URL Parameters */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">URL Parameters</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(urlParams, null, 2)}
            </pre>
          </div>

          {/* Session Storage */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Session Storage</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(sessionData, null, 2)}
            </pre>
          </div>

          {/* Lead Data */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Leads in localStorage</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(leadData, null, 2)}
            </pre>
            {leadData && leadData.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Test Lead Signup:</h3>
                {leadData.map((lead: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => goToLeadSignup(lead)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 mb-2"
                  >
                    Signup as {lead.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lead Signup Data */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Lead Signup Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(leadSignupData, null, 2)}
            </pre>
          </div>

          {/* Questionnaire Data */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Questionnaires in localStorage</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(questionnaireData, null, 2)}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={clearAll}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Clear All Data
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Go to Home
            </button>
            <button
              onClick={() => router.push('/lead-signup')}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Test Lead Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
