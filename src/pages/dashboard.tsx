import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { 
  Heart, Users, MessageCircle, Settings, Star, ArrowRight, User, MapPin, LogOut, Loader,
  Bell, Crown, Zap, Eye, X, Check, Send, Phone, Video, MoreVertical, Filter,
  Search, Calendar, Gift, Award, Shield, Verified, Camera, Edit3, Mail, Clock,
  TrendingUp, Activity, Target, Sparkles, Diamond, Plus, ChevronRight, ChevronDown,
  ThumbsUp, ThumbsDown, Coffee, Music, BookOpen, Plane, Palette, Code
} from 'lucide-react'
import { useUser } from '@/lib/UserContext'
import MatchCard from '@/components/MatchCard'
import WebinarCarousel from '@/components/WebinarCarousel'
import ProfilePictureUpload from '@/components/ProfilePictureUpload'

// Enhanced mock data with more realistic profiles
const generateMatches = (userProfile: any) => [
  {
    id: '1',
    name: 'Priya Sharma',
    age: 28,
    location: 'Mumbai, India',
    education: 'MBA from IIM Bangalore',
    profession: 'Product Manager at Tech Startup',
    bio: 'Family-oriented person who loves travel, cooking, and spending time with loved ones. I believe in building a partnership based on mutual respect and shared values.',
    interests: ['Travel', 'Cooking', 'Yoga', 'Reading', 'Photography'],
    values: ['Family', 'Honesty', 'Adventure', 'Growth'],
    photos: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop'],
    compatibilityScore: 94,
    verified: true,
    lastActive: '2 hours ago',
    occupation: 'Product Manager',
    height: '5\'6"',
    religion: 'Hindu',
    languages: ['English', 'Hindi', 'Marathi'],
    lifestyle: {
      smoking: 'Never',
      drinking: 'Socially',
      exercise: 'Regular',
      diet: 'Vegetarian'
    }
  },
  {
    id: '2',
    name: 'Arjun Patel',
    age: 31,
    location: 'Delhi, India',
    education: 'B.Tech from IIT Delhi, MS from Stanford',
    profession: 'Software Engineer at Google',
    bio: 'Looking for a life partner who shares my passion for technology and values family traditions. I enjoy hiking, playing cricket, and exploring new cuisines.',
    interests: ['Technology', 'Cricket', 'Hiking', 'Music', 'Food'],
    values: ['Innovation', 'Tradition', 'Fitness', 'Learning'],
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'],
    compatibilityScore: 89,
    verified: true,
    lastActive: '1 day ago',
    occupation: 'Software Engineer',
    height: '5\'10"',
    religion: 'Hindu',
    languages: ['English', 'Hindi', 'Gujarati'],
    lifestyle: {
      smoking: 'Never',
      drinking: 'Never',
      exercise: 'Daily',
      diet: 'Vegetarian'
    }
  },
  {
    id: '3',
    name: 'Kavya Reddy',
    age: 26,
    location: 'Bangalore, India',
    education: 'MBBS from AIIMS',
    profession: 'Doctor at Apollo Hospital',
    bio: 'Compassionate doctor who believes in work-life balance. I love dancing, spending time in nature, and building meaningful relationships with people.',
    interests: ['Medicine', 'Dance', 'Nature', 'Volunteering', 'Art'],
    values: ['Compassion', 'Balance', 'Service', 'Creativity'],
    photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop'],
    compatibilityScore: 92,
    verified: true,
    lastActive: 'Online now',
    occupation: 'Doctor',
    height: '5\'4"',
    religion: 'Hindu',
    languages: ['English', 'Hindi', 'Telugu'],
    lifestyle: {
      smoking: 'Never',
      drinking: 'Occasionally',
      exercise: 'Regular',
      diet: 'Non-vegetarian'
    }
  },
  {
    id: '4',
    name: 'Rohit Gupta',
    age: 29,
    location: 'Pune, India',
    education: 'CA from ICAI',
    profession: 'Financial Analyst at Investment Firm',
    bio: 'Numbers person with a creative soul. I love financial planning but also enjoy photography and weekend getaways. Looking for someone who appreciates both stability and adventure.',
    interests: ['Finance', 'Photography', 'Travel', 'Books', 'Coffee'],
    values: ['Stability', 'Growth', 'Adventure', 'Honesty'],
    photos: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop'],
    compatibilityScore: 87,
    verified: true,
    lastActive: '3 hours ago',
    occupation: 'Financial Analyst',
    height: '5\'8"',
    religion: 'Hindu',
    languages: ['English', 'Hindi'],
    lifestyle: {
      smoking: 'Never',
      drinking: 'Socially',
      exercise: 'Moderate',
      diet: 'Vegetarian'
    }
  }
]

