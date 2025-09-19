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
