export interface QuestionnaireResponse {
  id: string
  userId?: string // For registered users
  leadId?: string // For leads who haven't registered yet
  userName?: string // User's full name for easy identification
  userEmail?: string // User's email for identification
  userPhone?: string // User's phone for identification
  userType?: 'user' | 'lead' // Type of respondent
  createdAt: string
  updatedAt: string
  responses: Record<string, any>
  completedAt?: string
  isComplete: boolean
  source?: string // Where the questionnaire was initiated from
  completionTime?: number // Time taken to complete in minutes
  needsSync?: boolean // Flag to indicate response needs to be synced to backend
}

export interface QuestionnaireQuestion {
  id: string
  category: string
  question: string
  type: 'multiple_choice' | 'single_choice' | 'scale' | 'text' | 'boolean'
  options?: string[]
  required: boolean
  order: number
}

// Essential questionnaire questions for AI matching - Values & Lifestyle focused
export const essentialQuestions: QuestionnaireQuestion[] = [
  // 1. Spirituality/Religion
  {
    id: 'spirituality_importance',
    category: 'Values & Lifestyle',
    question: 'How important is spirituality or religion in your life?',
    type: 'single_choice',
    options: ['Very important', 'Somewhat important', 'Not important'],
    required: true,
    order: 1
  },
  
  // 2. Pre-marital Counseling
  {
    id: 'premarital_counseling',
    category: 'Values & Lifestyle',
    question: 'What are your thoughts on pre-marital counseling?',
    type: 'single_choice',
    options: ['I\'m open to it.', 'I prefer not to.', 'I\'m not sure.'],
    required: true,
    order: 2
  },

  // 3. Shared Interests
  {
    id: 'shared_interests_importance',
    category: 'Values & Lifestyle',
    question: 'How important is it for you to have a partner who shares your interests?',
    type: 'single_choice',
    options: ['Very important', 'Somewhat important', 'Not important'],
    required: true,
    order: 3
  },

  // 4. Relocation After Marriage
  {
    id: 'relocation_openness',
    category: 'Values & Lifestyle',
    question: 'Are you open to relocating for a partner after marriage?',
    type: 'single_choice',
    options: ['Yes, I\'m fully open to relocating.', 'Yes, but only within a specific region or country.', 'No, I would prefer to stay in my current location.'],
    required: true,
    order: 4
  },

  // 5. Children Perspective
  {
    id: 'children_perspective',
    category: 'Values & Lifestyle',
    question: 'What is your perspective on having children?',
    type: 'single_choice',
    options: ['I definitely want children.', 'I am open to it, but it\'s not a priority.', 'I prefer not to have children.', 'I\'m still undecided.'],
    required: true,
    order: 5
  },

  // 6. Caste Importance
  {
    id: 'caste_importance',
    category: 'Values & Lifestyle',
    question: 'Does caste matter to you in a partner?',
    type: 'single_choice',
    options: ['Yes, very much', 'Yes, somewhat', 'Not at all'],
    required: true,
    order: 6
  },

  // 7. Weekend Preferences
  {
    id: 'weekend_preferences',
    category: 'Personal Preferences',
    question: 'How do you prefer to spend a typical weekend? (Select up to 3)',
    type: 'multiple_choice',
    options: ['Staying in and relaxing', 'Going out for drinks or dinner', 'Engaging in hobbies', 'Spending time with family', 'Exercising or being outdoors', 'Socializing with friends'],
    required: true,
    order: 7
  },

  // 8. Family vs Independence Scenario
  {
    id: 'family_independence_scenario',
    category: 'Personal Preferences',
    question: 'You and your partner are serious about getting married. Your parents believe it is very important that you live with them after marriage to continue family traditions and care for them. Your partner, however, is accustomed to an independent lifestyle and feels it\'s important for you to have your own space. How do you approach this situation?',
    type: 'single_choice',
    options: ['I would speak with both my parents and my partner to find a compromise, perhaps by living nearby or making a clear plan for how we can all be together.', 'I would prioritize my parents\' wishes and explain to my partner that living with my family is a non-negotiable part of my life and values.', 'I would stand by my partner and politely explain to my parents that we have decided to live independently after marriage.', 'I would make it clear to both sides that we, as a couple, will make the decision that is best for our future, and we would not allow family pressure to influence it.'],
    required: true,
    order: 8
  },

  // 9. Hobbies and Activities
  {
    id: 'hobbies_activities',
    category: 'Personal Preferences',
    question: 'What are some of your favorite hobbies or activities? (Select all that apply)',
    type: 'multiple_choice',
    options: ['Sports', 'Cooking', 'Reading', 'Listening to music', 'Traveling', 'Art or crafts', 'Trekking', 'Watching movies/shows'],
    required: true,
    order: 9
  },

  // 10. Drinking Habits
  {
    id: 'drinking_habits',
    category: 'Personal Preferences',
    question: 'Do you drink?',
    type: 'single_choice',
    options: ['Yes, socially', 'Yes, regularly', 'No'],
    required: true,
    order: 10
  },

  // 11. Smoking Habits
  {
    id: 'smoking_habits',
    category: 'Personal Preferences',
    question: 'Do you smoke?',
    type: 'single_choice',
    options: ['Yes', 'No', 'Sometimes'],
    required: true,
    order: 11
  },

  // 12. Relationship Reasons
  {
    id: 'relationship_reasons',
    category: 'Personal Preferences',
    question: 'In addition to love and affection, what are your main reasons for wanting a relationship? (Select up to 3)',
    type: 'multiple_choice',
    options: ['Emotional security', 'Having a partner I can trust', 'Someone to share my free time with', 'To build a family', 'Life is easier with a partner', 'To not be alone'],
    required: true,
    order: 12
  },

  // 13. Career Opportunity Scenario
  {
    id: 'career_opportunity_scenario',
    category: 'Personal Preferences',
    question: 'Your partner is presented with a once-in-a-lifetime career opportunity that would require them to relocate to another country for two years. They are excited but also hesitant because it would mean a significant change to your life together. How do you respond to this?',
    type: 'single_choice',
    options: ['I would fully support them, no questions asked. Their dream is our dream, and we would figure out a way to make it work together.', 'I\'d be supportive but would want to have a serious conversation about the practical details, like our jobs, finances, and how we\'d maintain the relationship long-distance.', 'I would want to discuss whether this is the right time. I\'d need to feel confident that this big change won\'t negatively impact our relationship.', 'I would be willing to put my own life on hold to move with them, because being together is what\'s most important to me.'],
    required: true,
    order: 13
  },

  // 14. Family Gathering vs Private Time Scenario
  {
    id: 'family_gathering_scenario',
    category: 'Personal Preferences',
    question: 'You and your partner have a rare free weekend. You want to spend it quietly together at home, relaxing and reconnecting. However, your family has planned a large gathering with relatives for the same weekend and expects you both to attend. How do you handle this?',
    type: 'single_choice',
    options: ['The Compromiser: "I would attend the family gathering for a few hours and then politely excuse ourselves to spend some private time together."', 'The Dutiful Relative: "I would prioritize the family gathering, as it is an important obligation, and explain to my partner that we can have our private time later."', 'The Partner-First Person: "I would politely decline the family invitation, explaining that we have other plans, and prioritize my partner and our time together."', 'The Boundary Setter: "I would communicate to my family that while we love them, we need our personal time, and suggest another time for the gathering that works for everyone."'],
    required: true,
    order: 14
  }
]

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api'

