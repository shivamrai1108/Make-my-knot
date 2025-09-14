import React, { useState, useEffect } from 'react'
import { Heart, MapPin, GraduationCap, Briefcase, Star, X, Check, ChevronDown, ChevronUp, MessageCircle, Calendar, Sparkles, Users, Target } from 'lucide-react'
import { MatchResult, calculateRelationshipStrength } from '@/lib/aiMatching'

interface EnhancedMatchCardProps {
  match: MatchResult
  onLike?: (matchId: string) => void
  onPass?: (matchId: string) => void
  className?: string
}

export default function EnhancedMatchCard({ match, onLike, onPass, className = '' }: EnhancedMatchCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [likeAnimation, setLikeAnimation] = useState(false)
  const [passAnimation, setPassAnimation] = useState(false)
  
  const candidate = match.candidate
  const relationshipStrength = calculateRelationshipStrength(match)
  
  // Extract data from questionnaire responses
  const responses = candidate.questionnaireResponse.responses
  const age = responses.age || '25'
  const location = responses.living_situation_preference || candidate.location || 'Location not specified'
  const profession = responses.profession || candidate.profession || 'Profession not specified'
  const education = responses.education_level || candidate.education || 'Education not specified'
  const interests = responses.interests || []
  const gender = responses.gender || 'Not specified'

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleLike = () => {
    setLikeAnimation(true)
    setTimeout(() => {
      onLike?.(candidate.id)
      setLikeAnimation(false)
    }, 600)
  }

  const handlePass = () => {
    setPassAnimation(true)
    setTimeout(() => {
      onPass?.(candidate.id)
      setPassAnimation(false)
    }, 400)
  }

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Exceptional': return 'text-purple-600 bg-purple-100'
      case 'High': return 'text-green-600 bg-green-100'
      case 'Moderate': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className={`bg-white rounded-3xl shadow-xl overflow-hidden max-w-sm mx-auto transition-all duration-500 transform hover:scale-105 ${
      isAnimating ? 'animate-fadeInUp' : ''
    } ${
      likeAnimation ? 'animate-pulse bg-pink-50' : ''
    } ${
      passAnimation ? 'animate-fadeOut' : ''
    } ${className}`}>
      
      {/* Photo Section */}
      <div className="relative h-96 bg-gradient-to-br from-primary-100 via-purple-100 to-gold-100">
        {candidate.profilePicture ? (
          <img
            src={candidate.profilePicture}
            alt={candidate.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Users className="h-20 w-20 text-primary-400 mx-auto mb-4" />
              <p className="text-primary-600 font-medium">Photo Coming Soon</p>
            </div>
          </div>
        )}
        
        {/* Animated Compatibility Badge */}
        <div className="absolute top-4 right-4">
          <div className={`${getCompatibilityColor(match.compatibilityScore)} backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center shadow-lg animate-bounce`}>
            <Sparkles className="h-5 w-5 mr-2 animate-spin" />
            <div className="text-center">
              <div className="text-lg font-bold">{match.compatibilityScore}%</div>
              <div className="text-xs font-medium">Match</div>
            </div>
          </div>
        </div>

        {/* Gender Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-xs font-medium text-gray-700">{gender}</span>
        </div>

        {/* Relationship Strength Badge */}
        <div className="absolute bottom-4 left-4">
          <div className={`${getStrengthColor(relationshipStrength.strength)} rounded-xl px-3 py-1 backdrop-blur-sm`}>
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-1" />
              <span className="text-sm font-semibold">{relationshipStrength.strength}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            {candidate.name}
            <span className="text-lg text-gray-600 font-normal ml-2">({age})</span>
            {match.compatibilityScore >= 90 && (
              <Star className="h-5 w-5 text-gold-500 ml-2 animate-pulse" />
            )}
          </h3>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {location}
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <GraduationCap className="h-4 w-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{education}</span>
          </div>
          <div className="flex items-start">
            <Briefcase className="h-4 w-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{profession}</span>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-primary-800 mb-2 flex items-center">
            <Sparkles className="h-4 w-4 mr-1" />
            AI Compatibility Insight
          </h4>
          <p className="text-sm text-primary-700 leading-relaxed">
            {match.summary}
          </p>
        </div>

        {/* Shared Interests */}
        {match.sharedInterests.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Shared Values</h4>
            <div className="flex flex-wrap gap-2">
              {match.sharedInterests.slice(0, 3).map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  ✓ {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {interests.slice(0, 4).map((interest: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
              {interests.length > 4 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{interests.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Detailed Compatibility Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mb-4 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-between"
        >
          <span className="text-sm font-medium text-gray-700">View Detailed Compatibility</span>
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {/* Detailed Compatibility Section */}
        {showDetails && (
          <div className="mb-6 animate-slideDown">
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              {/* Matching Areas */}
              {match.matchingSections.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-gray-800 mb-2 uppercase tracking-wide">Strong Compatibility</h5>
                  <div className="flex flex-wrap gap-1">
                    {match.matchingSections.map((section, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-medium"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Relationship Strength Factors */}
              <div>
                <h5 className="text-xs font-semibold text-gray-800 mb-2 uppercase tracking-wide">Key Factors</h5>
                <div className="space-y-1">
                  {relationshipStrength.factors.slice(0, 3).map((factor, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {relationshipStrength.recommendations.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-gray-800 mb-2 uppercase tracking-wide">AI Recommendations</h5>
                  <div className="space-y-1">
                    {relationshipStrength.recommendations.slice(0, 2).map((recommendation, index) => (
                      <div key={index} className="flex items-start">
                        <Star className="h-3 w-3 text-gold-500 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-700">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePass}
            disabled={passAnimation}
            className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center transform hover:scale-105 active:scale-95"
          >
            <X className="h-5 w-5 mr-2" />
            {passAnimation ? 'Passing...' : 'Pass'}
          </button>
          <button
            onClick={handleLike}
            disabled={likeAnimation}
            className="flex-1 bg-gradient-to-r from-pink-500 to-primary-600 hover:from-pink-600 hover:to-primary-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <Heart className={`h-5 w-5 mr-2 ${likeAnimation ? 'animate-ping' : ''}`} />
            {likeAnimation ? 'Connecting...' : 'Interested'}
          </button>
        </div>

        {/* Connect Options */}
        <div className="mt-3 flex gap-2">
          <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </button>
          <button className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
            <Calendar className="h-4 w-4 mr-1" />
            Meet
          </button>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.8);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
        
        .animate-fadeOut {
          animation: fadeOut 0.4s ease-in;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
