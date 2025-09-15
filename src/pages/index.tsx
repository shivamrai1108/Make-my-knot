import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Users, MessageCircle, CheckCircle, Star, ArrowRight, ChevronLeft, ChevronRight, Quote, X } from 'lucide-react'
import Footer from '@/components/Footer'
import LeadQuestionnaire from '@/components/LeadQuestionnaire'
import Navigation from '@/components/Navigation'
import NominationMarquee from '@/components/NominationMarquee'
import { NAVIGATION_CONSTANTS } from '@/lib/constants/navigation'
import { useState, useEffect, useRef } from 'react'

// Couple Slider Component
function CoupleSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  
  const couples = [
    {
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop&auto=format',
      names: 'Rajesh & Priya',
      story: 'Found love through shared values in Mumbai, celebrated with a grand Indian wedding in 2023',
      quote: "Make My Knot's AI understood what we were truly looking for. We couldn't be happier!",
      alt: 'Happy couple Rajesh and Priya at their Indian wedding'
    },
    {
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&h=600&fit=crop&auto=format',
      names: 'Arjun & Kavya',
      story: 'Connected across cities, engaged in a beautiful ceremony with both families in 2024',
      quote: 'The compatibility matching was spot-on. We share the same dreams and aspirations!',
      alt: 'Engaged couple Arjun and Kavya at their engagement ceremony'
    },
    {
      image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop&auto=format',
      names: 'Vikram & Sneha',
      story: 'Long-distance match turned into a beautiful partnership, now settled together in Delhi',
      quote: 'Distance meant nothing when we found our perfect match. Thank you Make My Knot!',
      alt: 'Couple Vikram and Sneha celebrating their partnership'
    },
    {
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop&auto=format',
      names: 'Rohit & Ananya',
      story: 'Both medical professionals who found love through compatibility and understanding',
      quote: 'We connected instantly over our shared passion for helping others. Perfect match!',
      alt: 'Medical professionals Rohit and Ananya in traditional attire'
    },
    {
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=600&fit=crop&auto=format',
      names: 'Karan & Meera',
      story: 'Traditional values met modern love, celebrated with a spectacular Rajasthani wedding',
      quote: 'Make My Knot respected our traditions while finding us our soulmate. Incredible!',
      alt: 'Traditional Rajasthani wedding of Karan and Meera'
    },
    {
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&auto=format',
      names: 'Nikhil & Anjali',
      story: 'Childhood friends of families, matched through AI and realized they were meant to be',
      quote: 'Sometimes the perfect match is closer than you think. AI helped us see it!',
      alt: 'Childhood friends Nikhil and Anjali at their wedding'
    }
  ]

  const coupleCount = couples.length

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prevSlide()
      if (e.key === "ArrowRight") nextSlide()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [currentSlide, coupleCount])

  // Autoplay with pause functionality
  useEffect(() => {
    if (isPaused || coupleCount <= 1) return
    autoplayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % coupleCount)
    }, 4000)
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [isPaused, coupleCount])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % coupleCount)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + coupleCount) % coupleCount)
  }

  // Touch handlers for swipe functionality
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const dx = touchStartX.current - touchEndX.current
    const absDx = Math.abs(dx)
    const threshold = 50 // px
    if (absDx > threshold) {
      if (dx > 0) nextSlide()
      else prevSlide()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Happy Couples</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Over 50,000 couples have found love through Make My Knot. Here are some of their beautiful stories.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div 
            className="relative overflow-hidden rounded-3xl shadow-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            aria-roledescription="carousel"
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentSlide * 100}%)`,
                width: `${couples.length * 100}%`
              }}
            >
              {couples.map((couple, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 relative"
                  style={{ width: `${100 / couples.length}%` }}
                >
                  <div className="relative h-96">
                    <Image
                      src={couple.image}
                      alt={couple.names}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h3 className="text-2xl font-bold mb-2">{couple.names}</h3>
                      <p className="text-lg mb-2 text-gray-200">{couple.story}</p>
                      <p className="text-sm italic text-gray-300">"{couple.quote}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {couples.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  index === currentSlide ? 'bg-primary-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Testimonials Section Component
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      age: '28, Marketing Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
      quote: 'I was skeptical about online matchmaking, but Make My Knot changed my perspective completely. The AI understood my preferences better than I did myself!',
      rating: 5
    },
    {
      name: 'Arjun Patel',
      age: '31, Software Engineer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      quote: 'The quality of matches was exceptional. Every profile I received was thoughtfully curated. Found my life partner within 3 months!',
      rating: 5
    },
    {
      name: 'Kavya Reddy',
      age: '26, Doctor',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
      quote: 'The personalized approach made all the difference. My matchmaker understood my busy schedule and found someone who truly complements my lifestyle.',
      rating: 5
    },
    {
      name: 'Rohit Gupta',
      age: '29, Financial Analyst',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
      quote: 'Professional, efficient, and results-driven. The team at Make My Knot goes above and beyond to ensure successful matches.',
      rating: 5
    }
  ]

  return (
    <section id="testimonials" className="relative py-20 overflow-hidden">
      {/* Modern Blush Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-300 via-pink-200 to-purple-300">
        <div className="absolute inset-0 bg-gradient-to-tl from-amber-200/40 via-transparent to-cyan-200/30"></div>
        {/* Animated Background Elements */}
        <div className="absolute top-32 left-16 w-40 h-40 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-56 h-56 bg-rose-400/15 rounded-full blur-3xl animate-bounce" style={{animationDuration: '5s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-purple-300/20 rounded-full blur-xl animate-ping" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">What Our Members Say</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our successful members have to say about their experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 hover:bg-white/80 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/50">
              <div className="flex items-center mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 ring-2 ring-white/50">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 font-medium">{testimonial.age}</p>
                </div>
              </div>
              
              <div className="flex mb-4 justify-center">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gold-500 fill-current mx-0.5" />
                ))}
              </div>
              
              <div className="relative">
                <Quote className="h-8 w-8 text-rose-300 absolute -top-3 -left-3" />
                <p className="text-gray-700 italic pl-5 leading-relaxed font-medium">"{testimonial.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showSplash, setShowSplash] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  
  const couples = [
    {
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1920&h=1080&fit=crop&auto=format',
      gradient: 'bg-gradient-to-br from-purple-600 via-pink-600 to-red-500',
      names: 'Rajesh & Priya',
      story: 'Found love through shared values in Mumbai, celebrated with a grand Indian wedding in 2023',
      quote: "Make My Knot's AI understood what we were truly looking for. We couldn't be happier!"
    },
    {
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=1920&h=1080&fit=crop&auto=format',
      gradient: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600',
      names: 'Arjun & Kavya',
      story: 'Connected across cities, engaged in a beautiful ceremony with both families in 2024',
      quote: 'The compatibility matching was spot-on. We share the same dreams and aspirations!'
    },
    {
      image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1920&h=1080&fit=crop&auto=format',
      gradient: 'bg-gradient-to-br from-green-600 via-teal-600 to-blue-600',
      names: 'Vikram & Sneha',
      story: 'Long-distance match turned into a beautiful partnership, now settled together in Delhi',
      quote: 'Distance meant nothing when we found our perfect match. Thank you Make My Knot!'
    },
    {
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&h=1080&fit=crop&auto=format',
      gradient: 'bg-gradient-to-br from-orange-600 via-red-600 to-pink-600',
      names: 'Rohit & Ananya',
      story: 'Both medical professionals who found love through compatibility and understanding',
      quote: 'We connected instantly over our shared passion for helping others. Perfect match!'
    },
    {
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1920&h=1080&fit=crop&auto=format',
      gradient: 'bg-gradient-to-br from-gold-600 via-primary-600 to-purple-600',
      names: 'Karan & Meera',
      story: 'Traditional values met modern love, celebrated with a spectacular Rajasthani wedding',
      quote: 'Make My Knot respected our traditions while finding us our soulmate. Incredible!'
    },
    {
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop&auto=format',
      gradient: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600',
      names: 'Nikhil & Anjali',
      story: 'Childhood friends of families, matched through AI and realized they were meant to be',
      quote: 'Sometimes the perfect match is closer than you think. AI helped us see it!'
    }
  ]

  // Splash screen effect
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)
    
    const splashTimer = setTimeout(() => {
      setShowSplash(false)
    }, 3500)
    
    return () => {
      clearTimeout(loadTimer)
      clearTimeout(splashTimer)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % couples.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [couples.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % couples.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + couples.length) % couples.length)
  }

  // Splash Screen Component
  if (showSplash) {
    return (
      <>
        <Head>
          <title>Make My Knot - AI-Powered Wedding Matchmaking</title>
          <meta name="description" content="Find your perfect life partner with our AI-powered matchmaking platform. Quality matches, compatibility-based pairing, and personalized service." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-purple-900 flex items-center justify-center relative overflow-hidden">
          {/* Animated Wine Color Background */}
          <div className="absolute inset-0">
            {/* Base animated gradient layers */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-800/80 via-red-700/60 to-red-900/90 animate-pulse" style={{animationDuration: '4s'}}></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-800/70 via-red-600/50 to-red-800/80 animate-pulse" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
            
            {/* Wine color animated elements */}
            <div className="absolute top-20 left-20 w-40 h-40 bg-red-300/20 rounded-full blur-2xl animate-pulse" style={{animationDuration: '5s'}}></div>
            <div className="absolute bottom-32 right-16 w-64 h-64 bg-red-400/15 rounded-full blur-3xl animate-bounce" style={{animationDuration: '4s'}}></div>
            <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-purple-300/20 rounded-full blur-xl animate-ping" style={{animationDelay: '1.5s', animationDuration: '3s'}}></div>
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-red-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-red-600/10 rounded-full blur-xl animate-bounce" style={{animationDelay: '0.8s', animationDuration: '5s'}}></div>
            
            {/* Additional wine-themed floating elements */}
            <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-pulse" style={{animationDelay: '3s', animationDuration: '3.5s'}}></div>
            <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-red-300/25 rounded-full blur-md animate-ping" style={{animationDelay: '2.5s', animationDuration: '4s'}}></div>
          </div>
          
          <div className="relative z-10 text-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-32 h-32 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-2xl p-4 hover:scale-105 transition-all duration-500">
                <Image
                  src="/images/logo.png"
                  alt="Make My Knot Logo"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain animate-pulse"
                  priority
                />
              </div>
            </motion.div>
            
            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mb-6"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 text-shadow-lg">
                <span className="bg-gradient-to-r from-gold-300 to-gold-100 bg-clip-text text-transparent">
                  Make My Knot
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="text-xl text-white/90 font-medium italic"
              >
                From Handshake to Pheras
              </motion.p>
            </motion.div>
            
            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="mb-8"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2 text-white/80">
                  <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <span className="ml-3 text-lg font-medium">Loading your journey...</span>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-white/90"
                >
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-lg font-semibold">Ready to find your perfect match!</span>
                  </div>
                  <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-gold-400 mx-auto rounded-full"></div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Wine-themed Floating Elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 border border-red-200/30 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
            <div className="absolute -bottom-10 -right-10 w-16 h-16 border-2 border-red-300/40 rounded-full animate-ping"></div>
            <div className="absolute top-2/3 left-10 w-12 h-12 border border-purple-200/25 rounded-full animate-pulse" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/3 right-20 w-8 h-8 border-2 border-red-400/35 rounded-full animate-bounce" style={{animationDuration: '3s', animationDelay: '2s'}}></div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Make My Knot - AI-Powered Wedding Matchmaking</title>
        <meta name="description" content="Find your perfect life partner with our AI-powered matchmaking platform. Quality matches, compatibility-based pairing, and personalized service." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <Navigation variant="wine-glass" />

        {/* Hero Section - Questionnaire with Couple Slider Background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ paddingTop: `${NAVIGATION_CONSTANTS.MOBILE_HEIGHT}px` }}>
          {/* Background Couple Slider */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div className="relative w-full h-full">
              <div 
                className="flex transition-transform duration-1000 ease-in-out w-full h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {couples.map((couple, index) => (
                  <div key={index} className="min-w-full flex-shrink-0 relative h-full">
                    {/* Background Image */}
                    <div className={`absolute inset-0 w-full h-full transition-all duration-1000 ${
                      index === currentSlide ? 'scale-100' : 'scale-110'
                    }`}>
                      <Image
                        src={couple.image}
                        alt={couple.names}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                    {/* Gradient overlay for readability */}
                    <div className={`absolute inset-0 w-full h-full ${couple.gradient} opacity-30 transition-all duration-1000`} />
                    {/* Enhanced gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-transparent to-gold-800/20" />
                    
                    {/* Subtle quote overlay */}
                    <div className="absolute bottom-16 right-8 left-8 text-center z-10 pointer-events-none">
                      <div className={`transition-all duration-1000 transform ${
                        index === currentSlide 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-8'
                      }`}>
                        <h3 className="text-white/90 text-lg md:text-xl font-semibold mb-2">
                          {couple.names}
                        </h3>
                        <p className="text-white/70 text-sm md:text-base italic max-w-2xl mx-auto">
                          &ldquo;{couple.quote}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Questionnaire Content */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-20"
          >
            <div className="flex justify-start items-center min-h-[600px]">
              {/* Left Aligned Glass Questionnaire */}
              <div className="w-full max-w-lg ml-8 lg:ml-16">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                    Start Your Journey
                  </h2>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                    className="mb-6"
                  >
                    <p className="text-lg text-gold-200 font-medium italic leading-relaxed">
                      "From handshake to pheras, let us guide your journey to love and lifelong happiness."
                    </p>
                  </motion.div>
                  <p className="text-gray-200 leading-relaxed">
                    Answer a few questions to help us find your perfect match
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <LeadQuestionnaire />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Slider Navigation */}
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSlide}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 border border-white/30 text-white p-4 rounded-full backdrop-blur-md transition-all duration-300 z-20 shadow-2xl"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 border border-white/30 text-white p-4 rounded-full backdrop-blur-md transition-all duration-300 z-20 shadow-2xl"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>

          {/* Enhanced Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
            {couples.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full border-2 ${
                  index === currentSlide 
                    ? 'w-4 h-4 bg-gold-400 border-gold-300 shadow-lg shadow-gold-400/50 scale-125' 
                    : 'w-3 h-3 bg-white/40 border-white/60 hover:bg-white/60 hover:scale-110'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Nomination Marquee */}
        <NominationMarquee />

        {/* Promotions Section */}
        <section className="py-16 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-70 translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-white">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Launch Offer
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  15 Days Free
                  <span className="block">Membership! 🎉</span>
                </h2>
                
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Be among the first 100 customers to experience our premium matchmaking service. 
                  Get 15 days of complete access to find your perfect match!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Link href="/signup" className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg text-center">
                    Claim Free 15 Days
                  </Link>
                  <div className="flex items-center text-white/90 text-sm">
                    <Users className="h-5 w-5 mr-2" />
                    <span>Only 100 spots available</span>
                  </div>
                </div>
                
                <div className="text-sm text-white/80">
                  🚀 Launch Special • First 100 customers only • No payment required
                </div>
              </div>
              
              {/* Right Content - Floating Cards */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4 transform rotate-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                    <div className="w-12 h-12 bg-white/20 rounded-full mb-3 flex items-center justify-center">
                      <Heart className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-1">Verified Profiles</h4>
                    <p className="text-sm text-white/80">100% authentic matches</p>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white transform rotate-12 hover:rotate-0 transition-transform duration-300 mt-8">
                    <div className="w-12 h-12 bg-white/20 rounded-full mb-3 flex items-center justify-center">
                      <Star className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-1">AI Matching</h4>
                    <p className="text-sm text-white/80">Smart compatibility</p>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                    <div className="w-12 h-12 bg-white/20 rounded-full mb-3 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-1">Success Rate</h4>
                    <p className="text-sm text-white/80">91% find matches</p>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white transform rotate-6 hover:rotate-0 transition-transform duration-300 -mt-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full mb-3 flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-1">Community</h4>
                    <p className="text-sm text-white/80">50,000+ members</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Your Perfect Life Partner Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background with Image and Video */}
          <div className="absolute inset-0">
            {/* Background Image as Primary */}
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop&auto=format"
              alt="Beautiful Indian wedding celebration background"
              fill
              className="object-cover"
              priority
            />
            
            {/* Wedding Video Overlay - Only loads if supported */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              style={{ mixBlendMode: 'soft-light' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            >
              <source src="https://sample-videos.com/zip/10/mp4/480/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
              <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
              <source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" type="video/mp4" />
            </video>
            
            {/* Enhanced Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-primary-900/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-pink-900/20" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Meet Your <span className="text-gold-400">Perfect</span><br />
                Life Partner
              </motion.h2>
              
              {/* Animated Tagline */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative mb-8"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg max-w-4xl mx-auto">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-2xl lg:text-3xl font-semibold text-gold-300 italic leading-relaxed"
                  >
                    "From handshake to pheras, let us guide your journey to love and lifelong happiness."
                  </motion.p>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100px' }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="h-1 bg-gradient-to-r from-gold-400 to-gold-200 mx-auto mt-4 rounded-full"
                  />
                </div>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-xl text-gray-200 mb-8 leading-relaxed max-w-4xl mx-auto"
              >
                50 years of matchmaking expertise now powered by AI. We understand your values, lifestyle, and what truly matters to you.
              </motion.p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
                <Link href="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/about" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center">
                  Our Story
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-12 text-sm text-gray-200 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  <span className="font-semibold">91% success rate</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-gold-400 mr-2" />
                  <span className="font-semibold">4.9/5 rating</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary-300 mr-2" />
                  <span className="font-semibold">50,000+ happy couples</span>
                </div>
              </div>

              {/* Enhanced Webinar Announcement with Speaker Photo and Animated Background */}
              <div className="max-w-lg mx-auto relative overflow-hidden rounded-3xl">
                {/* Animated Background */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-blue-600/70 via-transparent to-green-500/70 animate-bounce" style={{animationDuration: '3s'}}></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/30 to-primary-600/30"></div>
                  {/* Floating particles effect */}
                  <div className="absolute top-4 left-4 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
                  <div className="absolute top-8 right-8 w-3 h-3 bg-gold-300/50 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-6 left-8 w-2 h-2 bg-pink-300/60 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-blue-300/50 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 p-6 text-white">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-semibold text-white uppercase tracking-wide">Live This Week</span>
                  </div>
                  
                  {/* Speaker Photo */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white/30 shadow-lg">
                        <Image
                          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=faces&auto=format"
                          alt="Dr. Sarah Mitchell - Relationship Expert"
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-center mb-2">Relationship Mastery Webinar</h3>
                  <p className="text-center text-white/90 text-sm mb-1 font-medium">with Dr. Sarah Mitchell</p>
                  <p className="text-center text-white/80 text-sm mb-6">Join our expert therapist for insights on building lasting relationships</p>
                  
                  <Link href="/webinars" className="block w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-center border border-white/30 hover:border-white/50">
                    Register Free 🎯
                  </Link>
                  
                  <div className="flex items-center justify-center mt-3 text-xs text-white/70">
                    <Users className="h-3 w-3 mr-1" />
                    <span>247 already registered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How Make My Knot Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our intelligent matching process ensures you meet people who truly align with your values and life goals
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-primary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Meet Your Matchmaker</h3>
                <p className="text-gray-600">
                  Have a conversation with your AI matchmaker about your values, lifestyle, and what you're looking for in a life partner.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-gold-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Curated Matches</h3>
                <p className="text-gray-600">
                  Receive 3-5 carefully selected profiles each week, chosen based on deep compatibility rather than just photos.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect & Meet</h3>
                <p className="text-gray-600">
                  When both parties are interested, your matchmaker introduces you personally and helps facilitate your first meeting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Happy Couples Slider */}
        <CoupleSlider />

        {/* The Make My Knot Difference Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Modern Vibrant Blush-tone Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-300 to-purple-400">
            <div className="absolute inset-0 bg-gradient-to-tl from-peach-300/40 via-transparent to-lavender-200/50"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-coral-200/30 via-transparent to-blush-300/40"></div>
            {/* Enhanced Animated Background Elements */}
            <div className="absolute top-16 left-12 w-40 h-40 bg-white/15 rounded-full blur-2xl animate-pulse" style={{animationDuration: '3s'}}></div>
            <div className="absolute bottom-20 right-16 w-64 h-64 bg-rose-300/20 rounded-full blur-3xl animate-bounce" style={{animationDuration: '6s'}}></div>
            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-pink-200/25 rounded-full blur-xl animate-ping" style={{animationDelay: '0.5s', animationDuration: '4s'}}></div>
            <div className="absolute bottom-1/3 left-1/5 w-48 h-48 bg-purple-200/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
            <div className="absolute top-3/4 left-2/3 w-28 h-28 bg-coral-300/30 rounded-full blur-lg animate-bounce" style={{animationDelay: '1.5s', animationDuration: '4s'}}></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                The <span className="text-gold-300">Make My Knot</span> Difference
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Why thousands choose us over traditional dating apps and other matchmaking services
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {/* AI-Powered Matching */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <MessageCircle className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute top-0 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Precision</h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Our advanced algorithm analyzes 50+ compatibility factors, from deep personality traits to life goals, ensuring every match has real potential.
                </p>
                <ul className="text-sm text-white/70 space-y-2 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Psychological compatibility analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Values and lifestyle alignment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Future goals compatibility
                  </li>
                </ul>
              </div>

              {/* Human Touch */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute top-0 left-1/4 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Personal Touch</h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Unlike apps that leave you swiping endlessly, our dedicated relationship experts provide personalized guidance throughout your journey.
                </p>
                <ul className="text-sm text-white/70 space-y-2 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Dedicated relationship advisor
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Profile optimization support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Date coaching and feedback
                  </li>
                </ul>
              </div>

              {/* Quality Over Quantity */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <Star className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-1/4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Quality Over Quantity</h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  We focus on meaningful connections, not endless scrolling. Every profile is verified, and every match is curated with intention.
                </p>
                <ul className="text-sm text-white/70 space-y-2 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    100% verified profiles
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Background checks available
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Curated, not random matches
                  </li>
                </ul>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-primary-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">Results That Speak</h3>
                <p className="text-primary-100 text-lg">Our track record of creating lasting relationships</p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">91%</div>
                  <div className="text-primary-200">Success Rate</div>
                  <div className="text-sm text-primary-100 mt-1">Find meaningful matches</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">3.2M</div>
                  <div className="text-primary-200">Average Days</div>
                  <div className="text-sm text-primary-100 mt-1">To first quality match</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">87%</div>
                  <div className="text-primary-200">Go on Dates</div>
                  <div className="text-sm text-primary-100 mt-1">Within first month</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">2.1K+</div>
                  <div className="text-primary-200">Weddings</div>
                  <div className="text-sm text-primary-100 mt-1">Celebrated this year</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-3xl"></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl opacity-70"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl opacity-70"></div>
          
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6 text-shadow-lg">
              Ready to Find Your
              <span className="block mt-2 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Life Partner?</span>
            </h2>
            <p className="text-xl text-slate-200 mb-8">
              Join thousands of people who have found meaningful relationships through our premium matchmaking platform.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
            >
              Start Your Journey Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