// Chat storage utilities
const CONVERSATIONS_KEY = 'makemyknot_conversations'

const saveConversationsToStorage = (conversations: Conversation[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))
  }
}

const loadConversationsFromStorage = (): Conversation[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(CONVERSATIONS_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.warn('Failed to parse stored conversations:', error)
      }
    }
  }
  return []
}

// Default conversation data (only used if no stored conversations exist)
const getDefaultConversation = () => ({
  id: 'conv1',
  matchId: '1',
  matchName: 'Priya Sharma',
  matchPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop',
  lastMessage: 'That sounds amazing! I love traveling too.',
  lastMessageTime: '2 hours ago',
  unreadCount: 2,
  online: true,
  messages: [
    { id: 'm1', senderId: 'demo-user-001', text: 'Hi Priya! I noticed we both love photography. Do you have any favorite spots in Mumbai?', timestamp: '2024-01-10T10:00:00Z', read: true },
    { id: 'm2', senderId: '1', text: 'Hi! Yes, I love Marine Drive during sunset and the old architecture in Fort area. What about you?', timestamp: '2024-01-10T10:15:00Z', read: true },
    { id: 'm3', senderId: 'demo-user-001', text: 'Marine Drive is beautiful! I recently went to Iceland for the Northern Lights - incredible experience.', timestamp: '2024-01-10T10:30:00Z', read: true },
    { id: 'm4', senderId: '1', text: 'That sounds amazing! I love traveling too. Iceland is definitely on my bucket list.', timestamp: '2024-01-10T11:00:00Z', read: false },
    { id: 'm5', senderId: '1', text: 'What camera do you use for your photography?', timestamp: '2024-01-10T11:01:00Z', read: false }
  ]
})

const generateConversations = (): Conversation[] => {
  const storedConversations = loadConversationsFromStorage()
  if (storedConversations.length > 0) {
    return storedConversations
  }
  // Return default conversation only if no stored conversations exist
  return [getDefaultConversation()]
}

// Activity feed data
const generateActivity = () => [
  { id: 'a1', type: 'match', message: 'You have 3 new compatible matches!', time: '2 hours ago', icon: Users, color: 'primary' },
  { id: 'a2', type: 'message', message: 'Priya sent you a message', time: '3 hours ago', icon: MessageCircle, color: 'gold' },
  { id: 'a3', type: 'profile', message: 'Your profile completeness increased to 85%', time: '1 day ago', icon: TrendingUp, color: 'green' },
  { id: 'a4', type: 'verification', message: 'Your phone number has been verified', time: '2 days ago', icon: Shield, color: 'blue' }
]

interface ChatMessage {
  id: string
  senderId: string
  text: string
  timestamp: string
  read: boolean
}

interface Conversation {
  id: string
  matchId: string
  matchName: string
  matchPhoto: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  online: boolean
  messages: ChatMessage[]
}

