export interface SEOConfig {
  title: string
  description: string
  keywords?: string
  canonical?: string
  openGraph?: {
    title?: string
    description?: string
    image?: string
    url?: string
    type?: string
  }
  twitter?: {
    card?: string
    title?: string
    description?: string
    image?: string
  }
  jsonLd?: object
}

export const defaultSEO: SEOConfig = {
  title: "MakeMyKnot - India's #1 Premium Matchmaking Service | Find Your Perfect Life Partner",
  description: "Find your perfect life partner with MakeMyKnot, India's most trusted premium matchmaking service. Personalized matches, expert guidance, and 95% success rate. Join 50,000+ happy couples.",
  keywords: "matchmaking, marriage bureau, Indian matchmaking, matrimony, life partner, arranged marriage, premium matchmaking, relationship counseling, marriage consultant",
  openGraph: {
    title: "MakeMyKnot - India's #1 Premium Matchmaking Service",
    description: "Find your perfect life partner with India's most trusted premium matchmaking service. 95% success rate, expert guidance.",
    image: "https://makemyknot.com/images/og-image.jpg",
    url: "https://makemyknot.com",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "MakeMyKnot - India's #1 Premium Matchmaking Service",
    description: "Find your perfect life partner with India's most trusted premium matchmaking service. 95% success rate, expert guidance.",
    image: "https://makemyknot.com/images/twitter-card.jpg"
  }
}

export const pageConfigs: Record<string, SEOConfig> = {
  home: {
    title: "MakeMyKnot - India's #1 Premium Matchmaking Service | Find Your Perfect Life Partner",
    description: "Find your perfect life partner with MakeMyKnot, India's most trusted premium matchmaking service. Personalized matches, expert guidance, and 95% success rate. Join 50,000+ happy couples.",
    keywords: "matchmaking, marriage bureau, Indian matchmaking, matrimony, life partner, arranged marriage, premium matchmaking, relationship counseling, marriage consultant, wedding planner",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MakeMyKnot",
      "url": "https://makemyknot.com",
      "logo": "https://makemyknot.com/images/logo.png",
      "description": "India's premier matchmaking service connecting compatible life partners",
      "foundingDate": "2024",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": "Delhi",
        "addressLocality": "New Delhi"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9999999999",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://www.instagram.com/makemyknot",
        "https://www.facebook.com/makemyknot",
        "https://www.linkedin.com/company/makemyknot"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Matchmaking Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Premium Matchmaking",
              "description": "Personalized matchmaking service with dedicated relationship manager"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "Marriage Counseling",
              "description": "Pre and post-marriage counseling services"
            }
          }
        ]
      }
    }
  },
  
  about: {
    title: "About MakeMyKnot - India's Most Trusted Matchmaking Experts | Our Story",
    description: "Learn about MakeMyKnot's mission to create meaningful connections. Founded by relationship experts, we've helped 50,000+ couples find love with our personalized approach to matchmaking.",
    keywords: "about MakeMyKnot, matchmaking experts, relationship consultants, marriage bureau history, Indian matchmaking company"
  },

  pricing: {
    title: "Matchmaking Service Pricing Plans | Affordable Premium Matrimony Packages - MakeMyKnot",
    description: "Choose from our flexible matchmaking packages starting at ₹999. Premium matrimony services with guaranteed matches, relationship coaching, and 24/7 support. No hidden fees.",
    keywords: "matchmaking pricing, matrimony packages, marriage bureau cost, wedding consultant fees, relationship counseling prices"
  },

  contact: {
    title: "Contact MakeMyKnot - Get Expert Matchmaking Consultation | Call +91-9999999999",
    description: "Ready to find your life partner? Contact MakeMyKnot's expert matchmakers for a free consultation. Available 24/7 in Delhi, Mumbai, Bangalore, and across India.",
    keywords: "contact matchmaking service, marriage consultation, matrimony help, relationship expert contact"
  },

  assessment: {
    title: "Free Compatibility Assessment - Find Your Perfect Match | MakeMyKnot Personality Test",
    description: "Take our scientifically-designed compatibility assessment to discover your ideal life partner preferences. Free personality test used by 100,000+ users to find lasting love.",
    keywords: "compatibility test, personality assessment, marriage compatibility, relationship quiz, partner matching algorithm"
  },

  blog: {
    title: "Relationship Advice & Marriage Tips Blog | MakeMyKnot Expert Insights",
    description: "Expert relationship advice, marriage tips, and dating guidance from India's top matchmaking professionals. Learn how to find love, build relationships, and create lasting partnerships.",
    keywords: "relationship advice, marriage tips, dating guide, love advice, relationship blog, marriage counseling tips"
  },

  signup: {
    title: "Join MakeMyKnot - Start Your Journey to Find Your Perfect Life Partner",
    description: "Create your profile on India's most trusted matchmaking platform. Join thousands who found love through our personalized approach. Free registration with verified profiles.",
    keywords: "matchmaking signup, marriage registration, matrimony profile, Indian matrimony, join matchmaking service"
  },

  login: {
    title: "Login to MakeMyKnot - Access Your Matchmaking Dashboard",
    description: "Login to your MakeMyKnot account to view your matches, messages, and profile. Secure access to India's premium matchmaking platform.",
    keywords: "matchmaking login, matrimony login, marriage bureau login, MakeMyKnot account"
  },

  questionnaire: {
    title: "Compatibility Questionnaire - MakeMyKnot Partner Preferences Assessment",
    description: "Complete our comprehensive partner preferences questionnaire to help us find your ideal match. Detailed compatibility assessment for better matchmaking results.",
    keywords: "partner preferences, compatibility questionnaire, matchmaking assessment, marriage questionnaire, relationship preferences"
  },

  'lead-signup': {
    title: "Express Interest - Quick Registration | MakeMyKnot Matchmaking",
    description: "Show your interest in our matchmaking services with quick registration. Get personalized matches and expert guidance in finding your life partner.",
    keywords: "quick registration, express interest, matchmaking inquiry, marriage consultation, partner search"
  },

  webinars: {
    title: "Free Relationship & Marriage Webinars | MakeMyKnot Expert Sessions",
    description: "Join our free webinars on relationships, marriage preparation, and finding love. Expert advice from India's top matchmaking professionals.",
    keywords: "relationship webinars, marriage webinars, dating advice, love guidance, relationship counseling sessions"
  }
}

