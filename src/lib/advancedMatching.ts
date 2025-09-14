// Advanced AI-Powered Matching Algorithm for Make My Knot
// This implements sophisticated compatibility scoring based on multiple factors

export interface UserProfile {
  id: string
  age: number
  location: {
    city: string
    state: string
    coordinates?: { lat: number; lng: number }
  }
  education: string
  profession: string
  income?: number
  religion: string
  caste?: string
  interests: string[]
  values: {
    familyImportance: number // 1-10 scale
    careerAmbition: number
    religiousValues: number
    traditionalValues: number
    socialLife: number
  }
  lifestyle: {
    smokingHabits: 'never' | 'occasionally' | 'regularly'
    drinkingHabits: 'never' | 'socially' | 'regularly'
    exerciseFrequency: number // times per week
    dietPreference: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'flexible'
  }
  personalityTraits: {
    extroversion: number // 1-10
    openness: number
    agreeableness: number
    conscientiousness: number
    emotionalStability: number
  }
  relationshipGoals: {
    timelineToMarriage: 'within-year' | '1-2-years' | '2-3-years' | 'flexible'
    childrenDesired: boolean
    numberOfChildren?: number
    livingWithParents: boolean
  }
  preferences: {
    ageRange: { min: number; max: number }
    educationPreference: string[]
    professionPreference: string[]
    locationPreference: string[]
    incomeExpectation?: number
  }
  questionnaireResponses?: Record<string, any>
}

export interface MatchScore {
  userId: string
  overallScore: number // 0-100
  categoryScores: {
    basicCompatibility: number
    personalityMatch: number
    lifestyleAlignment: number
    valuesAlignment: number
    goalsCompatibility: number
    preferencesMatch: number
  }
  strengths: string[]
  concerns: string[]
  explanation: string
}

export class AdvancedMatchingEngine {
  
  // Calculate comprehensive compatibility score
  calculateCompatibility(user1: UserProfile, user2: UserProfile): MatchScore {
    const scores = {
      basicCompatibility: this.calculateBasicCompatibility(user1, user2),
      personalityMatch: this.calculatePersonalityMatch(user1, user2),
      lifestyleAlignment: this.calculateLifestyleAlignment(user1, user2),
      valuesAlignment: this.calculateValuesAlignment(user1, user2),
      goalsCompatibility: this.calculateGoalsCompatibility(user1, user2),
      preferencesMatch: this.calculatePreferencesMatch(user1, user2)
    }

    // Weighted overall score
    const weights = {
      basicCompatibility: 0.15,
      personalityMatch: 0.25,
      lifestyleAlignment: 0.20,
      valuesAlignment: 0.20,
      goalsCompatibility: 0.15,
      preferencesMatch: 0.05
    }

    const overallScore = Object.entries(scores).reduce((total, [category, score]) => {
      return total + (score * weights[category as keyof typeof weights])
    }, 0)

    const strengths = this.identifyStrengths(scores, user1, user2)
    const concerns = this.identifyConcerns(scores, user1, user2)
    const explanation = this.generateExplanation(scores, overallScore)

    return {
      userId: user2.id,
      overallScore: Math.round(overallScore),
      categoryScores: scores,
      strengths,
      concerns,
      explanation
    }
  }

  // Basic demographic compatibility
  private calculateBasicCompatibility(user1: UserProfile, user2: UserProfile): number {
    let score = 0
    let factors = 0

    // Age compatibility
    const ageDiff = Math.abs(user1.age - user2.age)
    if (ageDiff <= 2) score += 100
    else if (ageDiff <= 5) score += 80
    else if (ageDiff <= 8) score += 60
    else if (ageDiff <= 12) score += 40
    else score += 20
    factors++

    // Education compatibility
    const educationLevels = ['high-school', 'bachelors', 'masters', 'phd']
    const user1EduIndex = educationLevels.findIndex(level => 
      user1.education.toLowerCase().includes(level.replace('-', ' '))
    )
    const user2EduIndex = educationLevels.findIndex(level => 
      user2.education.toLowerCase().includes(level.replace('-', ' '))
    )
    
    if (user1EduIndex !== -1 && user2EduIndex !== -1) {
      const eduDiff = Math.abs(user1EduIndex - user2EduIndex)
      if (eduDiff === 0) score += 100
      else if (eduDiff === 1) score += 80
      else score += 60
    } else {
      score += 70 // neutral if can't determine
    }
    factors++

    // Location proximity (simplified)
    if (user1.location.city.toLowerCase() === user2.location.city.toLowerCase()) {
      score += 100
    } else if (user1.location.state.toLowerCase() === user2.location.state.toLowerCase()) {
      score += 70
    } else {
      score += 40
    }
    factors++

    // Religious compatibility
    if (user1.religion.toLowerCase() === user2.religion.toLowerCase()) {
      score += 100
    } else {
      score += 30
    }
    factors++

    return score / factors
  }

