import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { 
  Heart, 
  Users, 
  UserPlus, 
  Video, 
  BarChart3, 
  Settings, 
  LogOut, 
  Shield,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Crown,
  Clock,
  MessageSquare,
  UserCheck,
  UserX,
  CreditCard,
  Gift,
  Ban,
  Play,
  Pause,
  Send,
  FileText,
  TrendingDown,
  Activity,
  PhoneCall,
  Mail,
  MapPin,
  User,
  Briefcase,
  GraduationCap,
  Phone,
  Globe,
  Star
} from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'

// Enhanced interfaces
interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  age: number
  location: string
  profession: string
  education: string
  joinedAt: string
  isVerified: boolean
  subscription: {
    plan: 'none' | 'trial' | 'monthly' | 'annual'
    status: 'active' | 'inactive' | 'suspended' | 'cancelled'
    startedAt?: string
    endsAt?: string
  }
  questionnaire: {
    completed: boolean
    completedAt?: string
    responses?: QuestionnaireResponse[]
  }
  lastActive: string
  status: 'active' | 'inactive' | 'suspended' | 'banned'
  preferences?: UserPreferences
  matches?: number
  profileCompleteness: number
  totalSpent: number
  messages: Message[]
}

interface QuestionnaireResponse {
  questionId: string
  question: string
  answer: string
  category: string
}

interface UserPreferences {
  ageRange: [number, number]
  location: string[]
  education: string[]
  profession: string[]
  religion?: string
  interests: string[]
}

interface Message {
  id: string
  fromUserId?: string
  fromAdmin: boolean
  content: string
  timestamp: string
  read: boolean
  type: 'support' | 'notification' | 'offer'
}

interface Offer {
  id: string
  title: string
  description: string
  discountPercent?: number
  discountAmount?: number
  validUntil: string
  targetUsers: string[]
  isActive: boolean
  createdAt: string
}

interface AdminRole {
  id: string
  name: string
  permissions: string[]
}

// Mock data
const mockUsers: UserProfile[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    age: 28,
    location: 'Mumbai, India',
    profession: 'Product Manager',
    education: 'MBA',
    joinedAt: '2024-01-15T10:30:00Z',
    isVerified: true,
    subscription: { 
      plan: 'monthly', 
      status: 'active', 
      startedAt: '2024-02-01T00:00:00Z',
      endsAt: '2024-03-01T00:00:00Z'
    },
    questionnaire: { 
      completed: true, 
      completedAt: '2024-01-16T14:22:00Z',
      responses: [
        { questionId: 'q1', question: 'What are your relationship goals?', answer: 'Looking for a life partner for marriage', category: 'Goals' },
        { questionId: 'q2', question: 'What is your ideal age range for a partner?', answer: '26-32 years', category: 'Preferences' },
        { questionId: 'q3', question: 'What are your hobbies and interests?', answer: 'Reading, traveling, cooking, yoga', category: 'Lifestyle' },
        { questionId: 'q4', question: 'What is your family background?', answer: 'Nuclear family, both parents working', category: 'Background' }
      ]
    },
    lastActive: '2024-03-01T09:15:00Z',
    status: 'active',
    preferences: {
      ageRange: [26, 32],
      location: ['Mumbai', 'Pune', 'Delhi'],
      education: ['Bachelor', 'Master', 'MBA'],
      profession: ['Software Engineer', 'Manager', 'Consultant'],
      religion: 'Hindu',
      interests: ['Travel', 'Reading', 'Cooking']
    },
    matches: 12,
    profileCompleteness: 95,
    totalSpent: 1999,
    messages: [
      { id: 'm1', fromAdmin: false, content: 'Hi, I need help with my profile verification', timestamp: '2024-03-01T09:15:00Z', read: false, type: 'support' },
      { id: 'm2', fromAdmin: true, content: 'Hi Priya! I can help you with that. Please upload your ID document.', timestamp: '2024-03-01T09:20:00Z', read: true, type: 'support' }
    ]
  },
  {
    id: '2',
    name: 'Arjun Patel',
    email: 'arjun.patel@email.com',
    phone: '+91 87654 32109',
    age: 31,
    location: 'Delhi, India',
    profession: 'Software Engineer',
    education: 'B.Tech',
    joinedAt: '2024-01-20T16:45:00Z',
    isVerified: true,
    subscription: { 
      plan: 'trial', 
      status: 'active', 
      startedAt: '2024-02-25T00:00:00Z', 
      endsAt: '2024-03-04T00:00:00Z' 
    },
    questionnaire: { 
      completed: true, 
      completedAt: '2024-01-21T11:30:00Z',
      responses: [
        { questionId: 'q1', question: 'What are your relationship goals?', answer: 'Looking for serious relationship leading to marriage', category: 'Goals' },
        { questionId: 'q2', question: 'What is your ideal age range for a partner?', answer: '24-29 years', category: 'Preferences' }
      ]
    },
    lastActive: '2024-02-28T18:45:00Z',
    status: 'active',
    matches: 8,
    profileCompleteness: 78,
    totalSpent: 0,
    messages: []
  }
]

