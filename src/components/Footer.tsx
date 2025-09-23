import { Heart, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Smartphone, Monitor } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 mr-2 flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Make My Knot Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold">{t('footer.company', 'Make My Knot')}</span>
            </div>
            <p className="text-gray-400 mb-6">
              {t('footer.tagline', 'Where Hearts Meet Intelligence')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks', 'Quick Links')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.links.howItWorks', 'How It Works')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.links.successStories', 'Success Stories')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Safety</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.links.blog', 'Blog')}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community Guidelines</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-primary-400 mr-3" />
                <span className="text-gray-400">hello@makemyknot.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary-400 mr-3" />
                <span className="text-gray-400">+91 98765 43210</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-400 mr-3 mt-0.5" />
                <span className="text-gray-400">
                  Noida, India<br />
                  Serving users globally
                </span>
              </div>
            </div>
            
            {/* App Download */}
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-3">Download Our App</h4>
              <div className="space-y-3">
                <a 
                  href="#" 
                  className="flex items-center bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors group"
                >
                  <div className="bg-white rounded p-1 mr-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 21.99C7.78997 22.03 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
                
                <a 
                  href="#" 
                  className="flex items-center bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors group"
                >
                  <div className="bg-white rounded p-1 mr-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" fill="#4285f4"/>
                      <path d="M14.54,11.15L16.81,8.88L6.05,2.66L14.54,11.15Z" fill="#ea4335"/>
                      <path d="M14.54,12.85L16.81,15.12L6.05,21.34L14.54,12.85Z" fill="#fbbc04"/>
                      <path d="M14.54,11.15L6.05,2.66L14.54,12.85L6.05,21.34L14.54,11.15Z" fill="#34a853"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Make My Knot. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
