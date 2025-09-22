import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { useLanguage, LANGUAGES, LanguageCode } from '@/contexts/LanguageContext'

interface LanguageSelectorProps {
  className?: string
  variant?: 'default' | 'mobile'
  theme?: 'light' | 'dark' | 'wine-glass'
}

export default function LanguageSelector({ className = '', variant = 'default', theme = 'light' }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage, isLoading } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle language selection
  const handleLanguageSelect = async (languageCode: LanguageCode) => {
    setIsOpen(false)
    await setLanguage(languageCode)
  }

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, languageCode: LanguageCode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleLanguageSelect(languageCode)
    } else if (event.key === 'Escape') {
      setIsOpen(false)
      buttonRef.current?.focus()
    }
  }

  const currentLang = LANGUAGES[currentLanguage]
  
  // Theme-based styling
  const getButtonClasses = () => {
    const base = "flex items-center space-x-2 px-3 py-2 transition-all duration-200 text-sm font-medium touch-manipulation"
    switch (theme) {
      case 'wine-glass':
        return `${base} text-gray-100 hover:text-white hover:bg-white/10 active:bg-white/20 rounded-md`
      case 'dark':
        return `${base} text-gray-300 hover:text-white hover:bg-white/10 rounded-md`
      default:
        return `${base} text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md`
    }
  }

  if (variant === 'mobile') {
    return (
      <div className={`relative ${className}`}>
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className={getButtonClasses()}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={isLoading}
        >
          <Globe className="h-4 w-4" />
          <span>{currentLang.flag} {currentLang.name}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="fixed inset-x-4 top-auto mt-2 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-xl z-[9999] py-2 max-h-64 overflow-y-auto"
            role="listbox"
            style={{
              top: buttonRef.current ? `${buttonRef.current.getBoundingClientRect().bottom + window.scrollY + 8}px` : 'auto'
            }}
          >
            {Object.entries(LANGUAGES).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => handleLanguageSelect(code as LanguageCode)}
                onKeyDown={(e) => handleKeyDown(e, code as LanguageCode)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center space-x-3 touch-manipulation ${
                  currentLanguage === code ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700'
                }`}
                role="option"
                aria-selected={currentLanguage === code}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {currentLanguage === code && (
                  <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-600 transition-all duration-200 rounded-lg hover:bg-gray-50 text-sm font-medium"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={isLoading}
      >
        <Globe className="h-4 w-4" />
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2 backdrop-blur-sm"
          role="listbox"
        >
          {Object.entries(LANGUAGES).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => handleLanguageSelect(code as LanguageCode)}
              onKeyDown={(e) => handleKeyDown(e, code as LanguageCode)}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3 ${
                currentLanguage === code ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
              }`}
              role="option"
              aria-selected={currentLanguage === code}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {currentLanguage === code && (
                <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}