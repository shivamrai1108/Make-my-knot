// Navigation constants for consistent height management across the app
export const NAVIGATION_CONSTANTS = {
  // Height of the navigation bar (in pixels)
  HEIGHT: 72,
  
  // Height as Tailwind CSS classes
  HEIGHT_CLASS: 'h-18', // 72px = 18 * 4px
  
  // Padding top classes to offset fixed navbar
  OFFSET_CLASS: 'pt-18', // 72px offset
  
  // Mobile offset (slightly smaller for mobile navbar)
  MOBILE_HEIGHT: 64,
  MOBILE_OFFSET_CLASS: 'pt-16', // 64px offset
  
  // Combined responsive offset
  RESPONSIVE_OFFSET_CLASS: 'pt-16 md:pt-18',
  
  // Z-index for navigation
  Z_INDEX: 100,
} as const

export type NavigationHeight = typeof NAVIGATION_CONSTANTS.HEIGHT
