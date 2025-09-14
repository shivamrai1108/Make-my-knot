import Head from 'next/head'
import { useState, useEffect, useCallback } from 'react'
import { MessageCircle, Search, Phone, Video, MoreVertical, ArrowLeft, Send } from 'lucide-react'
import { useUser } from '@/lib/UserContext'
import { useRouter } from 'next/router'

interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantImage: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isOnline: boolean
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
}

// Mock conversations service - in a real app, this would be API calls
const conversationsService = {
  getUserConversations: (userId: string): Conversation[] => {
    const conversations = JSON.parse(localStorage.getItem('user_conversations') || '[]')
    return conversations.filter((c: any) => 
      c.participantId === userId || c.currentUserId === userId
    )
  },

  getConversationMessages: (conversationId: string): Message[] => {
    const messages = JSON.parse(localStorage.getItem('conversation_messages') || '[]')
    return messages
      .filter((m: Message) => m.conversationId === conversationId)
      .sort((a: Message, b: Message) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  },

  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>): Message => {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    }

    const messages = JSON.parse(localStorage.getItem('conversation_messages') || '[]')
    messages.push(newMessage)
    localStorage.setItem('conversation_messages', JSON.stringify(messages))

    // Update conversation's last message
    const conversations = JSON.parse(localStorage.getItem('user_conversations') || '[]')
    const conversationIndex = conversations.findIndex((c: any) => c.id === message.conversationId)
    if (conversationIndex !== -1) {
      conversations[conversationIndex].lastMessage = message.content
      conversations[conversationIndex].lastMessageTime = newMessage.timestamp
      localStorage.setItem('user_conversations', JSON.stringify(conversations))
    }

    return newMessage
  },

  createConversation: (userId: string, otherUserId: string, otherUserName: string, otherUserImage?: string): Conversation => {
    const conversationId = `conv_${userId}_${otherUserId}`
    const existingConversations = JSON.parse(localStorage.getItem('user_conversations') || '[]')
    
    // Check if conversation already exists
    const existing = existingConversations.find((c: any) => 
      c.id === conversationId || c.id === `conv_${otherUserId}_${userId}`
    )
    
    if (existing) {
      return existing
    }

    const newConversation: Conversation = {
      id: conversationId,
      participantId: otherUserId,
      participantName: otherUserName,
      participantImage: otherUserImage || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50)}.jpg`,
      lastMessage: '',
      lastMessageTime: new Date(),
      unreadCount: 0,
      isOnline: Math.random() > 0.5
    }

    // Store conversation for both users
    const userConversation = { ...newConversation, currentUserId: userId }
    const otherUserConversation = { 
      ...newConversation, 
      id: `conv_${otherUserId}_${userId}`,
      participantId: userId,
      participantName: 'You', // This would be the current user's name from their perspective
      currentUserId: otherUserId
    }

    existingConversations.push(userConversation)
    localStorage.setItem('user_conversations', JSON.stringify(existingConversations))

    return newConversation
  }
}

export default function Conversations() {
  const { user, isAuthenticated } = useUser()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const loadConversations = useCallback(() => {
    if (!user) return

    try {
      // Generate some demo conversations for testing
      const demoConversations = generateDemoConversations(user.id)
      setConversations(demoConversations)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  const loadMessages = useCallback((conversationId: string) => {
    const conversationMessages = conversationsService.getConversationMessages(conversationId)
    
    // If no messages exist, create some demo messages
    if (conversationMessages.length === 0 && selectedConversation) {
      const demoMessages = generateDemoMessages(conversationId, user!.id, selectedConversation.participantId)
      setMessages(demoMessages)
    } else {
      setMessages(conversationMessages)
    }
  }, [selectedConversation, user])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadConversations()
  }, [isAuthenticated, router, loadConversations])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
    }
  }, [selectedConversation, loadMessages])

  const generateDemoConversations = (userId: string): Conversation[] => {
    const testUsers = JSON.parse(localStorage.getItem('makemyknot_test_users') || '[]')
    const demoUsers = testUsers.slice(0, 5) // Take first 5 test users

    return demoUsers.map((testUser: any, index: number) => ({
      id: `conv_${userId}_${testUser.id}`,
      participantId: testUser.id,
      participantName: testUser.name,
      participantImage: testUser.profilePicture || `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${index}.jpg`,
      lastMessage: [
        'Hi! I saw your profile and would love to connect.',
        'Thanks for the like! How are you doing?',
        'I noticed we have similar interests in travel.',
        'Would you like to grab coffee sometime?',
        'Great to meet you! Looking forward to chatting.'
      ][index] || 'Hello there!',
      lastMessageTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time within last week
      unreadCount: Math.floor(Math.random() * 3),
      isOnline: Math.random() > 0.5
    }))
  }

  const generateDemoMessages = (conversationId: string, userId: string, otherUserId: string): Message[] => {
    const demoMessages: Message[] = [
      {
        id: 'demo1',
        conversationId,
        senderId: otherUserId,
        receiverId: userId,
        content: 'Hi! I saw your profile and really liked it. Would love to get to know you better!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true
      },
      {
        id: 'demo2',
        conversationId,
        senderId: userId,
        receiverId: otherUserId,
        content: 'Thanks for reaching out! I&apos;d love to chat too. What got you interested in my profile?',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
        read: true
      },
      {
        id: 'demo3',
        conversationId,
        senderId: otherUserId,
        receiverId: userId,
        content: 'I noticed we both love traveling and have similar career backgrounds. Plus, your photos from the mountains looked amazing!',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        read: true
      }
    ]
    return demoMessages
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return

    const message = conversationsService.sendMessage({
      conversationId: selectedConversation.id,
      senderId: user.id,
      receiverId: selectedConversation.participantId,
      content: newMessage.trim()
    })

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Update conversation in list
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: message.content, lastMessageTime: message.timestamp }
        : conv
    ))
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    const diffDays = diffHours / 24

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`
    if (diffDays < 7) return `${Math.floor(diffDays)}d ago`
    return new Date(date).toLocaleDateString()
  }

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>
  }

  return (
    <>
      <Head>
        <title>Conversations - Make My Knot</title>
        <meta name="description" content="Chat with your matches and build meaningful connections." />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-screen">
            {/* Conversations Sidebar */}
            <div className={`bg-white border-r border-gray-200 ${selectedConversation ? 'hidden md:block md:w-1/3 lg:w-1/4' : 'w-full md:w-1/3 lg:w-1/4'}`}>
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-900 mb-4">Messages</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="overflow-y-auto h-full pb-20">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading conversations...</div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p>No conversations yet</p>
                    <p className="text-sm">Start chatting with your matches!</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation?.id === conversation.id ? 'bg-primary-50 border-primary-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={conversation.participantImage}
                            alt={conversation.participantName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {conversation.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conversation.participantName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessageTime)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.lastMessage || 'No messages yet'}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${selectedConversation ? 'block' : 'hidden md:flex'}`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setSelectedConversation(null)}
                          className="md:hidden text-gray-500 hover:text-gray-700"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </button>
                        <img
                          src={selectedConversation.participantImage}
                          alt={selectedConversation.participantName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">
                            {selectedConversation.participantName}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {selectedConversation.isOnline ? 'Online now' : 'Last seen recently'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100">
                          <Phone className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100">
                          <Video className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            message.senderId === user?.id
                              ? 'bg-primary-600 text-white rounded-br-md'
                              : 'bg-gray-200 text-gray-800 rounded-bl-md'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === user?.id ? 'text-primary-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="bg-white border-t border-gray-200 p-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose a conversation from the sidebar to start chatting</p>
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
