import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, Users, FileText, Globe, Mail, Phone, MessageCircle } from 'lucide-react'
import Footer from '@/components/Footer'
import BrandLogo from '@/components/BrandLogo'

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Make My Knot | Your Data Protection & Privacy Rights</title>
        <meta name="description" content="Learn how Make My Knot protects your personal information, manages your data, and respects your privacy rights. Our comprehensive privacy policy ensures transparency and security." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              <Link href="/" className="flex items-center">
                <BrandLogo size="sm" className="mr-2" />
                <span className="text-xl font-qasira font-bold text-gray-900">Make My Knot</span>
              </Link>
              <Link href="/" className="flex items-center text-gray-700 hover:text-primary-600 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </nav>

        {/* Header */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-primary-100">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <div className="mt-4 text-sm text-primary-200">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Introduction */}
            <div className="mb-12">
              <div className="bg-primary-50 rounded-lg p-6 border-l-4 border-primary-600">
                <h2 className="text-2xl font-bold text-primary-900 mb-4">Our Commitment to Your Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  At Make My Knot, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our matchmaking services, 
                  website, and mobile applications.
                </p>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-primary-600" />
                Table of Contents
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2">
                  <li><a href="#information-collection" className="text-primary-600 hover:text-primary-800 font-medium">1. Information We Collect</a></li>
                  <li><a href="#information-use" className="text-primary-600 hover:text-primary-800 font-medium">2. How We Use Your Information</a></li>
                  <li><a href="#information-sharing" className="text-primary-600 hover:text-primary-800 font-medium">3. Information Sharing and Disclosure</a></li>
                  <li><a href="#data-security" className="text-primary-600 hover:text-primary-800 font-medium">4. Data Security</a></li>
                  <li><a href="#your-rights" className="text-primary-600 hover:text-primary-800 font-medium">5. Your Privacy Rights</a></li>
                  <li><a href="#data-retention" className="text-primary-600 hover:text-primary-800 font-medium">6. Data Retention</a></li>
                  <li><a href="#international-transfers" className="text-primary-600 hover:text-primary-800 font-medium">7. International Data Transfers</a></li>
                  <li><a href="#changes" className="text-primary-600 hover:text-primary-800 font-medium">8. Changes to This Policy</a></li>
                  <li><a href="#contact" className="text-primary-600 hover:text-primary-800 font-medium">9. Contact Us</a></li>
                </ul>
              </div>
            </div>

            {/* Information Collection */}
            <div id="information-collection" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="h-6 w-6 mr-3 text-primary-600" />
                1. Information We Collect
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Name, age, gender, and contact information (email, phone number)</li>
                    <li>Location and address details</li>
                    <li>Educational and professional background</li>
                    <li>Physical attributes and preferences</li>
                    <li>Lifestyle information and interests</li>
                    <li>Family background and values</li>
                    <li>Photos and profile information</li>
                    <li>Biodata and matrimonial preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Technical Information</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Device information and identifiers</li>
                    <li>IP address and location data</li>
                    <li>Usage patterns and app interactions</li>
                    <li>Browser type and operating system</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Information Use */}
            <div id="information-use" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="h-6 w-6 mr-3 text-primary-600" />
                2. How We Use Your Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Matchmaking Services</h3>
                  <ul className="list-disc list-inside space-y-2 text-blue-800 text-sm">
                    <li>AI-powered compatibility matching</li>
                    <li>Profile suggestions and recommendations</li>
                    <li>Personalized matchmaking services</li>
                    <li>Communication facilitation</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Service Improvement</h3>
                  <ul className="list-disc list-inside space-y-2 text-green-800 text-sm">
                    <li>Platform optimization and enhancement</li>
                    <li>User experience personalization</li>
                    <li>Algorithm improvement</li>
                    <li>Customer support and assistance</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Communication</h3>
                  <ul className="list-disc list-inside space-y-2 text-purple-800 text-sm">
                    <li>Service updates and notifications</li>
                    <li>Marketing communications (with consent)</li>
                    <li>Important account information</li>
                    <li>Customer support responses</li>
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">Legal & Safety</h3>
                  <ul className="list-disc list-inside space-y-2 text-orange-800 text-sm">
                    <li>Fraud prevention and security</li>
                    <li>Legal compliance requirements</li>
                    <li>Terms of service enforcement</li>
                    <li>Safety and abuse prevention</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Information Sharing */}
            <div id="information-sharing" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Information Sharing and Disclosure</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                <div className="flex items-center mb-2">
                  <Lock className="h-5 w-5 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-semibold text-yellow-800">We Never Sell Your Personal Data</h3>
                </div>
                <p className="text-yellow-700">
                  Your personal information is never sold to third parties. We only share information in specific circumstances outlined below.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">With Other Users (Controlled Sharing)</h4>
                  <p className="text-gray-700 text-sm">Profile information shared for matchmaking purposes with your consent and privacy settings control.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Service Providers</h4>
                  <p className="text-gray-700 text-sm">Trusted third parties who help us operate our services (cloud hosting, payment processing, customer support).</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Legal Requirements</h4>
                  <p className="text-gray-700 text-sm">When required by law, court order, or to protect our rights and safety.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Business Transfers</h4>
                  <p className="text-gray-700 text-sm">In connection with mergers, acquisitions, or asset sales (with notice to you).</p>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div id="data-security" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lock className="h-6 w-6 mr-3 text-primary-600" />
                4. Data Security
              </h2>
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary-900 mb-3">Technical Safeguards</h3>
                    <ul className="list-disc list-inside space-y-1 text-primary-800 text-sm">
                      <li>SSL/TLS encryption for data transmission</li>
                      <li>Advanced encryption for stored data</li>
                      <li>Regular security audits and assessments</li>
                      <li>Secure cloud infrastructure</li>
                      <li>Multi-factor authentication options</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary-900 mb-3">Organizational Measures</h3>
                    <ul className="list-disc list-inside space-y-1 text-primary-800 text-sm">
                      <li>Limited employee access to personal data</li>
                      <li>Regular staff training on privacy practices</li>
                      <li>Incident response procedures</li>
                      <li>Privacy by design principles</li>
                      <li>Continuous monitoring and improvement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div id="your-rights" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Your Privacy Rights</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-primary-600" />
                    Access Your Data
                  </h4>
                  <p className="text-gray-700 text-sm">Request a copy of the personal information we hold about you.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary-600" />
                    Correct Information
                  </h4>
                  <p className="text-gray-700 text-sm">Update or correct inaccurate personal information.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary-600" />
                    Delete Your Account
                  </h4>
                  <p className="text-gray-700 text-sm">Request deletion of your account and associated data.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-primary-600" />
                    Limit Processing
                  </h4>
                  <p className="text-gray-700 text-sm">Restrict how we process your personal information.</p>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>How to Exercise Your Rights:</strong> Contact our privacy team at{' '}
                  <a href="mailto:privacy@makemyknot.com" className="text-primary-600 hover:text-primary-800">privacy@makemyknot.com</a>
                  {' '}or call us at{' '}
                  <a href="tel:+919315643044" className="text-primary-600 hover:text-primary-800">+91 93156 43044</a>.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div id="data-retention" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Data Retention</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  We retain your personal information only for as long as necessary to provide our services and fulfill legal obligations:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Active Accounts:</strong> Data retained while your account is active and for a reasonable period afterward</li>
                  <li><strong>Inactive Accounts:</strong> Data may be deleted after 2 years of inactivity (with prior notice)</li>
                  <li><strong>Legal Requirements:</strong> Some data may be retained longer to comply with legal obligations</li>
                  <li><strong>Account Deletion:</strong> Most data deleted within 30 days of account deletion request</li>
                </ul>
              </div>
            </div>

            {/* International Transfers */}
            <div id="international-transfers" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="h-6 w-6 mr-3 text-primary-600" />
                7. International Data Transfers
              </h2>
              <div className="border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  As we serve users globally, your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Compliance with applicable data protection laws</li>
                  <li>Standard contractual clauses with service providers</li>
                  <li>Adequate protection measures for cross-border transfers</li>
                  <li>Regular assessment of transfer mechanisms</li>
                </ul>
              </div>
            </div>

            {/* Changes to Policy */}
            <div id="changes" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Changes to This Privacy Policy</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800 mb-3">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons.
                </p>
                <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                  <li>Material changes will be notified via email or prominent notice on our platform</li>
                  <li>The "Last Updated" date will reflect the most recent revision</li>
                  <li>Continued use of our services constitutes acceptance of the updated policy</li>
                  <li>Previous versions available upon request</li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div id="contact" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Contact Us</h2>
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6">Have Questions About Your Privacy?</h3>
                <p className="mb-6 text-primary-100">
                  Our privacy team is here to help. Contact us for any questions, concerns, or requests regarding your personal information.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-primary-100">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-primary-300" />
                        <span>privacy@makemyknot.com</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-primary-300" />
                        <span>+91 93156 43044</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-2 text-primary-300" />
                        <a href="https://wa.me/919315643044" className="hover:text-white transition-colors">WhatsApp Support</a>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-primary-100">Mailing Address</h4>
                    <div className="text-sm">
                      <p>Make My Knot</p>
                      <p>NPX URBTECH</p>
                      <p>99-100, 7th Floor, Sector 153</p>
                      <p>Noida - 201304, India</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-primary-500">
                  <p className="text-sm text-primary-200">
                    <strong>Response Time:</strong> We aim to respond to all privacy inquiries within 48 hours during business days.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}