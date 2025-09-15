import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart, Filter, Search, MapPin, Users, MessageCircle, Star, Sparkles, Target, RefreshCw, X } from 'lucide-react'
import EnhancedMatchCard from '@/components/EnhancedMatchCard'
import { getMatchRecommendations, MatchResult } from '@/lib/aiMatching'
import { useUser } from '@/lib/UserContext'
import BrandLogo from '@/components/BrandLogo'

// Enhanced AI-powered matching system
function useAIMatches(userId?: string) {
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMatches = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!userId) {
        // Demo matches when no user ID
        setMatches([])
        setLoading(false)
        return
      }

      const aiMatches = getMatchRecommendations(userId)
      setMatches(aiMatches)
    } catch (err) {
      console.error('Error loading matches:', err)
      setError('Failed to load matches')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMatches()
  }, [userId])

  return { matches, loading, error, refreshMatches: loadMatches }
}

export default function Matches() {
  const { user, isAuthenticated } = useUser()
  const { matches, loading, error, refreshMatches } = useAIMatches(user?.id)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [processingAction, setProcessingAction] = useState(false)
  const [filters, setFilters] = useState({
    ageRange: [25, 35],
    location: '',
    education: '',
    profession: ''
  })

  const handleLike = async (matchId: string) => {
    setProcessingAction(true)
    try {
      console.log('Liked:', matchId)
      // TODO: Implement API call to record like
      
      // Move to next match with animation delay
      setTimeout(() => {
        if (currentMatchIndex < matches.length - 1) {
          setCurrentMatchIndex(currentMatchIndex + 1)
        }
        setProcessingAction(false)
      }, 800)
    } catch (error) {
      console.error('Error recording like:', error)
      setProcessingAction(false)
    }
  }

  const handlePass = async (matchId: string) => {
    setProcessingAction(true)
    try {
      console.log('Passed:', matchId)
      // TODO: Implement API call to record pass
      
      // Move to next match with animation delay
      setTimeout(() => {
        if (currentMatchIndex < matches.length - 1) {
          setCurrentMatchIndex(currentMatchIndex + 1)
        }
        setProcessingAction(false)
      }, 600)
    } catch (error) {
      console.error('Error recording pass:', error)
      setProcessingAction(false)
    }
  }

  const currentMatch = matches[currentMatchIndex]
  
  // Calculate match statistics
  const matchStats = {
    newMatches: matches.filter(m => m.compatibilityScore >= 80).length,
    averageCompatibility: matches.length > 0 
      ? Math.round(matches.reduce((sum, m) => sum + m.compatibilityScore, 0) / matches.length)
      : 0,
    exceptionalMatches: matches.filter(m => m.compatibilityScore >= 90).length
  }

  return (
    <>
      <Head>
        <title>Your Matches - Make My Knot</title>
        <meta name="description" content="Discover your curated matches based on compatibility and shared values." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Finding your perfect matches...</p>
              <p className="text-sm text-gray-500 mt-1">AI is analyzing compatibility</p>
            </div>
          </div>
        )}
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              <div className="flex items-center">
                <BrandLogo size="sm" className="mr-2" />
                <span className="text-xl font-bold text-gray-900">Make My Knot</span>
              </div>
              <nav className="hidden md:flex items-center space-x-1">
                <Link href="/matches" className="text-primary-600 font-semibold text-sm px-3 py-2 rounded-md">Matches</Link>
                <Link href="/conversations" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-semibold text-sm px-3 py-2 rounded-md">Conversations</Link>
                <Link href="/profile" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-semibold text-sm px-3 py-2 rounded-md">Profile</Link>
                <button className="btn-secondary text-sm px-3 py-2">Settings</button>
              </nav>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Stats Bar */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{matchStats.newMatches}</div>
              <div className="text-sm text-gray-600">Quality Matches</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{matchStats.exceptionalMatches}</div>
              <div className="text-sm text-gray-600">Exceptional Matches</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 bg-gold-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-gold-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">2</div>
              <div className="text-sm text-gray-600">Active Chats</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{matchStats.averageCompatibility}%</div>
              <div className="text-sm text-gray-600">Avg Compatibility</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar - Matchmaker Chat */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Matchmaker</h3>
                  <p className="text-gray-600 text-sm">Priya is here to help</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3 text-left">
                    <p className="text-sm text-gray-700">&quot;I found 3 amazing matches for you this week! Each one shares your values and interests.&quot;</p>
                  </div>
                  <div className="bg-primary-600 text-white rounded-lg p-3 text-right ml-6">
                    <p className="text-sm">&quot;That&apos;s great! Tell me about the first one.&quot;</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-left">
                    <p className="text-sm text-gray-700">&quot;Perfect! Let me introduce you to {currentMatch?.candidate.name}. You both value family and share a passion for {currentMatch?.sharedInterests[0]?.toLowerCase() || 'common interests'}. 💕&quot;</p>
                  </div>
                </div>

                <button className="w-full btn-primary text-sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Knot Counsellor Chat
                </button>
              </div>
            </div>

            {/* Main Match Area */}
            <div className="lg:col-span-2">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary-600 mr-3 animate-pulse" />
                  <h1 className="text-3xl font-bold text-gray-900">AI-Curated Matches</h1>
                  <Sparkles className="h-8 w-8 text-primary-600 ml-3 animate-pulse" />
                </div>
                <p className="text-gray-600 mb-4">Personalized matches based on gender preferences, compatibility, and shared values</p>
                {matches.length > 0 && (
                  <div className="inline-flex items-center bg-gradient-to-r from-primary-100 to-purple-100 rounded-full px-4 py-2">
                    <Target className="h-4 w-4 text-primary-600 mr-2" />
                    <span className="text-sm font-medium text-primary-800">
                      Showing personalized matches based on compatibility
                    </span>
                  </div>
                )}
              </div>

              {/* Enhanced Filter Bar */}
              <div className="bg-white rounded-xl p-4 mb-8 flex items-center justify-between shadow-lg">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center text-gray-600 hover:text-primary-600 transition-colors font-medium"
                  >
                    <Filter className="h-5 w-5 mr-2" />
                    Advanced Filters
                  </button>
                  <button
                    onClick={refreshMatches}
                    disabled={loading}
                    className="flex items-center text-gray-600 hover:text-purple-600 transition-colors font-medium"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh AI Matches
                  </button>
                </div>
                <div className="text-sm font-medium">
                  {matches.length > 0 && (
                    <span className="text-gray-900">
                      Match {currentMatchIndex + 1} of {matches.length}
                      {currentMatch && (
                        <span className="ml-2 text-primary-600">
                          ({currentMatch.compatibilityScore}% compatible)
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Enhanced Match Card */}
              {error ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <X className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Matches</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button 
                    onClick={refreshMatches}
                    className="btn-primary flex items-center mx-auto"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </button>
                </div>
              ) : currentMatch ? (
                <div className="flex justify-center">
                  <EnhancedMatchCard
                    match={currentMatch}
                    onLike={handleLike}
                    onPass={handlePass}
                    className={processingAction ? 'pointer-events-none opacity-75' : ''}
                  />
                </div>
              ) : !loading && matches.length === 0 && isAuthenticated ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Looking for Compatible Matches</h3>
                  <p className="text-gray-600 mb-6">Our AI is working hard to find people who match your preferences and values. New matches will appear as more people join!</p>
                  <div className="space-y-3">
                    <button 
                      onClick={refreshMatches}
                      className="btn-primary flex items-center mx-auto"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Check for New Matches
                    </button>
                    <button className="btn-secondary flex items-center mx-auto">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat with Knot Counsellor
                    </button>
                  </div>
                </div>
              ) : !isAuthenticated ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Assessment</h3>
                  <p className="text-gray-600 mb-6">Take our comprehensive compatibility assessment to see personalized matches based on your preferences.</p>
                  <div className="space-y-3">
                    <Link href="/assessment" className="btn-primary inline-flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start Assessment
                    </Link>
                    <Link href="/login" className="btn-secondary inline-flex items-center">
                      Sign In
                    </Link>
                  </div>
                </div>
              ) : null}

              {/* Navigation Dots */}
              {matches.length > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    {matches.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMatchIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentMatchIndex
                            ? 'bg-primary-600'
                            : index < currentMatchIndex
                            ? 'bg-gray-400'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
