import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Supported languages
export const LANGUAGES = {
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
  hi: { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
} as const

export type LanguageCode = keyof typeof LANGUAGES

interface LanguageContextType {
  currentLanguage: LanguageCode
  setLanguage: (language: LanguageCode) => void
  t: (key: string, fallback?: string) => string
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation storage
let translations: Record<LanguageCode, any> = {
  en: {},
  hi: {}
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en')
  const [isLoading, setIsLoading] = useState(false)

  // Load translations from localStorage or default to English
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as LanguageCode
    if (savedLanguage && LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  // Load translation files dynamically
  const loadTranslations = async (language: LanguageCode) => {
    if (translations[language] && Object.keys(translations[language]).length > 0) {
      return translations[language]
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/locales/${language}.json`)
      if (response.ok) {
        const data = await response.json()
        translations[language] = data
        return data
      } else {
        console.warn(`Translation file for ${language} not found, falling back to English`)
        return translations.en
      }
    } catch (error) {
      console.error(`Error loading translations for ${language}:`, error)
      return translations.en
    } finally {
      setIsLoading(false)
    }
  }

  // Set language and persist to localStorage
  const setLanguage = async (language: LanguageCode) => {
    setCurrentLanguage(language)
    localStorage.setItem('preferred-language', language)
    await loadTranslations(language)
  }

  // Translation function
  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.')
    let value: any = translations[currentLanguage]

    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }

    if (value === undefined && currentLanguage !== 'en') {
      // Fallback to English
      let englishValue: any = translations.en
      for (const k of keys) {
        englishValue = englishValue?.[k]
        if (englishValue === undefined) break
      }
      value = englishValue
    }

    return value || fallback || key
  }

  // Initialize English translations on mount
  useEffect(() => {
    loadTranslations('en')
  }, [])

  // Load translations when language changes
  useEffect(() => {
    if (currentLanguage !== 'en') {
      loadTranslations(currentLanguage)
    }
  }, [currentLanguage])

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        isLoading
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}