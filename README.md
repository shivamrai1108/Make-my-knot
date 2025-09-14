# Make My Knot 💒

A comprehensive wedding matchmaking platform powered by AI that connects hearts and creates lasting relationships.

## 🌟 Overview

Make My Knot is a modern, full-stack matchmaking platform that combines 75 years of traditional matchmaking expertise with cutting-edge AI technology. The platform focuses on quality over quantity, providing 3-5 carefully curated matches per week based on deep compatibility analysis.

## ✨ Key Features

### 🤖 AI-Powered Matching
- Advanced compatibility analysis using 50+ factors
- Personalized AI matchmaker conversations
- Continuous learning from user preferences

### 🏆 Premium User Experience
- Clean, modern interface built with Next.js & Tailwind CSS
- Responsive design for all devices
- Real-time chat and messaging
- Professional profile management

### 📊 Comprehensive Admin Dashboard
- Lead management and tracking
- User analytics and insights
- Subscription management
- Conversation monitoring

### 🔒 Data Security & Privacy
- MongoDB database with secure authentication
- Profile verification system
- Privacy-first approach to user data

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Modern icons

### Backend
- **Node.js + Express** - RESTful API server
- **MongoDB + Mongoose** - Database and ODM
- **Socket.io** - Real-time communication
- **JWT** - Secure authentication
- **Cloudinary** - Image storage

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shivamrai1108/Make-my-knot.git
   cd Make-my-knot
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd makemyknot-backend
   npm install
   ```

4. **Configure environment variables**
   ```bash
   # Update makemyknot-backend/.env with your MongoDB connection string
   MONGODB_URI=your_mongodb_connection_string
   ```

5. **Start the development servers**
   
   **Frontend (Terminal 1):**
   ```bash
   npm run dev
   # Runs on http://localhost:3000
   ```
   
   **Backend (Terminal 2):**
   ```bash
   cd makemyknot-backend
   npm run dev
   # Runs on http://localhost:4000
   ```

## 📁 Project Structure

```
Make-my-knot/
├── src/                      # Frontend source code
│   ├── components/           # Reusable React components
│   │   ├── Navigation.tsx
│   │   ├── KnotCounsellor.tsx
│   │   └── ComprehensiveQuestionnaire.tsx
│   ├── pages/               # Next.js pages
│   │   ├── index.tsx        # Homepage
│   │   ├── about.tsx        # About page
│   │   ├── pricing.tsx      # Pricing plans
│   │   └── admin.tsx        # Admin dashboard
│   ├── lib/                 # Utilities and stores
│   │   ├── UserContext.tsx  # User state management
│   │   ├── leadStore.ts     # Lead management
│   │   └── questionnaireStore.ts
│   └── styles/              # Global styles
├── makemyknot-backend/      # Backend API
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── index.js         # Server entry point
│   └── .env                 # Environment variables
├── public/                  # Static assets
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

## 🎯 Current Status

### ✅ Completed Features
- [x] Complete homepage with hero section
- [x] About page with company story
- [x] Pricing page with subscription tiers
- [x] Comprehensive admin dashboard
- [x] Lead capture and management
- [x] AI questionnaire system
- [x] MongoDB integration
- [x] Responsive design
- [x] Authentication system (currently disabled for demo)

### 🚧 In Progress
- [ ] MongoDB data migration from localStorage
- [ ] Real-time matching algorithm
- [ ] Payment integration
- [ ] Email notification system

### 🔮 Planned Features
- [ ] Video calling integration
- [ ] Advanced filtering options
- [ ] Mobile app development
- [ ] Multi-language support

## 🧪 Authentication Status

**Note**: Authentication is currently disabled for this phase to focus on content and design. The platform showcases all features without requiring user login.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Contact

- **Developer**: Shivam Rai
- **Email**: [shivamrai1108@gmail.com](mailto:shivamrai1108@gmail.com)
- **GitHub**: [@shivamrai1108](https://github.com/shivamrai1108)

---

**Made with ❤️ for bringing hearts together**
