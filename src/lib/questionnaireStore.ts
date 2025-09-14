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

// Comprehensive questionnaire questions for AI matching (48+ questions)
export const comprehensiveQuestions: QuestionnaireQuestion[] = [
  // Basic Demographics & Preferences
  {
    id: 'gender',
    category: 'Basic Info',
    question: 'What is your gender?',
    type: 'single_choice',
    options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
    required: true,
    order: 1
  },
  {
    id: 'looking_for_gender',
    category: 'Basic Info',
    question: 'What gender are you looking for in a partner?',
    type: 'single_choice',
    options: ['Male', 'Female', 'Any gender', 'Prefer not to specify'],
    required: true,
    order: 2
  },
  {
    id: 'relationship_type',
    category: 'Basic Info',
    question: 'What type of relationship are you seeking?',
    type: 'single_choice',
    options: ['Marriage', 'Long-term relationship leading to marriage', 'Serious relationship', 'Dating to see where it goes', 'Companionship'],
    required: true,
    order: 3
  },
  
  // Personality & Character
  {
    id: 'personality_type',
    category: 'Personality',
    question: 'How would you describe your personality?',
    type: 'single_choice',
    options: ['Very outgoing and social', 'Somewhat outgoing', 'Balanced - depends on situation', 'Prefer smaller groups', 'More introverted and private'],
    required: true,
    order: 4
  },
  {
    id: 'ideal_weekend',
    category: 'Lifestyle',
    question: 'What does your ideal weekend look like?',
    type: 'single_choice',
    options: ['Adventure and outdoor activities', 'Social gatherings and parties', 'Quiet time at home with loved ones', 'Exploring new places and experiences', 'Mix of social and alone time'],
    required: true,
    order: 5
  },
  {
    id: 'communication_style',
    category: 'Personality',
    question: 'How do you prefer to communicate in relationships?',
    type: 'single_choice',
    options: ['Very direct and straightforward', 'Gentle and considerate', 'Mix of both depending on situation', 'Through actions more than words', 'Need time to process before discussing'],
    required: true,
    order: 6
  },
  {
    id: 'conflict_resolution',
    category: 'Personality',
    question: 'How do you handle disagreements in relationships?',
    type: 'single_choice',
    options: ['Address immediately and directly', 'Take time to cool down first', 'Seek compromise and middle ground', 'Avoid conflict when possible', 'Need mediator/counselor help'],
    required: true,
    order: 7
  },
  
  // Values & Beliefs
  {
    id: 'religious_importance',
    category: 'Values',
    question: 'How important is religion/spirituality in your life?',
    type: 'scale',
    options: ['Not important at all', 'Slightly important', 'Moderately important', 'Very important', 'Extremely important'],
    required: true,
    order: 8
  },
  {
    id: 'family_values',
    category: 'Values',
    question: 'How important is family in your life?',
    type: 'scale',
    options: ['Not very important', 'Somewhat important', 'Important', 'Very important', 'Most important thing'],
    required: true,
    order: 9
  },
  {
    id: 'career_ambition',
    category: 'Values',
    question: 'How would you describe your career ambitions?',
    type: 'single_choice',
    options: ['Work to live - value work-life balance', 'Moderately ambitious', 'Very career-focused and ambitious', 'Entrepreneurial and risk-taking', 'Flexible - depends on life stage'],
    required: true,
    order: 10
  },
  
  // Lifestyle & Habits
  {
    id: 'exercise_frequency',
    category: 'Lifestyle',
    question: 'How often do you exercise or stay physically active?',
    type: 'single_choice',
    options: ['Daily - fitness is very important', '3-4 times per week', '1-2 times per week', 'Occasionally/when motivated', 'Rarely - prefer other activities'],
    required: true,
    order: 11
  },
  {
    id: 'social_drinking',
    category: 'Lifestyle',
    question: 'What is your relationship with alcohol?',
    type: 'single_choice',
    options: ["Don't drink at all", 'Rarely - special occasions only', 'Social drinker - weekends/events', 'Regular but moderate', 'Prefer not to answer'],
    required: true,
    order: 12
  },
  {
    id: 'travel_enthusiasm',
    category: 'Lifestyle',
    question: 'How much do you enjoy traveling?',
    type: 'single_choice',
    options: ['Love frequent travel and adventures', 'Enjoy occasional trips', 'Prefer familiar places', 'Homebody - travel less important', 'Travel for specific purposes only'],
    required: true,
    order: 13
  },
  
  // Relationship Preferences
  {
    id: 'affection_style',
    category: 'Relationship',
    question: 'How do you prefer to show and receive affection?',
    type: 'multiple_choice',
    options: ['Physical touch and hugs', 'Words of affirmation', 'Quality time together', 'Acts of service', 'Gift giving'],
    required: true,
    order: 14
  },
  {
    id: 'alone_time_need',
    category: 'Relationship',
    question: 'How much alone time do you need in a relationship?',
    type: 'single_choice',
    options: ['Very little - prefer being together', 'Some alone time is nice', 'Need regular personal space', 'Significant alone time required', 'Varies by mood and situation'],
    required: true,
    order: 15
  },
  {
    id: 'financial_approach',
    category: 'Relationship',
    question: 'What is your approach to finances in relationships?',
    type: 'single_choice',
    options: ['Completely shared finances', 'Shared major expenses, separate personal', 'Proportional contribution based on income', 'Keep finances mostly separate', 'Flexible - depends on situation'],
    required: true,
    order: 16
  },
  
  // Future Goals
  {
    id: 'children_desire',
    category: 'Future',
    question: 'Do you want to have children?',
    type: 'single_choice',
    options: ['Definitely want children', 'Probably want children', 'Not sure yet', 'Probably do not want children', 'Definitely do not want children'],
    required: true,
    order: 17
  },
  {
    id: 'living_situation_preference',
    category: 'Future',
    question: 'Where would you prefer to live long-term?',
    type: 'single_choice',
    options: ['Big city center', 'Suburban area near city', 'Small town or rural area', 'Flexible based on opportunities', 'International/willing to relocate'],
    required: true,
    order: 18
  },
  {
    id: 'retirement_goals',
    category: 'Future',
    question: 'What are your long-term financial/retirement goals?',
    type: 'single_choice',
    options: ['Early retirement and financial independence', 'Traditional retirement planning', 'Work as long as enjoying it', 'Focus on experiences over savings', 'Haven\'t thought much about it yet'],
    required: true,
    order: 19
  },
  
  // Compatibility Factors
  {
    id: 'political_values',
    category: 'Values',
    question: 'How important is political compatibility?',
    type: 'single_choice',
    options: ['Must share similar views', 'Prefer similar but open to differences', 'Not very important', 'Enjoy respectful political discussions', 'Prefer to avoid politics completely'],
    required: true,
    order: 20
  },
  {
    id: 'social_circle_importance',
    category: 'Social',
    question: 'How important is it that your partner fits in with your friends/family?',
    type: 'scale',
    options: ['Not important', 'Somewhat important', 'Important', 'Very important', 'Essential'],
    required: true,
    order: 21
  },
  {
    id: 'personal_growth',
    category: 'Values',
    question: 'How important is personal growth and self-improvement?',
    type: 'scale',
    options: ['Not focused on it', 'Somewhat important', 'Important to me', 'Very important', 'Central to my life philosophy'],
    required: true,
    order: 22
  },
  {
    id: 'deal_breakers',
    category: 'Compatibility',
    question: 'Select any absolute deal-breakers for you:',
    type: 'multiple_choice',
    options: ['Smoking', 'Heavy drinking', 'No desire for children', 'Very different religious views', 'Poor financial habits', 'Lack of ambition', 'Different political views', 'Poor communication', 'None of these'],
    required: true,
    order: 23
  },

  // Physical Attributes & Health
  {
    id: 'height',
    category: 'Physical',
    question: 'What is your height?',
    type: 'single_choice',
    options: ['Under 5\'0"', '5\'0" - 5\'3"', '5\'4" - 5\'6"', '5\'7" - 5\'9"', '5\'10" - 6\'0"', '6\'1" - 6\'3"', 'Over 6\'3"'],
    required: true,
    order: 21
  },
  {
    id: 'weight_fitness',
    category: 'Physical',
    question: 'How would you describe your body type?',
    type: 'single_choice',
    options: ['Athletic/Muscular', 'Slim/Lean', 'Average', 'Curvy', 'Plus-size', 'Prefer not to say'],
    required: true,
    order: 22
  },
  {
    id: 'health_conditions',
    category: 'Health',
    question: 'Do you have any chronic health conditions?',
    type: 'single_choice',
    options: ['No health issues', 'Minor manageable conditions', 'Some health concerns', 'Prefer to discuss privately', 'Prefer not to answer'],
    required: true,
    order: 23
  },
  {
    id: 'blood_group',
    category: 'Health',
    question: 'What is your blood group? (For compatibility)',
    type: 'single_choice',
    options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown', 'Prefer not to share'],
    required: true,
    order: 24
  },
  {
    id: 'genetic_concerns',
    category: 'Health',
    question: 'Are there any hereditary conditions in your family?',
    type: 'single_choice',
    options: ['No known hereditary conditions', 'Minor hereditary conditions', 'Some hereditary concerns', 'Would discuss with serious partner', 'Prefer not to answer'],
    required: true,
    order: 25
  },

  // Detailed Lifestyle & Habits
  {
    id: 'smoking_habits',
    category: 'Lifestyle',
    question: 'What is your relationship with smoking?',
    type: 'single_choice',
    options: ['Never smoked', 'Former smoker (quit)', 'Occasional social smoker', 'Regular smoker', 'Trying to quit'],
    required: true,
    order: 26
  },
  {
    id: 'diet_preferences',
    category: 'Lifestyle',
    question: 'What are your dietary preferences?',
    type: 'single_choice',
    options: ['Vegetarian', 'Vegan', 'Non-vegetarian', 'Jain vegetarian', 'Eggetarian', 'No specific restrictions', 'Other dietary restrictions'],
    required: true,
    order: 27
  },
  {
    id: 'cooking_skills',
    category: 'Lifestyle',
    question: 'How would you rate your cooking abilities?',
    type: 'single_choice',
    options: ['Excellent cook', 'Good cook', 'Basic cooking skills', 'Can manage simple meals', 'Rarely cook', 'Cannot cook'],
    required: true,
    order: 28
  },

  // Professional & Financial Details
  {
    id: 'education_level',
    category: 'Professional',
    question: 'What is your highest level of education?',
    type: 'single_choice',
    options: ['High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD/Doctorate', 'Professional Degree (MD, JD, etc.)', 'Trade/Vocational Training', 'Other'],
    required: true,
    order: 29
  },
  {
    id: 'profession',
    category: 'Professional',
    question: 'What is your profession/career field?',
    type: 'single_choice',
    options: ['Technology/IT', 'Healthcare/Medical', 'Business/Finance', 'Education', 'Legal', 'Engineering', 'Government', 'Arts/Creative', 'Self-employed', 'Other'],
    required: true,
    order: 30
  },
  {
    id: 'income_expectations',
    category: 'Financial',
    question: 'What are your financial expectations from a partner?',
    type: 'single_choice',
    options: ['Should earn more than me', 'Should earn similar to me', 'Income doesn\'t matter much', 'Should be financially stable', 'Open to supporting if needed'],
    required: true,
    order: 31
  },
  {
    id: 'current_income',
    category: 'Financial',
    question: 'What is your current annual income range?',
    type: 'single_choice',
    options: ['Under ₹3 Lakhs', '₹3-6 Lakhs', '₹6-10 Lakhs', '₹10-15 Lakhs', '₹15-25 Lakhs', '₹25-50 Lakhs', 'Above ₹50 Lakhs', 'Prefer not to say'],
    required: true,
    order: 32
  },

  // Family Background & Details
  {
    id: 'family_type',
    category: 'Family',
    question: 'What type of family do you come from?',
    type: 'single_choice',
    options: ['Nuclear family', 'Joint family', 'Extended family', 'Single parent family', 'Live independently'],
    required: true,
    order: 33
  },
  {
    id: 'siblings',
    category: 'Family',
    question: 'How many siblings do you have?',
    type: 'single_choice',
    options: ['No siblings', '1 sibling', '2 siblings', '3 siblings', 'More than 3 siblings'],
    required: true,
    order: 34
  },
  {
    id: 'parents_occupation',
    category: 'Family',
    question: 'What is your father\'s occupation?',
    type: 'single_choice',
    options: ['Business', 'Government Service', 'Private Service', 'Professional (Doctor/Lawyer)', 'Retired', 'Agriculture', 'Other', 'Not applicable'],
    required: true,
    order: 35
  },
  {
    id: 'family_values_traditional',
    category: 'Family',
    question: 'How traditional is your family?',
    type: 'single_choice',
    options: ['Very traditional', 'Moderately traditional', 'Modern with some traditions', 'Very modern', 'Mix of both'],
    required: true,
    order: 36
  },

  // Religious & Cultural Background
  {
    id: 'religion',
    category: 'Religion',
    question: 'What is your religion?',
    type: 'single_choice',
    options: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Jewish', 'Other', 'No religion'],
    required: true,
    order: 37
  },
  {
    id: 'caste_importance',
    category: 'Religion',
    question: 'How important is caste/community in marriage for you?',
    type: 'single_choice',
    options: ['Very important', 'Somewhat important', 'Not very important', 'Not important at all', 'Open to intercaste'],
    required: true,
    order: 38
  },
  {
    id: 'mother_tongue',
    category: 'Cultural',
    question: 'What is your mother tongue?',
    type: 'single_choice',
    options: ['Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Other'],
    required: true,
    order: 39
  },
  {
    id: 'cultural_values',
    category: 'Cultural',
    question: 'How important is preserving cultural traditions?',
    type: 'scale',
    options: ['Not important', 'Slightly important', 'Moderately important', 'Very important', 'Extremely important'],
    required: true,
    order: 40
  },

  // Marriage & Relationship Expectations
  {
    id: 'marriage_timeline',
    category: 'Marriage',
    question: 'When are you looking to get married?',
    type: 'single_choice',
    options: ['Within 6 months', 'Within 1 year', '1-2 years', '2-3 years', 'No specific timeline', 'Just exploring options'],
    required: true,
    order: 41
  },
  {
    id: 'wedding_type',
    category: 'Marriage',
    question: 'What type of wedding do you prefer?',
    type: 'single_choice',
    options: ['Grand traditional wedding', 'Medium celebration', 'Simple ceremony', 'Destination wedding', 'Court marriage', 'Whatever partner prefers'],
    required: true,
    order: 42
  },
  {
    id: 'post_marriage_work',
    category: 'Marriage',
    question: 'How do you feel about your spouse working after marriage?',
    type: 'single_choice',
    options: ['Definitely should work', 'Should work if they want', 'Prefer they focus on family', 'Can decide together later', 'No preference'],
    required: true,
    order: 43
  },
  {
    id: 'living_arrangement',
    category: 'Marriage',
    question: 'What are your preferred living arrangements after marriage?',
    type: 'single_choice',
    options: ['Live with my family', 'Live with spouse\'s family', 'Live independently', 'Alternate between families', 'Open to discussion'],
    required: true,
    order: 44
  },
  {
    id: 'children_timeline',
    category: 'Future',
    question: 'If you want children, when would you prefer to have them?',
    type: 'single_choice',
    options: ['Within 1-2 years of marriage', '2-3 years after marriage', '3-5 years after marriage', 'After 5+ years', 'No specific timeline', 'Don\'t want children'],
    required: true,
    order: 45
  },

  // Final Compatibility Questions
  {
    id: 'partner_age_preference',
    category: 'Preferences',
    question: 'What age range do you prefer for your partner?',
    type: 'single_choice',
    options: ['Younger than me', 'Same age as me', 'Older than me', '1-3 years difference', '3-5 years difference', 'Age doesn\'t matter'],
    required: true,
    order: 46
  },
  {
    id: 'long_distance',
    category: 'Preferences',
    question: 'Are you open to long-distance relationships initially?',
    type: 'single_choice',
    options: ['Yes, completely open', 'Yes, if the person is right', 'Prefer local but open to discuss', 'Only local matches', 'No long-distance relationships'],
    required: true,
    order: 47
  },
  {
    id: 'remarriage_acceptance',
    category: 'Preferences',
    question: 'Are you open to marrying someone who was previously married?',
    type: 'single_choice',
    options: ['Yes, completely open', 'Yes, depending on circumstances', 'Open but prefer first marriage', 'Only first marriage', 'Would need to discuss'],
    required: true,
    order: 48
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
  
  comprehensiveQuestions.forEach(question => {
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
