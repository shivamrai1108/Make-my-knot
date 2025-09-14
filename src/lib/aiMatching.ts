import { QuestionnaireResponse, calculateCompatibilityScore, getQuestionnaireResponses, comprehensiveQuestions } from './questionnaireStore'

export interface MatchCandidate {
  id: string
  name: string
  email?: string
  phone?: string
  userType: 'user' | 'lead'
  questionnaireResponse: QuestionnaireResponse
  profilePicture?: string
  location?: string
  age?: number
  profession?: string
  education?: string
}

export interface MatchResult {
  candidate: MatchCandidate
  compatibilityScore: number
  sharedInterests: string[]
  matchingSections: string[]
  potentialConcerns: string[]
  summary: string
}

// Advanced AI matching algorithm with gender filtering
export function findCompatibleMatches(
  userResponse: QuestionnaireResponse,
  minCompatibilityScore: number = 70,
  maxResults: number = 10
): MatchResult[] {
  const allResponses = getQuestionnaireResponses()
  const potentialMatches: MatchResult[] = []

  // Get user's gender and preference
  const userGender = userResponse.responses.gender
  const lookingForGender = userResponse.responses.looking_for_gender

  // Filter candidates based on gender compatibility
  const otherResponses = allResponses.filter(r => {
    if (r.id === userResponse.id || !r.isComplete) return false
    
    const candidateGender = r.responses.gender
    const candidateLookingFor = r.responses.looking_for_gender
    
    // Check if genders match preferences (mutual compatibility)
    const userWantsCandidate = lookingForGender === 'Any gender' || lookingForGender === candidateGender
    const candidateWantsUser = candidateLookingFor === 'Any gender' || candidateLookingFor === userGender
    
    return userWantsCandidate && candidateWantsUser
  })

  otherResponses.forEach(otherResponse => {
    const compatibilityScore = calculateCompatibilityScore(userResponse, otherResponse)
    
    if (compatibilityScore >= minCompatibilityScore) {
      const matchResult = analyzeCompatibility(userResponse, otherResponse, compatibilityScore)
      if (matchResult) {
        potentialMatches.push(matchResult)
      }
    }
  })

  // Sort by compatibility score (descending)
  potentialMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore)

  return potentialMatches.slice(0, maxResults)
}

// Detailed compatibility analysis
function analyzeCompatibility(
  user1: QuestionnaireResponse,
  user2: QuestionnaireResponse,
  compatibilityScore: number
): MatchResult | null {
  const candidate = createMatchCandidate(user2)
  if (!candidate) return null

  const responses1 = user1.responses
  const responses2 = user2.responses

  const sharedInterests: string[] = []
  const matchingSections: string[] = []
  const potentialConcerns: string[] = []

  // Analyze by categories
  const categoryMatches = analyzeCategoryCompatibility(responses1, responses2)
  
  // Find shared interests and values
  if (responses1.affection_style && responses2.affection_style) {
    const shared = responses1.affection_style.filter((style: string) => 
      responses2.affection_style?.includes(style)
    )
    sharedInterests.push(...shared)
  }

  // Matching sections (high compatibility areas)
  Object.entries(categoryMatches).forEach(([category, score]) => {
    if (score >= 80) {
      matchingSections.push(category)
    } else if (score < 50) {
      potentialConcerns.push(category)
    }
  })

  // Check for potential deal-breakers
  const dealBreakers = checkDealBreakers(responses1, responses2)
  potentialConcerns.push(...dealBreakers)

  const summary = generateMatchSummary(compatibilityScore, matchingSections, sharedInterests, potentialConcerns)

  return {
    candidate,
    compatibilityScore,
    sharedInterests,
    matchingSections,
    potentialConcerns,
    summary
  }
}

// Create match candidate from questionnaire response
function createMatchCandidate(response: QuestionnaireResponse): MatchCandidate | null {
  if (!response.userName && !response.userEmail) {
    return null // Cannot create candidate without basic info
  }

  const candidate: MatchCandidate = {
    id: response.id,
    name: response.userName || 'Anonymous',
    email: response.userEmail,
    phone: response.userPhone,
    userType: response.userType || 'user',
    questionnaireResponse: response
  }

  // Extract additional info from responses
  if (response.responses) {
    const { responses } = response
    
    // Add location if available
    if (responses.living_situation_preference) {
      candidate.location = responses.living_situation_preference
    }

    // Add profession
    if (responses.profession) {
      candidate.profession = responses.profession
    }

    // Add education
    if (responses.education_level) {
      candidate.education = responses.education_level
    }
  }

  return candidate
}

// Analyze compatibility by category
function analyzeCategoryCompatibility(
  responses1: Record<string, any>,
  responses2: Record<string, any>
): Record<string, number> {
  const categoryScores: Record<string, number> = {}

  // Group questions by category
  const questionsByCategory: Record<string, typeof comprehensiveQuestions> = {}
  comprehensiveQuestions.forEach(q => {
    if (!questionsByCategory[q.category]) {
      questionsByCategory[q.category] = []
    }
    questionsByCategory[q.category].push(q)
  })

  // Calculate score for each category
  Object.entries(questionsByCategory).forEach(([category, questions]) => {
    let totalScore = 0
    let questionCount = 0

    questions.forEach(question => {
      const answer1 = responses1[question.id]
      const answer2 = responses2[question.id]

      if (answer1 && answer2) {
        questionCount++
        
        if (question.type === 'multiple_choice') {
          const overlap = answer1.filter((a: string) => answer2.includes(a)).length
          const union = Array.from(new Set([...answer1, ...answer2])).length
          totalScore += (overlap / union) * 100
        } else if (question.type === 'scale') {
          const diff = Math.abs(parseInt(answer1) - parseInt(answer2))
          const maxDiff = question.options!.length - 1
          totalScore += (1 - diff / maxDiff) * 100
        } else {
          totalScore += (answer1 === answer2 ? 100 : 0)
        }
      }
    })

    categoryScores[category] = questionCount > 0 ? totalScore / questionCount : 0
  })

  return categoryScores
}

