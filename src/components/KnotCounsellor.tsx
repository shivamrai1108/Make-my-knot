import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, ChevronDown, ChevronUp, Brain, Sparkles } from 'lucide-react'
import { useUser } from '@/lib/UserContext'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

interface QuickReply {
  id: string
  text: string
  response: string
}

const quickReplies: QuickReply[] = [
  {
    id: 'services',
    text: 'What services do you offer?',
    response: 'We offer AI-powered matchmaking, compatibility assessments, personal matchmaker consultations, relationship counseling webinars, and premium membership plans. Our 50-year legacy ensures the highest quality matches.'
  },
  {
    id: 'pricing',
    text: 'What are your pricing plans?',
    response: 'We offer flexible pricing: Free profile creation, 7-day trial for ₹299, Monthly Premium at ₹1,999, and Annual Premium at ₹18,999 (save 21%). All plans include AI matching and personal support.'
  },
  {
    id: 'process',
    text: 'How does your matching process work?',
    response: 'Our 4-step process: 1) Complete detailed compatibility assessment, 2) AI analyzes your preferences and personality, 3) Receive 3-5 curated matches weekly, 4) Connect with mutual interests through our secure platform.'
  },
  {
    id: 'success',
    text: 'What is your success rate?',
    response: 'We have an 89% success rate with over 50,000 marriages facilitated since 1975. Our AI-enhanced traditional approach ensures meaningful connections that lead to lasting relationships.'
  },
  {
    id: 'support',
    text: 'How can I contact support?',
    response: 'Contact us at support@makemyknot.com, call +91-11-4567-8900, or schedule a consultation. Our relationship experts are available Mon-Sat, 9 AM to 8 PM IST.'
  }
]

const knotCounsellorResponses: Record<string, string> = {
  greeting: "Hello! I'm your Knot Counsellor from Make My Knot. I'm here to guide you on your journey to finding your perfect life partner. How can I assist you today?",
  default: "As your Knot Counsellor, I understand you're looking for information. Our relationship experts would be happy to help you personally. You can reach us at support@makemyknot.com or call +91-11-4567-8900. Is there anything specific I can help you with?",
  thanks: "You're very welcome! As your Knot Counsellor, we're here to help you find lasting love. If you have any other questions, feel free to ask. Good luck on your journey!",
  goodbye: "Thank you for chatting with your Knot Counsellor! We look forward to helping you find your perfect match. Have a wonderful day!"
}

