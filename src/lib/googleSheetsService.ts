// Google Sheets API Integration for Lead Data Capture
// Spreadsheet: https://docs.google.com/spreadsheets/d/1QFvu2uBzrmv_ktcNqIzzEUgfCp4ZZ_ExwozppGIaBec/edit?usp=sharing

import { Lead } from './leadStore'

// Google Sheets configuration
const SPREADSHEET_ID = '1QFvu2uBzrmv_ktcNqIzzEUgfCp4ZZ_ExwozppGIaBec'
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY
const LEADS_SHEET_NAME = 'Leads' // Sheet tab name for leads
const ASSESSMENTS_SHEET_NAME = 'Assessments' // Sheet tab name for assessments

// Lead data structure for Google Sheets
interface LeadSheetRow {
  timestamp: string
  name: string
  email: string
  phone: string
  countryCode: string
  dateOfBirth: string
  age: string
  genderIdentity: string
  openToMeeting: string
  matchmakingExperience: string
  preferredAgeRange: string
  currentLocation: string
  hasBiodata: string
  status: string
  leadScore: number
  source: string
  createdAt: string
}

// Assessment data structure for Google Sheets
interface AssessmentSheetRow {
  timestamp: string
  userName: string
  userEmail: string
  userPhone: string
  userType: string
  isComplete: string
  completionTimeMinutes: number
  // All 14 assessment questions
  gender: string
  lookingForGender: string
  age: string
  profession: string
  educationLevel: string
  religiousImportance: string
  smokingHabits: string
  drinkingHabits: string
  childrenDesire: string
  idealWeekend: string
  affectionStyle: string
  livingSituationPreference: string
  relationshipReasons: string
  careerOpportunityResponse: string
  familyGatheringResponse: string
  createdAt: string
  completedAt: string
  source: string
}