// Generate JSON-LD structured data
export const generateJsonLd = (config: SEOConfig) => {
  if (!config.jsonLd) return null
  
  return {
    __html: JSON.stringify(config.jsonLd)
  }
}

// Generate breadcrumb schema
export const generateBreadcrumbSchema = (items: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}

// Generate FAQ schema
export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

// Generate review/testimonial schema
export const generateReviewSchema = (reviews: Array<{
  author: string,
  rating: number,
  reviewBody: string,
  datePublished: string
}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MakeMyKnot",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": reviews.length.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.reviewBody,
      "datePublished": review.datePublished
    }))
  }
}

// Generate LocalBusiness schema
export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://makemyknot.com/#organization",
    "name": "MakeMyKnot",
    "image": "https://makemyknot.com/images/logo.png",
    "description": "India's premier matchmaking service connecting compatible life partners with 50+ years of experience",
    "url": "https://makemyknot.com",
    "telephone": "+91-9999999999",
    "priceRange": "₹₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Connaught Place",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "21:00"
    },
    "sameAs": [
      "https://www.instagram.com/makemyknot",
      "https://www.facebook.com/makemyknot",
      "https://www.linkedin.com/company/makemyknot"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1000",
      "bestRating": "5",
      "worstRating": "1"
    }
  }
}

// Generate Service schema for matchmaking
export const generateServiceSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Premium Matchmaking Service",
    "description": "Professional matchmaking service connecting compatible life partners across India",
    "provider": {
      "@type": "Organization",
      "name": "MakeMyKnot",
      "url": "https://makemyknot.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Matchmaking Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Premium Matchmaking",
            "description": "Personalized matchmaking with dedicated relationship manager"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Compatibility Assessment",
            "description": "Detailed personality and compatibility analysis"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Relationship Counseling",
            "description": "Pre and post-marriage relationship guidance"
          }
        }
      ]
    }
  }
}

// Generate WebSite schema with search action
export const generateWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://makemyknot.com/#website",
    "url": "https://makemyknot.com",
    "name": "MakeMyKnot",
    "description": "India's premier matchmaking service",
    "publisher": {
      "@id": "https://makemyknot.com/#organization"
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://makemyknot.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    ],
    "inLanguage": "en-IN"
  }
}
