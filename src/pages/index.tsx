import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Users, MessageCircle, CheckCircle, Star, ArrowRight, Quote, X } from 'lucide-react'
import Footer from '@/components/Footer'
import LeadQuestionnaire from '@/components/LeadQuestionnaire'
import Navigation from '@/components/Navigation'
import NominationMarquee from '@/components/NominationMarquee'
import { NAVIGATION_CONSTANTS } from '@/lib/constants/navigation'
import { useState, useEffect, useRef } from 'react'

// Image Slider Component
function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const slidesRef = useRef<HTMLDivElement>(null)
  
  // Image data - using your existing images
  const images = [
    '/images/1.svg',
    '/images/2.svg', 
    '/images/3.svg'
  ]
  
  const showSlide = (index: number) => {
    if (index < 0) {
      setCurrentIndex(images.length - 1)
    } else if (index >= images.length) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex(index)
    }
  }
  
  // Navigation functions
  const prevSlide = () => showSlide(currentIndex - 1)
  const nextSlide = () => showSlide(currentIndex + 1)
  
  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
  }
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const diff = startX - endX
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
  }
  
  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
  }
  
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const endX = e.clientX
    const diff = startX - endX
    
    if (Math.abs(diff) > 50) { // Minimum drag distance
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
    
    setIsDragging(false)
  }
  
  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)
    
    return () => clearInterval(timer)
  }, [currentIndex])
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Slides Container */}
      <div 
        ref={slidesRef}
        className="flex transition-transform duration-300 ease-in-out cursor-grab active:cursor-grabbing h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img 
              src={image} 
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>
      
      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 z-30"
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 z-30"
        aria-label="Next slide"
      >
        &#10095;
      </button>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// Success Stories Carousel Component
function SuccessStoriesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  
  // Success stories with couple testimonials
  const stories = [
    {
      image: '/images/pic1.jpg',
      names: 'Rahul & Aishwarya',
      location: 'Mumbai, Maharashtra',
      testimonial: 'When we first connected on Make My Knot, it felt like our hearts recognized each other. Every conversation, every laugh, every shared dream brought us closer. Today, we know our knot isn\'t just a bond—it\'s forever.',
      rating: 5
    },
    {
      image: '/images/pic2.jpg',
      names: 'Nitin & Preeti',
      location: 'Delhi, India',
      testimonial: 'We were just looking for someone who really understood us. Make My Knot helped us meet each other, and our connection grew naturally into something meaningful.',
      rating: 5
    },
    {
      image: '/images/pic3.jpg',
      names: 'Aman & Muskan',
      location: 'Bengaluru, Karnataka',
      testimonial: 'We connected on Make My Knot and soon realized how much we had in common. What started with simple conversations slowly turned into something beautiful. Today, we feel lucky to have found each other.',
      rating: 5
    }
  ]
  
  // Auto-advance slides - pause on hover
  useEffect(() => {
    if (isPaused) return // Don't start timer if paused
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === stories.length - 1 ? 0 : prevIndex + 1
      )
    }, 6000)
    
    return () => clearInterval(timer)
  }, [currentIndex, stories.length, isPaused])
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === stories.length - 1 ? 0 : prevIndex + 1
    )
  }
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? stories.length - 1 : prevIndex - 1
    )
  }
  
  return (
    <div className="relative w-full">
      {/* Cards Grid Layout - Desktop Only */}
      <div 
        className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {stories.map((story, index) => (
          <div 
            key={index}
            className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {/* Background Image with Wavy Crop */}
            <div className="absolute inset-0">
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={story.image}
                  alt={`${story.names} wedding photo`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  draggable={false}
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 60px), 95% calc(100% - 40px), 90% calc(100% - 60px), 80% calc(100% - 30px), 70% calc(100% - 50px), 60% calc(100% - 35px), 50% calc(100% - 55px), 40% calc(100% - 25px), 30% calc(100% - 45px), 20% calc(100% - 35px), 10% calc(100% - 50px), 5% calc(100% - 40px), 0 calc(100% - 60px))'
                  }}
                />
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              {/* Couple Names */}
              <h3 className="text-2xl font-bold mb-2 text-center">
                {story.names}
              </h3>
              
              {/* Location */}
              <p className="text-sm text-gray-200 mb-4 text-center font-medium">
                {story.location}
              </p>
              
              {/* Star Rating */}
              <div className="flex justify-center mb-4">
                {[...Array(story.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              {/* Testimonial */}
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-sm leading-relaxed text-gray-100 text-center italic line-clamp-4">
                  {story.testimonial}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile Carousel View */}
      <div className="md:hidden">
        <div 
          className="relative h-[500px] overflow-hidden rounded-2xl"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {stories.map((story, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-500 ${
                index === currentIndex 
                  ? 'opacity-100 transform translate-x-0' 
                  : index < currentIndex 
                  ? 'opacity-0 transform -translate-x-full'
                  : 'opacity-0 transform translate-x-full'
              }`}
            >
              {/* Background Image with Wavy Crop - Mobile */}
              <div className="absolute inset-0">
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={story.image}
                    alt={`${story.names} wedding photo`}
                    className="w-full h-full object-cover"
                    draggable={false}
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 60px), 95% calc(100% - 40px), 90% calc(100% - 60px), 80% calc(100% - 30px), 70% calc(100% - 50px), 60% calc(100% - 35px), 50% calc(100% - 55px), 40% calc(100% - 25px), 30% calc(100% - 45px), 20% calc(100% - 35px), 10% calc(100% - 50px), 5% calc(100% - 40px), 0 calc(100% - 60px))'
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
              </div>
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <h3 className="text-2xl font-bold mb-2 text-center">{story.names}</h3>
                <p className="text-sm text-gray-200 mb-4 text-center font-medium">{story.location}</p>
                
                <div className="flex justify-center mb-4">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-sm leading-relaxed text-gray-100 text-center italic">
                    {story.testimonial}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Mobile Navigation */}
          <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-30">
            <button 
              onClick={prevSlide}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 shadow-lg pointer-events-auto"
              aria-label="Previous story"
            >
              &#10094;
            </button>
            
            <button 
              onClick={nextSlide}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 shadow-lg pointer-events-auto"
              aria-label="Next story"
            >
              &#10095;
            </button>
          </div>
          
          {/* Mobile Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 h-2 bg-white rounded-full' 
                    : 'w-2 h-2 bg-white/50 hover:bg-white/70 rounded-full'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Testimonials Section Component
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      age: '28, Marketing Manager',
      image: '/images/profile1.jpg',
      quote: 'I was skeptical about online matchmaking, but Make My Knot changed my perspective completely. The AI understood my preferences better than I did myself!',
      rating: 5
    },
    {
      name: 'Arjun Patel',
      age: '31, Software Engineer',
      image: '/images/profile2.jpg',
      quote: 'The quality of matches was exceptional. Every profile I received was thoughtfully curated. Found my life partner within 3 months!',
      rating: 5
    },
    {
      name: 'Kavya Reddy',
      age: '26, Doctor',
      image: '/images/profile3.jpg',
      quote: 'The personalized approach made all the difference. My matchmaker understood my busy schedule and found someone who truly complements my lifestyle.',
      rating: 5
    },
    {
      name: 'Rohit Gupta',
      age: '29, Financial Analyst',
      image: '/images/profile1.jpg',
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
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">What Our Members Say</h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">
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
  const [showSplash, setShowSplash] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  
  // Clean up completed lead sessions on page load
  useEffect(() => {
    const leadId = sessionStorage.getItem('leadId')
    if (leadId) {
      const assessmentCompleted = sessionStorage.getItem(`assessment_completed_${leadId}`)
      if (assessmentCompleted === 'true') {
        // Assessment is completed, clear all lead-related session storage
        console.log('Cleaning up completed lead session on home page load')
        sessionStorage.removeItem('leadSubmitted')
        sessionStorage.removeItem('leadId')
        // Keep the assessment_completed flag for future reference but clean up lead flow
      }
    }
  }, [])
  

  // Splash screen effect - Extended timing for better visibility
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoading(false)
    }, 3500) // Increased from 2500 to 3500
    
    const splashTimer = setTimeout(() => {
      setShowSplash(false)
    }, 6000) // Increased from 3500 to 6000 (6 seconds total)
    
    return () => {
      clearTimeout(loadTimer)
      clearTimeout(splashTimer)
    }
  }, [])


  // Splash Screen Component
  if (showSplash) {
    return (
      <>
        <Head>
          <title>Make My Knot - AI-Powered Wedding Matchmaking</title>
          <meta name="description" content="Find your perfect life partner with our AI-powered matchmaking platform. Quality matches, compatibility-based pairing, and personalized service." />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Wine Glass Background with Blur */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-red-800/70 to-purple-900/80 backdrop-blur-md">
            {/* Additional glass layers for depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-700/60 via-transparent to-red-900/50 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-800/40 via-red-600/30 to-red-800/60 backdrop-blur-lg"></div>
            
            {/* Wine-colored glass floating elements */}
            <div className="absolute top-20 left-20 w-40 h-40 bg-red-300/20 rounded-full blur-2xl animate-pulse" style={{animationDuration: '6s'}}></div>
            <div className="absolute bottom-32 right-16 w-64 h-64 bg-red-400/15 rounded-full blur-3xl animate-float" style={{animationDuration: '8s'}}></div>
            <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-purple-300/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-red-500/15 rounded-full blur-2xl animate-float" style={{animationDelay: '3s', animationDuration: '7s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-red-600/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s', animationDuration: '6s'}}></div>
            
            {/* Additional wine glass elements */}
            <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-float" style={{animationDelay: '4s', animationDuration: '5s'}}></div>
            <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-red-300/25 rounded-full blur-md animate-pulse" style={{animationDelay: '2.5s', animationDuration: '6s'}}></div>
          </div>
          
          <div className="relative z-10 text-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-32 h-32 bg-white/90 backdrop-blur-sm rounded-2xl mx-auto flex items-center justify-center shadow-2xl p-4 hover:scale-105 transition-all duration-500 border border-white/30">
                <Image
                  src="/images/logo.png"
                  alt="Make My Knot Logo"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                <span className="bg-gradient-to-r from-gold-300 to-gold-100 bg-clip-text text-transparent">
                  Make My Knot
                </span>
              </h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="text-lg md:text-xl lg:text-2xl text-white/90 font-medium italic"
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.8 }}
                  className="inline-block"
                >
                  From
                </motion.span>
                {' '}
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 2.2 }}
                  className="inline-block bg-gradient-to-r from-gold-600 to-yellow-600 bg-clip-text text-transparent font-bold"
                >
                  Handshake
                </motion.span>
                {' '}
                <motion.span
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 2.6 }}
                  className="inline-block"
                >
                  to
                </motion.span>
                {' '}
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.0, delay: 3.0 }}
                  className="inline-block bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent font-bold animate-pulse"
                  style={{ animationDelay: '4s', animationDuration: '2s' }}
                >
                  Pheras
                </motion.span>
              </motion.div>
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <Navigation variant="wine-glass" />

        {/* Hero Section with Full-Length Slider */}
        <section className="relative" style={{ 
          paddingTop: '80px', 
          paddingBottom: '60px',
          minHeight: 'calc(100vh + 100px)',
          height: 'auto'
        }}>
          {/* Full-Length Background Slider */}
          <ImageSlider />
          
          {/* Dark Overlay for Better Text Visibility */}
          <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
          
          {/* Overlapping Content */}
          <div className="absolute inset-0 flex items-start justify-start z-20 pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-lg">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">
                  Start Your Journey
                </h1>
                <p className="text-lg sm:text-xl text-white mb-6 sm:mb-8 italic leading-relaxed drop-shadow-md">
                  "From <span className="font-bold text-yellow-300">handshake</span> to <span className="font-bold text-pink-300">pheras</span>, let us guide your journey to love and lifelong happiness."
                </p>
                <p className="text-gray-200 mb-6 sm:mb-8 text-base sm:text-lg drop-shadow-sm">
                  Answer a few questions to help us find your perfect match
                </p>
                
                {/* Questionnaire - Direct Style like eharmony */}
                <LeadQuestionnaire />
              </div>
            </div>
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
                
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                  15 Days Free
                  <span className="block">Membership! 🎉</span>
                </h2>
                
                <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
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
              src="/images/1.jpg"
              alt="Beautiful wedding celebration background"
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
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
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
                    className="text-lg md:text-xl lg:text-2xl font-semibold text-gold-300 italic leading-relaxed"
                  >
                    "<motion.span
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      viewport={{ once: true }}
                      className="inline-block"
                    >
                      From
                    </motion.span>
                    {' '}
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 1.0 }}
                      viewport={{ once: true }}
                      className="inline-block font-bold bg-gradient-to-r from-gold-200 to-gold-400 bg-clip-text text-transparent"
                    >
                      handshake
                    </motion.span>
                    {' '}
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                      viewport={{ once: true }}
                      className="inline-block"
                    >
                      to
                    </motion.span>
                    {' '}
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 1.4 }}
                      viewport={{ once: true }}
                      className="inline-block font-bold bg-gradient-to-r from-red-300 to-pink-300 bg-clip-text text-transparent animate-pulse"
                      style={{ animationDelay: '2s', animationDuration: '2s' }}
                    >
                      pheras
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1.6 }}
                      viewport={{ once: true }}
                      className="inline-block"
                    >
                      , let us guide your journey to love and lifelong happiness.
                    </motion.span>"
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
                className="text-base md:text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed max-w-4xl mx-auto"
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
                          src="/images/speaker.jpg"
                          alt="Dr. Sarah Mitchell - Relationship Expert"
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-center mb-2">Relationship Mastery Webinar</h3>
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
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How Make My Knot Works</h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Our intelligent matching process ensures you meet people who truly align with your values and life goals
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-primary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Meet Your Matchmaker</h3>
                <p className="text-gray-600">
                  Have a conversation with your AI matchmaker about your values, lifestyle, and what you're looking for in a life partner.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-gold-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Get Curated Matches</h3>
                <p className="text-gray-600">
                  Receive 3-5 carefully selected profiles each week, chosen based on deep compatibility rather than just photos.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Connect & Meet</h3>
                <p className="text-gray-600">
                  When both parties are interested, your matchmaker introduces you personally and helps facilitate your first meeting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                From First Hello to a Beautiful Knot
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Real stories from couples who found their perfect match through Make My Knot
              </p>
            </div>
            
            {/* Success Stories Carousel */}
            <SuccessStoriesCarousel />
          </div>
        </section>

        {/* The Make My Knot Difference Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Light Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:40px_40px]"></div>
            {/* Light decorative elements */}
            <div className="absolute top-20 left-16 w-40 h-40 bg-primary-100/30 rounded-full blur-2xl"></div>
            <div className="absolute bottom-32 right-20 w-56 h-56 bg-gold-100/25 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-pink-100/30 rounded-full blur-xl"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-tight">
                The Make My Knot Difference
              </h2>
              <div className="w-24 h-1 bg-gray-900 mx-auto mt-4"></div>
            </div>

            {/* Perfect Grid Layout - All cards equal height */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Verified Profiles */}
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-16 h-1 bg-gray-900 mb-4"></div>
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 leading-tight">Complete Support</h3>
                <p className="text-gray-600 leading-relaxed flex-grow font-light text-base">
                  We provide complete support throughout your matchmaking journey. From intelligent conversation starters to AI-generated interaction prompts, we make sure you always feel confident and comfortable, helping you connect naturally and build meaningful relationships.
                </p>
              </div>

              {/* Meaningful Likes */}
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-16 h-1 bg-gray-900 mb-4"></div>
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 leading-tight">Meaningful Connections</h3>
                <p className="text-gray-600 leading-relaxed flex-grow font-light text-base">
                  Connections on Make My Knot aren't random interactions—they're thoughtful. You can send voice notes, reactions, or thoughtful comments, so every connection feels personal and genuine.
                </p>
              </div>

              {/* AI Compatibility Scores */}
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-16 h-1 bg-gray-900 mb-4"></div>
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 leading-tight">AI Compatibility Analysis</h3>
                <p className="text-gray-600 leading-relaxed flex-grow font-light text-base">
                  Our proprietary AI engine calculates compatibility not just between two people, but also considers family expectations, lifestyle choices, and values—making every match more meaningful and lasting.
                </p>
              </div>

              {/* Transparent Intentions */}
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-16 h-1 bg-gray-900 mb-4"></div>
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 leading-tight">Transparent Intentions</h3>
                <p className="text-gray-600 leading-relaxed flex-grow font-light text-base">
                  No guessing games. Profiles highlight key details like education, family background, and optional income visibility—so you know exactly who you're connecting with from the start.
                </p>
              </div>

              {/* Personalized Conversation Starters */}
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-16 h-1 bg-gray-900 mb-4"></div>
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 leading-tight">Personalized Guidance</h3>
                <p className="text-gray-600 leading-relaxed flex-grow font-light text-base">
                  We provide comprehensive support throughout your journey. From intelligent conversation starters to AI-generated interaction prompts, we ensure you never feel uncertain about how to connect naturally.
                </p>
              </div>

              {/* Knot Specials */}
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-16 h-1 bg-gray-900 mb-4"></div>
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 leading-tight">Premium Services</h3>
                <p className="text-gray-600 leading-relaxed flex-grow font-light text-base">
                  Access exclusive experiences beyond standard matchmaking. Our premium services include numerology insights, curated private events, and AI-powered relationship counseling through our expert advisors.
                </p>
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 text-shadow-lg">
              Ready to Find Your
              <span className="block mt-2 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Life Partner?</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-slate-200 mb-8">
              Join thousands of people who have found meaningful relationships through our premium matchmaking platform.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center px-6 py-3 text-base md:text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
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
