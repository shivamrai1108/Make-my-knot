// MongoDB Migration Utility for localStorage Data
// This script migrates localStorage data structures to MongoDB

export interface MigrationResult {
  success: boolean
  message: string
  migratedCounts: {
    leads: number
    questionnaires: number
    users: number
    adminData: number
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// Helper function to make API calls to MongoDB backend
async function mongoApiCall(endpoint: string, data: any, method: string = 'POST') {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error)
    throw error
  }
}

// Migration functions for each data type
async function migrateLeads(): Promise<number> {
  try {
    const leadsData = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
    let migratedCount = 0
    
    for (const lead of leadsData) {
      try {
        await mongoApiCall('/leads/migrate', {
          ...lead,
          source: lead.source || 'website',
          migratedFromLocalStorage: true
        })
        migratedCount++
      } catch (error) {
        console.error(`Failed to migrate lead ${lead.id}:`, error)
      }
    }
    
    console.log(`Successfully migrated ${migratedCount} leads to MongoDB`)
    return migratedCount
  } catch (error) {
    console.error('Error migrating leads:', error)
    return 0
  }
}

async function migrateQuestionnaires(): Promise<number> {
  try {
    const questionnaireData = JSON.parse(localStorage.getItem('questionnaire_responses') || '[]')
    let migratedCount = 0
    
    for (const questionnaire of questionnaireData) {
      try {
        await mongoApiCall('/questionnaires/migrate', {
          ...questionnaire,
          migratedFromLocalStorage: true
        })
        migratedCount++
      } catch (error) {
        console.error(`Failed to migrate questionnaire ${questionnaire.id}:`, error)
      }
    }
    
    console.log(`Successfully migrated ${migratedCount} questionnaires to MongoDB`)
    return migratedCount
  } catch (error) {
    console.error('Error migrating questionnaires:', error)
    return 0
  }
}

async function migrateUsers(): Promise<number> {
  try {
    const usersData = JSON.parse(localStorage.getItem('makemyknot_local_users') || '[]')
    let migratedCount = 0
    
    for (const user of usersData) {
      try {
        // Don't migrate passwords in plain text - this is for demo data only
        const { password, ...userWithoutPassword } = user
        await mongoApiCall('/users/migrate', {
          ...userWithoutPassword,
          migratedFromLocalStorage: true,
          // Set a demo password hash for testing
          passwordHash: 'migrated-demo-user'
        })
        migratedCount++
      } catch (error) {
        console.error(`Failed to migrate user ${user.id}:`, error)
      }
    }
    
    console.log(`Successfully migrated ${migratedCount} users to MongoDB`)
    return migratedCount
  } catch (error) {
    console.error('Error migrating users:', error)
    return 0
  }
}

async function migrateAdminData(): Promise<number> {
  try {
    const adminKeys = [
      'makemyknot_admin_stats',
      'makemyknot_admin_leads',
      'makemyknot_admin_users',
      'makemyknot_admin_matches',
      'makemyknot_admin_conversations'
    ]
    
    let migratedCount = 0
    
    for (const key of adminKeys) {
      const data = localStorage.getItem(key)
      if (data) {
        try {
          await mongoApiCall('/admin/migrate', {
            key,
            data: JSON.parse(data),
            migratedFromLocalStorage: true
          })
          migratedCount++
        } catch (error) {
          console.error(`Failed to migrate admin data ${key}:`, error)
        }
      }
    }
    
    console.log(`Successfully migrated ${migratedCount} admin data entries to MongoDB`)
    return migratedCount
  } catch (error) {
    console.error('Error migrating admin data:', error)
    return 0
  }
}

// Main migration function
export async function migrateLocalStorageToMongoDB(): Promise<MigrationResult> {
  console.log('Starting migration from localStorage to MongoDB...')
  
  try {
    const results = {
      leads: await migrateLeads(),
      questionnaires: await migrateQuestionnaires(), 
      users: await migrateUsers(),
      adminData: await migrateAdminData()
    }
    
    const totalMigrated = Object.values(results).reduce((sum, count) => sum + count, 0)
    
    if (totalMigrated > 0) {
      // Create backup of localStorage data
      const backupData = {
        timestamp: new Date().toISOString(),
        leads: JSON.parse(localStorage.getItem('makemyknot_leads') || '[]'),
        questionnaires: JSON.parse(localStorage.getItem('questionnaire_responses') || '[]'),
        users: JSON.parse(localStorage.getItem('makemyknot_local_users') || '[]'),
        adminStats: JSON.parse(localStorage.getItem('makemyknot_admin_stats') || '{}')
      }
      
      localStorage.setItem('makemyknot_migration_backup', JSON.stringify(backupData))
      
      return {
        success: true,
        message: `Successfully migrated ${totalMigrated} items to MongoDB`,
        migratedCounts: results
      }
    } else {
      return {
        success: false,
        message: 'No data was migrated to MongoDB',
        migratedCounts: results
      }
    }
    
  } catch (error) {
    console.error('Migration failed:', error)
    return {
      success: false,
      message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      migratedCounts: { leads: 0, questionnaires: 0, users: 0, adminData: 0 }
    }
  }
}

// Function to restore from backup if needed
export async function restoreFromBackup(): Promise<boolean> {
  try {
    const backupData = localStorage.getItem('makemyknot_migration_backup')
    if (!backupData) {
      console.log('No backup data found')
      return false
    }
    
    const backup = JSON.parse(backupData)
    
    localStorage.setItem('makemyknot_leads', JSON.stringify(backup.leads))
    localStorage.setItem('questionnaire_responses', JSON.stringify(backup.questionnaires))
    localStorage.setItem('makemyknot_local_users', JSON.stringify(backup.users))
    localStorage.setItem('makemyknot_admin_stats', JSON.stringify(backup.adminStats))
    
    console.log('Successfully restored data from backup')
    return true
  } catch (error) {
    console.error('Failed to restore from backup:', error)
    return false
  }
}