export default function KnotCounsellor() {
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: generatePersonalizedGreeting(),
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [aiContext, setAiContext] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  function generatePersonalizedGreeting(): string {
    if (!user) {
      return knotCounsellorResponses.greeting
    }

    const greetings = [
      `Hello ${user.name}! 👋 I'm your AI Knot Counsellor. I see you're ${user.age} and located in ${user.location}. How can I help you find your perfect match today?`,
      `Hi ${user.name}! 🌟 As your personalized matchmaking assistant, I'm here to guide your journey. I notice you're interested in ${user.interests[0] || 'building meaningful connections'}. What would you like to explore?`,
      `Welcome back ${user.name}! 💕 Your Knot Counsellor here. Based on your profile, I can see you value ${user.values || 'authentic relationships'}. How can I assist you today?`
    ]

    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    // Update AI context with user message topics
    const newContext = [...aiContext]
    if (message.includes('match') || message.includes('partner')) newContext.push('seeking_matches')
    if (message.includes('profile') || message.includes('complete')) newContext.push('profile_optimization')
    if (message.includes('conversation') || message.includes('talk') || message.includes('chat')) newContext.push('communication_help')
    if (message.includes('date') || message.includes('meet')) newContext.push('dating_advice')
    setAiContext(newContext.slice(-5)) // Keep last 5 context items
    
    // Advanced AI responses based on user profile and context
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return generatePersonalizedGreeting()
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      const thankResponses = [
        `You're most welcome, ${user?.name || 'friend'}! 😊 I'm here whenever you need guidance on your matchmaking journey.`,
        `My pleasure! Remember, finding love is a journey, and I'm here to support you every step of the way. 💕`,
        `Anytime! Your happiness is our priority. Feel free to ask me anything about relationships or our services. ✨`
      ]
      return thankResponses[Math.floor(Math.random() * thankResponses.length)]
    }
    
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
      const goodbyeResponses = [
        `Goodbye ${user?.name || 'friend'}! 👋 Best of luck with your matches. I'll be here whenever you need me!`,
        `Take care! Remember, your perfect match is out there waiting. Keep believing in love! 💖`,
        `See you soon! Don't forget to check your new matches and keep building those connections. 🌟`
      ]
      return goodbyeResponses[Math.floor(Math.random() * goodbyeResponses.length)]
    }
    
    // Profile and matches related queries
    if (message.includes('profile') || message.includes('complete')) {
      if (!user?.profileComplete) {
        return `I see you haven't completed your profile yet, ${user?.name}! 📝 A complete profile gets 3x more matches. Would you like me to guide you through optimizing your profile with photos, interests, and preferences?`
      } else {
        return `Great news ${user?.name}! Your profile is complete and looking good. 🎉 Based on your interests in ${user?.interests?.join(', ')}, you're likely to attract matches who share similar passions. Need help with anything else?`
      }
    }
    
    if (message.includes('match') || message.includes('recommendation')) {
      if (user?.questionnaireComplete) {
        const matches = JSON.parse(localStorage.getItem('makemyknot_test_users') || '[]').length
        return `Perfect! Since you've completed our compatibility assessment, I've analyzed ${matches} potential matches for you. 🧠✨ Your ideal matches would be someone who values ${user?.values} like you do, and enjoys ${user?.interests?.[0]}. Would you like to see your top 3 matches?`
      } else {
        return `To provide you with the most compatible matches, I'd recommend completing our AI-powered compatibility assessment first! 🎯 It only takes 10 minutes and increases your match quality by 85%. Ready to take the assessment?`
      }
    }
    
    if (message.includes('conversation') || message.includes('talk') || message.includes('message')) {
      return `Great question about conversations! 💬 Here are my top 3 tips for ${user?.name}: 1) Start with shared interests like ${user?.interests?.[0] || 'travel or food'}, 2) Ask open-ended questions about their experiences, 3) Be authentic and show genuine interest. Want specific conversation starters for your matches?`
    }
    
    if (message.includes('date') || message.includes('meet') || message.includes('first')) {
      const dateAdvice = [
        `For first dates, ${user?.name}, I suggest something that aligns with your interests! Since you enjoy ${user?.interests?.[0] || 'good company'}, consider a coffee chat or a walk in a nice area. Keep it public, comfortable, and focused on getting to know each other. 🌟`,
        `First date nerves are normal! My advice: choose a setting where you both feel relaxed. Given your location in ${user?.location || 'your area'}, perhaps a local café or cultural spot? The key is authentic conversation, not perfection. 💕`,
        `Dating tip: Be yourself! Your genuine personality attracted them to match with you. Plan something that allows for easy conversation - maybe something related to ${user?.interests?.[0] || 'your shared interests'}. 😊`
      ]
      return dateAdvice[Math.floor(Math.random() * dateAdvice.length)]
    }
    
    // Business-related queries
    if (message.includes('price') || message.includes('cost') || message.includes('plan')) {
      return `Great question about pricing! 💳 For someone in ${user?.location || 'your area'}, our plans are designed to be accessible: 7-day trial for ₹299, Monthly Premium at ₹1,999 (perfect for active matching), and Annual Premium at ₹18,999 (saves 21%!). Given your ${user?.age || 'profile'}, I'd recommend starting with our monthly plan to get the full experience. Which plan interests you?`
    }
    
    if (message.includes('service') || message.includes('offer') || message.includes('what do you do')) {
      return `Excellent question! 🎯 We're not just another dating app - we're your personal matchmaking service with 50 years of expertise. For ${user?.name}, specifically, we offer: AI-powered compatibility matching based on your ${user?.values || 'values'}, personal matchmaker consultations, relationship coaching, and verified profiles. Our success rate is 89% - much higher than traditional apps!`
    }
    
    if (message.includes('how') && (message.includes('work') || message.includes('process') || message.includes('match'))) {
      return `Great question about our process! 🧠 Here's how it works for you, ${user?.name}: 1) We analyze your detailed compatibility assessment (${user?.questionnaireComplete ? 'already done! ✅' : 'please complete for better matches'}), 2) Our AI compares 200+ compatibility factors, 3) You receive 3-5 curated matches weekly, 4) Our team provides personalized guidance. It's science meets tradition!`
    }
    
    if (message.includes('success') || message.includes('rate') || message.includes('effective')) {
      return `Our success rate is exceptional! 📈 89% of our members find meaningful relationships, with over 50,000 marriages since 1975. For someone like you in ${user?.location || 'your area'} with interests in ${user?.interests?.[0] || 'genuine connections'}, our AI-enhanced approach typically finds compatible matches within 4-6 weeks. The key is our combination of traditional matchmaking wisdom and modern AI technology!`
    }
    
    if (message.includes('contact') || message.includes('support') || message.includes('help') || message.includes('phone')) {
      return `I'm here to help, but for complex queries our human experts are amazing! 👥 Contact our relationship specialists at support@makemyknot.com or call +91-11-4567-8900. They're available Mon-Sat, 9 AM to 8 PM IST. For ${user?.name}, I can also schedule a personal consultation call - would you like that?`
    }
    
    // Contextual responses based on AI learning
    if (aiContext.includes('seeking_matches') && user) {
      return `I notice you're interested in finding matches! 🎯 Based on your profile (${user.age}, ${user.location}, interested in ${user.interests?.[0]}), I can already see potential compatibility with several members. ${user.questionnaireComplete ? 'Your assessment results show great matching potential!' : 'Completing your assessment would unlock even better matches!'} Want to explore this?`
    }
    
    if (aiContext.includes('communication_help')) {
      return `Communication is key to building connections! 💬 Since you're asking about this, here's a personalized tip for ${user?.name}: Given your interest in ${user?.interests?.[0] || 'meaningful conversations'}, try starting conversations around shared passions. It creates instant connection and shows your authentic self. Need specific examples?`
    }
    
    // Emotional intelligence responses
    if (message.includes('nervous') || message.includes('scared') || message.includes('worried')) {
      return `It's completely natural to feel nervous about finding love, ${user?.name}! 🤗 You're not alone - 78% of our successful matches felt the same way initially. Remember, you're ${user?.age} with wonderful interests like ${user?.interests?.[0]}, and you have so much to offer! Take it one conversation at a time. I'm here to support you through this journey. 💪`
    }
    
    if (message.includes('lonely') || message.includes('alone') || message.includes('single')) {
      return `I hear you, ${user?.name}. Feeling lonely is part of the human experience, and it shows you're ready for meaningful connection. 💕 The beautiful thing is, there are amazing people in ${user?.location} and beyond who would love to meet someone like you. Your journey to finding love starts with believing you deserve it. Let's focus on connecting you with your perfect match! 🌟`
    }
    
    // Default intelligent response with personalization
    const personalizedDefaults = [
      `That's an interesting point, ${user?.name || 'friend'}! 🤔 While I'd love to help more specifically, our relationship experts can provide detailed guidance. As someone who values ${user?.values || 'authentic connections'}, you might benefit from a personal consultation. Shall I arrange that?`,
      `I appreciate you sharing that with me! 💭 For personalized advice about your specific situation, our experienced matchmakers would be perfect to help. Given your background and interests in ${user?.interests?.[0] || 'meaningful relationships'}, they can offer tailored guidance. Would you like to connect with them?`,
      `Thank you for that question! 🌟 While I can provide general guidance, our human relationship experts specialize in situations like yours. They understand the ${user?.location || 'local'} dating scene and can offer insights perfect for someone with your interests. Want me to set up a consultation?`
    ]
    
    return personalizedDefaults[Math.floor(Math.random() * personalizedDefaults.length)]
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setShowQuickReplies(false)
    setIsTyping(true)

    // Simulate counsellor typing delay
    setTimeout(() => {
      const botResponse = generateAIResponse(content)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  const handleQuickReply = (quickReply: QuickReply) => {
    handleSendMessage(quickReply.text)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        {/* Floating Action Button with Enhanced Animations */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-12 animate-bounce"
            aria-label="Open Knot Counsellor"
            style={{
              animation: 'gentle-bounce 3s ease-in-out infinite'
            }}
          >
            <MessageCircle className="h-6 w-6 animate-pulse" />
          </button>
          
          {/* Enhanced notification dot with ripple effect */}
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute top-0 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Floating helper text */}
          <div className="absolute bottom-16 right-0 mb-2 mr-2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm font-medium opacity-90 animate-fade-in-up transform transition-all duration-300">
            <div className="relative">
              Hi! Need help? 👋
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white"></div>
            </div>
          </div>
        </div>
        
        {/* CSS animations for enhanced effects */}
        <style jsx>{`
          @keyframes gentle-bounce {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }
          
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 0.9;
              transform: translateY(0px);
            }
          }
          
          @keyframes slide-in {
            0% {
              opacity: 0;
              transform: translateX(-20px) translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateX(0px) translateY(0px);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
          }
          
          .animate-slide-in {
            animation: slide-in 0.4s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-80 h-96'
      }`}>
        {/* Header */}
        <div className="bg-primary-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Knot Counsellor</h3>
              <p className="text-xs text-primary-100">Online • Ready to guide you</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:text-primary-200 transition-colors"
              aria-label={isMinimized ? 'Expand Knot Counsellor' : 'Minimize Knot Counsellor'}
            >
              {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-primary-200 transition-colors"
              aria-label="Close Knot Counsellor"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages with Animations */}
            <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50/50 to-transparent">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className={`max-w-xs ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm shadow-sm transition-all duration-300 hover:shadow-md transform hover:scale-105 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-br-md'
                          : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md'
                      }`}
                    >
                      <div className="relative">
                        {message.content}
                        {message.type === 'bot' && (
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    <div className={`text-xs text-gray-500 mt-2 font-medium ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mx-3 shadow-md transition-all duration-300 hover:scale-110 ${
                    message.type === 'user' 
                      ? 'order-1 bg-gradient-to-r from-primary-600 to-purple-600' 
                      : 'order-2 bg-gradient-to-r from-green-400 to-blue-400'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white animate-pulse" />
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-xs order-1">
                    <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-bl-sm text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mx-2 bg-gray-200">
                    <Bot className="h-3 w-3 text-gray-600" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {showQuickReplies && messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="text-xs text-gray-500 mb-2">Quick questions:</div>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.slice(0, 3).map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-200 p-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