const mockOffers: Offer[] = [
  {
    id: 'o1',
    title: 'Valentine\'s Special',
    description: '50% off on Premium subscription for new users',
    discountPercent: 50,
    validUntil: '2024-02-14T23:59:59Z',
    targetUsers: ['trial'],
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'o2',
    title: 'Loyalty Bonus',
    description: '₹500 off for existing premium users',
    discountAmount: 500,
    validUntil: '2024-03-31T23:59:59Z',
    targetUsers: ['monthly', 'annual'],
    isActive: true,
    createdAt: '2024-02-15T00:00:00Z'
  }
]

const adminRoles: AdminRole[] = [
  { id: 'super', name: 'Super Admin', permissions: ['*'] },
  { id: 'manager', name: 'Manager', permissions: ['users', 'webinars', 'analytics', 'offers'] },
  { id: 'support', name: 'Support Agent', permissions: ['users:read', 'messages', 'support'] },
  { id: 'content', name: 'Content Manager', permissions: ['webinars', 'content'] }
]

export default function EnhancedAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'messages' | 'offers' | 'webinars' | 'analytics' | 'roles'>('overview')
  const [users, setUsers] = useState<UserProfile[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [userFilter, setUserFilter] = useState('all')
  const [offers, setOffers] = useState<Offer[]>(mockOffers)
  const [newMessage, setNewMessage] = useState('')
  const [selectedUserForMessage, setSelectedUserForMessage] = useState<string | null>(null)
  const [currentAdminRole, setCurrentAdminRole] = useState('super')
  const router = useRouter()

  useEffect(() => {
    // Mock authentication check
    setIsAuthenticated(true)
  }, [])

  const hasPermission = (permission: string): boolean => {
    const role = adminRoles.find(r => r.id === currentAdminRole)
    if (!role) return false
    return role.permissions.includes('*') || role.permissions.includes(permission)
  }

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'suspended' ? 'active' : 'suspended' as const }
        : user
    ))
  }

  const handleCancelSubscription = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            subscription: { 
              ...user.subscription, 
              status: 'cancelled' as const 
            }
          }
        : user
    ))
  }

  const handleStartTrial = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            subscription: { 
              plan: 'trial' as const,
              status: 'active' as const,
              startedAt: new Date().toISOString(),
              endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
          }
        : user
    ))
  }

  const handleSendMessage = (userId: string, content: string, type: 'support' | 'notification' | 'offer' = 'support') => {
    const newMsg: Message = {
      id: Date.now().toString(),
      fromAdmin: true,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      type
    }
    
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, messages: [...user.messages, newMsg] }
        : user
    ))
    setNewMessage('')
    setSelectedUserForMessage(null)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    const matchesFilter = userFilter === 'all' ||
                         (userFilter === 'active' && user.status === 'active') ||
                         (userFilter === 'suspended' && user.status === 'suspended') ||
                         (userFilter === 'trial' && user.subscription.plan === 'trial') ||
                         (userFilter === 'premium' && ['monthly', 'annual'].includes(user.subscription.plan))
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string, type: 'user' | 'subscription' = 'user') => {
    const colors = {
      user: {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        suspended: 'bg-red-100 text-red-800',
        banned: 'bg-red-200 text-red-900'
      },
      subscription: {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        suspended: 'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800'
      }
    }
    
    const colorConfig = colors[type] as Record<string, string>
    const statusColor = colorConfig[status] || 'bg-gray-100 text-gray-800'
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Enhanced Admin Dashboard - Make My Knot</title>
        <meta name="description" content="Complete administrative dashboard for Make My Knot" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <BrandLogo size="sm" className="mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Enhanced Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">Complete User Lifecycle Management</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={currentAdminRole}
                  onChange={(e) => setCurrentAdminRole(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-3 py-1"
                >
                  {adminRoles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-600">Administrator</span>
                <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-8 overflow-x-auto">
            <div className="flex space-x-0">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3, permission: 'overview' },
                { id: 'users', label: 'User Management', icon: Users, permission: 'users' },
                { id: 'messages', label: 'Messages', icon: MessageSquare, permission: 'messages' },
                { id: 'offers', label: 'Offers', icon: Gift, permission: 'offers' },
                { id: 'webinars', label: 'Webinars', icon: Video, permission: 'webinars' },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp, permission: 'analytics' },
                { id: 'roles', label: 'Roles', icon: Shield, permission: 'roles' },
              ].map((tab) => {
                const Icon = tab.icon
                const canAccess = hasPermission(tab.permission)
                
                if (!canAccess) return null
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
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

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Enhanced KPI Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">1,247</div>
                  <div className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% from last month
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Active Subscriptions</h3>
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">456</div>
                  <div className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% conversion rate
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Messages Today</h3>
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">89</div>
                  <div className="text-sm text-red-600 mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    12 urgent
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Monthly Revenue</h3>
                    <DollarSign className="h-5 w-5 text-gold-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">₹45,600</div>
                  <div className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18% from last month
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab('users')}
                      className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <div className="font-medium text-gray-900">Manage Users</div>
                      <div className="text-sm text-gray-600">View, suspend, or manage subscriptions</div>
                    </button>
                    <button 
                      onClick={() => setActiveTab('messages')}
                      className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <div className="font-medium text-gray-900">Handle Messages</div>
                      <div className="text-sm text-gray-600">Respond to user inquiries and support</div>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Server Status</span>
                      <span className="flex items-center text-green-600 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Online
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Database</span>
                      <span className="flex items-center text-green-600 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Healthy
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">API Response</span>
                      <span className="text-sm text-gray-700">&lt; 200ms</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <UserPlus className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700">New user: Priya S.</span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-gray-700">Subscription: Arjun P.</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 text-purple-500 mr-2" />
                      <span className="text-gray-700">Support request</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced User Management Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by name, email, or phone..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Users</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="trial">Trial Users</option>
                    <option value="premium">Premium Users</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Complete User Management</h3>
                  <p className="text-sm text-gray-600">Manage subscriptions, suspend users, view questionnaires, and send offers</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                <div className="text-xs text-gray-400">{user.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {getStatusBadge(user.status, 'user')}
                              {user.isVerified && (
                                <div className="flex items-center">
                                  <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                                  <span className="text-xs text-green-600">Verified</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {getStatusBadge(user.subscription.status, 'subscription')}
                              <div className="text-xs text-gray-600">
                                Plan: {user.subscription.plan}
                              </div>
                              {user.subscription.endsAt && (
                                <div className="text-xs text-gray-500">
                                  Ends: {formatDate(user.subscription.endsAt)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center mb-1">
                                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${user.profileCompleteness}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs">{user.profileCompleteness}%</span>
                              </div>
                              <div className="text-xs text-gray-600">
                                Matches: {user.matches || 0}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">₹{user.totalSpent?.toLocaleString() || 0}</div>
                            <div className="text-xs text-gray-500">Total spent</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user)
                                  setShowUserDetails(true)
                                }}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setSelectedUserForMessage(user.id)}
                                className="text-purple-600 hover:text-purple-800 p-1 rounded"
                                title="Send Message"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleSuspendUser(user.id)}
                                className={`p-1 rounded ${
                                  user.status === 'suspended'
                                    ? 'text-green-600 hover:text-green-800'
                                    : 'text-red-600 hover:text-red-800'
                                }`}
                                title={user.status === 'suspended' ? 'Activate User' : 'Suspend User'}
                              >
                                {user.status === 'suspended' ? <UserCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                              </button>
                              <div className="relative">
                                <button className="text-gray-600 hover:text-gray-800 p-1 rounded">
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* User Details Modal */}
          {showUserDetails && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Complete User Profile</h3>
                    <p className="text-sm text-gray-600">{selectedUser.name} - {selectedUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDetails(false)
                      setSelectedUser(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">Name:</span>
                            <span className="ml-2 font-medium">{selectedUser.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">Email:</span>
                            <span className="ml-2">{selectedUser.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">Phone:</span>
                            <span className="ml-2">{selectedUser.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">Age:</span>
                            <span className="ml-2">{selectedUser.age} years</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">Location:</span>
                            <span className="ml-2">{selectedUser.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">Profession:</span>
                            <span className="ml-2">{selectedUser.profession}</span>
                          </div>
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">Education:</span>
                            <span className="ml-2">{selectedUser.education}</span>
                          </div>
                        </div>
                      </div>

                      {/* Subscription Management */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Subscription Management</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Current Plan:</span>
                            {getStatusBadge(selectedUser.subscription.plan)}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Status:</span>
                            {getStatusBadge(selectedUser.subscription.status, 'subscription')}
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handleStartTrial(selectedUser.id)}
                              className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              Start Trial
                            </button>
                            <button
                              onClick={() => handleCancelSubscription(selectedUser.id)}
                              className="px-3 py-2 bg-red-100 text-red-800 text-sm rounded-lg hover:bg-red-200 transition-colors"
                            >
                              Cancel Subscription
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Questionnaire Data */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Questionnaire Responses</h4>
                        {selectedUser.questionnaire.completed ? (
                          <div className="space-y-4">
                            {selectedUser.questionnaire.responses?.map((response, index) => (
                              <div key={index} className="border-l-4 border-blue-500 pl-4">
                                <div className="text-sm font-medium text-gray-900 mb-1">
                                  {response.question}
                                </div>
                                <div className="text-sm text-gray-700 mb-1">
                                  {response.answer}
                                </div>
                                <div className="text-xs text-blue-600">
                                  {response.category}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                            Questionnaire not completed
                          </div>
                        )}
                      </div>

                      {/* Preferences */}
                      {selectedUser.preferences && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Partner Preferences</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600">Age Range:</span>
                              <span className="ml-2">{selectedUser.preferences.ageRange[0]}-{selectedUser.preferences.ageRange[1]} years</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Locations:</span>
                              <span className="ml-2">{selectedUser.preferences.location.join(', ')}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Education:</span>
                              <span className="ml-2">{selectedUser.preferences.education.join(', ')}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Interests:</span>
                              <span className="ml-2">{selectedUser.preferences.interests.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Admin Actions</h4>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleSuspendUser(selectedUser.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedUser.status === 'suspended'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {selectedUser.status === 'suspended' ? 'Activate User' : 'Suspend User'}
                      </button>
                      <button
                        onClick={() => setSelectedUserForMessage(selectedUser.id)}
                        className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                      >
                        Send Message
                      </button>
                      <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                        Create Offer
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Download Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Message Modal */}
          {selectedUserForMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Send Message</h3>
                  <p className="text-sm text-gray-600">
                    To: {users.find(u => u.id === selectedUserForMessage)?.name}
                  </p>
                </div>
                <div className="p-6">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setSelectedUserForMessage(null)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendMessage(selectedUserForMessage, newMessage)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab !== 'overview' && activeTab !== 'users' && (
            <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h2>
              <p className="text-gray-600 mb-6">
                Advanced {activeTab} management interface coming soon with full functionality.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
