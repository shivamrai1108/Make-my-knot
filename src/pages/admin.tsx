import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { 
  Shield, Trash2, CheckCircle2, Mail, Phone, User, Lock, LogOut, Users, BarChart3, MessageSquare, CreditCard, Eye, EyeOff, Settings, Zap, AlertTriangle, DollarSign, TrendingUp, Activity, UserPlus, Video, Calendar, Gift, Edit, XCircle, MapPin, Briefcase, GraduationCap, Search, Wifi, MessageCircle, FileText, Brain, Download, Target, Filter, Clock, Heart, Star
} from 'lucide-react'
import { useOnlineStatus } from '@/lib/OnlineStatusContext'
import { OnlineUsersList, OnlineStatusBadge, OnlineStatusIndicator } from '@/components/OnlineStatusIndicator'
import { getQuestionnaireResponses, essentialQuestions, calculateCompatibilityScore, QuestionnaireResponse } from '@/lib/questionnaireStore'
import { deleteLead as deleteLeadFromCRM, preventLeadDataLoss } from '@/lib/leadStore'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

// Enhanced interfaces for admin management
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
    responses?: AdminQuestionnaireResponse[]
  }
  lastActive: string
  status: 'active' | 'inactive' | 'suspended' | 'banned'
  preferences?: UserPreferences
  matches?: number
  profileCompleteness: number
  totalSpent: number
  messages: Message[]
}

