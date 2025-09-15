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

// Essential questionnaire questions for AI matching (15 questions)
export const essentialQuestions: QuestionnaireQuestion[] = [
  // 1. Basic Demographics
  {
    id: 'relationship_type',
    category: 'Basic Info',
    question: 'What type of relationship are you seeking?',
    type: 'single_choice',
    options: ['Marriage', 'Long-term relationship leading to marriage', 'Serious relationship', 'Dating to see where it goes'],
    required: true,
    order: 1
  },
  
  // 2. Personality
  {
    id: 'personality_type',
    category: 'Personality',
    question: 'How would you describe your personality?',
    type: 'single_choice',
    options: ['Very outgoing and social', 'Somewhat outgoing', 'Balanced - depends on situation', 'Prefer smaller groups', 'More introverted and private'],
    required: true,
    order: 2
  },

  // 3. Lifestyle
  {
    id: 'ideal_weekend',
    category: 'Lifestyle',
    question: 'What does your ideal weekend look like?',
    type: 'single_choice',
    options: ['Adventure and outdoor activities', 'Social gatherings with friends', 'Quiet time at home with loved ones', 'Exploring new places and experiences', 'Mix of social and alone time'],
    required: true,
    order: 3
  },

  // 4. Values - Religion
  {
    id: 'religious_importance',
    category: 'Values',
    question: 'How important is religion/spirituality in your life?',
    type: 'scale',
    options: ['Not important at all', 'Slightly important', 'Moderately important', 'Very important', 'Extremely important'],
    required: true,
    order: 4
  },

  // 5. Values - Family
  {
    id: 'family_values',
    category: 'Values',
    question: 'How important is family in your life?',
    type: 'scale',
    options: ['Not very important', 'Somewhat important', 'Important', 'Very important', 'Most important thing'],
    required: true,
    order: 5
  },

  // 6. Career Ambitions
  {
    id: 'career_ambition',
    category: 'Values',
    question: 'How would you describe your career ambitions?',
    type: 'single_choice',
    options: ['Work to live - value work-life balance', 'Moderately ambitious', 'Very career-focused and ambitious', 'Entrepreneurial mindset', 'Flexible - depends on life stage'],
    required: true,
    order: 6
  },

  // 7. Communication Style
  {
    id: 'communication_style',
    category: 'Personality',
    question: 'How do you prefer to communicate in relationships?',
    type: 'single_choice',
    options: ['Very direct and straightforward', 'Gentle and considerate', 'Mix of both depending on situation', 'Through actions more than words', 'Need time to process before discussing'],
    required: true,
    order: 7
  },

  // 8. Lifestyle - Exercise
  {
    id: 'exercise_frequency',
    category: 'Lifestyle',
    question: 'How often do you exercise or stay physically active?',
    type: 'single_choice',
    options: ['Daily - fitness is very important', '3-4 times per week', '1-2 times per week', 'Occasionally when motivated', 'Rarely - prefer other activities'],
    required: true,
    order: 8
  },

  // 9. Travel Preferences
  {
    id: 'travel_enthusiasm',
    category: 'Lifestyle',
    question: 'How much do you enjoy traveling?',
    type: 'single_choice',
    options: ['Love frequent travel and adventures', 'Enjoy occasional trips', 'Prefer familiar places', 'Homebody - travel less important', 'Travel for specific purposes only'],
    required: true,
    order: 9
  },

  // 10. Love Language
  {
    id: 'affection_style',
    category: 'Relationship',
    question: 'How do you prefer to show and receive affection?',
    type: 'multiple_choice',
    options: ['Physical touch and hugs', 'Words of affirmation', 'Quality time together', 'Acts of service', 'Gift giving'],
    required: true,
    order: 10
  },

  // 11. Future Goals - Children
  {
    id: 'children_desire',
    category: 'Future',
    question: 'Do you want to have children?',
    type: 'single_choice',
    options: ['Definitely want children', 'Probably want children', 'Not sure yet', 'Probably do not want children', 'Definitely do not want children'],
    required: true,
    order: 11
  },

  // 12. Living Preferences
  {
    id: 'living_situation_preference',
    category: 'Future',
    question: 'Where would you prefer to live long-term?',
    type: 'single_choice',
    options: ['Big city center', 'Suburban area near city', 'Small town or rural area', 'Flexible based on opportunities', 'International/willing to relocate'],
    required: true,
    order: 12
  },

  // 13. Social Circle Importance
  {
    id: 'social_circle_importance',
    category: 'Social',
    question: 'How important is it that your partner fits in with your friends/family?',
    type: 'scale',
    options: ['Not important', 'Somewhat important', 'Important', 'Very important', 'Essential'],
    required: true,
    order: 13
  },

  // 14. Deal Breakers
  {
    id: 'deal_breakers',
    category: 'Compatibility',
    question: 'Select any absolute deal-breakers for you:',
    type: 'multiple_choice',
    options: ['Smoking', 'Heavy drinking', 'No desire for children', 'Very different religious views', 'Poor financial habits', 'Lack of ambition', 'Different political views', 'Poor communication', 'None of these'],
    required: true,
    order: 14
  },

  // 15. Marriage Timeline
  {
    id: 'marriage_timeline',
    category: 'Marriage',
    question: 'When are you looking to get married?',
    type: 'single_choice',
    options: ['Within 6 months', 'Within 1 year', '1-2 years', '2-3 years', 'No specific timeline', 'Just exploring options'],
    required: true,
    order: 15
  }
]

// Local storage functions
const QUESTIONNAIRE_STORAGE_KEY = 'questionnaire_responses'

export function saveQuestionnaireResponse(response: QuestionnaireResponse): void {
  const existing = getQuestionnaireResponses()
  const updated = existing.filter(r => r.id !== response.id)
  
  // Auto-populate user information if not provided
  if (!response.userName || !response.userEmail) {
    if (response.leadId) {
      // Try to get lead information
      try {
        const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
        const lead = leads.find((l: any) => l.id === response.leadId)
        if (lead) {
          response.userName = lead.name
          response.userEmail = lead.email
          response.userPhone = lead.phone
          response.userType = 'lead'
        }
      } catch (error) {
        console.error('Error loading lead data:', error)
      }
    } else if (response.userId) {
      // Try to get user information
      try {
        const users = JSON.parse(localStorage.getItem('makemyknot_users') || '[]')
        const user = users.find((u: any) => u.id === response.userId)
        if (user) {
          response.userName = user.name
          response.userEmail = user.email
          response.userPhone = user.phone
          response.userType = 'user'
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }
  }
  
  updated.push(response)
  localStorage.setItem(QUESTIONNAIRE_STORAGE_KEY, JSON.stringify(updated))
}

export function getQuestionnaireResponses(): QuestionnaireResponse[] {
  try {
    const data = localStorage.getItem(QUESTIONNAIRE_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error loading questionnaire responses:', error)
    return []
  }
}

export function getQuestionnaireResponseByUser(userId: string): QuestionnaireResponse | null {
  const responses = getQuestionnaireResponses()
  return responses.find(r => r.userId === userId) || null
}

export function getQuestionnaireResponseByLead(leadId: string): QuestionnaireResponse | null {
  const responses = getQuestionnaireResponses()
  return responses.find(r => r.leadId === leadId) || null
}

export function deleteQuestionnaireResponse(id: string): void {
  const existing = getQuestionnaireResponses()
  const filtered = existing.filter(r => r.id !== id)
  localStorage.setItem(QUESTIONNAIRE_STORAGE_KEY, JSON.stringify(filtered))
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
