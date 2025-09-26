import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import BrandLogo from '@/components/BrandLogo'

interface SplashScreenProps {
  onComplete?: () => void
  duration?: number
}

export default function SplashScreen({ onComplete, duration = 4000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete?.()
      }, 800) // Allow for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  if (!isVisible && onComplete) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated Silk Background */}
      <div className="absolute inset-0 silk-background">
        <div className="silk-wave-1"></div>
        <div className="silk-wave-2"></div>
        <div className="silk-wave-3"></div>
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-purple-900/30 to-primary-800/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2
          }}
          className="mb-8"
        >
          <div className="relative">
            {/* Glowing effect behind logo */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-purple-400/20 rounded-full blur-3xl scale-150 animate-pulse" />
            <div className="relative p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
              <BrandLogo size="lg" className="drop-shadow-2xl" />
            </div>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.6,
            ease: "easeOut"
          }}
          className="text-4xl md:text-5xl lg:text-6xl font-qasira font-bold text-white mb-6 drop-shadow-2xl"
        >
          Make My <span className="text-gold-300">Knot</span>
        </motion.h1>

        {/* Animated Tagline */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 1, 
            delay: 1.2,
            ease: "easeOut"
          }}
          className="relative"
        >
          {/* Background glow for text */}
          <div className="absolute inset-0 bg-gradient-to-r from-gold-400/20 to-pink-400/20 rounded-2xl blur-xl scale-110" />
          
          <div className="relative bg-white/10 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20">
            <p className="text-lg md:text-xl lg:text-2xl font-semibold text-gold-200 italic leading-relaxed">
              "From{' '}
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1.8,
                  type: "spring",
                  stiffness: 150
                }}
                className="inline-block font-bold bg-gradient-to-r from-gold-200 to-gold-400 bg-clip-text text-transparent"
              >
                Handshakes
              </motion.span>
              {' '}to{' '}
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 2.2,
                  type: "spring",
                  stiffness: 150
                }}
                className="inline-block font-bold bg-gradient-to-r from-red-300 to-pink-300 bg-clip-text text-transparent"
              >
                Pheras
              </motion.span>
              "
            </p>
            
            {/* Animated underline */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ 
                duration: 1, 
                delay: 2.6,
                ease: "easeInOut"
              }}
              className="h-0.5 bg-gradient-to-r from-gold-400 to-pink-400 mx-auto mt-3 rounded-full"
            />
          </div>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="mt-8"
        >
          <div className="flex space-x-2">
            <motion.div
              className="w-3 h-3 bg-gold-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="w-3 h-3 bg-primary-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
            <motion.div
              className="w-3 h-3 bg-pink-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Floating elements for extra magic */}
      <motion.div
        className="absolute top-20 left-10 w-2 h-2 bg-gold-300/60 rounded-full"
        animate={{ 
          y: [0, -20, 0], 
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.5, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-40 right-16 w-3 h-3 bg-pink-300/50 rounded-full"
        animate={{ 
          y: [0, -15, 0], 
          x: [0, 10, 0],
          opacity: [0.4, 0.9, 0.4]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-primary-300/70 rounded-full"
        animate={{ 
          y: [0, -25, 0], 
          opacity: [0.2, 1, 0.2]
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      <motion.div
        className="absolute bottom-20 right-12 w-2 h-2 bg-purple-300/60 rounded-full"
        animate={{ 
          y: [0, -30, 0], 
          x: [0, -15, 0],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{ 
          duration: 3.5, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />
    </motion.div>
  )
}