export default function Dashboard() {
  const { user, isAuthenticated, logout, getUserQuestionnaireResponse, isLoading, updateUser } = useUser()
  const [matches, setMatches] = useState<any[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'conversations' | 'profile'>('overview')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [matchFilter, setMatchFilter] = useState<'all' | 'new' | 'liked' | 'premium'>('all')
  const [showMatchDetails, setShowMatchDetails] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      const userMatches = generateMatches(user)
      const userConversations = generateConversations()
      const userActivity = generateActivity()
      
      setMatches(userMatches)
      setConversations(userConversations)
      setNotifications(userActivity)
    }
  }, [user])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleLike = (matchId: string) => {
    console.log('Liked match:', matchId)
    // Create conversation
    const match = matches.find(m => m.id === matchId)
    if (match) {
      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        matchId: match.id,
        matchName: match.name,
        matchPhoto: match.photos[0],
        lastMessage: 'You matched! Start the conversation.',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        online: Math.random() > 0.5,
        messages: []
      }
      const updatedConversations = [newConversation, ...conversations]
      setConversations(updatedConversations)
      saveConversationsToStorage(updatedConversations)
      setActiveTab('conversations')
    }
  }

  const handlePass = (matchId: string) => {
    console.log('Passed match:', matchId)
    setMatches(prev => prev.filter(m => m.id !== matchId))
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return
    
    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'demo-user-001',
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true
    }
    
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedConversation.id 
        ? { 
            ...conv, 
            messages: [...conv.messages, message],
            lastMessage: message.text,
            lastMessageTime: 'Just now'
          }
        : conv
    )
    
    setConversations(updatedConversations)
    saveConversationsToStorage(updatedConversations)
    
    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: message.text,
      lastMessageTime: 'Just now'
    } : null)
    
    setNewMessage('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const questionnaireResponse = getUserQuestionnaireResponse()
  const needsQuestionnaire = !user.questionnaireComplete && (() => {
    // Double-check in localStorage as a fallback
    try {
      const questionnaireData = JSON.parse(localStorage.getItem('questionnaire_responses') || '[]')
      const userQuestionnaire = questionnaireData.find((q: any) => 
        (q.userId === user.id || q.userEmail === user.email) && q.isComplete
      )
      if (userQuestionnaire) {
        console.log('Found completed questionnaire in localStorage, user should not need assessment')
        return false // They have completed questionnaire
      }
    } catch (error) {
      console.error('Error checking localStorage for questionnaire:', error)
    }
    return true // Default to needing questionnaire
  })()

  // Subscription helpers
  const now = new Date()
  const trialActive = user.subscription?.plan === 'trial' && user.subscription?.trialEndsAt ? new Date(user.subscription.trialEndsAt) > now : false
  const trialDaysLeft = trialActive && user.subscription?.trialEndsAt ? Math.ceil((new Date(user.subscription.trialEndsAt).getTime() - now.getTime()) / (1000*60*60*24)) : 0
  const isMonthly = user.subscription?.plan === 'monthly'

  const startFreeTrial = () => {
    const started = new Date()
    const ends = new Date(started.getTime() + 7*24*60*60*1000)
    updateUser({ subscription: { plan: 'trial', trialStartedAt: started.toISOString(), trialEndsAt: ends.toISOString() } })
  }

  const subscribeMonthly = () => {
    const started = new Date()
    updateUser({ subscription: { plan: 'monthly', startedAt: started.toISOString() } })
  }

  return (
    <>
      <Head>
        <title>Dashboard - Make My Knot</title>
        <meta name="description" content="From Handshakes to Pheras - Your personal dashboard for finding your perfect life partner through trusted matchmaking." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Make My Knot</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-primary-200 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-200">
                      <span className="text-sm font-medium text-primary-700">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-gray-700">Welcome, {user.name}!</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Questionnaire Notice */}
        {needsQuestionnaire && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-6 w-6 mr-3" />
                  <div>
                    <h3 className="font-semibold">Complete your compatibility assessment</h3>
                    <p className="text-sm text-orange-100">Get better matches by completing our questionnaire</p>
                  </div>
                </div>
                <Link href="/questionnaire" className="bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center">
                  Start Questionnaire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="flex space-x-0 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: Heart },
                { id: 'matches', label: 'Matches', icon: Users },
                { id: 'conversations', label: 'Conversations', icon: MessageCircle },
                { id: 'profile', label: 'Profile', icon: User },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8 fade-in">
              {/* Stats Dashboard */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card hover-lift p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-primary-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-1">{needsQuestionnaire ? '0' : matches.length}</div>
                  <div className="text-sm text-gray-600">New Matches</div>
                  {!needsQuestionnaire && <div className="text-xs text-blue-600 mt-1">✨ High compatibility</div>}
                </div>
                
                <div className="card hover-lift p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-1">{conversations.length}</div>
                  <div className="text-sm text-gray-600">Active Chats</div>
                  {conversations.some(c => c.unreadCount > 0) && <div className="text-xs text-green-600 mt-1">💬 New messages!</div>}
                </div>
                
                <div className="card hover-lift p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-1">{needsQuestionnaire ? 'N/A' : '91%'}</div>
                  <div className="text-sm text-gray-600">Avg Match Score</div>
                </div>
                
                <div className="card hover-lift p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-1">{user.profileComplete ? '85%' : '45%'}</div>
                  <div className="text-sm text-gray-600">Profile Complete</div>
                </div>
              </div>

              {/* Subscription Status */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Crown className="h-6 w-6 text-yellow-500 mr-2" />
                    Subscription Status
                  </h3>
                  {(trialActive || isMonthly) && <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Active</div>}
                </div>
                
                {isMonthly ? (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <Diamond className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Premium Monthly Plan</h4>
                        <p className="text-blue-700">Unlimited matches, priority support, advanced features</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center text-sm text-blue-700">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Unlimited matches
                      </div>
                      <div className="flex items-center text-sm text-blue-700">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Priority messaging
                      </div>
                      <div className="flex items-center text-sm text-blue-700">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Advanced filters
                      </div>
                    </div>
                  </div>
                ) : trialActive ? (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <Zap className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Free Trial Active</h4>
                        <p className="text-blue-700">{trialDaysLeft} days remaining of premium features</p>
                      </div>
                    </div>
                    <button onClick={subscribeMonthly} className="btn-primary">
                      Upgrade to Premium
                      <Crown className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <Gift className="h-8 w-8 text-gray-600 mr-3" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Free Plan</h4>
                        <p className="text-gray-700">Unlock premium features with a subscription</p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={startFreeTrial} className="btn-primary">
                        Start 7-Day Trial
                        <Sparkles className="ml-2 h-4 w-4" />
                      </button>
                      <button onClick={subscribeMonthly} className="btn-secondary">
                        Go Premium
                        <Crown className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Feed */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {notifications.map((item) => {
                      const IconComponent = item.icon
                      return (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className={`p-2 rounded-lg bg-blue-100`}>
                            <IconComponent className={`h-4 w-4 text-blue-600`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{item.message}</p>
                            <p className="text-xs text-gray-500">{item.time}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    {needsQuestionnaire ? (
                      <button 
                        onClick={() => router.push('/questionnaire')} 
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all"
                      >
                        <div className="flex items-center">
                          <Star className="h-6 w-6 text-blue-600 mr-3" />
                          <div className="text-left">
                            <div className="font-medium text-blue-900">Complete Assessment</div>
                            <div className="text-sm text-blue-700">Unlock personalized matches</div>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-blue-600" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => setActiveTab('matches')} 
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl hover:from-green-100 hover:to-teal-100 transition-all"
                      >
                        <div className="flex items-center">
                          <Users className="h-6 w-6 text-green-600 mr-3" />
                          <div className="text-left">
                            <div className="font-medium text-green-900">View Matches</div>
                            <div className="text-sm text-green-700">{matches.length} profiles waiting</div>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-green-600" />
                      </button>
                    )}
                    
                    <button 
                      onClick={() => setActiveTab('profile')} 
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all"
                    >
                      <div className="flex items-center">
                        <Edit3 className="h-6 w-6 text-purple-600 mr-3" />
                        <div className="text-left">
                          <div className="font-medium text-purple-900">Update Profile</div>
                          <div className="text-sm text-purple-700">Add photos and details</div>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-purple-600" />
                    </button>

                    {conversations.length > 0 && (
                      <button 
                        onClick={() => setActiveTab('conversations')} 
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl hover:from-pink-100 hover:to-rose-100 transition-all"
                      >
                        <div className="flex items-center">
                          <MessageCircle className="h-6 w-6 text-pink-600 mr-3" />
                          <div className="text-left">
                            <div className="font-medium text-pink-900">Continue Chats</div>
                            <div className="text-sm text-pink-700">{conversations.filter(c => c.unreadCount > 0).length} unread messages</div>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-pink-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Matchmaker Insights */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-500" />
                  AI Matchmaker Insights
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                      AI
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-2">
                        "Hi {user.name}! {needsQuestionnaire 
                          ? 'I\'m excited to help you find your perfect match. Let\'s start with understanding your preferences and values through our compatibility assessment.' 
                          : 'Based on your profile, I\'ve found some exceptional matches for you. Your compatibility scores are looking great!'
                        }"
                      </p>
                      <div className="flex items-center text-sm text-blue-600">
                        <Sparkles className="h-4 w-4 mr-1" />
                        <span>Your AI Matchmaker, Priya</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div>
              {needsQuestionnaire ? (
                <div className="text-center py-12">
                  <Star className="h-16 w-16 text-gold-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Assessment First</h3>
                  <p className="text-gray-600 mb-6">We need to understand your preferences to find compatible matches.</p>
                  <Link href="/questionnaire" className="btn-gold">
                    Start Compatibility Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Matches</h1>
                    <p className="text-gray-600">Curated based on your compatibility assessment</p>
                  </div>
                  
                  <div className="grid lg:grid-cols-3 gap-6">
                    {matches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onLike={handleLike}
                        onPass={handlePass}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'conversations' && (
            <div className="fade-in">
              {conversations.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <MessageCircle className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Conversations Yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">Start liking matches to begin meaningful conversations with compatible people!</p>
                  <button onClick={() => setActiveTab('matches')} className="btn-primary">
                    Explore Matches
                    <Users className="ml-2 h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-6 h-[700px]">
                  {/* Conversations List */}
                  <div className="lg:col-span-1">
                    <div className="card h-full flex flex-col">
                      {/* Chat List Header */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Search className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Search Input */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      
                      {/* Conversations List */}
                      <div className="flex-1 overflow-y-auto">
                        {conversations.map((conv) => (
                          <div
                            key={conv.id}
                            onClick={() => setSelectedConversation(conv)}
                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                              selectedConversation?.id === conv.id ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <img src={conv.matchPhoto} alt={conv.matchName} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                {conv.online && (
                                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-semibold text-gray-900 truncate">{conv.matchName}</h3>
                                  <div className="flex items-center space-x-2">
                                    {conv.unreadCount > 0 && (
                                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium">
                                        {conv.unreadCount}
                                      </span>
                                    )}
                                    <span className="text-gray-500 text-xs">{conv.lastMessageTime}</span>
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm truncate">{conv.lastMessage}</p>
                                <div className="flex items-center mt-1 space-x-2">
                                  {conv.online && <span className="text-green-600 text-xs font-medium">Online</span>}
                                  {conv.messages.length > 0 && (
                                    <span className="text-gray-500 text-xs">{conv.messages.length} messages</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chat Interface */}
                  <div className="lg:col-span-2">
                    {selectedConversation ? (
                      <div className="card h-full flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <img src={selectedConversation.matchPhoto} alt={selectedConversation.matchName} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                {selectedConversation.online && (
                                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 flex items-center">
                                  {selectedConversation.matchName}
                                  <Verified className="h-4 w-4 ml-1 text-blue-500" />
                                </h3>
                                <p className="text-gray-600 text-sm flex items-center">
                                  <div className={`w-2 h-2 rounded-full mr-2 ${
                                    selectedConversation.online ? 'bg-green-500' : 'bg-gray-400'
                                  }`}></div>
                                  {selectedConversation.online ? 'Online now' : `Last seen ${selectedConversation.lastMessageTime}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors group">
                                <Phone className="h-5 w-5 group-hover:scale-110 transition-transform" />
                              </button>
                              <button className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors group">
                                <Video className="h-5 w-5 group-hover:scale-110 transition-transform" />
                              </button>
                              <button className="p-3 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
                                <MoreVertical className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                          {selectedConversation.messages.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Heart className="h-8 w-8 text-blue-600" />
                              </div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-2">You Matched!</h4>
                              <p className="text-gray-600 mb-4">Start the conversation and get to know each other better.</p>
                              <div className="flex flex-wrap gap-2 justify-center">
                                <button 
                                  onClick={() => {
                                    setNewMessage('Hi! I saw your profile and would love to get to know you better. 😊')
                                    const input = document.querySelector('input[placeholder="Type your message..."]') as HTMLInputElement
                                    input?.focus()
                                  }}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                                >
                                  Hi! Nice to meet you 😊
                                </button>
                                <button 
                                  onClick={() => {
                                    setNewMessage('I noticed we have similar interests! What do you enjoy doing in your free time?')
                                    const input = document.querySelector('input[placeholder="Type your message..."]') as HTMLInputElement
                                    input?.focus()
                                  }}
                                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                                >
                                  Ask about interests
                                </button>
                                <button 
                                  onClick={() => {
                                    setNewMessage('Would you like to have a coffee chat sometime?')
                                    const input = document.querySelector('input[placeholder="Type your message..."]') as HTMLInputElement
                                    input?.focus()
                                  }}
                                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                                >
                                  Suggest meeting ☕
                                </button>
                              </div>
                            </div>
                          ) : (
                            selectedConversation.messages.map((message, index) => {
                              const isOwnMessage = message.senderId === 'demo-user-001'
                              const showAvatar = !isOwnMessage && (index === 0 || selectedConversation.messages[index - 1]?.senderId !== message.senderId)
                              
                              return (
                                <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
                                  {!isOwnMessage && showAvatar && (
                                    <img src={selectedConversation.matchPhoto} alt={selectedConversation.matchName} className="w-8 h-8 rounded-full mr-2 mt-auto" />
                                  )}
                                  {!isOwnMessage && !showAvatar && <div className="w-8 mr-2"></div>}
                                  
                                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                                    isOwnMessage
                                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                      : 'bg-white border border-gray-200 text-gray-900'
                                  }`}>
                                    <p className="text-sm leading-relaxed">{message.text}</p>
                                    <div className="flex items-center justify-between mt-2">
                                      <p className={`text-xs ${
                                        isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                                      }`}>
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                      {isOwnMessage && (
                                        <div className="flex items-center space-x-1">
                                          <Check className={`h-3 w-3 ${
                                            message.read ? 'text-blue-200' : 'text-blue-300'
                                          }`} />
                                          {message.read && <Check className="h-3 w-3 text-blue-200 -ml-1" />}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          )}
                          
                          {/* Typing Indicator */}
                          {selectedConversation.online && Math.random() > 0.7 && (
                            <div className="flex justify-start mb-2">
                              <img src={selectedConversation.matchPhoto} alt={selectedConversation.matchName} className="w-8 h-8 rounded-full mr-2" />
                              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Message Input Area */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                          {/* Quick Actions */}
                          <div className="flex items-center space-x-2 mb-3">
                            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Camera className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                              <Gift className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Calendar className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {/* Message Input */}
                          <div className="flex items-end space-x-3">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    sendMessage()
                                  }
                                }}
                                placeholder="Type your message..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                maxLength={500}
                              />
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-2">
                                  <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                                    <span className="text-lg">😊</span>
                                  </button>
                                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                                    <span className="text-lg">❤️</span>
                                  </button>
                                  <button className="text-gray-400 hover:text-blue-500 transition-colors">
                                    <span className="text-lg">👍</span>
                                  </button>
                                </div>
                                <span className="text-xs text-gray-400">{newMessage.length}/500</span>
                              </div>
                            </div>
                            <button 
                              onClick={sendMessage}
                              disabled={!newMessage.trim()}
                              className={`p-3 rounded-full transition-all transform hover:scale-105 ${
                                newMessage.trim() 
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl' 
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <Send className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="card h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <MessageCircle className="h-8 w-8 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Conversation</h3>
                          <p className="text-gray-600">Choose a chat from the left to start messaging</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                  {/* Profile Picture Upload */}
                  <div className="mb-6">
                    <ProfilePictureUpload
                      currentPicture={user.profilePicture}
                      onUpload={(pictureUrl) => {
                        updateUser({ profilePicture: pictureUrl })
                      }}
                      className="flex justify-center"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700">
                    <Shield className="h-4 w-4 mr-1" />
                    Profile {user.profilePicture ? '85%' : '60%'} Complete
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                      <p className="text-gray-900">{user.age || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <p className="text-gray-900">{user.phone || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <p className="text-gray-900">{user.location || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                    <p className="text-gray-900">{user.education || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                    <p className="text-gray-900">{user.profession || 'Not specified'}</p>
                  </div>
                </div>

                <div className="mt-8 flex space-x-4">
                  <Link href="/onboarding" className="btn-secondary flex-1 text-center">
                    Edit Profile
                  </Link>
                  {needsQuestionnaire && (
                    <Link href="/questionnaire" className="btn-primary flex-1 text-center">
                      Complete Assessment
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
