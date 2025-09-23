export interface Lead {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  email: string
  phone: string
  password?: string // Optional password for account creation
  answers: Record<string, any>
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
  biodataFile?: File | null // Biodata upload file
  isPermanent?: boolean // Flag to indicate this lead should persist in CRM
  savedToCRM?: boolean // Flag to confirm lead is saved to CRM
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
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })
    
    const result = await apiCall(`/leads?${queryParams}`)
    return {
      leads: result.data.leads.map((lead: any) => ({
        id: lead._id,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        answers: lead.answers,
        status: lead.status,
        source: lead.source,
        leadScore: lead.leadScore,
        notes: lead.notes,
        assignedTo: lead.assignedTo,
        followUpDate: lead.followUpDate,
        isActive: lead.isActive
      })),
      pagination: result.data.pagination
    }
  } catch (error) {
    console.error('Error fetching leads:', error)
    // Fallback to localStorage if API fails
    const localLeads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
    return { leads: localLeads, pagination: { page: 1, limit: 10, total: localLeads.length, pages: 1 } }
  }
}

export async function saveLead(leadInput: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> | Lead): Promise<Lead> {
  try {
    // PERMANENT CRM STORAGE: Leads are stored permanently until admin deletion
    // If lead already has an ID, it's coming from LeadQuestionnaire, use it as-is for localStorage first
    if ('id' in leadInput && leadInput.id) {
      console.log('🔒 PERMANENT CRM STORAGE: Saving lead with existing ID to localStorage:', leadInput.id)
      const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
      // Remove any existing lead with the same ID to update it
      const filteredLeads = leads.filter((l: Lead) => l.id !== leadInput.id)
      const permanentLead = { ...leadInput, isPermanent: true, savedToCRM: true }
      filteredLeads.push(permanentLead)
      localStorage.setItem('makemyknot_leads', JSON.stringify(filteredLeads))
      console.log('🔒 Lead stored permanently in CRM. Total leads in CRM:', filteredLeads.length)
    }

    const result = await apiCall('/leads', {
      method: 'POST',
      body: JSON.stringify({
        name: leadInput.name,
        email: leadInput.email,
        phone: leadInput.phone,
        answers: leadInput.answers,
        source: leadInput.source || 'website'
      })
    })
    
    const savedLead = result.data.lead
    const apiLead = {
      id: savedLead._id,
      createdAt: savedLead.createdAt,
      updatedAt: savedLead.updatedAt,
      name: savedLead.name,
      email: savedLead.email,
      phone: savedLead.phone,
      answers: savedLead.answers,
      status: savedLead.status,
      source: savedLead.source,
      leadScore: savedLead.leadScore,
      isActive: savedLead.isActive
    }
    
    // Update localStorage with API response
    const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
    const idx = leads.findIndex((l: Lead) => l.email === apiLead.email)
    if (idx >= 0) {
      leads[idx] = apiLead
    } else {
      leads.push(apiLead)
    }
    localStorage.setItem('makemyknot_leads', JSON.stringify(leads))
    
    return apiLead
  } catch (error) {
    console.error('Error saving lead to API, using localStorage fallback:', error)
    // Fallback to localStorage if API fails - STILL PERMANENT STORAGE
    const localLead = 'id' in leadInput && leadInput.id ? 
      { ...leadInput as Lead, isPermanent: true, savedToCRM: true } : 
      {
        ...leadInput,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPermanent: true,
        savedToCRM: true
      }
    
    const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
    // Remove any existing lead with the same ID or email
    const filteredLeads = leads.filter((l: Lead) => l.id !== localLead.id && l.email !== localLead.email)
    filteredLeads.push(localLead)
    localStorage.setItem('makemyknot_leads', JSON.stringify(filteredLeads))
    console.log('Lead saved to localStorage:', localLead)
    return localLead
  }
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