interface AdminQuestionnaireResponse {
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

interface AdminRole {
  id: string
  name: string
  permissions: string[]
}

// Simple admin auth constants
const ADMIN_TOKEN_KEY = 'makemyknot_admin_token'
const ADMIN_PASSWORD = 'admin123'

// Mock analytics data
function getAnalyticsData() {
  return {
    totalUsers: 1247,
    newUsersThisWeek: 23,
    totalLeads: 342,
    newLeadsThisWeek: 15,
    activeSubscriptions: 89,
    trialUsers: 156,
    completedQuestionnaires: 892,
    verifiedLeads: 287
  }
}

// Mock notification system
function sendNotification(userId: string, message: string, type: string) {
  console.log(`Sending ${type} notification to ${userId}: ${message}`)
}

// Global PDF generation function
const generatePDF = async (assessment: any, setIsGeneratingPdf: (loading: boolean) => void) => {
  setIsGeneratingPdf(true)
  
  try {
    // Create new PDF document with A4 format for better quality
    const pdf = new jsPDF('portrait', 'pt', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let currentY = 60
    const margin = 50
    const contentWidth = pageWidth - (2 * margin)
    
    // Color palette for professional design
    const colors = {
      primary: [99, 102, 241], // Indigo
      secondary: [139, 92, 246], // Purple  
      accent: [245, 158, 11], // Amber
      success: [16, 185, 129], // Emerald
      text: [31, 41, 55], // Gray-800
      lightGray: [249, 250, 251], // Gray-50
      mediumGray: [156, 163, 175], // Gray-400
      darkGray: [75, 85, 99] // Gray-600
    }
    
    // Helper function to add text with better formatting
    const addText = (text: string, x: number, y: number, options: any = {}) => {
      const { 
        fontSize = 12, 
        fontStyle = 'normal', 
        color = colors.text, 
        align = 'left',
        maxWidth = contentWidth,
        lineHeight = 1.4
      } = options
      
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', fontStyle)
      pdf.setTextColor(color[0], color[1], color[2])
      
      if (maxWidth && text.length > 0) {
        const lines = pdf.splitTextToSize(text, maxWidth)
        if (align === 'center') {
          lines.forEach((line: string, index: number) => {
            pdf.text(line, x, y + (index * fontSize * lineHeight), { align: 'center' })
          })
        } else {
          pdf.text(lines, x, y)
        }
        return y + (lines.length * fontSize * lineHeight)
      } else {
        pdf.text(text, x, y, { align })
        return y + (fontSize * lineHeight)
      }
    }
    
    // Header with gradient-like design
    pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2])
    pdf.rect(0, 0, pageWidth, 120, 'F')
    
    // Company logo and branding
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(margin + 10, 25, 40, 40, 8, 8, 'F')
    pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Make My', margin + 15, 42)
    pdf.text('Knot', margin + 22, 52)
    
    // Main title
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(28)
    pdf.setFont('helvetica', 'bold')
    pdf.text('COMPATIBILITY ASSESSMENT REPORT', margin + 70, 55)
    
    // Subtitle
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Professional Psychological & Compatibility Analysis', margin + 70, 75)
    
    // Report metadata in header
    pdf.setFontSize(10)
    const reportDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    })
    const reportTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', minute: '2-digit' 
    })
    pdf.text(`Generated: ${reportDate} at ${reportTime}`, pageWidth - margin, 50, { align: 'right' })
    pdf.text(`Report ID: ${assessment.id.substring(0, 8).toUpperCase()}`, pageWidth - margin, 65, { align: 'right' })
    
    currentY = 160
    
    // Personal Information Section
    pdf.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2])
    pdf.rect(margin, currentY, contentWidth, 30, 'F')
    currentY = addText('Personal Information', margin + 15, currentY + 20, { 
      fontSize: 16, fontStyle: 'bold', color: colors.primary 
    })
    currentY += 15
    
    // User details in a clean table format
    const userDetails = [
      ['Name:', assessment.userInfo?.name || 'N/A'],
      ['Email:', assessment.userInfo?.email || 'N/A'],
      ['Phone:', assessment.userInfo?.phone || 'N/A'],
      ['User Type:', assessment.userInfo?.type?.toUpperCase() || 'N/A'],
      ['Assessment Date:', new Date(assessment.createdAt).toLocaleDateString()],
      ['Completion Status:', assessment.isComplete ? 'Complete' : 'In Progress']
    ]
    
    userDetails.forEach(([label, value]) => {
      currentY = addText(label, margin + 20, currentY, { 
        fontSize: 11, fontStyle: 'bold', color: colors.darkGray 
      })
      addText(value, margin + 120, currentY - 15, { 
        fontSize: 11, color: colors.text 
      })
      currentY += 5
    })
    
    currentY += 20
    
    // Responses Section
    pdf.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2])
    pdf.rect(margin, currentY, contentWidth, 30, 'F')
    currentY = addText('Assessment Responses', margin + 15, currentY + 20, { 
      fontSize: 16, fontStyle: 'bold', color: colors.primary 
    })
    currentY += 25
    
    // Add assessment responses with better formatting
    essentialQuestions.forEach((question, index) => {
      const answer = assessment.responses[question.id]
      if (answer) {
        // Check if we need a new page
        if (currentY > pageHeight - 100) {
          pdf.addPage()
          currentY = 60
        }
        
        // Question number and category
        currentY = addText(`Q${index + 1}. [${question.category}]`, margin, currentY, {
          fontSize: 10, fontStyle: 'bold', color: colors.accent
        })
        
        // Question text
        currentY = addText(question.question, margin, currentY + 5, {
          fontSize: 11, fontStyle: 'bold', color: colors.text, maxWidth: contentWidth - 20
        })
        
        // Answer
        const formattedAnswer = Array.isArray(answer) ? answer.join(', ') : String(answer)
        currentY = addText(`Answer: ${formattedAnswer}`, margin + 20, currentY + 5, {
          fontSize: 10, color: colors.darkGray, maxWidth: contentWidth - 40
        })
        
        currentY += 15
      }
    })
    
    // Footer
    const footerY = pageHeight - 50
    pdf.setDrawColor(colors.mediumGray[0], colors.mediumGray[1], colors.mediumGray[2])
    pdf.setLineWidth(0.5)
    pdf.line(margin, footerY - 10, pageWidth - margin, footerY - 10)
    
    pdf.setFontSize(8)
    pdf.setTextColor(colors.mediumGray[0], colors.mediumGray[1], colors.mediumGray[2])
    pdf.text('© Make My Knot - Confidential Assessment Report', margin, footerY)
    pdf.text(`Page 1 of ${pdf.getNumberOfPages()}`, pageWidth - margin, footerY, { align: 'right' })
    
    // Save the PDF
    const fileName = `Assessment_${assessment.userInfo?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'User'}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF. Please try again.')
  } finally {
    setIsGeneratingPdf(false)
  }
}

// CRM Configuration Interface
interface CRMConfig {
  provider: 'hubspot' | 'salesforce' | 'pipedrive' | 'custom'
  apiKey: string
  baseUrl?: string
  isEnabled: boolean
  syncSettings: {
    autoSync: boolean
    syncFrequency: number // minutes
    fieldsMapping: Record<string, string>
  }
}

// Lead Activity Interface
interface LeadActivity {
  id: string
  leadId: string
  type: 'note' | 'call' | 'email' | 'meeting' | 'status_change' | 'sync'
  description: string
  createdBy: string
  createdAt: string
  metadata?: Record<string, any>
}

// Enhanced Lead Interface
interface Lead {
  id: string
  name: string
  email: string
  phone: string
  status: 'new' | 'qualified' | 'contacted' | 'interested' | 'not_interested' | 'verified' | 'converted'
  source: 'website' | 'referral' | 'social' | 'advertisement' | 'event' | 'other'
  score: number // 0-100
  qualificationLevel: 'cold' | 'warm' | 'hot' | 'qualified'
  assignedTo?: string
  tags: string[]
  syncedAt?: string
  lastActivityAt?: string
  createdAt: string
  updatedAt: string
  notes?: string
  customFields?: Record<string, any>
}

// Enhanced lead interface with questionnaire data
interface EnhancedLead extends Lead {
  questionnaire: QuestionnaireResponse | null
  hasQuestionnaire: boolean
  questionnaireComplete: boolean
  answers?: Record<string, any>
  biodataFile?: File | null
}

// Mock lead management functions
function getLeads(): Lead[] {
  return JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
}

// Removed local deleteLead function - now using secure version from leadStore

function verifyLead(id: string) {
  const leads = getLeads()
  const updated = leads.map(l => l.id === id ? {...l, status: 'verified' as const} : l)
  localStorage.setItem('makemyknot_leads', JSON.stringify(updated))
}

function saveLead(lead: Lead) {
  const leads = getLeads()
  const updated = leads.map(l => l.id === lead.id ? lead : l)
  localStorage.setItem('makemyknot_leads', JSON.stringify(updated))
}

// CRM Configuration Management
function getCRMConfig(): CRMConfig {
  const defaultConfig: CRMConfig = {
    provider: 'hubspot',
    apiKey: '',
    isEnabled: false,
    syncSettings: {
      autoSync: false,
      syncFrequency: 60,
      fieldsMapping: {
        'name': 'firstname',
        'email': 'email',
        'phone': 'phone',
        'status': 'lifecyclestage'
      }
    }
  }
  return JSON.parse(localStorage.getItem('makemyknot_crm_config') || JSON.stringify(defaultConfig))
}

function saveCRMConfig(config: CRMConfig) {
  localStorage.setItem('makemyknot_crm_config', JSON.stringify(config))
}

// Lead Scoring System
function calculateLeadScore(lead: Lead, questionnaire?: QuestionnaireResponse): number {
  let score = 0
  
  // Base score for having complete contact info
  if (lead.email && lead.phone && lead.name) score += 20
  
  // Questionnaire completion score
  if (questionnaire) {
    const responseCount = Object.keys(questionnaire.responses).length
    const completionPercentage = (responseCount / essentialQuestions.length) * 100
    score += Math.round(completionPercentage * 0.4) // 40% weight for questionnaire
  }
  
  // Profile quality indicators
  if (lead.tags && lead.tags.length > 0) score += 10
  if (lead.notes && lead.notes.length > 50) score += 5
  
  // Activity recency bonus
  if (lead.lastActivityAt) {
    const daysSinceActivity = (Date.now() - new Date(lead.lastActivityAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceActivity < 7) score += 15
    else if (daysSinceActivity < 30) score += 10
  }
  
  // Status-based scoring
  const statusScores = {
    'new': 10,
    'qualified': 20,
    'contacted': 25,
    'interested': 35,
    'not_interested': 0,
    'verified': 40,
    'converted': 50
  }
  
  score += statusScores[lead.status] || 0
  
  return Math.min(Math.max(score, 0), 100)
}

// Determine lead qualification level based on score
function getQualificationLevel(score: number): 'cold' | 'warm' | 'hot' | 'qualified' {
  if (score >= 80) return 'qualified'
  if (score >= 60) return 'hot'
  if (score >= 40) return 'warm'
  return 'cold'
}

// Lead Activities Management
function getLeadActivities(leadId: string): LeadActivity[] {
  const allActivities = JSON.parse(localStorage.getItem('makemyknot_lead_activities') || '[]')
  return allActivities.filter((activity: LeadActivity) => activity.leadId === leadId)
}

function addLeadActivity(activity: Omit<LeadActivity, 'id' | 'createdAt'>) {
  const activities = JSON.parse(localStorage.getItem('makemyknot_lead_activities') || '[]')
  const newActivity: LeadActivity = {
    ...activity,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  }
  activities.push(newActivity)
  localStorage.setItem('makemyknot_lead_activities', JSON.stringify(activities))
  return newActivity
}

// Enhanced CRM Sync with proper error handling
function syncLeadToCRM(lead: Lead) {
  const config = getCRMConfig()
  
  if (!config.isEnabled || !config.apiKey) {
    return { success: false, error: 'CRM not configured or disabled' }
  }
  
  try {
    console.log(`Syncing lead to ${config.provider} CRM:`, lead)
    
    // Add activity log
    addLeadActivity({
      leadId: lead.id,
      type: 'sync',
      description: `Lead synced to ${config.provider.toUpperCase()} CRM`,
      createdBy: 'system'
    })
    
    // In production, this would make actual API calls
    // Example for HubSpot:
    // const hubspotData = {
    //   properties: {
    //     firstname: lead.name,
    //     email: lead.email,
    //     phone: lead.phone,
    //     lifecyclestage: lead.status
    //   }
    // }
    // await fetch(`${config.baseUrl}/contacts/v1/contact/`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${config.apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(hubspotData)
    // })
    
    return { success: true, message: `Lead synced to ${config.provider.toUpperCase()} successfully` }
  } catch (error) {
    console.error('CRM Sync Error:', error)
    return { success: false, error: `Failed to sync to ${config.provider}: ${error}` }
  }
}

// Bulk Operations
function bulkUpdateLeads(leadIds: string[], updates: Partial<Lead>) {
  const leads = getLeads()
  const updatedLeads = leads.map(lead => 
    leadIds.includes(lead.id) ? { ...lead, ...updates, updatedAt: new Date().toISOString() } : lead
  )
  localStorage.setItem('makemyknot_leads', JSON.stringify(updatedLeads))
  
  // Log activities for bulk updates
  leadIds.forEach(leadId => {
    addLeadActivity({
      leadId,
      type: 'status_change',
      description: `Bulk update applied: ${Object.keys(updates).join(', ')}`,
      createdBy: 'admin'
    })
  })
  
  return updatedLeads.filter(lead => leadIds.includes(lead.id))
}

function exportLeadsToCSV(leads: EnhancedLead[]) {
  const headers = [
    'ID', 'Name', 'Email', 'Phone', 'Status', 'Source', 'Score', 
    'Qualification Level', 'Assigned To', 'Tags', 'Has Questionnaire',
    'Questionnaire Complete', 'Created At', 'Last Activity'
  ]
  
  const rows = leads.map(lead => [
    lead.id,
    lead.name,
    lead.email,
    lead.phone,
    lead.status,
    lead.source || 'website',
    lead.score || 0,
    lead.qualificationLevel || 'cold',
    lead.assignedTo || '',
    (lead.tags || []).join('; '),
    lead.hasQuestionnaire ? 'Yes' : 'No',
    lead.questionnaireComplete ? 'Yes' : 'No',
    lead.createdAt || new Date().toISOString(),
    lead.lastActivityAt || ''
  ])
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
    
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Import LogIn icon
import { LogIn } from 'lucide-react'

type AdminTab = 'dashboard' | 'users' | 'leads' | 'nominations' | 'questionnaires' | 'assessments' | 'webinars' | 'matchmaking' | 'moderation' | 'payments' | 'analytics' | 'communication' | 'offers' | 'online-status'

// Enhanced webinar interface
interface Webinar {
  id: string
  title: string
  description: string
  speaker: string
  date: string
  time: string
  duration: number // in minutes
  maxParticipants: number
  registeredCount: number
  price: number
  currency: string
  image: string
  status: 'draft' | 'published' | 'completed' | 'cancelled'
  tags: string[]
  createdAt: string
  updatedAt: string
}

// Offer interface
interface Offer {
  id: string
  title: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  validFrom: string
  validUntil: string
  targetUsers: string[]
  isActive: boolean
  maxUses?: number
  currentUses: number
  createdAt: string
  updatedAt: string
}

// Webinar data - loaded from database in production
const mockWebinars: Webinar[] = []

// Offers data - loaded from database in production
const mockOffers: Offer[] = []

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
    if (token === 'ok') {
      setAuthed(true)
      // Initialize lead data protection when admin loads
      preventLeadDataLoss()
      console.log('🔒 Lead data protection initialized for admin session')
    }
  }, [])

  const login = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, 'ok')
      setAuthed(true)
    } else {
      alert('Invalid admin password')
    }
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-xl bg-blue-500 mr-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          </div>
          <form onSubmit={login} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter Admin Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e)=>setPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500" 
                  placeholder="Enter admin password" 
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-1"/>
                  Login
                </button>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">🔒 Secure admin access for Make My Knot management</p>
            </div>
          </form>
        </div>
      </main>
    )
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'online-status', label: 'Online Status', icon: Wifi },
    { id: 'leads', label: 'CRM & Leads', icon: Mail },
    { id: 'nominations', label: 'Nominations', icon: UserPlus },
    { id: 'questionnaires', label: 'AI Questionnaires', icon: Brain },
    { id: 'assessments', label: 'Assessments', icon: FileText },
    { id: 'webinars', label: 'Webinars', icon: Video },
    { id: 'offers', label: 'Offers', icon: Gift },
    { id: 'matchmaking', label: 'Matchmaking', icon: Shield },
    { id: 'moderation', label: 'Moderation', icon: Eye },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
  ]

  return (
    <>
      <Head>
        <title>Admin Dashboard - Make My Knot</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center px-6 py-5 border-b border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-600 mr-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Make My Knot</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AdminTab)}
                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                )
              })}
            </div>
          </nav>

          {/* User Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <button 
                onClick={() => {
                  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
                  setAuthed(false)
                }} 
                className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pl-64">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Welcome back! Here's what's happening with Make My Knot today.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">System Online</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              {/* Quick Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">1,247</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+12%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Active Matches</p>
                      <p className="text-2xl font-bold text-gray-900">342</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+8%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">₹2.1L</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+23%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">91%</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+2%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
              </div>

          {/* Tab Content */}
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'users' && <UserManagementTab />}
          {activeTab === 'online-status' && <OnlineStatusTab />}
          {activeTab === 'leads' && <CRMLeadsTab />}
          {activeTab === 'nominations' && <NominationsTab />}
          {activeTab === 'questionnaires' && <QuestionnairesTab />}
          {activeTab === 'assessments' && <AssessmentsTab />}
          {activeTab === 'webinars' && <WebinarsTab />}
          {activeTab === 'offers' && <OffersTab />}
          {activeTab === 'matchmaking' && <MatchmakingTab />}
          {activeTab === 'moderation' && <ModerationTab />}
          {activeTab === 'payments' && <PaymentsTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'communication' && <CommunicationTab />}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

// Assessments Management Tab with PDF Download
function AssessmentsTab() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'complete' | 'incomplete'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  useEffect(() => {
    // Get questionnaire responses
    const questionnaires = getQuestionnaireResponses()
    
    // Get leads with their details
    const leads = getLeads()
    
    // Combine questionnaires with lead/user information
    const assessmentsData = questionnaires.map(q => {
      let userInfo = null
      
      if (q.leadId) {
        const lead = leads.find(l => l.id === q.leadId)
        if (lead) {
          userInfo = {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            type: 'lead'
          }
        }
      } else if (q.userId) {
        // Try to get user info from users storage
        try {
          const users = JSON.parse(localStorage.getItem('makemyknot_users') || '[]')
          const user = users.find((u: any) => u.id === q.userId)
          if (user) {
            userInfo = {
              name: user.name,
              email: user.email,
              phone: user.phone,
              type: 'user'
            }
          }
        } catch (e) {
          console.error('Error getting user info:', e)
        }
      }
      
      return {
        ...q,
        userInfo: userInfo || {
          name: 'Unknown User',
          email: 'unknown@email.com',
          phone: 'N/A',
          type: 'unknown'
        }
      }
    })
    
    setAssessments(assessmentsData)
  }, [])

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = !searchTerm || 
      assessment.userInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.userInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assessment.userId && assessment.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (assessment.leadId && assessment.leadId.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'complete' && assessment.isComplete) ||
      (filterStatus === 'incomplete' && !assessment.isComplete)
    
    return matchesSearch && matchesFilter
  })

  const exportAssessmentToExcel = (assessment: any) => {
    try {
      // Gather user info (attempt to enrich with age if present for users)
      let age: number | string = ''
      try {
        if (assessment.userId) {
          const users = JSON.parse(localStorage.getItem('makemyknot_users') || '[]')
          const user = users.find((u: any) => u.id === assessment.userId)
          if (user && (typeof user.age === 'number' || typeof user.age === 'string')) {
            age = user.age
          }
        }
      } catch {}

      const summaryRows = [
        { Field: 'Name', Value: assessment.userInfo.name || '' },
        { Field: 'Email', Value: assessment.userInfo.email || '' },
        { Field: 'Phone', Value: assessment.userInfo.phone || '' },
        { Field: 'Age', Value: age },
        { Field: 'Type', Value: assessment.userInfo.type || '' },
        { Field: 'Assessment ID', Value: assessment.id },
        { Field: 'Status', Value: assessment.isComplete ? 'Complete' : 'In Progress' },
        { Field: 'Created At', Value: new Date(assessment.createdAt).toLocaleString() },
        { Field: 'Completed At', Value: assessment.completedAt ? new Date(assessment.completedAt).toLocaleString() : '' },
      ]

      // Build detailed responses (only include questions that exist in essentialQuestions to keep ordering)
      const responseRows = essentialQuestions.map((q, idx) => {
        const ans = assessment.responses[q.id]
        const normalized = Array.isArray(ans) ? ans.join(', ') : (ans ?? '')
        return {
          '#': idx + 1,
          Category: q.category,
          Question: q.question,
          Answer: normalized,
        }
      })

      const wb = XLSX.utils.book_new()
      const wsSummary = XLSX.utils.json_to_sheet(summaryRows)
      const wsResponses = XLSX.utils.json_to_sheet(responseRows)

      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary')
      XLSX.utils.book_append_sheet(wb, wsResponses, 'Responses')

      const cleanName = (assessment.userInfo.name || 'User').replace(/[^a-zA-Z0-9]/g, '-')
      const timestamp = new Date().toISOString().split('T')[0]
      const fileName = `MakeMyKnot_Assessment_${cleanName}_${timestamp}_${assessment.id.substring(0, 8)}.xlsx`
      XLSX.writeFile(wb, fileName)
    } catch (e) {
      console.error('Error exporting assessment to Excel', e)
      alert('Error exporting assessment to Excel. Please try again.')
    }
  }

  const handleDeleteAssessment = (assessmentId: string) => {
    if (confirm('Delete this assessment? This action cannot be undone.')) {
      const allAssessments = getQuestionnaireResponses()
      const filteredAssessments = allAssessments.filter(q => q.id !== assessmentId)
      localStorage.setItem('questionnaire_responses', JSON.stringify(filteredAssessments))
      
      // Update state
      setAssessments(prev => prev.filter(a => a.id !== assessmentId))
      
      alert('Assessment deleted successfully')
    }
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary-600" />
              User Assessment Reports
            </h2>
            <p className="text-gray-600 mt-2">View detailed assessment reports and download PDF summaries for individual users</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-blue-900">{assessments.length}</div>
                <div className="text-sm text-blue-700">Total Assessments</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-green-900">
                  {assessments.filter(a => a.isComplete).length}
                </div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-orange-900">
                  {assessments.filter(a => a.userInfo.type === 'lead').length}
                </div>
                <div className="text-sm text-orange-700">Lead Assessments</div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-purple-900">
                  {assessments.filter(a => a.userInfo.type === 'user').length}
                </div>
                <div className="text-sm text-purple-700">User Assessments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Assessments</option>
            <option value="complete">Complete</option>
            <option value="incomplete">In Progress</option>
          </select>
        </div>
      </div>

      {/* Assessments List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssessments.map((assessment) => (
                <tr key={assessment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {assessment.userInfo.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {assessment.userInfo.name}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {assessment.userInfo.type} • ID: {assessment.id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assessment.userInfo.email}</div>
                    <div className="text-sm text-gray-500">{assessment.userInfo.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      assessment.isComplete
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assessment.isComplete ? 'Complete' : 'In Progress'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(Object.keys(assessment.responses).length / essentialQuestions.length) * 100}%` 
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Object.keys(assessment.responses).length}/{essentialQuestions.length} questions
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assessment.completedAt ? new Date(assessment.completedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedAssessment(assessment)}
                        className="text-primary-600 hover:text-primary-900 flex items-center gap-1 px-3 py-1 rounded border border-primary-200 hover:bg-primary-50"
                        title="View Assessment"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        onClick={() => exportAssessmentToExcel(assessment)}
                        className="text-green-700 hover:text-green-900 flex items-center gap-1 px-3 py-1 rounded border border-green-200 hover:bg-green-50"
                        title="Download Excel Report"
                      >
                        <Download className="h-4 w-4" />
                        Excel
                      </button>
                      <button
                        onClick={() => handleDeleteAssessment(assessment.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1 px-3 py-1 rounded border border-red-200 hover:bg-red-50"
                        title="Delete Assessment"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No assessments found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? 'No assessments match your search criteria.' : 'No assessment reports are available yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Assessment Detail Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Assessment Report - {selectedAssessment.userInfo.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedAssessment.userInfo.email} • Assessment ID: {selectedAssessment.id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportAssessmentToExcel(selectedAssessment)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Excel
                  </button>
                  <button
                    onClick={() => setSelectedAssessment(null)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* User Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">User Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <div className="font-medium text-gray-900">{selectedAssessment.userInfo.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <div className="font-medium text-gray-900">{selectedAssessment.userInfo.email}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <div className="font-medium text-gray-900">{selectedAssessment.userInfo.phone}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <div className="font-medium text-gray-900 capitalize">{selectedAssessment.userInfo.type}</div>
                  </div>
                </div>
              </div>

              {/* Assessment Progress */}
              <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                <h4 className="font-semibold text-primary-900 mb-3">Assessment Progress</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-primary-700">Status:</span>
                    <div className={`font-medium ${
                      selectedAssessment.isComplete ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedAssessment.isComplete ? 'Complete' : 'In Progress'}
                    </div>
                  </div>
                  <div>
                    <span className="text-primary-700">Progress:</span>
                    <div className="font-medium text-primary-900">
                      {Object.keys(selectedAssessment.responses).length}/{essentialQuestions.length} questions
                    </div>
                  </div>
                  <div>
                    <span className="text-primary-700">Started:</span>
                    <div className="font-medium text-primary-900">
                      {new Date(selectedAssessment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-primary-700">Completed:</span>
                    <div className="font-medium text-primary-900">
                      {selectedAssessment.completedAt 
                        ? new Date(selectedAssessment.completedAt).toLocaleDateString()
                        : '—'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Responses Summary */}
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary-600" />
                  Comprehensive Assessment Analysis
                </h4>
                
                {/* Core Values & Beliefs */}
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h5 className="font-medium text-primary-900 mb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4" /> Core Values & Beliefs
                  </h5>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries({
                      'Spirituality': selectedAssessment.responses.spirituality_importance,
                      'Pre-marital Counseling': selectedAssessment.responses.premarital_counseling,
                      'Caste Importance': selectedAssessment.responses.caste_importance,
                    }).filter(([_, value]) => value).map(([key, value]) => (
                      <div key={key} className="p-3 bg-white border border-primary-200 rounded-lg">
                        <div className="text-xs font-medium text-primary-700 uppercase">{key}</div>
                        <div className="text-sm text-gray-900 mt-1">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Relationship & Future */}
                <div className="bg-rose-50 p-4 rounded-lg">
                  <h5 className="font-medium text-rose-900 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" /> Relationship & Future Plans
                  </h5>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries({
                      'Children Perspective': selectedAssessment.responses.children_perspective,
                      'Relocation Openness': selectedAssessment.responses.relocation_openness,
                      'Shared Interests': selectedAssessment.responses.shared_interests_importance,
                      'Family/Independence Balance': selectedAssessment.responses.family_independence_scenario,
                      'Career Opportunity Response': selectedAssessment.responses.career_opportunity_scenario,
                      'Family Gathering Response': selectedAssessment.responses.family_gathering_scenario
                    }).filter(([_, value]) => value).map(([key, value]) => {
                      const displayValue = typeof value === 'string' && value.length > 60 
                        ? value.substring(0, 60) + '...' 
                        : value
                      return (
                        <div key={key} className="p-3 bg-white border border-rose-200 rounded-lg">
                          <div className="text-xs font-medium text-rose-700 uppercase">{key}</div>
                          <div className="text-sm text-gray-900 mt-1" title={value}>{displayValue}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Lifestyle & Personal Preferences */}
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h5 className="font-medium text-amber-900 mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" /> Lifestyle & Personal Preferences
                  </h5>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries({
                      'Weekend Preferences': Array.isArray(selectedAssessment.responses.weekend_preferences)
                        ? selectedAssessment.responses.weekend_preferences.join(', ')
                        : selectedAssessment.responses.weekend_preferences,
                      'Hobbies & Activities': Array.isArray(selectedAssessment.responses.hobbies_activities)
                        ? selectedAssessment.responses.hobbies_activities.join(', ')
                        : selectedAssessment.responses.hobbies_activities,
                      'Drinking Habits': selectedAssessment.responses.drinking_habits,
                      'Smoking Habits': selectedAssessment.responses.smoking_habits,
                      'Relationship Motivations': Array.isArray(selectedAssessment.responses.relationship_reasons)
                        ? selectedAssessment.responses.relationship_reasons.join(', ')
                        : selectedAssessment.responses.relationship_reasons
                    }).filter(([_, value]) => value).map(([key, value]) => {
                      const displayValue = typeof value === 'string' && value.length > 60 
                        ? value.substring(0, 60) + '...' 
                        : value
                      return (
                        <div key={key} className="p-3 bg-white border border-amber-200 rounded-lg">
                          <div className="text-xs font-medium text-amber-700 uppercase">{key}</div>
                          <div className="text-sm text-gray-900 mt-1" title={value}>{displayValue}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* AI Compatibility Score */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                  <h5 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" /> AI Compatibility Analysis
                  </h5>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600">85%</div>
                      <div className="text-xs text-purple-700 uppercase">Compatibility Score</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-blue-600">{Object.keys(selectedAssessment.responses).length}</div>
                      <div className="text-xs text-blue-700 uppercase">Questions Answered</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedAssessment.isComplete ? '100%' : Math.round((Object.keys(selectedAssessment.responses).length / essentialQuestions.length) * 100) + '%'}
                      </div>
                      <div className="text-xs text-green-700 uppercase">Profile Completeness</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Dashboard Overview Tab
function DashboardTab() {
  const [analytics, setAnalytics] = useState<any>(null)
  
  useEffect(() => {
    setAnalytics(getAnalyticsData())
  }, [])

  if (!analytics) return <div>Loading...</div>

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <div className="card hover-lift border-gradient-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-xl gradient-bg mr-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">{analytics.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-success-600 font-medium">+{analytics.newUsersThisWeek} this week</div>
          <div className="text-xs text-gray-500">📈 Growing</div>
        </div>
      </div>
      
      <div className="card hover-lift border-gradient-accent">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-xl gradient-bg-accent mr-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text-accent">{analytics.totalLeads}</div>
              <div className="text-sm text-gray-600">Total Leads</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-success-600 font-medium">+{analytics.newLeadsThisWeek} this week</div>
          <div className="text-xs text-gray-500">💼 Active</div>
        </div>
      </div>
      
      <div className="card hover-lift">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-xl gradient-bg-sunset mr-4">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text-gold">{analytics.activeSubscriptions}</div>
              <div className="text-sm text-gray-600">Active Subscriptions</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-warning-600 font-medium">{analytics.trialUsers} on trial</div>
          <div className="text-xs text-gray-500">💰 Revenue</div>
        </div>
      </div>
      
      <div className="card hover-lift">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-xl gradient-bg-secondary mr-4">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">{analytics.completedQuestionnaires}</div>
              <div className="text-sm text-gray-600">Questionnaires</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-primary-600 font-medium">Completed assessments</div>
          <div className="text-xs text-gray-500">📊 Insights</div>
        </div>
      </div>
    </div>
  )
}

// Online Status Monitoring Tab
function OnlineStatusTab() {
  const { 
    getTotalOnlineUsers, 
    getOnlineUsersList, 
    onlineUsers, 
    getUserStatus, 
    getLastSeenText 
  } = useOnlineStatus();
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'away' | 'offline'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'lastSeen'>('lastSeen');

  // Get all users with their status
  const allUserStatuses = Array.from(onlineUsers.values());
  
  // Filter users based on status
  const filteredUsers = allUserStatuses.filter(userStatus => {
    if (statusFilter === 'all') return true;
    return userStatus.status === statusFilter;
  });

  // Sort users
  const sortedUsers = filteredUsers.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.userId.localeCompare(b.userId);
      case 'status':
        const statusOrder = { online: 0, away: 1, offline: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      case 'lastSeen':
        return b.lastSeen.getTime() - a.lastSeen.getTime();
      default:
        return 0;
    }
  });

  const onlineCount = allUserStatuses.filter(u => u.status === 'online').length;
  const awayCount = allUserStatuses.filter(u => u.status === 'away').length;
  const offlineCount = allUserStatuses.filter(u => u.status === 'offline').length;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Wifi className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{onlineCount}</div>
              <div className="text-sm text-gray-600">Online Now</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm text-green-600">Active users</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{awayCount}</div>
              <div className="text-sm text-gray-600">Away</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-yellow-600">Inactive users</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{offlineCount}</div>
              <div className="text-sm text-gray-600">Offline</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-500">Offline users</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{allUserStatuses.length}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm text-gray-600">
              {Math.round((onlineCount / allUserStatuses.length) * 100)}% online
            </div>
          </div>
        </div>
      </div>

      {/* User Status Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">User Status Monitor</h2>
              <p className="text-sm text-gray-600">Real-time monitoring of user online status and activity</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="away">Away</option>
                <option value="offline">Offline</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="lastSeen">Sort by Last Seen</option>
                <option value="status">Sort by Status</option>
                <option value="name">Sort by Name</option>
              </select>
              <OnlineStatusBadge />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table-enhanced">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Seen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((userStatus) => (
                <tr key={userStatus.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {userStatus.userId.slice(-2).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          User {userStatus.userId.slice(-6)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {userStatus.userId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OnlineStatusIndicator 
                      userId={userStatus.userId} 
                      showText={true}
                      size="md"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getLastSeenText(userStatus.userId)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {userStatus.lastSeen.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {userStatus.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        {userStatus.location === 'Mobile' ? (
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        ) : (
                          <Activity className="h-4 w-4 mr-2 text-gray-400" />
                        )}
                        {userStatus.location}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {userStatus.isTyping && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Typing...
                        </span>
                      )}
                      {userStatus.status === 'online' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedUsers.length === 0 && (
          <div className="text-center py-12">
            <Wifi className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-sm text-gray-500">
              No users match the current filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Currently Online</h4>
            <OnlineUsersList maxUsers={8} showAvatars={true} className="" />
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">System Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Real-time updates</span>
                <span className="text-sm font-medium text-green-600 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last refresh</span>
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Peak online today</span>
                <span className="text-sm text-gray-900 font-medium">
                  {Math.max(onlineCount, Math.floor(Math.random() * 20) + onlineCount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// User Management Tab
function UserManagementTab() {
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  
  useEffect(() => {
    const refresh = () => {
      try {
        const raw = JSON.parse(localStorage.getItem('makemyknot_users')||'[]')
        const sanitized = raw.map((u:any)=>{ const {password, ...rest} = u; return rest })
        setUsers(sanitized)
      } catch { setUsers([]) }
    }
    refresh()
  }, [])

  const handleVerifyUser = (userId: string) => {
    const allUsers = JSON.parse(localStorage.getItem('makemyknot_users') || '[]')
    const idx = allUsers.findIndex((u: any) => u.id === userId)
    if (idx >= 0) {
      allUsers[idx].isVerified = true
      localStorage.setItem('makemyknot_users', JSON.stringify(allUsers))
      sendNotification(userId, 'Your account has been verified! Welcome to Make My Knot.', 'success')
      setUsers(prev => prev.map(u => u.id === userId ? {...u, isVerified: true} : u))
    }
  }

  const handleSuspendUser = (userId: string) => {
    if (confirm('Suspend this user?')) {
      sendNotification(userId, 'Your account has been temporarily suspended. Contact support for assistance.', 'warning')
      alert('User suspended (demo - no actual suspension logic)')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Verified</th>
              <th className="py-2 pr-4">Subscription</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u)=> (
              <tr key={u.id} className="border-b last:border-0">
                <td className="py-3 pr-4">{u.name || '—'}</td>
                <td className="py-3 pr-4">{u.email}</td>
                <td className="py-3 pr-4">{u.phone || '—'}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    u.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {u.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="py-3 pr-4">{u.subscription?.plan || '—'}</td>
                <td className="py-3 pr-4">
                  <div className="flex gap-2">
                    {!u.isVerified && (
                      <button onClick={() => handleVerifyUser(u.id)} className="px-3 py-1 bg-green-600 text-white text-xs rounded flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />Verify
                      </button>
                    )}
                    <button onClick={() => handleSuspendUser(u.id)} className="px-3 py-1 bg-red-600 text-white text-xs rounded flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />Suspend
                    </button>
                    <button onClick={() => setSelectedUser(u)} className="px-3 py-1 bg-blue-600 text-white text-xs rounded flex items-center gap-1">
                      <Eye className="h-3 w-3" />View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">User Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Location:</strong> {selectedUser.location || '—'}</p>
              <p><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => setSelectedUser(null)} className="mt-4 btn-secondary">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

// CRM & Leads Tab - Enhanced with questionnaire data and advanced features
function CRMLeadsTab() {
  const [leads, setLeads] = useState<EnhancedLead[]>([])
  const [leadQuestionnaires, setLeadQuestionnaires] = useState<QuestionnaireResponse[]>([])
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [filter, setFilter] = useState('all')
  const [showQuestionnaireData, setShowQuestionnaireData] = useState(false)
  const [showCRMConfig, setShowCRMConfig] = useState(false)
  const [crmConfig, setCrmConfig] = useState<CRMConfig>(getCRMConfig())
  const [searchTerm, setSearchTerm] = useState('')
  const [scoreRange, setScoreRange] = useState([0, 100])
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [selectedQualification, setSelectedQualification] = useState<string>('all')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [showLeadActivities, setShowLeadActivities] = useState<string | null>(null)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  
  useEffect(() => {
    const refresh = () => {
      const allLeads = getLeads()
      const allQuestionnaires = getQuestionnaireResponses()
      
      // Get questionnaires specifically from leads
      const leadQuestionnaires = allQuestionnaires.filter(q => q.leadId)
      
      // Enhance leads with questionnaire data and scoring
      const enhancedLeads = allLeads.map(lead => {
        const questionnaire = leadQuestionnaires.find(q => q.leadId === lead.id)
        
        // Ensure required fields exist with defaults
        const enhancedLead = {
          ...lead,
          source: lead.source || 'website',
          tags: lead.tags || [],
          createdAt: lead.createdAt || new Date().toISOString(),
          updatedAt: lead.updatedAt || new Date().toISOString(),
          questionnaire: questionnaire || null,
          hasQuestionnaire: !!questionnaire,
          questionnaireComplete: questionnaire?.isComplete || false
        }
        
        // Calculate lead score
        const score = calculateLeadScore(enhancedLead, questionnaire)
        const qualificationLevel = getQualificationLevel(score)
        
        return {
          ...enhancedLead,
          score,
          qualificationLevel
        }
      })
      
      setLeads(enhancedLeads)
      setLeadQuestionnaires(leadQuestionnaires)
    }
    
    refresh()
  }, [])

  const refresh = () => {
    const allLeads = getLeads()
    const allQuestionnaires = getQuestionnaireResponses()
    
    const leadQuestionnaires = allQuestionnaires.filter(q => q.leadId)
    
    const enhancedLeads = allLeads.map(lead => {
      const questionnaire = leadQuestionnaires.find(q => q.leadId === lead.id)
      
      const enhancedLead = {
        ...lead,
        source: lead.source || 'website',
        tags: lead.tags || [],
        createdAt: lead.createdAt || new Date().toISOString(),
        updatedAt: lead.updatedAt || new Date().toISOString(),
        questionnaire: questionnaire || null,
        hasQuestionnaire: !!questionnaire,
        questionnaireComplete: questionnaire?.isComplete || false
      }
      
      const score = calculateLeadScore(enhancedLead, questionnaire)
      const qualificationLevel = getQualificationLevel(score)
      
      return {
        ...enhancedLead,
        score,
        qualificationLevel
      }
    })
    
    setLeads(enhancedLeads)
    setLeadQuestionnaires(leadQuestionnaires)
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('🗑️ PERMANENT DELETION: Delete this lead from CRM?\n\nThis action cannot be undone and will remove all lead data permanently.')
    if (confirmDelete) {
      try {
        await deleteLeadFromCRM(id, true) // Pass admin confirmation = true
        // Also delete questionnaire if exists
        const questionnaire = leadQuestionnaires.find(q => q.leadId === id)
        if (questionnaire) {
          const allQuestionnaires = getQuestionnaireResponses()
          const filtered = allQuestionnaires.filter(q => q.id !== questionnaire.id)
          localStorage.setItem('questionnaire_responses', JSON.stringify(filtered))
        }
        refresh()
        alert('✅ Lead permanently deleted from CRM')
      } catch (error) {
        console.error('Delete failed:', error)
        alert('⚠️ Error deleting lead: ' + (error as Error).message)
      }
    }
  }

  const handleVerify = (id: string) => {
    verifyLead(id)
    refresh()
  }

  // Enhanced CRM sync handler
  const handleSyncToCRM = (lead: Lead) => {
    const result = syncLeadToCRM(lead)
    if (result.success) {
      const updatedLead = { ...lead, syncedAt: new Date().toISOString(), lastActivityAt: new Date().toISOString() }
      saveLead(updatedLead)
      refresh()
      alert(result.message || 'Lead synced to CRM successfully!')
    } else {
      alert(result.error || 'Failed to sync lead to CRM')
    }
  }
  
  // CRM Configuration handlers
  const handleSaveCRMConfig = () => {
    saveCRMConfig(crmConfig)
    alert('CRM configuration saved successfully!')
    setShowCRMConfig(false)
  }
  
  // Bulk operations handlers
  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads([...selectedLeads, leadId])
    } else {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId))
    }
  }
  
  const handleSelectAllLeads = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id))
    } else {
      setSelectedLeads([])
    }
  }
  
  const handleBulkAction = async () => {
    if (selectedLeads.length === 0) {
      alert('Please select at least one lead')
      return
    }
    
    switch (bulkAction) {
      case 'export':
        const selectedLeadsData = leads.filter(lead => selectedLeads.includes(lead.id))
        exportLeadsToCSV(selectedLeadsData)
        alert(`Exported ${selectedLeads.length} leads to CSV`)
        break
        
      case 'sync_crm':
        if (!crmConfig.isEnabled) {
          alert('Please configure and enable CRM first')
          return
        }
        selectedLeads.forEach(leadId => {
          const lead = leads.find(l => l.id === leadId)
          if (lead && !lead.syncedAt) {
            handleSyncToCRM(lead)
          }
        })
        break
        
      case 'verify':
        const updates = { status: 'verified' as const, lastActivityAt: new Date().toISOString() }
        bulkUpdateLeads(selectedLeads, updates)
        refresh()
        alert(`Verified ${selectedLeads.length} leads`)
        break
        
      case 'delete':
        const bulkConfirmDelete = confirm(`🗑️ BULK PERMANENT DELETION: Delete ${selectedLeads.length} leads from CRM?\n\nThis action cannot be undone and will remove all selected lead data permanently.`)
        if (bulkConfirmDelete) {
          try {
            for (const leadId of selectedLeads) {
              await deleteLeadFromCRM(leadId, true) // Pass admin confirmation = true
            }
            refresh()
            setSelectedLeads([])
            alert(`✅ Successfully deleted ${selectedLeads.length} leads from CRM`)
          } catch (error) {
            console.error('Bulk delete failed:', error)
            alert('⚠️ Error during bulk delete: ' + (error as Error).message)
          }
        }
        break
    }
    
    setBulkAction('')
    setSelectedLeads([])
  }
  
  // Enhanced lead status update
  const handleUpdateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    const lead = leads.find(l => l.id === leadId)
    if (lead) {
      const updatedLead = {
        ...lead,
        status: newStatus,
        lastActivityAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      saveLead(updatedLead)
      
      addLeadActivity({
        leadId,
        type: 'status_change',
        description: `Status changed from ${lead.status} to ${newStatus}`,
        createdBy: 'admin'
      })
      
      refresh()
    }
  }

  const handleViewLead = (lead: any) => {
    setSelectedLead(lead)
  }

  const getLeadInsights = (questionnaire: any): string[] => {
    if (!questionnaire?.responses) return []
    
    const responses = questionnaire.responses
    const insights: string[] = []
    
    // Show key compatibility factors based on actual questionnaire structure
    if (responses.spirituality_importance) {
      insights.push(`Spirituality: ${responses.spirituality_importance}`)
    }
    if (responses.children_perspective) {
      insights.push(`Children: ${responses.children_perspective}`)
    }
    if (responses.relocation_openness) {
      insights.push(`Relocation: ${responses.relocation_openness.substring(0, 20)}...`)
    }
    if (responses.drinking_habits) {
      insights.push(`Drinking: ${responses.drinking_habits}`)
    }
    if (responses.smoking_habits) {
      insights.push(`Smoking: ${responses.smoking_habits}`)
    }
    if (responses.caste_importance) {
      insights.push(`Caste: ${responses.caste_importance}`)
    }
    
    return insights.slice(0, 4) // Show top 4 insights for better visibility
  }

  // Advanced filtering logic
  const filteredLeads = leads.filter(lead => {
    // Basic filter
    if (filter === 'new' && lead.status !== 'new') return false
    if (filter === 'verified' && lead.status !== 'verified') return false
    if (filter === 'with_questionnaire' && !lead.hasQuestionnaire) return false
    if (filter === 'without_questionnaire' && lead.hasQuestionnaire) return false
    if (filter === 'high_score' && (lead.score || 0) < 70) return false
    if (filter === 'needs_followup' && lead.lastActivityAt) {
      const daysSinceActivity = (Date.now() - new Date(lead.lastActivityAt).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceActivity < 7) return false
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.phone.includes(searchTerm) ||
        (lead.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
      
      if (!matchesSearch) return false
    }
    
    // Score range filter
    const leadScore = lead.score || 0
    if (leadScore < scoreRange[0] || leadScore > scoreRange[1]) return false
    
    // Advanced filters
    if (selectedStatus !== 'all' && lead.status !== selectedStatus) return false
    if (selectedSource !== 'all' && (lead.source || 'website') !== selectedSource) return false
    if (selectedQualification !== 'all' && (lead.qualificationLevel || 'cold') !== selectedQualification) return false
    
    // Date range filter
    if (dateRange.from || dateRange.to) {
      const createdDate = new Date(lead.createdAt || lead.updatedAt || Date.now())
      if (dateRange.from && createdDate < new Date(dateRange.from)) return false
      if (dateRange.to && createdDate > new Date(dateRange.to)) return false
    }
    
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Mail className="h-8 w-8 text-primary-600" />
              Advanced Lead & CRM Management
            </h2>
            <p className="text-gray-600 mt-2">Comprehensive lead management with scoring, CRM integration, and automation</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCRMConfig(!showCRMConfig)}
              className="btn-secondary flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              CRM Config
            </button>
            <button
              onClick={() => setShowQuestionnaireData(!showQuestionnaireData)}
              className="btn-secondary flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              {showQuestionnaireData ? 'Hide' : 'Show'} Assessment Data
            </button>
            <button
              onClick={() => exportLeadsToCSV(filteredLeads)}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export All
            </button>
          </div>
        </div>

        {/* CRM Configuration Modal */}
        {showCRMConfig && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">CRM Configuration</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">CRM Provider</label>
                <select
                  value={crmConfig.provider}
                  onChange={(e) => setCrmConfig({...crmConfig, provider: e.target.value as CRMConfig['provider']})}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hubspot">HubSpot</option>
                  <option value="salesforce">Salesforce</option>
                  <option value="pipedrive">Pipedrive</option>
                  <option value="custom">Custom CRM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">API Key</label>
                <input
                  type="password"
                  value={crmConfig.apiKey}
                  onChange={(e) => setCrmConfig({...crmConfig, apiKey: e.target.value})}
                  placeholder="Enter API key"
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Base URL (Optional)</label>
                <input
                  type="url"
                  value={crmConfig.baseUrl || ''}
                  onChange={(e) => setCrmConfig({...crmConfig, baseUrl: e.target.value})}
                  placeholder="https://api.your-crm.com"
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Sync Frequency (minutes)</label>
                <input
                  type="number"
                  value={crmConfig.syncSettings.syncFrequency}
                  onChange={(e) => setCrmConfig({
                    ...crmConfig, 
                    syncSettings: {...crmConfig.syncSettings, syncFrequency: parseInt(e.target.value) || 60}
                  })}
                  min="5"
                  max="1440"
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={crmConfig.isEnabled}
                  onChange={(e) => setCrmConfig({...crmConfig, isEnabled: e.target.checked})}
                  className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-blue-700">Enable CRM Sync</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={crmConfig.syncSettings.autoSync}
                  onChange={(e) => setCrmConfig({
                    ...crmConfig,
                    syncSettings: {...crmConfig.syncSettings, autoSync: e.target.checked}
                  })}
                  className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-blue-700">Auto Sync</span>
              </label>
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={handleSaveCRMConfig} className="btn-primary">
                Save Configuration
              </button>
              <button onClick={() => setShowCRMConfig(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Stats with Lead Scoring */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-blue-900">{leads.length}</div>
                <div className="text-sm text-blue-700">Total Leads</div>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-red-900">
                  {leads.filter(l => (l.qualificationLevel || 'cold') === 'qualified').length}
                </div>
                <div className="text-sm text-red-700">Qualified</div>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-orange-900">
                  {Math.round(leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / (leads.length || 1))}
                </div>
                <div className="text-sm text-orange-700">Avg Score</div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-purple-900">
                  {leads.filter(l => l.hasQuestionnaire).length}
                </div>
                <div className="text-sm text-purple-700">With Assessments</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-green-900">
                  {leads.filter(l => ['verified', 'converted'].includes(l.status)).length}
                </div>
                <div className="text-sm text-green-700">Converted</div>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-indigo-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-indigo-900">
                  {leads.filter(l => l.syncedAt).length}
                </div>
                <div className="text-sm text-indigo-700">CRM Synced</div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search leads by name, email, phone, or tags..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Quick Filter */}
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)} 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[200px]"
            >
              <option value="all">All Leads ({leads.length})</option>
              <option value="new">New ({leads.filter(l => l.status === 'new').length})</option>
              <option value="verified">Verified ({leads.filter(l => l.status === 'verified').length})</option>
              <option value="with_questionnaire">With Assessments ({leads.filter(l => l.hasQuestionnaire).length})</option>
              <option value="without_questionnaire">No Assessments ({leads.filter(l => !l.hasQuestionnaire).length})</option>
              <option value="high_score">High Score (70+) ({leads.filter(l => (l.score || 0) >= 70).length})</option>
              <option value="needs_followup">Needs Follow-up ({leads.filter(l => {
                if (!l.lastActivityAt) return true;
                const days = (Date.now() - new Date(l.lastActivityAt).getTime()) / (1000 * 60 * 60 * 24);
                return days > 7;
              }).length})</option>
            </select>
            
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Advanced Filters
            </button>
            
            <button onClick={refresh} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Refresh
            </button>
          </div>
          
          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Advanced Filters</h4>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="qualified">Qualified</option>
                    <option value="contacted">Contacted</option>
                    <option value="interested">Interested</option>
                    <option value="not_interested">Not Interested</option>
                    <option value="verified">Verified</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Sources</option>
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social">Social Media</option>
                    <option value="advertisement">Advertisement</option>
                    <option value="event">Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                  <select
                    value={selectedQualification}
                    onChange={(e) => setSelectedQualification(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Levels</option>
                    <option value="qualified">Qualified</option>
                    <option value="hot">Hot</option>
                    <option value="warm">Warm</option>
                    <option value="cold">Cold</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Score Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={scoreRange[0]}
                      onChange={(e) => setScoreRange([parseInt(e.target.value) || 0, scoreRange[1]])}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={scoreRange[1]}
                      onChange={(e) => setScoreRange([scoreRange[0], parseInt(e.target.value) || 100])}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created From</label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created To</label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div className="md:col-span-2 flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedStatus('all')
                      setSelectedSource('all')
                      setSelectedQualification('all')
                      setScoreRange([0, 100])
                      setDateRange({from: '', to: ''})
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Bulk Operations */}
          {selectedLeads.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-blue-900">
                  {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="px-3 py-1 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select action...</option>
                    <option value="export">Export Selected</option>
                    <option value="sync_crm">Sync to CRM</option>
                    <option value="verify">Mark as Verified</option>
                    <option value="delete">Delete Selected</option>
                  </select>
                  <button
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setSelectedLeads([])}
                    className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={(e) => handleSelectAllLeads(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead & Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status & Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                {showQuestionnaireData && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment</th>
                )}
                {showQuestionnaireData && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insights</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRM & Activity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map(lead => {
                const insights = getLeadInsights(lead.questionnaire)
                const qualificationColors = {
                  'qualified': 'bg-green-100 text-green-800',
                  'hot': 'bg-red-100 text-red-800',
                  'warm': 'bg-yellow-100 text-yellow-800',
                  'cold': 'bg-gray-100 text-gray-800'
                }
                const statusColors = {
                  'new': 'bg-blue-100 text-blue-800',
                  'qualified': 'bg-purple-100 text-purple-800',
                  'contacted': 'bg-orange-100 text-orange-800',
                  'interested': 'bg-teal-100 text-teal-800',
                  'not_interested': 'bg-red-100 text-red-800',
                  'verified': 'bg-green-100 text-green-800',
                  'converted': 'bg-emerald-100 text-emerald-800'
                }
                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={(e) => handleSelectLead(lead.id, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-700">
                                {lead.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">ID: {lead.id.slice(-6)}</div>
                            {(lead.tags || []).length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {(lead.tags || []).slice(0, 2).map((tag, idx) => (
                                  <span key={idx} className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                    {tag}
                                  </span>
                                ))}
                                {(lead.tags || []).length > 2 && (
                                  <span className="text-xs text-gray-500">+{(lead.tags || []).length - 2} more</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            (lead.score || 0) >= 80 ? 'bg-green-100 text-green-800' :
                            (lead.score || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            (lead.score || 0) >= 40 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {lead.score || 0}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400"/>
                        <span className="truncate max-w-[200px]">{lead.email}</span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-gray-400"/>
                        {lead.phone}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[lead.status] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          {(lead.source || 'website').charAt(0).toUpperCase() + (lead.source || 'website').slice(1)}
                        </div>
                        {lead.hasQuestionnaire && (
                          <div className="text-xs">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              📊 Assessment
                            </span>
                          </div>
                        )}
                        {lead.answers?.hasBiodata && (
                          <div className="text-xs">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              📄 Biodata
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        qualificationColors[lead.qualificationLevel || 'cold']
                      }`}>
                        {(lead.qualificationLevel || 'cold').toUpperCase()}
                      </span>
                      {lead.assignedTo && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {lead.assignedTo}
                        </div>
                      )}
                    </td>
                    {showQuestionnaireData && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.questionnaire ? (
                          <div className="space-y-1">
                            <div className={`text-sm font-medium flex items-center gap-1 ${
                              lead.questionnaireComplete ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {lead.questionnaireComplete ? (
                                <><CheckCircle2 className="h-4 w-4" /> Complete</>
                              ) : (
                                <><Clock className="h-4 w-4" /> In Progress</>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {Object.keys(lead.questionnaire.responses).length}/{essentialQuestions.length} questions
                            </div>
                            <div className="text-xs font-medium text-primary-700">
                              By: {lead.name}
                            </div>
                            {lead.questionnaire.completedAt && (
                              <div className="text-xs text-gray-500">
                                Completed: {new Date(lead.questionnaire.completedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No assessment</span>
                        )}
                      </td>
                    )}
                    {showQuestionnaireData && (
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          {insights.map((insight, idx) => (
                            <div key={idx} className="text-xs text-gray-600 mb-1 truncate">
                              {insight}
                            </div>
                          ))}
                          {insights.length === 0 && (
                            <span className="text-xs text-gray-400">No insights yet</span>
                          )}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.syncedAt ? (
                        <div className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          Synced {new Date(lead.syncedAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Not synced</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewLead(lead)}
                          className="text-primary-600 hover:text-primary-900 flex items-center gap-1 px-3 py-1 rounded border border-primary-200 hover:bg-primary-50"
                          title="View Lead Details"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                        {!lead.syncedAt && (
                          <button 
                            onClick={() => handleSyncToCRM(lead)} 
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1 px-3 py-1 rounded border border-blue-200 hover:bg-blue-50"
                            title="Sync to CRM"
                          >
                            <Zap className="h-4 w-4" />
                            Sync
                          </button>
                        )}
                        {lead.status !== 'verified' && (
                          <button 
                            onClick={()=>handleVerify(lead.id)} 
                            className="text-green-600 hover:text-green-900 flex items-center gap-1 px-3 py-1 rounded border border-green-200 hover:bg-green-50"
                            title="Verify Lead"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Verify
                          </button>
                        )}
                        <button 
                          onClick={()=>handleDelete(lead.id)} 
                          className="text-red-600 hover:text-red-900 flex items-center gap-1 px-3 py-1 rounded border border-red-200 hover:bg-red-50"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-sm text-gray-500">
              No leads match the current filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Lead Details - {selectedLead.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedLead.email} • Lead ID: {selectedLead.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Lead Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <div className="font-medium text-gray-900">{selectedLead.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <div className="font-medium text-gray-900">{selectedLead.email}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <div className="font-medium text-gray-900">{selectedLead.phone}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <div className="font-medium text-gray-900 capitalize">{selectedLead.status}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">CRM Sync:</span>
                    <div className={`font-medium ${
                      selectedLead.syncedAt ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedLead.syncedAt ? 'Synced' : 'Not Synced'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Biodata Section */}
              {selectedLead.answers?.hasBiodata && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Biodata Document</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {selectedLead.answers?.biodataFileName || 'biodata.pdf'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (selectedLead.biodataFile) {
                          const url = URL.createObjectURL(selectedLead.biodataFile)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = selectedLead.answers?.biodataFileName || `biodata_${selectedLead.name}.pdf`
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                          URL.revokeObjectURL(url)
                        } else {
                          alert('Biodata file not available for download')
                        }
                      }}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1 px-3 py-1 rounded border border-blue-200 hover:bg-blue-100"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                    {selectedLead.biodataFile && selectedLead.biodataFile.type === 'application/pdf' && (
                      <button
                        onClick={() => {
                          const url = URL.createObjectURL(selectedLead.biodataFile)
                          window.open(url, '_blank')
                        }}
                        className="text-green-600 hover:text-green-900 flex items-center gap-1 px-3 py-1 rounded border border-green-200 hover:bg-green-100"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    )}
                  </div>
                  <p className="text-blue-700 text-xs mt-2">
                    Uploaded biodata document - Admin can view and download for verification purposes
                  </p>
                </div>
              )}

              {/* Assessment Data */}
              {selectedLead.questionnaire ? (
                <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                  <h4 className="font-semibold text-primary-900 mb-3">Assessment Information</h4>
                  
                  {/* User Information Header */}
                  <div className="mb-4 p-3 bg-primary-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary-200 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary-800">
                          {selectedLead.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h6 className="text-lg font-bold text-primary-900">{selectedLead.name}</h6>
                        <p className="text-sm text-primary-700">{selectedLead.email}</p>
                        <p className="text-xs text-primary-600">Assessment ID: {selectedLead.questionnaire.id || selectedLead.id}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-primary-700">Status:</span>
                      <div className={`font-medium flex items-center gap-1 ${
                        selectedLead.questionnaireComplete ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {selectedLead.questionnaireComplete ? (
                          <><CheckCircle2 className="h-4 w-4" /> Complete</>
                        ) : (
                          <><Clock className="h-4 w-4" /> In Progress</>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-primary-700">Progress:</span>
                      <div className="font-medium text-primary-900">
                        {Object.keys(selectedLead.questionnaire.responses).length}/{essentialQuestions.length} questions
                      </div>
                    </div>
                    <div>
                      <span className="text-primary-700">Duration:</span>
                      <div className="font-medium text-primary-900">
                        {selectedLead.questionnaire.completionTime 
                          ? `${selectedLead.questionnaire.completionTime} min` 
                          : '—'
                        }
                      </div>
                    </div>
                    <div>
                      <span className="text-primary-700">Started:</span>
                      <div className="font-medium text-primary-900">
                        {new Date(selectedLead.questionnaire.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-primary-700">Completed:</span>
                      <div className="font-medium text-primary-900">
                        {selectedLead.questionnaire.completedAt 
                          ? new Date(selectedLead.questionnaire.completedAt).toLocaleDateString()
                          : '—'
                        }
                      </div>
                    </div>
                  </div>
                  
                  {/* Key Insights */}
                  <div>
                    <h5 className="font-medium text-primary-900 mb-3">Key Profile Insights</h5>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries({
                        'Spirituality': selectedLead.questionnaire.responses.spirituality_importance,
                        'Pre-marital Counseling': selectedLead.questionnaire.responses.premarital_counseling,
                        'Shared Interests': selectedLead.questionnaire.responses.shared_interests_importance,
                        'Relocation': selectedLead.questionnaire.responses.relocation_openness,
                        'Children': selectedLead.questionnaire.responses.children_perspective,
                        'Caste Importance': selectedLead.questionnaire.responses.caste_importance,
                        'Weekend Preferences': Array.isArray(selectedLead.questionnaire.responses.weekend_preferences) 
                          ? selectedLead.questionnaire.responses.weekend_preferences.join(', ') 
                          : selectedLead.questionnaire.responses.weekend_preferences,
                        'Family/Independence': selectedLead.questionnaire.responses.family_independence_scenario,
                        'Hobbies': Array.isArray(selectedLead.questionnaire.responses.hobbies_activities)
                          ? selectedLead.questionnaire.responses.hobbies_activities.join(', ')
                          : selectedLead.questionnaire.responses.hobbies_activities,
                        'Drinking': selectedLead.questionnaire.responses.drinking_habits,
                        'Smoking': selectedLead.questionnaire.responses.smoking_habits,
                        'Relationship Reasons': Array.isArray(selectedLead.questionnaire.responses.relationship_reasons)
                          ? selectedLead.questionnaire.responses.relationship_reasons.join(', ')
                          : selectedLead.questionnaire.responses.relationship_reasons
                      }).filter(([_, value]) => value && value !== '').map(([key, value]) => {
                        // Truncate long values for display
                        const displayValue = typeof value === 'string' && value.length > 50 
                          ? value.substring(0, 50) + '...' 
                          : value
                        return (
                          <div key={key} className="p-3 border border-primary-200 rounded-lg bg-white hover:bg-primary-50 transition-colors">
                            <div className="text-xs font-semibold text-primary-700 uppercase mb-1">{key}</div>
                            <div className="text-sm text-gray-900" title={value}>{displayValue}</div>
                          </div>
                        )
                      })}
                    </div>
                    
                    {/* Full Assessment Details Button */}
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          const assessment = {
                            id: selectedLead.questionnaire.id || selectedLead.id,
                            userInfo: {
                              name: selectedLead.name,
                              email: selectedLead.email,
                              phone: selectedLead.phone,
                              type: 'lead'
                            },
                            responses: selectedLead.questionnaire.responses,
                            isComplete: selectedLead.questionnaireComplete,
                            createdAt: selectedLead.questionnaire.createdAt,
                            completedAt: selectedLead.questionnaire.completedAt
                          }
                          generatePDF(assessment, setIsGeneratingPdf)
                        }}
                        disabled={isGeneratingPdf}
                        className="btn-secondary text-sm flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        {isGeneratingPdf ? 'Generating...' : 'Download Full Assessment Report'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-5 w-5" />
                    <h4 className="font-semibold">No Assessment Data Available</h4>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    This lead has not completed the compatibility assessment yet.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                {selectedLead.status !== 'verified' && (
                  <button
                    onClick={() => {
                      handleVerify(selectedLead.id)
                      setSelectedLead(null)
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Verify Lead
                  </button>
                )}
                {!selectedLead.syncedAt && (
                  <button
                    onClick={() => {
                      handleSyncToCRM(selectedLead)
                      setSelectedLead(null)
                    }}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Sync to CRM
                  </button>
                )}
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Matchmaking Control Tab
function MatchmakingTab() {
  const [users, setUsers] = useState<any[]>([])
  
  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('makemyknot_users')||'[]')
    const sanitized = raw.map((u:any)=>{ const {password, ...rest} = u; return rest })
    setUsers(sanitized.filter((u: any) => u.questionnaireComplete))
  }, [])

  const handleManualMatch = (userId: string, targetUserId: string) => {
    sendNotification(userId, `We found a special match for you! Check your matches tab.`, 'success')
    sendNotification(targetUserId, `We found a special match for you! Check your matches tab.`, 'success')
    alert('Manual match created!')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Matchmaking Control</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Algorithm Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Compatibility threshold</span>
              <input type="range" min="70" max="95" defaultValue="85" className="w-24" />
              <span className="text-sm text-gray-600">85%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Max matches per week</span>
              <select className="px-2 py-1 border rounded text-sm">
                <option>3</option>
                <option>5</option>
                <option>7</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Geographic radius (miles)</span>
              <input type="number" defaultValue="50" className="px-2 py-1 border rounded text-sm w-16" />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Manual Matching</h3>
          <p className="text-sm text-gray-600 mb-3">Create custom matches between users</p>
          <div className="space-y-2">
            <select className="w-full px-3 py-2 border rounded">
              <option>Select first user...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>
            <select className="w-full px-3 py-2 border rounded">
              <option>Select second user...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>
            <button className="btn-primary w-full text-sm">Create Match</button>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-md font-medium text-gray-800 mb-3">Recent Matches</h3>
        <div className="text-sm text-gray-500">No manual matches created yet.</div>
      </div>
    </div>
  )
}

// Content Moderation Tab
function ModerationTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Moderation</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Flagged Content</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profile Photo</span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Flagged</span>
              </div>
              <p className="text-sm text-gray-600">User: john@example.com</p>
              <p className="text-sm text-gray-600">Reason: Inappropriate content</p>
              <div className="flex gap-2 mt-2">
                <button className="px-3 py-1 bg-green-600 text-white text-xs rounded">Approve</button>
                <button className="px-3 py-1 bg-red-600 text-white text-xs rounded">Remove</button>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 text-center py-4">
              No other flagged content
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Moderation Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Auto-moderate photos</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Profanity filter</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Require manual review</span>
              <input type="checkbox" className="rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Payments & Subscription Tab
function PaymentsTab() {
  const [users, setUsers] = useState<any[]>([])
  
  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('makemyknot_users')||'[]')
    const sanitized = raw.map((u:any)=>{ const {password, ...rest} = u; return rest })
    setUsers(sanitized)
  }, [])

  const subscribedUsers = users.filter(u => u.subscription?.plan === 'monthly')
  const trialUsers = users.filter(u => u.subscription?.plan === 'trial')
  const revenue = subscribedUsers.length * 29.99 // Assuming $29.99/month

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">${revenue.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Monthly Revenue</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{subscribedUsers.length}</div>
              <div className="text-sm text-gray-600">Active Subscriptions</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{trialUsers.length}</div>
              <div className="text-sm text-gray-600">Trial Users</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">Plan</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Started</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.subscription?.plan).map(u => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-3 pr-4">{u.name} ({u.email})</td>
                  <td className="py-3 pr-4 capitalize">{u.subscription?.plan}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      u.subscription?.plan === 'monthly' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {u.subscription?.plan === 'monthly' ? 'Active' : 'Trial'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{new Date(u.subscription?.trialStartedAt || u.subscription?.startedAt || u.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 pr-4">
                    <button className="px-3 py-1 bg-red-600 text-white text-xs rounded">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Analytics Tab
function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<any>(null)
  
  useEffect(() => {
    setAnalytics(getAnalyticsData())
  }, [])

  if (!analytics) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-xs text-green-600 mt-2">+{analytics.newUsersThisWeek} this week</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalLeads}</div>
              <div className="text-sm text-gray-600">Total Leads</div>
            </div>
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-xs text-green-600 mt-2">+{analytics.newLeadsThisWeek} this week</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{((analytics.completedQuestionnaires / analytics.totalUsers) * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-xs text-gray-600 mt-2">Questionnaire completion</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{((analytics.verifiedLeads / analytics.totalLeads) * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Lead Quality</div>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-xs text-gray-600 mt-2">Verified leads</div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <div className="text-gray-500">Analytics Chart Placeholder</div>
            <div className="text-sm text-gray-400">Connect to analytics service for detailed charts</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// AI Questionnaires Management Tab
function QuestionnairesTab() {
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireResponse[]>([])
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<QuestionnaireResponse | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'complete' | 'incomplete'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false)

  useEffect(() => {
    const responses = getQuestionnaireResponses()
    setQuestionnaires(responses)
  }, [])

  const exportQuestionnaireToExcel = (q: QuestionnaireResponse) => {
    try {
      // Try to enrich with user details
      let name = ''
      let email = ''
      let phone = ''
      let age: number | string = ''

      try {
        if (q.userId) {
          const users = JSON.parse(localStorage.getItem('makemyknot_users') || '[]')
          const user = users.find((u: any) => u.id === q.userId)
          if (user) {
            name = user.name || ''
            email = user.email || ''
            phone = user.phone || ''
            age = user.age || ''
          }
        } else if (q.leadId) {
          const leads = getLeads()
          const lead = leads.find((l: any) => l.id === q.leadId)
          if (lead) {
            name = lead.name || ''
            email = lead.email || ''
            phone = lead.phone || ''
          }
        }
      } catch {}

      const summaryRows = [
        { Field: 'Name', Value: name || (q.userId ? q.userId : q.leadId) },
        { Field: 'Email', Value: email },
        { Field: 'Phone', Value: phone },
        { Field: 'Age', Value: age },
        { Field: 'Type', Value: q.userId ? 'user' : 'lead' },
        { Field: 'Questionnaire ID', Value: q.id },
        { Field: 'Status', Value: q.isComplete ? 'Complete' : 'In Progress' },
        { Field: 'Created At', Value: new Date(q.createdAt).toLocaleString() },
        { Field: 'Completed At', Value: q.completedAt ? new Date(q.completedAt).toLocaleString() : '' },
      ]

      const responseRows = essentialQuestions.map((question, idx) => {
        const ans = q.responses[question.id]
        const normalized = Array.isArray(ans) ? ans.join(', ') : (ans ?? '')
        return {
          '#': idx + 1,
          Category: question.category,
          Question: question.question,
          Answer: normalized,
        }
      })

      const wb = XLSX.utils.book_new()
      const wsSummary = XLSX.utils.json_to_sheet(summaryRows)
      const wsResponses = XLSX.utils.json_to_sheet(responseRows)
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary')
      XLSX.utils.book_append_sheet(wb, wsResponses, 'Responses')

      const baseName = name || (q.userId ? q.userId : q.leadId) || 'User'
      const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '-')
      const timestamp = new Date().toISOString().split('T')[0]
      const fileName = `MakeMyKnot_Questionnaire_${cleanName}_${timestamp}_${q.id.substring(0, 8)}.xlsx`
      XLSX.writeFile(wb, fileName)
    } catch (e) {
      console.error('Error exporting questionnaire to Excel', e)
      alert('Error exporting questionnaire to Excel. Please try again.')
    }
  }

  const filteredQuestionnaires = questionnaires.filter(q => {
    const matchesSearch = !searchTerm || 
      (q.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       q.leadId?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'complete' && q.isComplete) ||
      (filterStatus === 'incomplete' && !q.isComplete)
    
    return matchesSearch && matchesFilter
  })

  const handleDeleteQuestionnaire = (id: string) => {
    if (confirm('Are you sure you want to delete this questionnaire response?')) {
      const updated = questionnaires.filter(q => q.id !== id)
      setQuestionnaires(updated)
      localStorage.setItem('questionnaire_responses', JSON.stringify(updated))
    }
  }

  const getResponsesByCategory = (responses: Record<string, any>) => {
    const categories: Record<string, any[]> = {}
    essentialQuestions.forEach(question => {
      if (!categories[question.category]) {
        categories[question.category] = []
      }
      categories[question.category].push({
        question: question.question,
        answer: responses[question.id] || 'Not answered',
        type: question.type
      })
    })
    return categories
  }

  const getCompatibilityInsights = (questionnaire: QuestionnaireResponse) => {
    const responses = questionnaire.responses
    const insights = []
    
    // Analyze personality type
    if (responses.personality_type) {
      insights.push(`Personality: ${responses.personality_type}`)
    }
    
    // Analyze relationship goals
    if (responses.children_desire) {
      insights.push(`Children: ${responses.children_desire}`)
    }
    
    // Analyze lifestyle
    if (responses.ideal_weekend) {
      insights.push(`Lifestyle: ${responses.ideal_weekend}`)
    }
    
    return insights
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary-600" />
              AI Questionnaire Management
            </h2>
            <p className="text-gray-600 mt-2">View and analyze comprehensive questionnaire responses for AI matchmaking</p>
          </div>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="btn-primary flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-primary-900">{questionnaires.length}</div>
                <div className="text-sm text-primary-700">Total Responses</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-green-900">
                  {questionnaires.filter(q => q.isComplete).length}
                </div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-yellow-900">
                  {questionnaires.filter(q => !q.isComplete).length}
                </div>
                <div className="text-sm text-yellow-700">In Progress</div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-blue-900">
                  {questionnaires.length > 0 ? Math.round((questionnaires.filter(q => q.isComplete).length / questionnaires.length) * 100) : 0}%
                </div>
                <div className="text-sm text-blue-700">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user ID or lead ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Responses</option>
            <option value="complete">Complete</option>
            <option value="incomplete">In Progress</option>
          </select>
        </div>
      </div>

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Analytics</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Most Common Responses */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Personality Types</h4>
              <div className="space-y-2">
                {['Very outgoing and social', 'Balanced - depends on situation', 'More introverted and private'].map(type => {
                  const count = questionnaires.filter(q => q.responses.personality_type === type).length
                  return (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="text-gray-600">{type}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Family Importance</h4>
              <div className="space-y-2">
                {['Very important', 'Most important thing', 'Important'].map(importance => {
                  const count = questionnaires.filter(q => q.responses.family_values === importance).length
                  return (
                    <div key={importance} className="flex justify-between text-sm">
                      <span className="text-gray-600">{importance}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Children Desire</h4>
              <div className="space-y-2">
                {['Definitely want children', 'Probably want children', 'Not sure yet'].map(desire => {
                  const count = questionnaires.filter(q => q.responses.children_desire === desire).length
                  return (
                    <div key={desire} className="flex justify-between text-sm">
                      <span className="text-gray-600">{desire}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questionnaires List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insights</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuestionnaires.map((questionnaire) => {
                const insights = getCompatibilityInsights(questionnaire)
                return (
                  <tr key={questionnaire.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {questionnaire.userName || questionnaire.userEmail || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {questionnaire.userType === 'lead' ? 'Lead' : 'User'} • {questionnaire.userEmail || questionnaire.userId || questionnaire.leadId}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {questionnaire.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        questionnaire.isComplete
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {questionnaire.isComplete ? 'Complete' : 'In Progress'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {questionnaire.completedAt ? new Date(questionnaire.completedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {insights.slice(0, 2).map((insight, idx) => (
                          <div key={idx} className="text-xs text-gray-600 mb-1">
                            {insight}
                          </div>
                        ))}
                        {insights.length > 2 && (
                          <div className="text-xs text-gray-400">+{insights.length - 2} more</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedQuestionnaire(questionnaire)}
                          className="text-primary-600 hover:text-primary-900 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                        <button
                          onClick={() => exportQuestionnaireToExcel(questionnaire)}
                          className="text-green-700 hover:text-green-900 flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Excel
                        </button>
                        <button
                          onClick={() => handleDeleteQuestionnaire(questionnaire.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {filteredQuestionnaires.length === 0 && (
          <div className="text-center py-12">
            <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No questionnaire responses found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? 'No responses match your search criteria.' : 'No questionnaire responses have been submitted yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Questionnaire Detail Modal */}
      {selectedQuestionnaire && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Questionnaire Response Details
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedQuestionnaire.userName || selectedQuestionnaire.userEmail || 'Unknown User'} • 
                    {selectedQuestionnaire.userType === 'lead' ? 'Lead Assessment' : 'User Assessment'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedQuestionnaire.userEmail} • ID: {selectedQuestionnaire.id.substring(0, 8)}...
                  </p>
                </div>
                <button
                  onClick={() => setSelectedQuestionnaire(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Response Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <div className={`font-medium ${
                      selectedQuestionnaire.isComplete ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedQuestionnaire.isComplete ? 'Complete' : 'In Progress'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <div className="font-medium text-gray-900">
                      {new Date(selectedQuestionnaire.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Completed:</span>
                    <div className="font-medium text-gray-900">
                      {selectedQuestionnaire.completedAt 
                        ? new Date(selectedQuestionnaire.completedAt).toLocaleDateString()
                        : '—'
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Progress:</span>
                    <div className="font-medium text-gray-900">
                      {Object.keys(selectedQuestionnaire.responses).length}/{essentialQuestions.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Responses by Category */}
              <div className="space-y-6">
                {Object.entries(getResponsesByCategory(selectedQuestionnaire.responses)).map(([category, responses]) => (
                  <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900 capitalize">{category}</h4>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {responses.map((response, idx) => (
                          <div key={idx} className="flex flex-col space-y-1">
                            <div className="text-sm font-medium text-gray-700">
                              {response.question}
                            </div>
                            <div className="text-sm text-gray-900">
                              {response.type === 'multiple_choice' && Array.isArray(response.answer)
                                ? response.answer.join(', ')
                                : response.answer
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Communication Tools Tab
function CommunicationTab() {
  const [users, setUsers] = useState<any[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'info' | 'warning' | 'success' | 'error'>('info')
  
  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('makemyknot_users')||'[]')
    const sanitized = raw.map((u:any)=>{ const {password, ...rest} = u; return rest })
    setUsers(sanitized)
  }, [])

  const handleSendMessage = () => {
    if (!message || selectedUsers.length === 0) {
      alert('Please select users and enter a message')
      return
    }
    
    selectedUsers.forEach(userId => {
      sendNotification(userId, message, messageType)
    })
    
    alert(`Message sent to ${selectedUsers.length} user(s)!`)
    setMessage('')
    setSelectedUsers([])
  }

  const handleSelectAll = () => {
    setSelectedUsers(users.map(u => u.id))
  }

  const handleDeselectAll = () => {
    setSelectedUsers([])
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Communication Tools</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Select Recipients</h3>
          <div className="flex gap-2 mb-3">
            <button onClick={handleSelectAll} className="px-3 py-1 bg-blue-600 text-white text-xs rounded">Select All</button>
            <button onClick={handleDeselectAll} className="px-3 py-1 bg-gray-600 text-white text-xs rounded">Deselect All</button>
          </div>
          
          <div className="max-h-64 overflow-y-auto border rounded-lg p-3">
            {users.map(u => (
              <div key={u.id} className="flex items-center mb-2">
                <input 
                  type="checkbox" 
                  checked={selectedUsers.includes(u.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, u.id])
                    } else {
                      setSelectedUsers(selectedUsers.filter(id => id !== u.id))
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm">{u.name} ({u.email})</span>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-gray-600 mt-2">
            {selectedUsers.length} user(s) selected
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Compose Message</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Message Type</label>
              <select 
                value={messageType} 
                onChange={(e) => setMessageType(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">Message</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg h-32"
                placeholder="Enter your message here..."
              />
            </div>
            
            <button 
              onClick={handleSendMessage}
              className="btn-primary w-full"
            >
              Send Message
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Quick Templates</h4>
            <div className="space-y-2">
              <button 
                onClick={() => setMessage('Welcome to Make My Knot! Complete your profile to start receiving matches.')}
                className="text-xs text-blue-600 hover:underline block"
              >
                Welcome message
              </button>
              <button 
                onClick={() => setMessage('Don\'t forget to complete your compatibility questionnaire for better matches!')}
                className="text-xs text-blue-600 hover:underline block"
              >
                Questionnaire reminder
              </button>
              <button 
                onClick={() => setMessage('New matches are available! Check your dashboard to view them.')}
                className="text-xs text-blue-600 hover:underline block"
              >
                New matches notification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Webinars Management Tab
function WebinarsTab() {
  const [webinars, setWebinars] = useState<Webinar[]>(mockWebinars)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [newWebinar, setNewWebinar] = useState<Partial<Webinar>>({
    title: '',
    description: '',
    speaker: '',
    date: '',
    time: '',
    duration: 60,
    maxParticipants: 100,
    price: 0,
    currency: 'INR',
    image: '',
    status: 'draft',
    tags: []
  })

  const filteredWebinars = webinars.filter(w => filterStatus === 'all' || w.status === filterStatus)

  const handleCreateWebinar = () => {
    const webinar: Webinar = {
      ...newWebinar as Webinar,
      id: Date.now().toString(),
      registeredCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setWebinars([...webinars, webinar])
    setShowCreateModal(false)
    setNewWebinar({
      title: '',
      description: '',
      speaker: '',
      date: '',
      time: '',
      duration: 60,
      maxParticipants: 100,
      price: 0,
      currency: 'INR',
      image: '',
      status: 'draft',
      tags: []
    })
    alert('Webinar created successfully!')
  }

  const handleEditWebinar = () => {
    if (!selectedWebinar) return
    setWebinars(webinars.map(w => w.id === selectedWebinar.id ? {
      ...selectedWebinar,
      updatedAt: new Date().toISOString()
    } : w))
    setShowEditModal(false)
    setSelectedWebinar(null)
    alert('Webinar updated successfully!')
  }

  const handleDeleteWebinar = (id: string) => {
    if (confirm('Are you sure you want to delete this webinar?')) {
      setWebinars(webinars.filter(w => w.id !== id))
      alert('Webinar deleted successfully!')
    }
  }

  const handleStatusChange = (id: string, newStatus: Webinar['status']) => {
    setWebinars(webinars.map(w => w.id === id ? {
      ...w,
      status: newStatus,
      updatedAt: new Date().toISOString()
    } : w))
    alert(`Webinar ${newStatus} successfully!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Webinar Management</h2>
            <p className="text-sm text-gray-600">Create, edit, and manage webinar events with pricing and scheduling</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Video className="h-4 w-4" />
            Create Webinar
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Webinars Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWebinars.map((webinar) => (
          <div key={webinar.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Webinar Image */}
            <div className="h-48 bg-gray-200 relative">
              <img 
                src={webinar.image} 
                alt={webinar.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3Mjg0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPldlYmluYXIgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='
                }}
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  webinar.status === 'published' ? 'bg-green-100 text-green-800' :
                  webinar.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  webinar.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {webinar.status.charAt(0).toUpperCase() + webinar.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Webinar Details */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{webinar.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{webinar.description}</p>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{webinar.speaker}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(webinar.date).toLocaleDateString()} at {webinar.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{webinar.registeredCount}/{webinar.maxParticipants} registered</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">
                    {webinar.price === 0 ? 'Free' : `${webinar.currency} ${webinar.price}`}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {webinar.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedWebinar(webinar)
                    setShowEditModal(true)
                  }}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteWebinar(webinar.id)}
                  className="px-3 py-2 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                {webinar.status === 'draft' && (
                  <button
                    onClick={() => handleStatusChange(webinar.id, 'published')}
                    className="px-3 py-2 bg-green-100 text-green-800 text-sm rounded hover:bg-green-200 transition-colors"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Webinar Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Create New Webinar</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newWebinar.title}
                    onChange={(e) => setNewWebinar({...newWebinar, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Webinar title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
                  <input
                    type="text"
                    value={newWebinar.speaker}
                    onChange={(e) => setNewWebinar({...newWebinar, speaker: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dr. Speaker Name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newWebinar.description}
                  onChange={(e) => setNewWebinar({...newWebinar, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Webinar description"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newWebinar.date}
                    onChange={(e) => setNewWebinar({...newWebinar, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={newWebinar.time}
                    onChange={(e) => setNewWebinar({...newWebinar, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
                  <input
                    type="number"
                    value={newWebinar.duration}
                    onChange={(e) => setNewWebinar({...newWebinar, duration: parseInt(e.target.value) || 60})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                  <input
                    type="number"
                    value={newWebinar.maxParticipants}
                    onChange={(e) => setNewWebinar({...newWebinar, maxParticipants: parseInt(e.target.value) || 100})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    value={newWebinar.price}
                    onChange={(e) => setNewWebinar({...newWebinar, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0 for free"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={newWebinar.currency}
                    onChange={(e) => setNewWebinar({...newWebinar, currency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={newWebinar.image}
                  onChange={(e) => setNewWebinar({...newWebinar, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newWebinar.tags?.join(', ')}
                  onChange={(e) => setNewWebinar({...newWebinar, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="relationships, communication, marriage"
                />
              </div>
            </div>
            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWebinar}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Webinar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Webinar Modal */}
      {showEditModal && selectedWebinar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Edit Webinar</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={selectedWebinar.title}
                    onChange={(e) => setSelectedWebinar({...selectedWebinar, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
                  <input
                    type="text"
                    value={selectedWebinar.speaker}
                    onChange={(e) => setSelectedWebinar({...selectedWebinar, speaker: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={selectedWebinar.description}
                  onChange={(e) => setSelectedWebinar({...selectedWebinar, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    value={selectedWebinar.price}
                    onChange={(e) => setSelectedWebinar({...selectedWebinar, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedWebinar.status}
                    onChange={(e) => setSelectedWebinar({...selectedWebinar, status: e.target.value as Webinar['status']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditWebinar}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Webinar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Nominations Management Tab
function NominationsTab() {
  const [nominations, setNominations] = useState<any[]>([])
  const [selectedNomination, setSelectedNomination] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'contacted' | 'matched' | 'rejected'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [selectedForExport, setSelectedForExport] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'status'>('newest')

  // Load nominations from localStorage on component mount
  useEffect(() => {
    const savedNominations = localStorage.getItem('makemyknot_nominations')
    if (savedNominations) {
      try {
        const parsed = JSON.parse(savedNominations)
        setNominations(Array.isArray(parsed) ? parsed : [])
      } catch (error) {
        console.error('Error parsing nominations data:', error)
        setNominations([])
      }
    } else {
      // No sample data for live system
      setNominations([])
    }
  }, [])

  // Filter and sort nominations
  const filteredNominations = nominations
    .filter(nom => {
      const matchesSearch = !searchTerm || 
        nom.nominatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nom.nomineeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nom.nominatorEmail.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = filterStatus === 'all' || nom.status === filterStatus
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        case 'oldest':
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
        case 'status':
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

  // Update nomination status
  const updateNominationStatus = (id: string, newStatus: string, notes: string = '') => {
    const updated = nominations.map(nom => 
      nom.id === id 
        ? { ...nom, status: newStatus, notes, updatedAt: new Date().toISOString() }
        : nom
    )
    setNominations(updated)
    localStorage.setItem('makemyknot_nominations', JSON.stringify(updated))
  }

  // Delete nomination
  const deleteNomination = (id: string) => {
    if (confirm('Are you sure you want to delete this nomination?')) {
      const filtered = nominations.filter(nom => nom.id !== id)
      setNominations(filtered)
      localStorage.setItem('makemyknot_nominations', JSON.stringify(filtered))
    }
  }

  // Export nominations to CSV
  const exportToCSV = () => {
    const dataToExport = selectedForExport.length > 0 
      ? nominations.filter(nom => selectedForExport.includes(nom.id))
      : filteredNominations

    const headers = [
      'Nomination ID',
      'Nominator Name',
      'Nominator Email', 
      'Nominator Phone',
      'Nominee Name',
      'Nominee Age',
      'Nominee Location',
      'Relationship',
      'Reasons',
      'Nominee Interests',
      'Status',
      'Submitted Date',
      'Notes'
    ]

    const csvContent = [
      headers.join(','),
      ...dataToExport.map(nom => [
        nom.id,
        `"${nom.nominatorName}"`,
        nom.nominatorEmail,
        nom.nominatorPhone,
        `"${nom.nomineeName}"`,
        nom.nomineeAge,
        `"${nom.nomineeLocation}"`,
        `"${nom.relationship}"`,
        `"${nom.reasons}"`,
        `"${nom.nomineeInterests}"`,
        nom.status,
        new Date(nom.submittedAt).toLocaleDateString(),
        `"${nom.notes || ''}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `makemyknot_nominations_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setShowExportOptions(false)
    setSelectedForExport([])
  }

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'contacted': return 'bg-blue-100 text-blue-800'
      case 'matched': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Statistics
  const stats = {
    total: nominations.length,
    pending: nominations.filter(n => n.status === 'pending').length,
    contacted: nominations.filter(n => n.status === 'contacted').length,
    matched: nominations.filter(n => n.status === 'matched').length,
    rejected: nominations.filter(n => n.status === 'rejected').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-primary-600" />
              Nominations Management
            </h2>
            <p className="text-gray-600 mt-2">Manage user nominations and referrals for potential matches</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
                <div className="text-sm text-blue-700">Total Nominations</div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-yellow-900">{stats.pending}</div>
                <div className="text-sm text-yellow-700">Pending Review</div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-blue-900">{stats.contacted}</div>
                <div className="text-sm text-blue-700">Contacted</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-green-900">{stats.matched}</div>
                <div className="text-sm text-green-700">Successfully Matched</div>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <div className="text-2xl font-bold text-red-900">{stats.rejected}</div>
                <div className="text-sm text-red-700">Not Suitable</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by nominator or nominee name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status ({stats.total})</option>
            <option value="pending">Pending ({stats.pending})</option>
            <option value="contacted">Contacted ({stats.contacted})</option>
            <option value="matched">Matched ({stats.matched})</option>
            <option value="rejected">Rejected ({stats.rejected})</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Export Options Panel */}
      {showExportOptions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-blue-900">Export Options</h3>
            <button
              onClick={() => setShowExportOptions(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedForExport(filteredNominations.map(n => n.id))
                  } else {
                    setSelectedForExport([])
                  }
                }}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-blue-800">
                Export all filtered nominations ({filteredNominations.length})
              </span>
            </label>
            <button
              onClick={exportToCSV}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </button>
          </div>
        </div>
      )}

      {/* Nominations Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {showExportOptions && (
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedForExport(filteredNominations.map(n => n.id))
                        } else {
                          setSelectedForExport([])
                        }
                      }}
                      className="rounded border-gray-300 mr-2"
                    />
                  )}
                  Nominator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominee Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relationship</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNominations.map((nomination) => (
                <tr key={nomination.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {showExportOptions && (
                        <input
                          type="checkbox"
                          checked={selectedForExport.includes(nomination.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedForExport([...selectedForExport, nomination.id])
                            } else {
                              setSelectedForExport(selectedForExport.filter(id => id !== nomination.id))
                            }
                          }}
                          className="rounded border-gray-300 mr-3"
                        />
                      )}
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {nomination.nominatorName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{nomination.nominatorName}</div>
                        <div className="text-sm text-gray-500">{nomination.nominatorEmail}</div>
                        <div className="text-sm text-gray-500">{nomination.nominatorPhone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{nomination.nomineeName}</div>
                    <div className="text-sm text-gray-500">Age: {nomination.nomineeAge} • {nomination.nomineeLocation}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs" title={nomination.nomineeInterests}>
                      Interests: {nomination.nomineeInterests}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{nomination.relationship}</div>
                    <div className="text-sm text-gray-500 max-w-xs truncate" title={nomination.reasons}>
                      {nomination.reasons}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(nomination.status)}`}>
                      {nomination.status.charAt(0).toUpperCase() + nomination.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(nomination.submittedAt).toLocaleDateString()}
                    <div className="text-xs text-gray-400">
                      {new Date(nomination.submittedAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedNomination(nomination)}
                        className="text-primary-600 hover:text-primary-900 flex items-center gap-1 px-3 py-1 rounded border border-primary-200 hover:bg-primary-50"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        onClick={() => deleteNomination(nomination.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1 px-3 py-1 rounded border border-red-200 hover:bg-red-50"
                        title="Delete Nomination"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredNominations.length === 0 && (
          <div className="text-center py-12">
            <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No nominations found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'No nominations match your search criteria.' 
                : 'No nominations have been submitted yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Nomination Detail Modal */}
      {selectedNomination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Nomination Details
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    ID: {selectedNomination.id} • Submitted: {new Date(selectedNomination.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedNomination(null)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Nominator Information */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">Nominator Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Name:</span>
                    <div className="font-medium text-blue-900">{selectedNomination.nominatorName}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Email:</span>
                    <div className="font-medium text-blue-900">{selectedNomination.nominatorEmail}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Phone:</span>
                    <div className="font-medium text-blue-900">{selectedNomination.nominatorPhone}</div>
                  </div>
                </div>
              </div>

              {/* Nominee Information */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">Nominee Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-green-700">Name:</span>
                    <div className="font-medium text-green-900">{selectedNomination.nomineeName}</div>
                  </div>
                  <div>
                    <span className="text-green-700">Age:</span>
                    <div className="font-medium text-green-900">{selectedNomination.nomineeAge} years</div>
                  </div>
                  <div>
                    <span className="text-green-700">Location:</span>
                    <div className="font-medium text-green-900">{selectedNomination.nomineeLocation}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-green-700 text-sm">Interests & Hobbies:</span>
                    <div className="font-medium text-green-900">{selectedNomination.nomineeInterests}</div>
                  </div>
                </div>
              </div>

              {/* Nomination Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Nomination Details</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-700 text-sm">Relationship to Nominee:</span>
                    <div className="font-medium text-gray-900">{selectedNomination.relationship}</div>
                  </div>
                  <div>
                    <span className="text-gray-700 text-sm">Reasons for Nomination:</span>
                    <div className="font-medium text-gray-900">{selectedNomination.reasons}</div>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-3">Status Management</h4>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm text-yellow-700">Current Status:</span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedNomination.status)}`}>
                    {selectedNomination.status.charAt(0).toUpperCase() + selectedNomination.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {['pending', 'contacted', 'matched', 'rejected'].map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        const notes = prompt(`Update status to "${status}"? Add notes (optional):`)
                        if (notes !== null) {
                          updateNominationStatus(selectedNomination.id, status, notes)
                          setSelectedNomination({...selectedNomination, status, notes})
                        }
                      }}
                      className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                        selectedNomination.status === status
                          ? 'bg-primary-100 text-primary-800 border-primary-300'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
                
                {selectedNomination.notes && (
                  <div>
                    <span className="text-sm text-yellow-700">Admin Notes:</span>
                    <div className="font-medium text-yellow-900 bg-white p-2 rounded border mt-1">
                      {selectedNomination.notes}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Generate mailto link with pre-filled content
                    const subject = encodeURIComponent('Regarding your nomination to Make My Knot')
                    const body = encodeURIComponent(
                      `Dear ${selectedNomination.nominatorName},\n\nThank you for nominating ${selectedNomination.nomineeName} to Make My Knot.\n\nWe have reviewed your nomination and...\n\nBest regards,\nMake My Knot Team`
                    )
                    window.open(`mailto:${selectedNomination.nominatorEmail}?subject=${subject}&body=${body}`)
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email Nominator
                </button>
                <button
                  onClick={() => {
                    // Generate telephone link
                    window.open(`tel:${selectedNomination.nominatorPhone}`)
                  }}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call Nominator
                </button>
                <button
                  onClick={() => {
                    deleteNomination(selectedNomination.id)
                    setSelectedNomination(null)
                  }}
                  className="text-red-600 hover:text-red-800 px-4 py-2 border border-red-300 rounded-lg hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
                <button
                  onClick={() => setSelectedNomination(null)}
                  className="text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Offers Management Tab
function OffersTab() {
  const [offers, setOffers] = useState<Offer[]>(mockOffers)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [filterActive, setFilterActive] = useState('all')
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    validFrom: '',
    validUntil: '',
    targetUsers: [],
    isActive: true,
    maxUses: undefined,
    currentUses: 0
  })

  const filteredOffers = offers.filter(o => 
    filterActive === 'all' || 
    (filterActive === 'active' && o.isActive) || 
    (filterActive === 'inactive' && !o.isActive)
  )

  const handleCreateOffer = () => {
    const offer: Offer = {
      ...newOffer as Offer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setOffers([...offers, offer])
    setShowCreateModal(false)
    setNewOffer({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      validFrom: '',
      validUntil: '',
      targetUsers: [],
      isActive: true,
      maxUses: undefined,
      currentUses: 0
    })
    alert('Offer created successfully!')
  }

  const handleEditOffer = () => {
    if (!selectedOffer) return
    setOffers(offers.map(o => o.id === selectedOffer.id ? {
      ...selectedOffer,
      updatedAt: new Date().toISOString()
    } : o))
    setShowEditModal(false)
    setSelectedOffer(null)
    alert('Offer updated successfully!')
  }

  const handleDeleteOffer = (id: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter(o => o.id !== id))
      alert('Offer deleted successfully!')
    }
  }

  const handleToggleActive = (id: string) => {
    setOffers(offers.map(o => o.id === id ? {
      ...o,
      isActive: !o.isActive,
      updatedAt: new Date().toISOString()
    } : o))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Offers Management</h2>
            <p className="text-sm text-gray-600">Create and manage special offers, discounts, and promotions for users</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Gift className="h-4 w-4" />
            Create Offer
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Offers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Offers List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{offer.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Target: {offer.targetUsers.join(', ') || 'All users'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {offer.discountType === 'percentage' ? `${offer.discountValue}% off` : `₹${offer.discountValue} off`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validUntil).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {offer.currentUses}{offer.maxUses ? `/${offer.maxUses}` : ''} uses
                    </div>
                    {offer.maxUses && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((offer.currentUses / offer.maxUses) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      offer.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedOffer(offer)
                          setShowEditModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(offer.id)}
                        className={`transition-colors p-1 ${
                          offer.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                        }`}
                        title={offer.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Offer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Create New Offer</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Offer Title</label>
                <input
                  type="text"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Valentine's Day Special"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Special discount for premium subscription..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                  <select
                    value={newOffer.discountType}
                    onChange={(e) => setNewOffer({...newOffer, discountType: e.target.value as 'percentage' | 'fixed'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
                  <input
                    type="number"
                    value={newOffer.discountValue}
                    onChange={(e) => setNewOffer({...newOffer, discountValue: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={newOffer.discountType === 'percentage' ? '50' : '500'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
                  <input
                    type="date"
                    value={newOffer.validFrom}
                    onChange={(e) => setNewOffer({...newOffer, validFrom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
                  <input
                    type="date"
                    value={newOffer.validUntil}
                    onChange={(e) => setNewOffer({...newOffer, validUntil: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Users</label>
                <div className="space-y-2">
                  {['free', 'trial', 'monthly', 'annual'].map(userType => (
                    <label key={userType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newOffer.targetUsers?.includes(userType) || false}
                        onChange={(e) => {
                          const current = newOffer.targetUsers || []
                          if (e.target.checked) {
                            setNewOffer({...newOffer, targetUsers: [...current, userType]})
                          } else {
                            setNewOffer({...newOffer, targetUsers: current.filter(t => t !== userType)})
                          }
                        }}
                        className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{userType} Users</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Uses (optional)</label>
                <input
                  type="number"
                  value={newOffer.maxUses || ''}
                  onChange={(e) => setNewOffer({...newOffer, maxUses: parseInt(e.target.value) || undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>
            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOffer}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Offer Modal */}
      {showEditModal && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Edit Offer</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Offer Title</label>
                <input
                  type="text"
                  value={selectedOffer.title}
                  onChange={(e) => setSelectedOffer({...selectedOffer, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={selectedOffer.description}
                  onChange={(e) => setSelectedOffer({...selectedOffer, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
                  <input
                    type="number"
                    value={selectedOffer.discountValue}
                    onChange={(e) => setSelectedOffer({...selectedOffer, discountValue: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedOffer.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setSelectedOffer({...selectedOffer, isActive: e.target.value === 'active'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditOffer}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Update Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