// Function to append lead data to Google Sheets
export async function appendLeadToGoogleSheets(lead: Lead): Promise<boolean> {
  try {
    console.log('📊 Saving lead to Google Sheets:', lead.email)
    
    if (!API_KEY) {
      console.warn('⚠️ Google Sheets API key not configured')
      return false
    }

    // Calculate age from date of birth
    const age = lead.dateOfBirth 
      ? Math.floor((Date.now() - new Date(lead.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : ''

    // Prepare lead data for Google Sheets
    const leadData: LeadSheetRow = {
      timestamp: new Date().toLocaleString(),
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      countryCode: lead.countryCode || '',
      dateOfBirth: lead.dateOfBirth ? new Date(lead.dateOfBirth).toLocaleDateString() : '',
      age: age.toString(),
      genderIdentity: lead.genderIdentity || '',
      openToMeeting: lead.openToMeeting || '',
      matchmakingExperience: lead.matchmakingExperience || '',
      preferredAgeRange: lead.preferredAgeRange || '',
      currentLocation: lead.currentLocation || '',
      hasBiodata: lead.hasBiodata ? 'Yes' : 'No',
      status: lead.status || 'new',
      leadScore: lead.leadScore || 0,
      source: lead.source || 'website',
      createdAt: lead.createdAt || new Date().toISOString()
    }

    // Convert to array format for Google Sheets API
    const rowData = [
      leadData.timestamp,
      leadData.name,
      leadData.email,
      leadData.phone,
      leadData.countryCode,
      leadData.dateOfBirth,
      leadData.age,
      leadData.genderIdentity,
      leadData.openToMeeting,
      leadData.matchmakingExperience,
      leadData.preferredAgeRange,
      leadData.currentLocation,
      leadData.hasBiodata,
      leadData.status,
      leadData.leadScore,
      leadData.source,
      leadData.createdAt
    ]

    // Append data to Google Sheets
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${LEADS_SHEET_NAME}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowData]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log('✅ Lead successfully saved to Google Sheets:', result)
    return true

  } catch (error) {
    console.error('❌ Error saving lead to Google Sheets:', error)
    return false
  }
}

// Function to append assessment data to Google Sheets
export async function appendAssessmentToGoogleSheets(assessment: any): Promise<boolean> {
  try {
    console.log('📊 Saving assessment to Google Sheets:', assessment.userEmail)
    
    if (!API_KEY) {
      console.warn('⚠️ Google Sheets API key not configured')
      return false
    }

    const responses = assessment.responses || {}

    // Prepare assessment data for Google Sheets
    const assessmentData: AssessmentSheetRow = {
      timestamp: new Date().toLocaleString(),
      userName: assessment.userName || '',
      userEmail: assessment.userEmail || '',
      userPhone: assessment.userPhone || '',
      userType: assessment.userType || '',
      isComplete: assessment.isComplete ? 'Yes' : 'No',
      completionTimeMinutes: assessment.completionTime ? Math.round(assessment.completionTime / 60) : 0,
      
      // All 14 assessment questions
      gender: responses.gender || '',
      lookingForGender: responses.looking_for_gender || '',
      age: responses.age || '',
      profession: responses.profession || '',
      educationLevel: responses.education_level || '',
      religiousImportance: responses.religious_importance || '',
      smokingHabits: responses.smoking_habits || '',
      drinkingHabits: responses.drinking_habits || '',
      childrenDesire: responses.children_desire || '',
      idealWeekend: responses.ideal_weekend || '',
      affectionStyle: Array.isArray(responses.affection_style) 
        ? responses.affection_style.join(', ') 
        : responses.affection_style || '',
      livingSituationPreference: responses.living_situation_preference || '',
      relationshipReasons: Array.isArray(responses.relationship_reasons) 
        ? responses.relationship_reasons.join(', ') 
        : responses.relationship_reasons || '',
      careerOpportunityResponse: responses.career_opportunity_scenario || '',
      familyGatheringResponse: responses.family_gathering_scenario || '',
      
      createdAt: assessment.createdAt || new Date().toISOString(),
      completedAt: assessment.completedAt || '',
      source: assessment.source || 'website'
    }

    // Convert to array format for Google Sheets API
    const rowData = [
      assessmentData.timestamp,
      assessmentData.userName,
      assessmentData.userEmail,
      assessmentData.userPhone,
      assessmentData.userType,
      assessmentData.isComplete,
      assessmentData.completionTimeMinutes,
      assessmentData.gender,
      assessmentData.lookingForGender,
      assessmentData.age,
      assessmentData.profession,
      assessmentData.educationLevel,
      assessmentData.religiousImportance,
      assessmentData.smokingHabits,
      assessmentData.drinkingHabits,
      assessmentData.childrenDesire,
      assessmentData.idealWeekend,
      assessmentData.affectionStyle,
      assessmentData.livingSituationPreference,
      assessmentData.relationshipReasons,
      assessmentData.careerOpportunityResponse,
      assessmentData.familyGatheringResponse,
      assessmentData.createdAt,
      assessmentData.completedAt,
      assessmentData.source
    ]

    // Append data to Google Sheets
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${ASSESSMENTS_SHEET_NAME}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowData]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log('✅ Assessment successfully saved to Google Sheets:', result)
    return true

  } catch (error) {
    console.error('❌ Error saving assessment to Google Sheets:', error)
    return false
  }
}

// Function to initialize Google Sheets with headers (run once)
export async function initializeGoogleSheetsHeaders(): Promise<void> {
  try {
    if (!API_KEY) {
      console.warn('⚠️ Google Sheets API key not configured')
      return
    }

    // Headers for Leads sheet
    const leadsHeaders = [
      'Timestamp',
      'Name', 
      'Email',
      'Phone',
      'Country Code',
      'Date of Birth',
      'Age',
      'Gender Identity',
      'Open to Meeting',
      'Matchmaking Experience',
      'Preferred Age Range',
      'Current Location',
      'Has Biodata',
      'Status',
      'Lead Score',
      'Source',
      'Created At'
    ]

    // Headers for Assessments sheet
    const assessmentHeaders = [
      'Timestamp',
      'User Name',
      'User Email', 
      'User Phone',
      'User Type',
      'Is Complete',
      'Completion Time (min)',
      'Gender',
      'Looking For Gender',
      'Age',
      'Profession',
      'Education Level',
      'Religious Importance',
      'Smoking Habits',
      'Drinking Habits',
      'Children Desire',
      'Ideal Weekend',
      'Affection Style',
      'Living Situation Preference',
      'Relationship Reasons',
      'Career Opportunity Response',
      'Family Gathering Response',
      'Created At',
      'Completed At',
      'Source'
    ]

    console.log('🔧 Initializing Google Sheets headers...')
    console.log('📋 Make sure your spreadsheet has two sheets: "Leads" and "Assessments"')
    
    // Note: This would require additional API permissions to create sheets
    // For now, you'll need to manually create the headers in your spreadsheet
    
  } catch (error) {
    console.error('❌ Error initializing Google Sheets headers:', error)
  }
}