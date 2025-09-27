import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

interface WebinarRegistration {
  id: string
  webinarId: string
  webinarTitle: string
  name: string
  email: string
  phone: string
  relationshipStatus: string
  interests: string
  marketingConsent: boolean
  registrationDate: string
  ipAddress?: string
  userAgent?: string
}

// File path to store registrations
const REGISTRATIONS_FILE = path.join(process.cwd(), 'data', 'webinar-registrations.json')

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read existing registrations
const readRegistrations = (): WebinarRegistration[] => {
  ensureDataDirectory()
  try {
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const data = fs.readFileSync(REGISTRATIONS_FILE, 'utf8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error reading registrations:', error)
    return []
  }
}

// Write registrations to file
const writeRegistrations = (registrations: WebinarRegistration[]) => {
  ensureDataDirectory()
  try {
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2))
  } catch (error) {
    console.error('Error writing registrations:', error)
    throw new Error('Failed to save registration')
  }
}

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Get webinar title from ID
const getWebinarTitle = (webinarId: string): string => {
  const webinarTitles: Record<string, string> = {
    '1': 'Building Stronger Marriages: Communication That Works',
    '2': 'Pre-Marriage Counseling: Starting Right Together',
    '3': 'Healing After Heartbreak: Moving Forward with Hope',
    '4': 'Love Languages: Speaking Your Partner\'s Heart',
    '5': 'Arranged Marriages: Making Modern Connections Work',
    '6': 'Long Distance Relationships: Staying Connected'
  }
  return webinarTitles[webinarId] || 'Unknown Webinar'
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        webinarId,
        name,
        email,
        phone,
        relationshipStatus,
        interests,
        marketingConsent
      } = req.body

      // Validate required fields
      if (!webinarId || !name || !email || !phone || !relationshipStatus) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        })
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        })
      }

      // Read existing registrations
      const registrations = readRegistrations()

      // Check if email already registered for this webinar
      const existingRegistration = registrations.find(
        r => r.email === email && r.webinarId === webinarId
      )

      if (existingRegistration) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered for this webinar'
        })
      }

      // Create new registration
      const newRegistration: WebinarRegistration = {
        id: generateId(),
        webinarId,
        webinarTitle: getWebinarTitle(webinarId),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        relationshipStatus,
        interests: interests || '',
        marketingConsent: !!marketingConsent,
        registrationDate: new Date().toISOString(),
        ipAddress: req.headers['x-forwarded-for'] as string || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
      }

      // Add to registrations array
      registrations.push(newRegistration)

      // Save to file
      writeRegistrations(registrations)

      // Log registration for monitoring
      console.log(`New webinar registration: ${email} for webinar ${webinarId}`)

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          id: newRegistration.id,
          webinarTitle: newRegistration.webinarTitle,
          registrationDate: newRegistration.registrationDate
        }
      })

    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  } else if (req.method === 'GET') {
    // Get registrations for admin panel
    try {
      const registrations = readRegistrations()
      
      // Return sanitized data (remove sensitive info for non-admin requests)
      const sanitizedRegistrations = registrations.map(reg => ({
        id: reg.id,
        webinarId: reg.webinarId,
        webinarTitle: reg.webinarTitle,
        name: reg.name,
        email: reg.email,
        phone: reg.phone,
        relationshipStatus: reg.relationshipStatus,
        interests: reg.interests,
        marketingConsent: reg.marketingConsent,
        registrationDate: reg.registrationDate
      }))

      res.status(200).json({
        success: true,
        data: sanitizedRegistrations,
        total: sanitizedRegistrations.length
      })
    } catch (error) {
      console.error('Error fetching registrations:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch registrations'
      })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
  }
}