// Local storage functions
const QUESTIONNAIRE_STORAGE_KEY = 'questionnaire_responses'

// Save assessment response to new Assessment collection
export async function saveAssessmentResponse(response: QuestionnaireResponse): Promise<void> {
  console.log('💾 Saving assessment to new Assessment collection:', response.userEmail)
  
  try {
    await saveAssessmentResponseAPIWithRetry(response)
    console.log('✅ Assessment successfully saved to Assessment collection:', response.userEmail)
  } catch (error) {
    console.error('❌ FAILED to save assessment to database after all retries:', error)
    throw new Error(`Failed to save assessment to database: ${error}`)
  }
}

// Save questionnaire response DIRECTLY to MongoDB only
export async function saveQuestionnaireResponse(response: QuestionnaireResponse): Promise<void> {
  console.log('💾 Saving questionnaire DIRECTLY to MongoDB:', response.userEmail)
  
  // Always use the Assessment API for questionnaire responses
  if (response.source === 'lead_assessment' || response.source === 'direct_assessment' || response.source === 'user_questionnaire') {
    await saveAssessmentResponse(response)
    return
  }
  
  // Fallback to questionnaire API for other sources
  try {
    await saveQuestionnaireResponseAPIWithRetry(response)
    console.log('✅ Questionnaire successfully saved to MongoDB:', response.userEmail)
  } catch (error) {
    console.error('❌ FAILED to save questionnaire to MongoDB after all retries:', error)
    throw new Error(`Failed to save questionnaire to database: ${error}`)
  }
}


// Import Google Sheets service
import { appendAssessmentToGoogleSheets } from './googleSheetsService'

