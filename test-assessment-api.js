// Test script to verify Assessment API is working
const API_BASE_URL = 'https://makemyknot-backend-production.up.railway.app/api'

async function testAssessmentAPI() {
  console.log('🧪 Testing Assessment API...')
  
  // Test sample assessment data
  const testAssessment = {
    name: 'Test User',
    email: 'test@example.com', 
    phone: '9876543210',
    responses: {
      spirituality_importance: 'Very important',
      premarital_counseling: 'I\'m open to it.',
      shared_interests_importance: 'Somewhat important',
      relocation_openness: 'Yes, I\'m fully open to relocating.',
      children_perspective: 'I definitely want children.',
      caste_importance: 'Not at all',
      weekend_preferences: ['Staying in and relaxing', 'Reading'],
      family_independence_scenario: 'I would speak with both my parents and my partner to find a compromise, perhaps by living nearby or making a clear plan for how we can all be together.',
      hobbies_activities: ['Reading', 'Traveling'],
      drinking_habits: 'No',
      smoking_habits: 'No', 
      relationship_reasons: ['Emotional security', 'Having a partner I can trust'],
      career_opportunity_scenario: 'I would fully support them, no questions asked. Their dream is our dream, and we would figure out a way to make it work together.',
      family_gathering_scenario: 'The Compromiser: "I would attend the family gathering for a few hours and then politely excuse ourselves to spend some private time together."'
    },
    completionTime: 15,
    source: 'direct_assessment'
  }
  
  try {
    // Test POST to create assessment
    console.log('📤 Testing POST /api/assessments/public...')
    const postResponse = await fetch(`${API_BASE_URL}/assessments/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAssessment)
    })
    
    console.log('📥 POST Response status:', postResponse.status)
    if (!postResponse.ok) {
      const errorText = await postResponse.text()
      console.error('❌ POST Error:', errorText)
    } else {
      const result = await postResponse.json()
      console.log('✅ POST Success:', result)
    }
    
    // Test GET to fetch assessments
    console.log('📤 Testing GET /api/assessments/admin...')
    const getResponse = await fetch(`${API_BASE_URL}/assessments/admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    console.log('📥 GET Response status:', getResponse.status)
    if (!getResponse.ok) {
      const errorText = await getResponse.text()
      console.error('❌ GET Error:', errorText)
    } else {
      const result = await getResponse.json()
      console.log('✅ GET Success - Assessments found:', result.data?.assessments?.length || 0)
      if (result.data?.assessments?.length > 0) {
        console.log('📊 Sample assessment:', {
          name: result.data.assessments[0].name,
          email: result.data.assessments[0].email,
          phone: result.data.assessments[0].phone,
          isComplete: result.data.assessments[0].isComplete
        })
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testAssessmentAPI()