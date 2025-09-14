import { useState } from 'react'
import Head from 'next/head'
import { migrateLocalStorageToMongoDB, restoreFromBackup, MigrationResult } from '../../utils/migrateToMongoDB'
import Navigation from '@/components/Navigation'

export default function MigrationPage() {
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [localStorageData, setLocalStorageData] = useState<any>({})

  // Check localStorage data on component mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const data = {
        leads: JSON.parse(localStorage.getItem('makemyknot_leads') || '[]'),
        questionnaires: JSON.parse(localStorage.getItem('questionnaire_responses') || '[]'),
        users: JSON.parse(localStorage.getItem('makemyknot_local_users') || '[]'),
        adminStats: JSON.parse(localStorage.getItem('makemyknot_admin_stats') || '{}')
      }
      setLocalStorageData(data)
    }
  })

  const handleMigration = async () => {
    setIsLoading(true)
    try {
      const result = await migrateLocalStorageToMongoDB()
      setMigrationResult(result)
    } catch (error) {
      setMigrationResult({
        success: false,
        message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        migratedCounts: { leads: 0, questionnaires: 0, users: 0, adminData: 0 }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async () => {
    const success = await restoreFromBackup()
    if (success) {
      alert('Data restored from backup successfully!')
      window.location.reload()
    } else {
      alert('Failed to restore from backup')
    }
  }

  const totalItems = Object.values(localStorageData).reduce((total: number, data: any) => {
    if (Array.isArray(data)) return total + data.length
    if (typeof data === 'object' && data !== null) return total + Object.keys(data).length
    return total
  }, 0)

  return (
    <>
      <Head>
        <title>MongoDB Migration - Make My Knot Admin</title>
        <meta name="description" content="Migrate localStorage data to MongoDB" />
      </Head>

      <Navigation variant="white" />

      <main className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">MongoDB Migration</h1>
            
            {/* Current localStorage Data */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current localStorage Data</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900">Leads</h3>
                  <p className="text-2xl font-bold text-blue-600">{localStorageData.leads?.length || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900">Questionnaires</h3>
                  <p className="text-2xl font-bold text-green-600">{localStorageData.questionnaires?.length || 0}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-900">Users</h3>
                  <p className="text-2xl font-bold text-purple-600">{localStorageData.users?.length || 0}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-900">Total Items</h3>
                  <p className="text-2xl font-bold text-orange-600">{totalItems}</p>
                </div>
              </div>
            </div>

            {/* Migration Controls */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Migration Actions</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleMigration}
                  disabled={isLoading || totalItems === 0}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isLoading || totalItems === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-105'
                  }`}
                >
                  {isLoading ? 'Migrating...' : 'Migrate to MongoDB'}
                </button>

                <button
                  onClick={handleRestore}
                  className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-all duration-200 transform hover:scale-105"
                >
                  Restore from Backup
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200"
                >
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Migration Results */}
            {migrationResult && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Migration Results</h2>
                <div className={`p-4 rounded-lg ${
                  migrationResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`font-semibold ${
                    migrationResult.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {migrationResult.message}
                  </p>

                  {migrationResult.success && (
                    <div className="mt-4 grid md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Leads</p>
                        <p className="text-xl font-bold text-blue-600">{migrationResult.migratedCounts.leads}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Questionnaires</p>
                        <p className="text-xl font-bold text-green-600">{migrationResult.migratedCounts.questionnaires}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Users</p>
                        <p className="text-xl font-bold text-purple-600">{migrationResult.migratedCounts.users}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Admin Data</p>
                        <p className="text-xl font-bold text-orange-600">{migrationResult.migratedCounts.adminData}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Ensure the backend server is running on port 4000</li>
                <li>• Verify MongoDB connection is established</li>
                <li>• Click "Migrate to MongoDB" to transfer all localStorage data</li>
                <li>• Data will be backed up locally before migration</li>
                <li>• Use "Restore from Backup" if you need to revert changes</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