// Check for potential deal-breakers
function checkDealBreakers(
  responses1: Record<string, any>,
  responses2: Record<string, any>
): string[] {
  const concerns: string[] = []

  // Children compatibility
  if (responses1.children_desire && responses2.children_desire) {
    const desire1 = responses1.children_desire.toLowerCase()
    const desire2 = responses2.children_desire.toLowerCase()
    
    if ((desire1.includes('definitely want') && desire2.includes('definitely do not want')) ||
        (desire1.includes('definitely do not want') && desire2.includes('definitely want'))) {
      concerns.push('Strong disagreement on having children')
    }
  }

  // Religious compatibility
  if (responses1.religious_importance && responses2.religious_importance) {
    const religious1 = parseInt(responses1.religious_importance)
    const religious2 = parseInt(responses2.religious_importance)
    
    if (Math.abs(religious1 - religious2) >= 3) {
      concerns.push('Significant difference in religious importance')
    }
  }

  // Lifestyle compatibility (smoking, drinking)
  if (responses1.smoking_habits && responses2.smoking_habits) {
    if (responses1.smoking_habits === 'Regular smoker' && responses2.smoking_habits === 'Never smoked') {
      concerns.push('Smoking habits difference')
    }
  }

  // Financial expectations
  if (responses1.income_expectations && responses2.current_income) {
    // Add logic for income compatibility analysis
    // This is simplified - you could make it more sophisticated
  }

  return concerns
}

// Generate AI-powered match summary
function generateMatchSummary(
  compatibilityScore: number,
  matchingSections: string[],
  sharedInterests: string[],
  concerns: string[]
): string {
  let summary = ''

  if (compatibilityScore >= 90) {
    summary = 'Exceptional compatibility! '
  } else if (compatibilityScore >= 80) {
    summary = 'Very strong compatibility. '
  } else if (compatibilityScore >= 70) {
    summary = 'Good compatibility potential. '
  } else {
    summary = 'Moderate compatibility. '
  }

  if (matchingSections.length > 0) {
    summary += `You align particularly well in ${matchingSections.slice(0, 2).join(' and ')}.`
  }

  if (sharedInterests.length > 0) {
    summary += ` You both value ${sharedInterests.slice(0, 2).join(' and ')}.`
  }

  if (concerns.length > 0) {
    summary += ` Consider discussing ${concerns[0]} to ensure alignment.`
  } else {
    summary += ' No significant concerns identified.'
  }

  return summary
}

// Get match recommendations for a user
export function getMatchRecommendations(userId?: string, leadId?: string): MatchResult[] {
  const allResponses = getQuestionnaireResponses()
  
  const userResponse = userId 
    ? allResponses.find(r => r.userId === userId)
    : leadId 
      ? allResponses.find(r => r.leadId === leadId)
      : null

  if (!userResponse || !userResponse.isComplete) {
    return []
  }

  return findCompatibleMatches(userResponse, 70, 10)
}

// Calculate relationship strength prediction
export function calculateRelationshipStrength(match: MatchResult): {
  strength: 'Low' | 'Moderate' | 'High' | 'Exceptional'
  factors: string[]
  recommendations: string[]
} {
  const { compatibilityScore, matchingSections, potentialConcerns } = match

  let strength: 'Low' | 'Moderate' | 'High' | 'Exceptional'
  const factors: string[] = []
  const recommendations: string[] = []

  if (compatibilityScore >= 90) {
    strength = 'Exceptional'
    factors.push('Outstanding overall compatibility')
  } else if (compatibilityScore >= 80) {
    strength = 'High'
    factors.push('Strong compatibility across multiple areas')
  } else if (compatibilityScore >= 70) {
    strength = 'Moderate'
    factors.push('Good foundation with some areas for growth')
  } else {
    strength = 'Low'
    factors.push('Limited compatibility, significant differences')
  }

  // Add specific factors
  if (matchingSections.includes('Values')) {
    factors.push('Shared core values and beliefs')
  }
  if (matchingSections.includes('Future')) {
    factors.push('Aligned life goals and timeline')
  }
  if (matchingSections.includes('Relationship')) {
    factors.push('Compatible relationship styles')
  }

  // Add recommendations
  if (potentialConcerns.length === 0) {
    recommendations.push('Excellent match - proceed with confidence')
  } else {
    recommendations.push(`Discuss ${potentialConcerns[0]} early in relationship`)
  }

  if (strength === 'Exceptional' || strength === 'High') {
    recommendations.push('Consider meeting in person soon')
    recommendations.push('Focus on building emotional connection')
  } else {
    recommendations.push('Take time to understand differences')
    recommendations.push('Focus on building friendship first')
  }

  return { strength, factors, recommendations }
}
