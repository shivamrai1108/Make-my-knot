import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useUser } from '@/lib/UserContext'
import ComprehensiveQuestionnaire from '@/components/ComprehensiveQuestionnaire'
import { QuestionnaireResponse } from '@/lib/questionnaireStore'


export default function QuestionnairePage() {
  const router = useRouter()
  const { leadId, userId, source } = router.query
  const { user, isAuthenticated, isLoading } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // If no user ID provided and user is not authenticated, redirect to login
    if (mounted && !userId && !leadId && !isLoading && !isAuthenticated) {
      router.push('/login?redirect=/questionnaire')
    }
  }, [mounted, userId, leadId, isAuthenticated, isLoading, router])

  const handleComplete = (response: QuestionnaireResponse) => {
    // Redirect based on user state
    if (user?.id || userId) {
      // Registered user - go to dashboard
      router.push('/dashboard')
    } else if (leadId) {
      // Lead user - redirect to signup with pre-filled info
      router.push(`/signup?leadId=${leadId}&questionnaire=complete`)
    } else {
      // Anonymous user - redirect to signup
      router.push('/signup?questionnaire=complete')
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>AI Compatibility Assessment - Make My Knot</title>
        <meta name="description" content="Complete our comprehensive questionnaire to help our AI find your perfect match based on personality, values, and compatibility." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <ComprehensiveQuestionnaire
        userId={(userId as string) || user?.id}
        leadId={leadId as string}
        onComplete={handleComplete}
        showIntro={source !== 'registration'}
      />
    </>
  )
}
