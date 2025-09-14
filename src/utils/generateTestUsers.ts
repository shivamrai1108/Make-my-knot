import { User } from '@/lib/UserContext'

const firstNames = [
  // Indian names
  'Arjun', 'Priya', 'Rajesh', 'Kavya', 'Vikram', 'Sneha', 'Rohit', 'Ananya', 
  'Karan', 'Isha', 'Amit', 'Nisha', 'Rahul', 'Pooja', 'Aditya', 'Riya',
  'Deepak', 'Meera', 'Sanjay', 'Divya', 'Nikhil', 'Sakshi', 'Akshay', 'Tanya',
  'Varun', 'Shreya', 'Manish', 'Neha', 'Siddharth', 'Anjali', 'Gaurav', 'Komal',
  // International names
  'Alex', 'Sarah', 'David', 'Emma', 'Michael', 'Olivia', 'James', 'Sophie',
  'Ryan', 'Maya', 'Daniel', 'Zara', 'Chris', 'Elena', 'Nathan', 'Aria',
  'Lucas', 'Chloe', 'Jordan', 'Leah'
]

const lastNames = [
  'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Agarwal', 'Mehta', 'Shah',
  'Joshi', 'Reddy', 'Nair', 'Iyer', 'Rao', 'Malhotra', 'Sinha', 'Mishra',
  'Chandra', 'Kapoor', 'Saxena', 'Verma', 'Jain', 'Bansal', 'Arora', 'Khanna',
  'Johnson', 'Smith', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
  'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Garcia', 'Martinez'
]

const locations = [
  'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 'Hyderabad, Telangana',
  'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Pune, Maharashtra', 'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan', 'Surat, Gujarat', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh',
  'Nagpur, Maharashtra', 'Indore, Madhya Pradesh', 'Thane, Maharashtra', 'Bhopal, Madhya Pradesh',
  'Visakhapatnam, Andhra Pradesh', 'Pimpri-Chinchwad, Maharashtra', 'Patna, Bihar', 'Vadodara, Gujarat',
  'Ghaziabad, Uttar Pradesh', 'Ludhiana, Punjab', 'Agra, Uttar Pradesh', 'Nashik, Maharashtra',
  'New York, NY', 'Los Angeles, CA', 'San Francisco, CA', 'Toronto, ON', 'London, UK',
  'Sydney, Australia', 'Singapore', 'Dubai, UAE', 'Berlin, Germany', 'Tokyo, Japan'
]

const educations = [
  'Bachelors Degree', 'Masters Degree', 'PhD', 'Professional Degree', 'MBA',
  'Engineering Degree', 'Medical Degree', 'Law Degree', 'Some College', 'Trade School'
]

const professions = [
  'Software Engineer', 'Data Scientist', 'Product Manager', 'Doctor', 'Teacher',
  'Marketing Manager', 'Consultant', 'Designer', 'Lawyer', 'Architect',
  'Accountant', 'Nurse', 'Sales Executive', 'HR Manager', 'Financial Analyst',
  'Business Analyst', 'Project Manager', 'Pharmacist', 'Civil Engineer', 'Writer',
  'Chef', 'Photographer', 'Artist', 'Entrepreneur', 'Researcher'
]

const interests = [
  'Travel', 'Reading', 'Movies', 'Music', 'Sports', 'Cooking', 'Photography',
  'Art', 'Technology', 'Gaming', 'Fitness', 'Dancing', 'Hiking', 'Yoga',
  'Fashion', 'Food', 'Nature', 'Adventure', 'Culture', 'Languages'
]

const values = [
  'Family-oriented', 'Career-focused', 'Spiritual/Religious', 'Health & Wellness',
  'Adventure & Travel', 'Intellectual Growth', 'Social Impact', 'Creativity & Arts',
  'Financial Security', 'Work-life Balance', 'Personal Growth', 'Community Service'
]

