import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(true)
  
  const phoneNumber = '+919315643044' // Your WhatsApp number
  const message = encodeURIComponent('Hello! I am interested in Make My Knot matchmaking services. Could you please provide more information?')
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank')
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Mobile WhatsApp Button */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-gray-700 transition-colors z-10"
          >
            <X className="w-3 h-3" />
          </button>
          
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
        
        {/* Message tooltip */}
        <div className="absolute bottom-14 right-0 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-90">
          Chat with us on WhatsApp
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"></div>
        </div>
      </div>

      {/* Desktop WhatsApp Button (smaller, less intrusive) */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 group"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
          
          {/* Tooltip for desktop */}
          <div className="absolute bottom-12 right-0 bg-gray-800 text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Chat on WhatsApp
          </div>
        </button>
      </div>
    </>
  )
}

export default WhatsAppButton