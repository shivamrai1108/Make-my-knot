import { useState } from 'react'
import { storeTestData } from '@/utils/generateTestUsers'
import { useRouter } from 'next/router'

export default function DebugTestData() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{ users: any[], responses: any[] } | null>(null)
  const [stats, setStats] = useState<any>(null)
  const router = useRouter()

  const generateTestData = async () => {
    setIsGenerating(true)
    try {
      const data = storeTestData()
      setResult(data)
      
      // Calculate stats
      const totalUsers = data.users.length
      const completedQuestionnaireUsers = data.users.filter(u => u.questionnaireComplete).length
      const verifiedUsers = data.users.filter(u => u.isVerified).length
      const subscribedUsers = data.users.filter(u => u.subscription?.plan === 'monthly').length
      
      setStats({
        totalUsers,
        completedQuestionnaireUsers,
        verifiedUsers,
        subscribedUsers,
        completionRate: Math.round((completedQuestionnaireUsers / totalUsers) * 100),
        verificationRate: Math.round((verifiedUsers / totalUsers) * 100),
        subscriptionRate: Math.round((subscribedUsers / totalUsers) * 100)
      })
    } catch (error) {
      console.error('Error generating test data:', error)
      setResult({ users: [], responses: [] })
    } finally {
      setIsGenerating(false)
    }
  }

  const clearTestData = () => {
    try {
      localStorage.removeItem('makemyknot_test_users')
      localStorage.removeItem('questionnaire_responses')
      setResult(null)
      setStats(null)
      console.log('Test data cleared from localStorage')
    } catch (error) {
      console.error('Error clearing test data:', error)
    }
  }

  const inspectLocalStorage = () => {
    const keys = [
      'makemyknot_test_users',
      'questionnaire_responses', 
      'makemyknot_user',
      'makemyknot_leads',
      'makemyknot_local_users'
    ]

    console.log('=== localStorage Inspection ===')
    keys.forEach(key => {
      const data = localStorage.getItem(key)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          console.log(`${key}:`, parsed.length ? `Array with ${parsed.length} items` : 'Object', parsed)
        } catch (e) {
          console.log(`${key}:`, data)
        }
      } else {
        console.log(`${key}:`, 'not found')
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Data Generator</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={generateTestData}
            disabled={isGenerating}
            className="bg-primary-600 text-white px-6 py-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-semibold"
          >
            {isGenerating ? 'Generating...' : 'Generate 50 Test Users'}
          </button>
          
          <button
            onClick={clearTestData}
            className="bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 font-semibold"
          >
            Clear Test Data
          </button>
          
          <button
            onClick={inspectLocalStorage}
            className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Inspect localStorage
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 font-semibold"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={() => router.push('/admin')}
            className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 font-semibold"
          >
            Go to Admin Panel
          </button>
        </div>

        {stats && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Generation Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completionRate}%</div>
                <div className="text-sm text-gray-600">Questionnaire Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.verificationRate}%</div>
                <div className="text-sm text-gray-600">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-600">{stats.subscriptionRate}%</div>
                <div className="text-sm text-gray-600">Subscribed</div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Generated Data Summary</h2>
            <div className="space-y-4">
              <p><strong>Users Generated:</strong> {result.users.length}</p>
              <p><strong>Questionnaire Responses:</strong> {result.responses.length}</p>
              
              {result.users.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Sample User:</h3>
                  <div className="bg-gray-100 p-4 rounded text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(result.users[0], null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              
              {result.responses.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Sample Response:</h3>
                  <div className="bg-gray-100 p-4 rounded text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(result.responses[0], null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-gray-600">
          <p>This page helps generate realistic test data for development and testing.</p>
          <p>Check the browser console for detailed logs.</p>
        </div>
      </div>
    </div>
  )
}