const bios = [
  "I'm passionate about life and love exploring new places and cuisines. Looking for someone who shares my zest for adventure and appreciates the little moments.",
  "Family means everything to me, and I believe in building strong, lasting relationships. I enjoy quiet evenings at home as much as exciting weekend getaways.",
  "Career-driven but never too busy for the right person. I love trying new restaurants, weekend hikes, and meaningful conversations over coffee.",
  "Creative soul with a love for art and music. I find inspiration in everyday moments and believe in the power of genuine connections.",
  "Fitness enthusiast who believes in maintaining a healthy balance between work and play. Always up for a workout buddy or a dance partner!",
  "Bookworm and coffee lover seeking someone who appreciates deep conversations and quiet moments. Let's explore the world together, one page at a time.",
  "Tech professional by day, foodie by night. I love cooking for others and believe the best relationships are built over shared meals.",
  "Travel has taught me that the world is full of amazing people and experiences. Looking for a partner to share new adventures with.",
  "Spiritually grounded and family-oriented. I believe in treating others with kindness and building relationships based on mutual respect.",
  "Life is too short not to pursue your passions. I'm looking for someone who's equally driven and knows how to have fun along the way."
]

const partnerPreferences = [
  "Looking for someone who shares my values and is ready for a committed relationship. Honesty and loyalty are non-negotiable.",
  "Seeking a life partner who is ambitious yet grounded, someone who can be my best friend and biggest supporter.",
  "I want to find someone who complements me and brings out the best in me. Mutual respect and understanding are essential.",
  "Looking for a genuine connection with someone who values family, has a good sense of humor, and is emotionally mature.",
  "Seeking someone who is passionate about life, career-oriented but family-focused, and believes in growing together.",
  "I want a partner who is independent yet caring, someone who can challenge me intellectually and support me emotionally.",
  "Looking for someone with similar interests but different perspectives, someone who can teach me new things about life.",
  "Seeking a kind-hearted person who is ready to build something beautiful together, someone who values communication and trust."
]

// Diverse profile pictures (using placeholder services)
const getProfilePicture = (name: string, index: number): string => {
  const gender = index % 2 === 0 ? 'women' : 'men'
  const photoIndex = Math.floor(index / 2) % 50
  return `https://randomuser.me/api/portraits/${gender}/${photoIndex}.jpg`
}

// Phone number generation
const generatePhoneNumber = (): string => {
  const countryCodes = ['+91', '+1', '+44', '+61', '+33', '+49']
  const code = countryCodes[Math.floor(Math.random() * countryCodes.length)]
  const number = Math.floor(Math.random() * 9000000000) + 1000000000
  return `${code} ${number.toString().slice(0, 3)}-${number.toString().slice(3, 6)}-${number.toString().slice(6)}`
}

