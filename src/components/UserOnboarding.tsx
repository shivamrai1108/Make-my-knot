import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser, User } from '@/lib/UserContext'
import ProfilePictureUpload from './ProfilePictureUpload'
import DatePicker from './DatePicker'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Heart, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  MessageCircle,
  User as UserIcon,
  Phone,
  Calendar,
  Sparkles
} from 'lucide-react'

interface OnboardingProps {
  initialData?: Partial<User> & { dateOfBirth?: string, profilePicture?: string }
  onComplete?: (userData: Partial<User>) => void
  skipable?: boolean
}

const steps = [
  { id: 'profile_picture', title: 'Profile Picture', description: 'Add your best photo', icon: UserIcon },
  { id: 'basic_info', title: 'Basic Information', description: 'Tell us about yourself', icon: Heart },
  { id: 'location_education', title: 'Background', description: 'Where are you from & what did you study?', icon: MapPin },
  { id: 'profession_bio', title: 'About You', description: 'What do you do & tell us more', icon: Briefcase },
  { id: 'interests_preferences', title: 'Interests & Values', description: 'What matters to you?', icon: Sparkles },
  { id: 'communication', title: 'Communication', description: 'How do you like to connect?', icon: MessageCircle },
]

const interestOptions = [
  'Travel', 'Reading', 'Movies', 'Music', 'Sports', 'Cooking', 'Photography',
  'Art', 'Technology', 'Gaming', 'Fitness', 'Dancing', 'Hiking', 'Yoga',
  'Fashion', 'Food', 'Nature', 'Adventure', 'Culture', 'Languages'
]

const valueOptions = [
  'Family-oriented', 'Career-focused', 'Spiritual/Religious', 'Health & Wellness',
  'Adventure & Travel', 'Intellectual Growth', 'Social Impact', 'Creativity & Arts',
  'Financial Security', 'Work-life Balance', 'Personal Growth', 'Community Service'
]

const educationOptions = [
  'High School', 'Some College', 'Associates Degree', 'Bachelors Degree', 
  'Masters Degree', 'PhD', 'Professional Degree', 'Trade School', 'Self-taught'
]

// Country codes for phone numbers (same as LeadQuestionnaire)
const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
]

