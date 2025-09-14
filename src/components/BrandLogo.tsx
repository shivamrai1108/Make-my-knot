import React from 'react'

interface BrandLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img
        src="/images/logo.png"
        alt="Make My Knot Logo"
        className="w-full h-full object-contain"
        loading="eager"
      />
    </div>
  )
}

export default BrandLogo
