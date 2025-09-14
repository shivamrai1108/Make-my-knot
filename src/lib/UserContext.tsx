import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService } from './api'
import { QuestionnaireResponse } from './questionnaireStore'

export interface User {
  id: string
  email: string
  name: string
  age: number
  phone: string
  location: string
  education: string
  profession: string
  bio: string
  interests: string[]
  values: string
  partnerPreferences: string
  communicationStyle: 'chat' | 'call'
  profileComplete: boolean
  questionnaireComplete: boolean
  profilePicture?: string
  isVerified?: boolean
  subscription?: {
    plan: 'trial' | 'monthly' | null
    trialStartedAt?: string
    trialEndsAt?: string
    startedAt?: string
  }
  createdAt: string
}


interface UserContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  saveQuestionnaireResponse: (response: QuestionnaireResponse) => Promise<void>
  getUserQuestionnaireResponse: () => Promise<QuestionnaireResponse | null>
  getCompatibilityMatches: (minCompatibility?: number, limit?: number) => Promise<any[]>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app load
    const initializeAuth = async () => {
      const token = localStorage.getItem('makemyknot_token')
      const savedUser = localStorage.getItem('makemyknot_user')
      
      if (token && savedUser) {
        try {
          // Parse saved user
          const parsedUser = JSON.parse(savedUser)
          
          // For demo or local tokens, just use saved user
          if (token === 'demo-token' || token.startsWith('local-')) {
            setUser(parsedUser)
          } else {
            // Try to verify token with API
            try {
              const response = await apiService.getMe()
              if (response.status === 'success' && response.user) {
                setUser(response.user)
                localStorage.setItem('makemyknot_user', JSON.stringify(response.user))
              } else {
                // Token invalid, but keep local user for offline mode
                setUser(parsedUser)
              }
            } catch (apiError) {
              // API unavailable, use saved user
              console.log('API unavailable, using cached user')
              setUser(parsedUser)
            }
          }
        } catch (parseError) {
          console.error('Error parsing saved user:', parseError)
          localStorage.removeItem('makemyknot_token')
          localStorage.removeItem('makemyknot_user')
        }
      }
      setIsLoading(false)
    }
    
    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Check for demo account
      if (email === 'demo@makemyknot.com' && password === 'demo123') {
        const demoUser: User = {
          id: 'demo-user-1',
          email: 'demo@makemyknot.com',
          name: 'Demo User',
          age: 28,
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          education: 'Masters Degree',
          profession: 'Software Engineer',
          bio: 'Demo user for testing the platform',
          interests: ['Technology', 'Travel', 'Reading'],
          values: 'Family-oriented',
          partnerPreferences: 'Looking for someone with similar values',
          communicationStyle: 'chat',
          profileComplete: true,
          questionnaireComplete: true,
          isVerified: true,
          subscription: { plan: 'monthly', startedAt: new Date().toISOString() },
          createdAt: new Date().toISOString()
        }
        setUser(demoUser)
        localStorage.setItem('makemyknot_user', JSON.stringify(demoUser))
        localStorage.setItem('makemyknot_token', 'demo-token')
        console.log('Demo login successful')
        return true
      }

      const response = await apiService.login({ email, password })
      
      if (response.status === 'success' && response.user) {
        // Convert API user to our User interface
        const convertedUser: User = {
          id: response.user._id || response.user.id,
          email: response.user.email,
          name: response.user.firstName ? `${response.user.firstName} ${response.user.lastName}` : response.user.name,
          age: response.user.age || 0,
          phone: response.user.phoneNumber || response.user.phone || '',
          location: response.user.location?.city || response.user.location || '',
          education: response.user.preferences?.education || response.user.education || '',
          profession: response.user.preferences?.occupation || response.user.profession || '',
          bio: response.user.bio || '',
          interests: response.user.preferences?.interests || response.user.interests || [],
          values: response.user.values || '',
          partnerPreferences: response.user.partnerPreferences || '',
          communicationStyle: 'chat',
          profileComplete: response.user.profileComplete || false,
          questionnaireComplete: response.user.questionnaireComplete || false,
          isVerified: response.user.verification?.isEmailVerified || false,
          subscription: response.user.subscription || { plan: null },
          createdAt: response.user.createdAt || new Date().toISOString()
        }
        
        // Check if user has a completed questionnaire and update their status
        try {
          const questionnaireData = JSON.parse(localStorage.getItem('questionnaire_responses') || '[]')
          const userQuestionnaire = questionnaireData.find((q: any) => 
            (q.userId === convertedUser.id || q.userEmail === convertedUser.email) && q.isComplete
          )
          
          if (userQuestionnaire && !convertedUser.questionnaireComplete) {
            convertedUser.questionnaireComplete = true
            console.log('Found completed questionnaire during login, marking user as complete')
          }
        } catch (error) {
          console.error('Error checking questionnaire status during login:', error)
        }
        
        setUser(convertedUser)
        localStorage.setItem('makemyknot_user', JSON.stringify(convertedUser))
        console.log('Login successful for:', convertedUser.email, 'questionnaireComplete:', convertedUser.questionnaireComplete)
        return true
      }
      
      console.log('Login failed:', response.message)
      return false
    } catch (error) {
      console.error('Login error:', error)
      // Fallback for offline/API unavailable - check local storage for existing users
      const existingUsers = JSON.parse(localStorage.getItem('makemyknot_local_users') || '[]')
      const user = existingUsers.find((u: any) => u.email === email && u.password === password)
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user
        // Check if user has a completed questionnaire and update their status
        try {
          const questionnaireData = JSON.parse(localStorage.getItem('questionnaire_responses') || '[]')
          const userQuestionnaire = questionnaireData.find((q: any) => 
            (q.userId === userWithoutPassword.id || q.userEmail === userWithoutPassword.email) && q.isComplete
          )
          
          if (userQuestionnaire && !userWithoutPassword.questionnaireComplete) {
            userWithoutPassword.questionnaireComplete = true
            console.log('Found completed questionnaire during offline login, marking user as complete')
          }
        } catch (error) {
          console.error('Error checking questionnaire status during offline login:', error)
        }
        
        setUser(userWithoutPassword)
        localStorage.setItem('makemyknot_user', JSON.stringify(userWithoutPassword))
        localStorage.setItem('makemyknot_token', `local-${user.id}`)
        console.log('Offline login successful for:', userWithoutPassword.email, 'questionnaireComplete:', userWithoutPassword.questionnaireComplete)
        return true
      }
      
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Check if user already exists locally
      const existingUsers = JSON.parse(localStorage.getItem('makemyknot_local_users') || '[]')
      const existingUser = existingUsers.find((u: any) => u.email === userData.email)
      
      if (existingUser) {
        console.log('User already exists')
        return false
      }

      // Try API first
      try {
        const apiUserData = {
          firstName: userData.name?.split(' ')[0] || '',
          lastName: userData.name?.split(' ').slice(1).join(' ') || '',
          email: userData.email || '',
          password: userData.password,
          confirmPassword: userData.password,
          dateOfBirth: new Date(Date.now() - (userData.age || 25) * 365.25 * 24 * 60 * 60 * 1000).toISOString(),
          phoneNumber: userData.phone,
          agreeToTerms: true
        }
        
        const response = await apiService.register(apiUserData)
        
        if (response.status === 'success' && response.user) {
          const convertedUser: User = {
            id: response.user._id || response.user.id,
            email: response.user.email,
            name: `${response.user.firstName} ${response.user.lastName}`,
            age: response.user.age || 0,
            phone: response.user.phoneNumber || '',
            location: response.user.location?.city || '',
            education: response.user.preferences?.education || '',
            profession: response.user.preferences?.occupation || '',
            bio: response.user.bio || '',
            interests: response.user.preferences?.interests || [],
            values: userData.values || '',
            partnerPreferences: userData.partnerPreferences || '',
            communicationStyle: 'chat',
            profileComplete: false,
            questionnaireComplete: false,
            isVerified: response.user.verification?.isEmailVerified || false,
            subscription: { plan: null },
            createdAt: response.user.createdAt || new Date().toISOString()
          }
          
        setUser(convertedUser)
        localStorage.setItem('makemyknot_user', JSON.stringify(convertedUser))
        
        // Link any existing questionnaire data if user signed up from lead flow
        try {
          const questionnaireData = JSON.parse(localStorage.getItem('questionnaire_responses') || '[]')
          // Try multiple ways to find the questionnaire
          let userQuestionnaire = questionnaireData.find((q: any) => 
            q.userEmail === convertedUser.email && q.userId === 'temp-user-id'
          )
          
          // If not found, try to find by email match
          if (!userQuestionnaire) {
            userQuestionnaire = questionnaireData.find((q: any) => 
              q.userEmail === convertedUser.email
            )
          }
          
          // If still not found, try to find by leadId if this was a lead signup
          if (!userQuestionnaire) {
            // Check if there's a completed assessment for any lead with matching email
            const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
            const matchingLead = leads.find((l: any) => l.email === convertedUser.email)
            if (matchingLead) {
              userQuestionnaire = questionnaireData.find((q: any) => q.leadId === matchingLead.id)
            }
          }
          
          if (userQuestionnaire) {
            // Update the questionnaire with the actual user ID
            userQuestionnaire.userId = convertedUser.id
            userQuestionnaire.leadId = undefined // Clear leadId since it's now a user
            userQuestionnaire.userEmail = convertedUser.email
            userQuestionnaire.userName = convertedUser.name
            userQuestionnaire.userPhone = convertedUser.phone
            userQuestionnaire.userType = 'user'
            
            localStorage.setItem('questionnaire_responses', JSON.stringify(questionnaireData))
            
            // Mark user as having completed questionnaire
            convertedUser.questionnaireComplete = true
            setUser(convertedUser)
            localStorage.setItem('makemyknot_user', JSON.stringify(convertedUser))
            
            console.log('Linked questionnaire data to user:', convertedUser.id)
          }
        } catch (error) {
          console.error('Error linking questionnaire data:', error)
        }
        
        console.log('API Signup successful for:', convertedUser.email)
        return true
        }
      } catch (apiError) {
        console.log('API signup failed, using fallback:', apiError)
      }
      
      // Fallback: Create user locally
      const newUser: User = {
        id: `local-${Date.now()}`,
        email: userData.email || '',
        name: userData.name || '',
        age: userData.age || 25,
        phone: userData.phone || '',
        location: '',
        education: '',
        profession: '',
        bio: '',
        interests: [],
        values: userData.values || '',
        partnerPreferences: userData.partnerPreferences || '',
        communicationStyle: 'chat',
        profileComplete: false,
        questionnaireComplete: false,
        isVerified: false,
        subscription: { plan: 'trial', trialStartedAt: new Date().toISOString(), trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
        createdAt: new Date().toISOString()
      }
      
      // Store user locally with password for login
      const userWithPassword = { ...newUser, password: userData.password }
      existingUsers.push(userWithPassword)
      localStorage.setItem('makemyknot_local_users', JSON.stringify(existingUsers))
      
      // Set current user (without password)
      setUser(newUser)
      localStorage.setItem('makemyknot_user', JSON.stringify(newUser))
      localStorage.setItem('makemyknot_token', `local-${newUser.id}`)
      
      // Link any existing questionnaire data if user signed up from lead flow
      try {
        const questionnaireData = JSON.parse(localStorage.getItem('questionnaire_responses') || '[]')
        // Try multiple ways to find the questionnaire
        let userQuestionnaire = questionnaireData.find((q: any) => 
          q.userEmail === newUser.email && q.userId === 'temp-user-id'
        )
        
        // If not found, try to find by email match
        if (!userQuestionnaire) {
          userQuestionnaire = questionnaireData.find((q: any) => 
            q.userEmail === newUser.email
          )
        }
        
        // If still not found, try to find by leadId if this was a lead signup
        if (!userQuestionnaire) {
          // Check if there's a completed assessment for any lead with matching email
          const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
          const matchingLead = leads.find((l: any) => l.email === newUser.email)
          if (matchingLead) {
            userQuestionnaire = questionnaireData.find((q: any) => q.leadId === matchingLead.id)
          }
        }
        
        if (userQuestionnaire) {
          // Update the questionnaire with the actual user ID
          userQuestionnaire.userId = newUser.id
          userQuestionnaire.leadId = undefined // Clear leadId since it's now a user
          userQuestionnaire.userEmail = newUser.email
          userQuestionnaire.userName = newUser.name
          userQuestionnaire.userPhone = newUser.phone
          userQuestionnaire.userType = 'user'
          
          localStorage.setItem('questionnaire_responses', JSON.stringify(questionnaireData))
          
          // Mark user as having completed questionnaire
          newUser.questionnaireComplete = true
          setUser(newUser)
          localStorage.setItem('makemyknot_user', JSON.stringify(newUser))
          
          console.log('Linked questionnaire data to user:', newUser.id)
        }
      } catch (error) {
        console.error('Error linking questionnaire data:', error)
      }
      
      console.log('Local signup successful for:', newUser.email)
      return true
    } catch (error) {
      console.error('Signup error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      try {
        const response = await apiService.updateProfile(updates)
        if (response.status === 'success' && response.user) {
          const updatedUser = { ...user, ...updates }
          setUser(updatedUser)
          localStorage.setItem('makemyknot_user', JSON.stringify(updatedUser))
        }
      } catch (error) {
        console.error('Update user error:', error)
        // Still update locally on error for better UX
        const updatedUser = { ...user, ...updates }
        setUser(updatedUser)
        localStorage.setItem('makemyknot_user', JSON.stringify(updatedUser))
      }
    }
  }

  const saveQuestionnaireResponse = async (response: QuestionnaireResponse) => {
    if (!user) return
    
    try {
      const apiResponse = await apiService.saveQuestionnaireResponse({
        responses: response.responses,
        compatibilityProfile: {
          values: [75, 80, 85], // Placeholder - should be calculated based on responses
          lifestyle: [70, 75, 80],
          interests: [65, 70, 75],
          personality: [80, 85, 90]
        },
        completionTime: response.completionTime || 0,
        questionnaire: {
          type: 'basic',
          version: '1.0',
          language: 'en'
        }
      })
      
      if (apiResponse.status === 'success') {
        // Mark questionnaire as complete
        updateUser({ questionnaireComplete: true })
      }
    } catch (error) {
      console.error('Error saving questionnaire response:', error)
      // Fallback to localStorage if API fails
      const responses = JSON.parse(localStorage.getItem('makemyknot_questionnaires') || '[]')
      const existingIndex = responses.findIndex((r: any) => r.userId === response.userId)
      
      if (existingIndex !== -1) {
        responses[existingIndex] = response
      } else {
        responses.push(response)
      }
      
      localStorage.setItem('makemyknot_questionnaires', JSON.stringify(responses))
      updateUser({ questionnaireComplete: true })
    }
  }

  const getUserQuestionnaireResponse = async (): Promise<QuestionnaireResponse | null> => {
    if (!user) return null
    
    try {
      const response = await apiService.getUserQuestionnaireResponse()
      if (response.status === 'success' && response.data.response) {
        const questionnaire = response.data.response
        return {
          id: questionnaire.id || 'api-response',
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone,
          userType: 'user',
          createdAt: questionnaire.createdAt,
          updatedAt: questionnaire.createdAt,
          responses: questionnaire.responses,
          completedAt: questionnaire.createdAt,
          isComplete: true,
          completionTime: questionnaire.completionTime
        }
      }
    } catch (error) {
      console.error('Error fetching questionnaire response:', error)
      // Fallback to localStorage
      const responses = JSON.parse(localStorage.getItem('makemyknot_questionnaires') || '[]')
      return responses.find((r: any) => r.userId === user.id) || null
    }
    
    return null
  }
  
  const getCompatibilityMatches = async (minCompatibility = 70, limit = 10): Promise<any[]> => {
    if (!user) return []
    
    try {
      const response = await apiService.getCompatibilityMatches(minCompatibility, limit)
      if (response.status === 'success') {
        return response.data.matches || []
      }
    } catch (error) {
      console.error('Error fetching compatibility matches:', error)
    }
    
    return []
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    saveQuestionnaireResponse,
    getUserQuestionnaireResponse,
    getCompatibilityMatches
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
