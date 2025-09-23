import type { NextApiRequest, NextApiResponse } from 'next'

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  preferredContactMethod: 'email' | 'phone'
  submittedAt: string
  source: string
}

interface ApiResponse {
  success: boolean
  message: string
  data?: any
  error?: string
}

// Simple in-memory storage for demo purposes
// In production, this should be replaced with a proper database
let contactSubmissions: ContactFormData[] = []

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
  }

  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      preferredContactMethod,
      submittedAt,
      source
    }: ContactFormData = req.body

    // Validation
    const errors: string[] = []

    if (!name?.trim()) {
      errors.push('Name is required')
    }

    if (!email?.trim()) {
      errors.push('Email is required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email address')
    }

    if (!phone?.trim()) {
      errors.push('Phone number is required')
    }

    if (!subject?.trim()) {
      errors.push('Subject is required')
    }

    if (!message?.trim()) {
      errors.push('Message is required')
    } else if (message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long')
    }

    if (!preferredContactMethod || !['email', 'phone'].includes(preferredContactMethod)) {
      errors.push('Invalid preferred contact method')
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.join(', ')
      })
    }

    // Create contact submission record
    const contactSubmission: ContactFormData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      preferredContactMethod,
      submittedAt: submittedAt || new Date().toISOString(),
      source: source || 'contact-form'
    }

    // Store the submission (in production, save to database)
    contactSubmissions.push(contactSubmission)

    // Log for admin dashboard (in production, this would be in a database)
    console.log('New contact form submission:', {
      id: contactSubmissions.length,
      name: contactSubmission.name,
      email: contactSubmission.email,
      subject: contactSubmission.subject,
      submittedAt: contactSubmission.submittedAt
    })

    // In production, you would also:
    // 1. Send an email notification to the admin
    // 2. Send an auto-reply email to the user
    // 3. Store in a database for the admin dashboard
    // 4. Integrate with CRM system
    // 5. Set up webhooks if needed

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return res.status(200).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you within 24 hours.',
      data: {
        submissionId: contactSubmissions.length,
        submittedAt: contactSubmission.submittedAt
      }
    })

  } catch (error) {
    console.error('Contact form submission error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Something went wrong while processing your request'
    })
  }
}

// Export a function to get all contact submissions for admin dashboard
export function getContactSubmissions(): ContactFormData[] {
  return contactSubmissions.map(submission => ({
    ...submission,
    // Don't expose sensitive data in production
    phone: submission.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')
  }))
}

// Export function to get contact submission count
export function getContactSubmissionCount(): number {
  return contactSubmissions.length
}

// Export function to get recent contact submissions
export function getRecentContactSubmissions(limit = 10): ContactFormData[] {
  return contactSubmissions
    .slice(-limit)
    .reverse()
    .map(submission => ({
      ...submission,
      phone: submission.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')
    }))
}