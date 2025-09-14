import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useUser } from '@/lib/UserContext'
import UserOnboarding from '@/components/UserOnboarding'
import { Loader } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useUser()
  const [initialData, setInitialData] = useState<any>({})

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      if (user && user.profileComplete) {
        // User has already completed profile, redirect to dashboard
        router.push('/dashboard')
        return
      }

      // Gather initial data from user and lead data
      if (user) {
        // Get lead data if this was a lead signup
        try {
          const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
          const matchingLead = leads.find((l: any) => 
            l.email === user.email && l.status === 'converted'
          )

          let leadAnswers: any = {}
          let leadDateOfBirth = ''

          if (matchingLead) {
            leadAnswers = matchingLead.answers || {}
            // Extract date of birth from lead data
            leadDateOfBirth = leadAnswers.dateOfBirth || ''
          }

          setInitialData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            age: user.age || '',
            location: user.location || leadAnswers.location || '',
            education: user.education || '',
            profession: user.profession || '',
            bio: user.bio || '',
            interests: user.interests || [],
            values: user.values || '',
            partnerPreferences: user.partnerPreferences || '',
            communicationStyle: user.communicationStyle || 'chat',
            dateOfBirth: leadDateOfBirth,
            profilePicture: ''
          })
        } catch (error) {
          console.error('Error loading lead data for onboarding:', error)
          setInitialData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            age: user.age || '',
            location: user.location || '',
            education: user.education || '',
            profession: user.profession || '',
            bio: user.bio || '',
            interests: user.interests || [],
            values: user.values || '',
            partnerPreferences: user.partnerPreferences || '',
            communicationStyle: user.communicationStyle || 'chat',
            dateOfBirth: '',
            profilePicture: ''
          })
        }
      }
    }
  }, [user, isAuthenticated, isLoading, router])

  const handleOnboardingComplete = (userData: any) => {
    console.log('Onboarding completed with data:', userData)
    
    // Store profile picture separately if provided
    if (userData.profilePicture) {
      localStorage.setItem('user_profile_picture', userData.profilePicture)
    }

    // Store date of birth separately if provided
    if (userData.dateOfBirth) {
      localStorage.setItem('user_date_of_birth', userData.dateOfBirth)
    }

    // Redirect to dashboard
    router.push('/dashboard')
  }

  if (isLoading || !user) {
    return (
      <>
        <Head>
          <title>Complete Your Profile - Make My Knot</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile setup...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Complete Your Profile - Make My Knot</title>
        <meta name="description" content="Complete your profile to find your perfect matches" />
      </Head>

      <UserOnboarding 
        initialData={initialData}
        onComplete={handleOnboardingComplete}
        skipable={true}
      />
    </>
  )
}