  // Personality compatibility using Big Five traits
  private calculatePersonalityMatch(user1: UserProfile, user2: UserProfile): number {
    const traits = ['extroversion', 'openness', 'agreeableness', 'conscientiousness', 'emotionalStability']
    let totalScore = 0

    traits.forEach(trait => {
      const user1Value = user1.personalityTraits[trait as keyof typeof user1.personalityTraits]
      const user2Value = user2.personalityTraits[trait as keyof typeof user2.personalityTraits]
      
      // Calculate compatibility based on trait type
      let traitScore: number
      
      if (trait === 'extroversion') {
        // Extroversion: moderate difference is often good
        const diff = Math.abs(user1Value - user2Value)
        if (diff <= 2) traitScore = 100
        else if (diff <= 4) traitScore = 85
        else traitScore = 70
      } else {
        // Other traits: closer values are better
        const diff = Math.abs(user1Value - user2Value)
        if (diff <= 1) traitScore = 100
        else if (diff <= 2) traitScore = 85
        else if (diff <= 3) traitScore = 70
        else traitScore = 50
      }
      
      totalScore += traitScore
    })

    return totalScore / traits.length
  }

  // Lifestyle compatibility
  private calculateLifestyleAlignment(user1: UserProfile, user2: UserProfile): number {
    let score = 0
    let factors = 0

    // Smoking compatibility
    if (user1.lifestyle.smokingHabits === user2.lifestyle.smokingHabits) {
      score += 100
    } else if (
      (user1.lifestyle.smokingHabits === 'never' && user2.lifestyle.smokingHabits === 'occasionally') ||
      (user2.lifestyle.smokingHabits === 'never' && user1.lifestyle.smokingHabits === 'occasionally')
    ) {
      score += 60
    } else {
      score += 30
    }
    factors++

    // Drinking compatibility
    if (user1.lifestyle.drinkingHabits === user2.lifestyle.drinkingHabits) {
      score += 100
    } else if (
      (user1.lifestyle.drinkingHabits === 'never' && user2.lifestyle.drinkingHabits === 'socially') ||
      (user2.lifestyle.drinkingHabits === 'never' && user1.lifestyle.drinkingHabits === 'socially')
    ) {
      score += 70
    } else {
      score += 40
    }
    factors++

    // Diet compatibility
    if (user1.lifestyle.dietPreference === user2.lifestyle.dietPreference) {
      score += 100
    } else if (user1.lifestyle.dietPreference === 'flexible' || user2.lifestyle.dietPreference === 'flexible') {
      score += 80
    } else {
      score += 40
    }
    factors++

    // Exercise compatibility
    const exerciseDiff = Math.abs(user1.lifestyle.exerciseFrequency - user2.lifestyle.exerciseFrequency)
    if (exerciseDiff <= 1) score += 100
    else if (exerciseDiff <= 2) score += 80
    else if (exerciseDiff <= 3) score += 60
    else score += 40
    factors++

    return score / factors
  }

  // Values alignment
  private calculateValuesAlignment(user1: UserProfile, user2: UserProfile): number {
    const valueKeys = ['familyImportance', 'careerAmbition', 'religiousValues', 'traditionalValues', 'socialLife'] as const
    let totalScore = 0

    valueKeys.forEach(key => {
      const diff = Math.abs(user1.values[key] - user2.values[key])
      if (diff <= 1) totalScore += 100
      else if (diff <= 2) totalScore += 80
      else if (diff <= 3) totalScore += 60
      else if (diff <= 4) totalScore += 40
      else totalScore += 20
    })

    return totalScore / valueKeys.length
  }

  // Relationship goals compatibility
  private calculateGoalsCompatibility(user1: UserProfile, user2: UserProfile): number {
    let score = 0
    let factors = 0

    // Marriage timeline compatibility
    const timelineCompatibility = {
      'within-year': { 'within-year': 100, '1-2-years': 80, '2-3-years': 60, 'flexible': 70 },
      '1-2-years': { 'within-year': 80, '1-2-years': 100, '2-3-years': 90, 'flexible': 85 },
      '2-3-years': { 'within-year': 60, '1-2-years': 90, '2-3-years': 100, 'flexible': 85 },
      'flexible': { 'within-year': 70, '1-2-years': 85, '2-3-years': 85, 'flexible': 100 }
    }
    
    score += timelineCompatibility[user1.relationshipGoals.timelineToMarriage][user2.relationshipGoals.timelineToMarriage]
    factors++

    // Children compatibility
    if (user1.relationshipGoals.childrenDesired === user2.relationshipGoals.childrenDesired) {
      score += 100
      
      // If both want children, check number preference
      if (user1.relationshipGoals.childrenDesired && 
          user1.relationshipGoals.numberOfChildren && 
          user2.relationshipGoals.numberOfChildren) {
        const childrenDiff = Math.abs(user1.relationshipGoals.numberOfChildren - user2.relationshipGoals.numberOfChildren)
        if (childrenDiff === 0) score += 20
        else if (childrenDiff === 1) score += 10
      }
    } else {
      score += 20 // Major incompatibility
    }
    factors++

    // Living with parents compatibility
    if (user1.relationshipGoals.livingWithParents === user2.relationshipGoals.livingWithParents) {
      score += 100
    } else {
      score += 60 // Some flexibility possible
    }
    factors++

    return score / factors
  }