export default function UserOnboarding({ initialData = {}, onComplete, skipable = false }: OnboardingProps) {
  const router = useRouter()
  const { user, updateUser } = useUser()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    age: initialData.age || '',
    phone: initialData.phone || '',
    dateOfBirth: initialData.dateOfBirth || '',
    countryCode: '+91',
    location: initialData.location || '',
    education: initialData.education || '',
    profession: initialData.profession || '',
    bio: initialData.bio || '',
    interests: initialData.interests || [],
    values: initialData.values || '',
    partnerPreferences: initialData.partnerPreferences || '',
    communicationStyle: initialData.communicationStyle || 'chat',
    profilePicture: initialData.profilePicture || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Parse phone number if it exists
  useEffect(() => {
    if (initialData.phone) {
      // Extract country code and phone number
      for (const country of countryCodes) {
        if (initialData.phone.startsWith(country.code)) {
          setFormData(prev => ({
            ...prev,
            countryCode: country.code,
            phone: initialData.phone!.substring(country.code.length)
          }))
          break
        }
      }
    }
  }, [initialData.phone])

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const validateStep = () => {
    switch (currentStepData.id) {
      case 'profile_picture':
        return true // Optional
      case 'basic_info':
        return formData.name.trim() && formData.age && formData.dateOfBirth
      case 'location_education':
        return formData.location.trim() && formData.education
      case 'profession_bio':
        return formData.profession.trim() && formData.bio.trim()
      case 'interests_preferences':
        return formData.interests.length > 0 && formData.values
      case 'communication':
        return formData.partnerPreferences.trim() && formData.communicationStyle
      default:
        return true
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    
    try {
      // Calculate age from date of birth if provided
      let calculatedAge = formData.age
      if (formData.dateOfBirth) {
        const today = new Date()
        const birthDate = new Date(formData.dateOfBirth)
        calculatedAge = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--
        }
      }

      const userData: Partial<User> = {
        name: formData.name,
        age: Number(calculatedAge),
        phone: formData.countryCode + formData.phone,
        location: formData.location,
        education: formData.education,
        profession: formData.profession,
        bio: formData.bio,
        interests: formData.interests,
        values: formData.values,
        partnerPreferences: formData.partnerPreferences,
        communicationStyle: formData.communicationStyle as 'chat' | 'call',
        profileComplete: true
      }

      // Update user in context
      if (user) {
        updateUser(userData)
      }

      // Call completion callback
      if (onComplete) {
        onComplete({ ...userData, profilePicture: formData.profilePicture })
      } else {
        // Default behavior - redirect to dashboard
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      alert('Error saving your profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'profile_picture':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Add Your Profile Picture</h2>
            <p className="text-gray-600 mb-8">Show your best self! A great photo makes a great first impression.</p>
            
            <div className="flex justify-center mb-6">
              <ProfilePictureUpload
                currentPicture={formData.profilePicture}
                onUpload={(url) => setFormData(prev => ({ ...prev, profilePicture: url }))}
              />
            </div>
            
            <div className="text-sm text-gray-500">
              <p>✨ Tip: Upload a clear, recent photo where you're smiling!</p>
              <p className="mt-1">This step is optional - you can add a photo later.</p>
            </div>
          </div>
        )

      case 'basic_info':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
            <p className="text-gray-600 mb-6">Let's get the basics covered first.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date of Birth *
                  </label>
                  <DatePicker
                    value={formData.dateOfBirth}
                    onChange={(date) => {
                      const birthDate = new Date(date)
                      const today = new Date()
                      let age = today.getFullYear() - birthDate.getFullYear()
                      const monthDiff = today.getMonth() - birthDate.getMonth()
                      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--
                      }
                      setFormData(prev => ({ ...prev, dateOfBirth: date, age: age }))
                    }}
                    placeholder="Select your date of birth"
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    minDate="1930-01-01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-gray-50"
                    value={formData.age}
                    readOnly
                    placeholder="Calculated from DOB"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <div className="flex">
                  <select
                    className="px-3 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white"
                    value={formData.countryCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="10-digit phone number"
                    value={formData.phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setFormData(prev => ({ ...prev, phone: digits }))
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'location_education':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Where are you from?</h2>
            <p className="text-gray-600 mb-6">Tell us about your location and educational background.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="City, State/Country"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <GraduationCap className="w-4 h-4 inline mr-1" />
                  Education *
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white"
                  value={formData.education}
                  onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                >
                  <option value="">Select your education level</option>
                  {educationOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )

      case 'profession_bio':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">What do you do?</h2>
            <p className="text-gray-600 mb-6">Tell us about your profession and a bit about yourself.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Profession *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="e.g., Software Engineer, Teacher, Doctor"
                  value={formData.profession}
                  onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About You *
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="Tell us about yourself, your hobbies, what makes you unique... (minimum 50 characters)"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                />
                <div className="text-sm text-gray-500 mt-1">
                  {formData.bio.length}/500 characters {formData.bio.length < 50 ? `(need ${50 - formData.bio.length} more)` : ''}
                </div>
              </div>
            </div>
          </div>
        )

      case 'interests_preferences':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">What are you passionate about?</h2>
            <p className="text-gray-600 mb-6">Select your interests and core values.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Your Interests * (select at least 3)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`p-3 text-sm border-2 rounded-lg transition-all duration-200 ${
                        formData.interests.includes(interest)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300 text-gray-700'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Selected: {formData.interests.length}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Core Values *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {valueOptions.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, values: value }))}
                      className={`p-3 text-sm text-left border-2 rounded-lg transition-all duration-200 ${
                        formData.values === value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300 text-gray-700'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'communication':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">How do you connect?</h2>
            <p className="text-gray-600 mb-6">Tell us about your communication preferences and what you're looking for.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What are you looking for in a partner? *
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="Describe your ideal partner, what qualities matter to you..."
                  value={formData.partnerPreferences}
                  onChange={(e) => setFormData(prev => ({ ...prev, partnerPreferences: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <MessageCircle className="w-4 h-4 inline mr-1" />
                  Preferred Communication Style *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'chat', label: 'Text/Chat First', description: 'I prefer to get to know someone through messages first' },
                    { value: 'call', label: 'Voice/Video Calls', description: 'I like to have conversations over calls' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, communicationStyle: option.value as 'chat' | 'call' }))}
                      className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                        formData.communicationStyle === option.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="px-8 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900">Profile Setup</h1>
            {skipable && (
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip for now
              </button>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-600 to-gold-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center mt-2">
            <currentStepData.icon className="w-4 h-4 text-primary-600 mr-2" />
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}: {currentStepData.title}
            </span>
          </div>
        </div>

        {/* Step Content */}
        <div className="px-8 py-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!validateStep() || isSubmitting}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              validateStep() && !isSubmitting
                ? 'bg-gradient-to-r from-primary-600 to-gold-500 text-white hover:from-primary-700 hover:to-gold-600 transform hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : currentStep === steps.length - 1 ? (
              <>
                Complete Setup
                <CheckCircle className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
