export interface Lead {
  id: string
  createdAt: string
  updatedAt: string
  
  // Basic Contact Information
  name: string
  email: string
  phone: string
  password?: string // Optional password for account creation
  dateOfBirth?: string // Date of birth
  countryCode?: string // Country code for phone number
  
  // Lead Questionnaire Specific Fields
  matchmakingExperience?: 'Yes' | 'No' // Have you used matchmaking platforms before?
  genderIdentity?: 'Man' | 'Woman' | 'Non-binary' | 'Prefer not to say' // Which gender best describes you?
  openToMeeting?: 'Men' | 'Women' | 'Non-binary' | 'All genders' // Who are you open to meeting?
  preferredAgeRange?: string // What is your preferred age range? (e.g., "25-35")
  currentLocation?: string // Where do you currently live?
  
  // Additional Profile Information
  hasBiodata?: boolean // Whether biodata file was uploaded
  biodataFileName?: string // Name of uploaded biodata file
  
  // Legacy and System Fields
  answers: Record<string, any> // Legacy answers field for backward compatibility
  status: 'new' | 'verified' | 'deleted' | 'contacted'
  syncedAt?: string
  source?: string
  leadScore?: number
  notes?: Array<{
    message: string
    addedBy: string
    addedAt: string
  }>
  assignedTo?: string
  followUpDate?: string
  isActive?: boolean
  biodataFile?: File | null // Biodata upload file (client-side only)
  isPermanent?: boolean // Flag to indicate this lead should persist in CRM
  savedToCRM?: boolean // Flag to confirm lead is saved to CRM
  needsSync?: boolean // Flag to indicate lead needs to be synced to backend
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// Helper function to get auth token
function getAuthToken(): string | null {
  return localStorage.getItem('makemyknot_token')
}

// PERMANENT STORAGE PROTECTION: Prevent accidental lead data loss
export function preventLeadDataLoss(): void {
  console.log('🔒 LEAD PROTECTION: Leads are stored permanently in CRM until admin deletion')
  
  // Protect against accidental localStorage clearing
  const originalClear = localStorage.clear
  localStorage.clear = function() {
    console.warn('⚠️ BLOCKED: localStorage.clear() blocked to protect lead data')
    console.log('🔒 If you need to clear storage, use clearNonLeadData() function')
  }
  
  // Protect against lead-specific removals
  const originalRemoveItem = localStorage.removeItem
  localStorage.removeItem = function(key: string) {
    if (key === 'makemyknot_leads') {
      console.warn('⚠️ BLOCKED: Attempted to remove lead data from localStorage')
      console.log('🔒 Use deleteLead() with admin confirmation to remove specific leads')
      return
    }
    return originalRemoveItem.call(this, key)
  }
}

// Safe function to clear non-lead data
export function clearNonLeadData(): void {
  const leads = localStorage.getItem('makemyknot_leads')
  localStorage.clear()
  if (leads) {
    localStorage.setItem('makemyknot_leads', leads)
    console.log('🔒 Cleared all data except protected lead data')
  }
}

// Helper function to make authenticated API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

export async function getLeads(params: {
  page?: number
  limit?: number
  status?: string
  search?: string
} = {}): Promise<{ leads: Lead[], pagination: any }> {
  try {
    console.log('🔍 Fetching leads from MongoDB...')
    
    // Use admin endpoint for direct MongoDB access
    const response = await fetch(`${API_BASE_URL}/leads/admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    const leads = result.data.leads.map((lead: any) => ({
      id: lead._id,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
      
      // Basic Contact Information
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      password: lead.password,
      dateOfBirth: lead.dateOfBirth,
      countryCode: lead.countryCode,
      
      // Lead Questionnaire Fields
      matchmakingExperience: lead.matchmakingExperience,
      genderIdentity: lead.genderIdentity,
      openToMeeting: lead.openToMeeting,
      preferredAgeRange: lead.preferredAgeRange,
      currentLocation: lead.currentLocation,
      
      // Additional Profile Information
      hasBiodata: lead.hasBiodata,
      biodataFileName: lead.biodataFileName,
      
      // System Fields
      answers: lead.answers,
      status: lead.status,
      source: lead.source,
      leadScore: lead.leadScore,
      notes: lead.notes,
      assignedTo: lead.assignedTo,
      followUpDate: lead.followUpDate,
      isActive: lead.isActive
    }))
    
    console.log(`✅ Fetched ${leads.length} leads from MongoDB`)
    return {
      leads,
      pagination: { page: 1, limit: leads.length, total: leads.length, pages: 1 }
    }
    
  } catch (error) {
    console.error('❌ Error fetching leads from MongoDB:', error)
    throw new Error(`Failed to fetch leads: ${error}`)
  }
}

export async function saveLead(leadInput: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> | Lead): Promise<Lead> {
  console.log('💾 Saving lead DIRECTLY to MongoDB:', leadInput.email)
  
  try {
    // Save directly to MongoDB with retry mechanism - NO localStorage
    const savedLead = await saveLeadToBackendWithRetry(leadInput)
    console.log('✅ Lead successfully saved to MongoDB:', savedLead.email)
    return savedLead
    
  } catch (error) {
    console.error('❌ FAILED to save lead to MongoDB after all retries:', error)
    throw new Error(`Failed to save lead to database: ${error}`)
  }
}

// Helper function to save lead to backend with retry logic
async function saveLeadToBackendWithRetry(leadInput: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> | Lead, maxRetries: number = 3): Promise<Lead> {
  const payload = {
    name: leadInput.name,
    email: leadInput.email,
    phone: leadInput.phone,
    password: leadInput.password,
    dateOfBirth: leadInput.dateOfBirth || leadInput.answers?.dateOfBirth,
    countryCode: leadInput.countryCode || leadInput.answers?.countryCode,
    answers: leadInput.answers,
    source: leadInput.source || 'website'
  }
  
  console.log('🔍 DEBUG: API_BASE_URL:', API_BASE_URL)
  console.log('🔍 DEBUG: Full API URL:', `${API_BASE_URL}/leads`)
  console.log('🔍 DEBUG: Payload to send:', payload)
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt} to save lead to MongoDB:`, leadInput.email)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
      
      const response = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      console.log('🔍 DEBUG: Response status:', response.status)
      console.log('🔍 DEBUG: Response headers:', [...response.headers.entries()])
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ DEBUG: Error response text:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const result = await response.json()
      console.log('✅ DEBUG: Success response:', result)
      const savedLead = result.data.lead
      
      // Convert MongoDB response to Lead interface
      const lead: Lead = {
        id: savedLead._id,
        createdAt: savedLead.createdAt,
        updatedAt: savedLead.updatedAt,
        
        // Basic Contact Information
        name: savedLead.name,
        email: savedLead.email,
        phone: savedLead.phone,
        password: savedLead.password,
        dateOfBirth: savedLead.dateOfBirth,
        countryCode: savedLead.countryCode,
        
        // Lead Questionnaire Fields
        matchmakingExperience: savedLead.matchmakingExperience,
        genderIdentity: savedLead.genderIdentity,
        openToMeeting: savedLead.openToMeeting,
        preferredAgeRange: savedLead.preferredAgeRange,
        currentLocation: savedLead.currentLocation,
        
        // Additional Profile Information
        hasBiodata: savedLead.hasBiodata,
        biodataFileName: savedLead.biodataFileName,
        
        // System Fields
        answers: savedLead.answers,
        status: savedLead.status,
        source: savedLead.source,
        leadScore: savedLead.leadScore,
        isActive: savedLead.isActive
      }
      
      console.log('✅ Lead saved to MongoDB successfully:', lead.email)
      return lead // Return the saved lead
      
    } catch (error: any) {
      console.error(`❌ MongoDB save attempt ${attempt} failed:`, error.message)
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to save lead to MongoDB after ${maxRetries} attempts: ${error.message}`)
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
      console.log(`⏳ Retrying MongoDB save in ${delay/1000} seconds...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw new Error('This should never be reached')
}

export async function deleteLead(id: string, adminConfirmation: boolean = false): Promise<void> {
  if (!adminConfirmation) {
    throw new Error('🔒 LEAD PROTECTION: Leads can only be deleted by admin with explicit confirmation')
  }
  
  try {
    console.log('🗑️ ADMIN ACTION: Deleting lead', id, 'with admin confirmation')
    await apiCall(`/leads/${id}`, {
      method: 'DELETE'
    })
    
    // Also remove from localStorage after successful API deletion
    const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
    const filteredLeads = leads.filter((l: Lead) => l.id !== id)
    localStorage.setItem('makemyknot_leads', JSON.stringify(filteredLeads))
    console.log('🗑️ Lead permanently deleted from both API and localStorage')
  } catch (error) {
    console.error('Error deleting lead from API:', error)
    // Even with API error, require admin confirmation for localStorage deletion
    if (adminConfirmation) {
      const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
      const filteredLeads = leads.filter((l: Lead) => l.id !== id)
      localStorage.setItem('makemyknot_leads', JSON.stringify(filteredLeads))
      console.log('🗑️ ADMIN ACTION: Lead deleted from localStorage (API failed)')
    }
  }
}

export async function verifyLead(id: string): Promise<Lead | null> {
  try {
    const result = await apiCall(`/leads/${id}/verify`, {
      method: 'PATCH'
    })
    
    const verifiedLead = result.data.lead
    return {
      id: verifiedLead._id,
      createdAt: verifiedLead.createdAt,
      updatedAt: verifiedLead.updatedAt,
      name: verifiedLead.name,
      email: verifiedLead.email,
      phone: verifiedLead.phone,
      answers: verifiedLead.answers,
      status: verifiedLead.status,
      source: verifiedLead.source,
      leadScore: verifiedLead.leadScore,
      isActive: verifiedLead.isActive
    }
  } catch (error) {
    console.error('Error verifying lead:', error)
    // Fallback to localStorage if API fails
    const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
    const idx = leads.findIndex((l: Lead) => l.id === id)
    if (idx >= 0) {
      leads[idx].status = 'verified'
      leads[idx].updatedAt = new Date().toISOString()
      localStorage.setItem('makemyknot_leads', JSON.stringify(leads))
      return leads[idx]
    }
    return null
  }
}

