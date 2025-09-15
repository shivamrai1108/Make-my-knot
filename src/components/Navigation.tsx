import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

interface NavigationProps {
  variant?: 'transparent' | 'white' | 'dark' | 'wine-glass'
  className?: string
}

export default function Navigation({ variant = 'transparent', className = '' }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const baseClasses = variant === 'transparent' 
    ? 'fixed w-full z-[100] top-0' 
    : variant === 'wine-glass'
    ? 'fixed w-full z-[100] top-0 bg-gradient-to-r from-red-900/30 via-red-800/25 to-purple-900/30 backdrop-blur-md border-b border-red-200/20 shadow-lg'
    : variant === 'dark'
    ? 'bg-gray-900 border-b border-gray-800 relative z-[100]'
    : 'bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-[100]'

  const textColor = variant === 'dark' ? 'text-white' : variant === 'transparent' ? 'text-white' : variant === 'wine-glass' ? 'text-white' : 'text-gray-900'
  const linkColor = variant === 'dark' 
    ? 'text-gray-300 hover:text-white' 
    : variant === 'transparent'
    ? 'text-gray-100 hover:text-white'
    : variant === 'wine-glass'
    ? 'text-gray-100 hover:text-white hover:text-gold-200'
    : 'text-gray-700 hover:text-primary-600'

  return (
    <nav className={`${baseClasses} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <BrandLogo size="md" className="mr-2" />
            <span className={`text-2xl font-bold ${textColor}`}>Make My Knot</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className={`${linkColor} transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-white/20 active:bg-white/30 font-medium cursor-pointer pointer-events-auto`}>
              Home
            </Link>
            <Link href="/#how-it-works" className={`${linkColor} transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-white/20 active:bg-white/30 font-medium cursor-pointer pointer-events-auto whitespace-nowrap`}>
              How It Works
            </Link>
            <Link href="/about" className={`${linkColor} transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-white/20 active:bg-white/30 font-medium cursor-pointer pointer-events-auto`}>
              Our Story
            </Link>
            <Link href="/#testimonials" className={`${linkColor} transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-white/20 active:bg-white/30 font-medium cursor-pointer pointer-events-auto whitespace-nowrap`}>
              Success Stories
            </Link>
            <Link href="/webinars" className={`${linkColor} transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-white/20 active:bg-white/30 font-medium cursor-pointer pointer-events-auto`}>
              Webinars
            </Link>
            
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${textColor} hover:text-primary-600 transition-all duration-200 p-3 rounded-lg hover:bg-white/20 active:bg-white/30 transform hover:scale-110 active:scale-95 touch-manipulation`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t ${variant === 'wine-glass' ? 'border-red-200/30' : 'border-white/20'} relative z-[110]`}>
            <div className="flex flex-col space-y-1">
              <Link 
                href="/" 
                className={`${linkColor} transition-all duration-200 px-4 py-4 rounded-lg hover:bg-white/10 active:bg-white/20 font-medium text-base block touch-manipulation`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/#how-it-works" 
                className={`${linkColor} transition-all duration-200 px-4 py-4 rounded-lg hover:bg-white/10 active:bg-white/20 font-medium text-base block touch-manipulation`}
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                href="/about" 
                className={`${linkColor} transition-all duration-200 px-4 py-4 rounded-lg hover:bg-white/10 active:bg-white/20 font-medium text-base block touch-manipulation`}
                onClick={() => setIsMenuOpen(false)}
              >
                Our Story
              </Link>
              <Link 
                href="/#testimonials" 
                className={`${linkColor} transition-all duration-200 px-4 py-4 rounded-lg hover:bg-white/10 active:bg-white/20 font-medium text-base block touch-manipulation`}
                onClick={() => setIsMenuOpen(false)}
              >
                Success Stories
              </Link>
              <Link 
                href="/webinars" 
                className={`${linkColor} transition-all duration-200 px-4 py-4 rounded-lg hover:bg-white/10 active:bg-white/20 font-medium text-base block touch-manipulation`}
                onClick={() => setIsMenuOpen(false)}
              >
                Webinars
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