export function generateTestUsers(): User[] {
  const users: User[] = []
  
  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const age = Math.floor(Math.random() * 15) + 22 // Ages 22-36
    
    // Generate 3-6 random interests for each user
    const userInterests = []
    const shuffledInterests = [...interests].sort(() => 0.5 - Math.random())
    const numInterests = Math.floor(Math.random() * 4) + 3 // 3-6 interests
    for (let j = 0; j < numInterests; j++) {
      userInterests.push(shuffledInterests[j])
    }
    
    const user: User = {
      id: `test-user-${i + 1}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      name,
      age,
      phone: generatePhoneNumber(),
      location: locations[Math.floor(Math.random() * locations.length)],
      education: educations[Math.floor(Math.random() * educations.length)],
      profession: professions[Math.floor(Math.random() * professions.length)],
      bio: bios[Math.floor(Math.random() * bios.length)],
      interests: userInterests,
      values: values[Math.floor(Math.random() * values.length)],
      partnerPreferences: partnerPreferences[Math.floor(Math.random() * partnerPreferences.length)],
      communicationStyle: Math.random() > 0.5 ? 'chat' : 'call',
      profileComplete: true,
      questionnaireComplete: Math.random() > 0.2, // 80% have completed questionnaire
      profilePicture: getProfilePicture(name, i),
      isVerified: Math.random() > 0.3, // 70% are verified
      subscription: {
        plan: Math.random() > 0.4 ? 'monthly' : 'trial', // 60% have monthly subscription
        startedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
      },
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString() // Created within last 6 months
    }
    
    users.push(user)
  }
  
  return users
}

// Function to generate questionnaire responses for users
export function generateQuestionnaireResponses(users: User[]) {
  const responses = []
  
  for (const user of users) {
    if (user.questionnaireComplete) {
      // Generate realistic responses based on user's profile
      const response = {
        id: `questionnaire-${user.id}`,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        userPhone: user.phone,
        userType: 'user',
        isComplete: true,
        completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        responses: {
          personality_type: ['Extroverted', 'Introverted', 'Ambivert'][Math.floor(Math.random() * 3)],
          relationship_goals: ['Marriage', 'Long-term relationship', 'Casual dating'][Math.floor(Math.random() * 3)],
          family_importance: Math.floor(Math.random() * 5) + 1, // 1-5 scale
          career_importance: Math.floor(Math.random() * 5) + 1,
          social_activities: user.interests.slice(0, 3), // Use some of their interests
          lifestyle_preferences: {
            exercise_frequency: ['Daily', 'Weekly', '2-3 times', 'Rarely'][Math.floor(Math.random() * 4)],
            social_preference: ['Large groups', 'Small groups', 'One-on-one', 'Mix of all'][Math.floor(Math.random() * 4)],
            weekend_activities: ['Stay home', 'Go out', 'Travel', 'Mix'][Math.floor(Math.random() * 4)]
          },
          deal_breakers: ['Smoking', 'Excessive drinking', 'Dishonesty', 'Lack of ambition'][Math.floor(Math.random() * 4)],
          communication_style: user.communicationStyle === 'chat' ? 'Text first' : 'Call first',
          conflict_resolution: ['Direct discussion', 'Give space first', 'Seek compromise', 'Avoid confrontation'][Math.floor(Math.random() * 4)],
          future_plans: {
            children: ['Want children', 'Maybe', 'No children', 'Have children'][Math.floor(Math.random() * 4)],
            location_flexibility: Math.random() > 0.5 ? 'Willing to relocate' : 'Prefer to stay',
            career_growth: Math.random() > 0.3 ? 'Very important' : 'Somewhat important'
          }
        },
        compatibilityProfile: {
          values: Array.from({length: 10}, () => Math.random() * 100),
          lifestyle: Array.from({length: 8}, () => Math.random() * 100),
          interests: Array.from({length: 12}, () => Math.random() * 100),
          personality: Array.from({length: 6}, () => Math.random() * 100)
        }
      }
      
      responses.push(response)
    }
  }
  
  return responses
}

// Function to store test data
export function storeTestData() {
  try {
    const users = generateTestUsers()
    const responses = generateQuestionnaireResponses(users)
    
    // Store users in local storage for testing
    const existingUsers = JSON.parse(localStorage.getItem('makemyknot_test_users') || '[]')
    const allUsers = [...existingUsers, ...users]
    localStorage.setItem('makemyknot_test_users', JSON.stringify(allUsers))
    
    // Store questionnaire responses
    const existingResponses = JSON.parse(localStorage.getItem('questionnaire_responses') || '[]')
    const allResponses = [...existingResponses, ...responses]
    localStorage.setItem('questionnaire_responses', JSON.stringify(allResponses))
    
    console.log(`Generated ${users.length} test users with ${responses.length} questionnaire responses`)
    console.log('Test users stored in localStorage under "makemyknot_test_users"')
    console.log('Sample user:', users[0])
    
    return { users, responses }
  } catch (error) {
    console.error('Error storing test data:', error)
    return { users: [], responses: [] }
  }
}