  // User preferences match
  private calculatePreferencesMatch(user1: UserProfile, user2: UserProfile): number {
    let score = 0
    let factors = 0

    // Age preference check
    const user2AgeInRange = user2.age >= user1.preferences.ageRange.min && user2.age <= user1.preferences.ageRange.max
    const user1AgeInRange = user1.age >= user2.preferences.ageRange.min && user1.age <= user2.preferences.ageRange.max
    
    if (user1AgeInRange && user2AgeInRange) score += 100
    else if (user1AgeInRange || user2AgeInRange) score += 70
    else score += 30
    factors++

    // Education preference (if specified)
    if (user1.preferences.educationPreference.length > 0) {
      const matchesEducation = user1.preferences.educationPreference.some(pref => 
        user2.education.toLowerCase().includes(pref.toLowerCase())
      )
      score += matchesEducation ? 100 : 40
      factors++
    }

    // Location preference (if specified)
    if (user1.preferences.locationPreference.length > 0) {
      const matchesLocation = user1.preferences.locationPreference.some(pref => 
        user2.location.city.toLowerCase().includes(pref.toLowerCase()) ||
        user2.location.state.toLowerCase().includes(pref.toLowerCase())
      )
      score += matchesLocation ? 100 : 50
      factors++
    }

    return factors > 0 ? score / factors : 80 // Default score if no specific preferences
  }

  // Identify relationship strengths
  private identifyStrengths(scores: any, user1: UserProfile, user2: UserProfile): string[] {
    const strengths: string[] = []

    if (scores.personalityMatch >= 85) {
      strengths.push("Excellent personality compatibility")
    }
    if (scores.valuesAlignment >= 85) {
      strengths.push("Strong shared values")
    }
    if (scores.lifestyleAlignment >= 85) {
      strengths.push("Similar lifestyle preferences")
    }
    if (scores.goalsCompatibility >= 85) {
      strengths.push("Aligned relationship goals")
    }
    if (user1.location.city === user2.location.city) {
      strengths.push("Same city location")
    }
    if (user1.religion === user2.religion) {
      strengths.push("Shared religious background")
    }

    return strengths
  }

  // Identify potential concerns
  private identifyConcerns(scores: any, user1: UserProfile, user2: UserProfile): string[] {
    const concerns: string[] = []

    if (scores.personalityMatch < 60) {
      concerns.push("Personality differences may need attention")
    }
    if (scores.valuesAlignment < 60) {
      concerns.push("Different core values")
    }
    if (scores.lifestyleAlignment < 60) {
      concerns.push("Lifestyle differences")
    }
    if (user1.relationshipGoals.childrenDesired !== user2.relationshipGoals.childrenDesired) {
      concerns.push("Different views on having children")
    }
    if (Math.abs(user1.age - user2.age) > 8) {
      concerns.push("Significant age difference")
    }

    return concerns
  }

  // Generate explanation of the match
  private generateExplanation(scores: any, overallScore: number): string {
    if (overallScore >= 90) {
      return "An exceptional match with strong compatibility across all major areas. This pairing shows great potential for a lasting relationship."
    } else if (overallScore >= 80) {
      return "A very good match with high compatibility in most areas. Minor differences can often strengthen a relationship."
    } else if (overallScore >= 70) {
      return "A good match with solid foundation. Some areas may need communication and understanding to build a strong relationship."
    } else if (overallScore >= 60) {
      return "A moderate match with potential. Success would depend on both partners' willingness to understand and adapt to differences."
    } else {
      return "Lower compatibility score suggests significant differences. While not impossible, this pairing would require considerable effort and compromise."
    }
  }

  // Find best matches for a user
  findMatches(targetUser: UserProfile, candidateUsers: UserProfile[], limit: number = 10): MatchScore[] {
    const matches = candidateUsers
      .filter(candidate => candidate.id !== targetUser.id)
      .map(candidate => this.calculateCompatibility(targetUser, candidate))
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, limit)

    return matches
  }
}

// Export singleton instance
export const matchingEngine = new AdvancedMatchingEngine()