// Assessment API save function with retry logic
async function saveAssessmentResponseAPIWithRetry(response: QuestionnaireResponse, maxRetries: number = 3): Promise<void> {
  // Get user information from leadId if available
  let name = response.userName || 'Anonymous'
  let phone = response.userPhone || ''
  
  // Try to get lead information if leadId exists
  if (response.leadId && typeof window !== 'undefined') {
    try {
      const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
      const lead = leads.find((l: any) => l.id === response.leadId)
      if (lead) {
        name = lead.name || name
        phone = lead.phone || phone
      }
    } catch (error) {
      console.warn('Could not retrieve lead information:', error)
    }
  }
  
  const assessmentData = {
    name,
    email: response.userEmail || 'anonymous@example.com',
    phone,
    responses: response.responses,
    leadId: response.leadId,
    userId: response.userId,
    completionTime: response.completionTime || 0,
    source: response.source || 'direct_assessment'
  }
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt} to save assessment to backend:`, assessmentData.email)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response_api = await fetch(`${API_BASE_URL}/assessments/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      if (!response_api.ok) {
        const errorData = await response_api.text()
        throw new Error(`API Error: ${response_api.status} - ${errorData}`)
      }

      const result = await response_api.json()
      console.log('✅ Backend assessment save successful:', assessmentData.email)
      
      // Also save to Google Sheets (non-blocking)
      try {
        await appendAssessmentToGoogleSheets({
          ...response,
          name,
          phone,
          _id: result.data?.assessment?.id || response.id,
          createdAt: result.data?.assessment?.completedAt || new Date().toISOString(),
          completedAt: result.data?.assessment?.completedAt || (response.isComplete ? new Date().toISOString() : null)
        })
        console.log('📊 Assessment successfully saved to Google Sheets:', assessmentData.email)
      } catch (sheetsError) {
        console.warn('⚠️ Google Sheets sync failed (non-critical):', sheetsError)
        // Don't fail the whole operation if Google Sheets fails
      }
      
      return // Success, exit retry loop
      
    } catch (error: any) {
      console.error(`❌ Assessment attempt ${attempt} failed:`, error.message)
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to save assessment to backend after ${maxRetries} attempts: ${error.message}`)
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
      console.log(`⏳ Retrying assessment in ${delay/1000} seconds...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

// API save function to backend with retry logic
async function saveQuestionnaireResponseAPIWithRetry(response: QuestionnaireResponse, maxRetries: number = 3): Promise<void> {
  const apiData = {
    userEmail: response.userEmail,
    userName: response.userName,
    userPhone: response.userPhone,
    leadId: response.leadId,
    userId: response.userId,
    userType: response.userType || 'lead',
    source: response.source || 'website',
    responses: response.responses,
    completionTime: response.completionTime || 0,
    metadata: {
      browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      submittedAt: new Date().toISOString(),
      isComplete: response.isComplete
    }
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt} to save questionnaire to backend:`, response.userEmail)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response_api = await fetch(`${API_BASE_URL}/questionnaires/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      if (!response_api.ok) {
        const errorData = await response_api.text()
        throw new Error(`API Error: ${response_api.status} - ${errorData}`)
      }

      const result = await response_api.json()
      console.log('✅ Backend questionnaire save successful:', response.userEmail)
      
      // Also save to Google Sheets (non-blocking)
      try {
        await appendAssessmentToGoogleSheets({
          ...response,
          _id: result.data?.response?._id || response.id,
          createdAt: result.data?.response?.createdAt || new Date().toISOString(),
          completedAt: result.data?.response?.completedAt || (response.isComplete ? new Date().toISOString() : null)
        })
        console.log('📊 Assessment successfully saved to Google Sheets:', response.userEmail)
      } catch (sheetsError) {
        console.warn('⚠️ Google Sheets sync failed (non-critical):', sheetsError)
        // Don't fail the whole operation if Google Sheets fails
      }
      
      return // Success, exit retry loop
      
    } catch (error: any) {
      console.error(`❌ Questionnaire attempt ${attempt} failed:`, error.message)
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to save questionnaire to backend after ${maxRetries} attempts: ${error.message}`)
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
      console.log(`⏳ Retrying questionnaire in ${delay/1000} seconds...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

// Legacy API save function (kept for backward compatibility)
export async function saveQuestionnaireResponseAPI(response: QuestionnaireResponse): Promise<void> {
  return saveQuestionnaireResponseAPIWithRetry(response, 1) // Single attempt for legacy use
}

// Get assessments from new Assessment collection
export async function getAssessmentResponses(): Promise<QuestionnaireResponse[]> {
  try {
    console.log('🔍 Fetching assessment responses from Assessment collection...')
    
    const response = await fetch(`${API_BASE_URL}/assessments/admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    const assessments = result.data.assessments.map((assessment: any) => ({
      id: assessment.id,
      userId: assessment.userId,
      leadId: assessment.leadId,
      userName: assessment.name,
      userEmail: assessment.email,
      userPhone: assessment.phone,
      userType: 'lead', // Most assessments are from leads
      createdAt: assessment.createdAt,
      updatedAt: assessment.createdAt,
      responses: assessment.responses,
      completedAt: assessment.completedAt,
      isComplete: assessment.isComplete,
      source: assessment.source,
      completionTime: assessment.completionTime,
      completionPercentage: assessment.completionPercentage
    }))
    
    console.log(`✅ Fetched ${assessments.length} assessment responses from Assessment collection`)
    return assessments
    
  } catch (error) {
    console.error('❌ Error fetching assessment responses:', error)
    throw new Error(`Failed to fetch assessment responses: ${error}`)
  }
}

// Legacy function for questionnaire responses
export async function getQuestionnaireResponses(): Promise<QuestionnaireResponse[]> {
  try {
    console.log('🔍 Fetching questionnaire responses from MongoDB...')
    
    const response = await fetch(`${API_BASE_URL}/questionnaires/admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    const responses = result.data.responses.map((resp: any) => ({
      id: resp._id,
      userId: resp.userId,
      leadId: resp.leadId,
      userName: resp.userName,
      userEmail: resp.userEmail,
      userPhone: resp.userPhone,
      userType: resp.userType,
      createdAt: resp.createdAt,
      updatedAt: resp.updatedAt,
      responses: resp.responses,
      completedAt: resp.completedAt,
      isComplete: resp.isComplete,
      source: resp.source,
      completionTime: resp.completionTime
    }))
    
    console.log(`✅ Fetched ${responses.length} questionnaire responses from MongoDB`)
    return responses
    
  } catch (error) {
    console.error('❌ Error fetching questionnaire responses from MongoDB:', error)
    throw new Error(`Failed to fetch questionnaire responses: ${error}`)
  }
}

export async function getQuestionnaireResponseByUser(userId: string): Promise<QuestionnaireResponse | null> {
  try {
    const responses = await getQuestionnaireResponses()
    return responses.find(r => r.userId === userId) || null
  } catch (error) {
    console.error('Error fetching questionnaire response by user:', error)
    return null
  }
}

export async function getQuestionnaireResponseByLead(leadId: string): Promise<QuestionnaireResponse | null> {
  try {
    const responses = await getQuestionnaireResponses()
    return responses.find(r => r.leadId === leadId) || null
  } catch (error) {
    console.error('Error fetching questionnaire response by lead:', error)
    return null
  }
}

// Note: deleteQuestionnaireResponse should be updated to call backend API instead of localStorage
export async function deleteQuestionnaireResponse(id: string): Promise<void> {
  try {
    console.log('🗑️ Deleting questionnaire response from MongoDB:', id)
    
    const response = await fetch(`${API_BASE_URL}/questionnaires/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    console.log('✅ Successfully deleted questionnaire response from MongoDB:', id)
  } catch (error) {
    console.error('❌ Error deleting questionnaire response:', error)
    throw new Error(`Failed to delete questionnaire response: ${error}`)
  }
}

// Helper function to calculate compatibility score
export function calculateCompatibilityScore(user1: QuestionnaireResponse, user2: QuestionnaireResponse): number {
  const responses1 = user1.responses
  const responses2 = user2.responses
  
  let totalWeight = 0
  let matchingScore = 0
  
  // Define weights for different categories
  const weights = {
    'Values': 3,
    'Relationship': 2.5,
    'Future': 2,
    'Personality': 1.5,
    'Lifestyle': 1,
    'Social': 1,
    'Compatibility': 3
  }
  
  essentialQuestions.forEach(question => {
    const weight = weights[question.category as keyof typeof weights] || 1
    totalWeight += weight
    
    const answer1 = responses1[question.id]
    const answer2 = responses2[question.id]
    
    if (!answer1 || !answer2) return
    
    // Calculate match based on question type
    if (question.type === 'multiple_choice') {
      const overlap = answer1.filter((a: string) => answer2.includes(a)).length
      const union = Array.from(new Set([...answer1, ...answer2])).length
      matchingScore += (overlap / union) * weight
    } else if (question.type === 'scale') {
      const diff = Math.abs(parseInt(answer1) - parseInt(answer2))
      const maxDiff = question.options!.length - 1
      matchingScore += (1 - diff / maxDiff) * weight
    } else {
      matchingScore += (answer1 === answer2 ? 1 : 0) * weight
    }
  })
  
  return totalWeight > 0 ? Math.round((matchingScore / totalWeight) * 100) : 0
}
