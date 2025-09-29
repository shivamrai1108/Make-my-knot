# Make My Knot - Public API Deployment Guide

## 🎯 **Overview**

Your Make My Knot backend is now configured for **public access to lead generation and assessments** while keeping admin functions secure. Anyone from anywhere can submit leads and fill out questionnaires, and all data will be permanently stored in MongoDB Atlas.

## 🔧 **Current Setup Status**

✅ **MongoDB Atlas Connected**: Database is working and configured  
✅ **Public APIs Ready**: Leads and questionnaires are publicly accessible  
✅ **Admin Panel Secure**: Protected with authentication  
✅ **CORS Configured**: Ready for cross-origin requests  
✅ **Data Persistence**: All data saved permanently to MongoDB  

## 🌐 **Public API Endpoints**

### **Lead Generation (PUBLIC ACCESS)**
Anyone can submit leads from anywhere:

```bash
# Submit a Lead
POST http://localhost:4000/api/leads
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "answers": {
    "looking_for": "Serious relationship",
    "age_preference": "25-30",
    "location": "Delhi"
  },
  "source": "website"
}
```

### **Assessment/Questionnaire (PUBLIC ACCESS)**
Anyone can submit questionnaires:

```bash
# Submit Assessment
POST http://localhost:4000/api/questionnaires/public
Content-Type: application/json

{
  "userEmail": "jane@example.com",
  "userName": "Jane Smith", 
  "userPhone": "+919876543211",
  "userType": "lead",
  "source": "website",
  "responses": {
    "relationship_goals": "Marriage",
    "family_importance": "Very Important",
    "career_ambition": "High",
    "values": ["Honesty", "Loyalty"],
    "lifestyle_preferences": ["Health-conscious", "Travel"]
  },
  "completionTime": 300
}
```

### **Retrieve Assessment (PUBLIC ACCESS)**
Get questionnaire by email:

```bash
# Get Assessment by Email
GET http://localhost:4000/api/questionnaires/public/jane@example.com
```

## 🔐 **Admin Endpoints (PROTECTED)**

### **Admin Login**
```bash
POST http://localhost:4000/api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`
- ⚠️ **Change password after first login!**

### **View Leads (Admin Only)**
```bash
GET http://localhost:4000/api/leads
Authorization: Bearer YOUR_JWT_TOKEN
```

### **View Questionnaires (Admin Only)**  
```bash
GET http://localhost:4000/api/questionnaires
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🚀 **Deployment Steps**

### **Local Development**
```bash
cd "/Users/shivamrai/Make my knot/makemyknot-backend"
node src/index.js
```

### **Production Deployment**

#### **1. Environment Variables**
Update your production environment with:

```bash
# Required Variables
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://Useradmin:Play%40123Dehradun@makemyknot.rlnjjl7.mongodb.net/makemyknot?retryWrites=true&w=majority&appName=Makemyknot

# Production Domains
PRODUCTION_URL=https://api.makemyknot.com
CLIENT_URL=https://makemyknot.com

# JWT Configuration
JWT_SECRET=your-production-jwt-secret-key
```

#### **2. Deploy to Hosting Provider**
Choose one:

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Railway:**
```bash
npm install -g @railway/cli
railway login
railway deploy
```

**Heroku:**
```bash
git add .
git commit -m "Deploy production"
git push heroku main
```

**DigitalOcean App Platform:**
- Connect your GitHub repository
- Set environment variables in the dashboard
- Deploy automatically

#### **3. Update CORS Origins**
In production, update the CORS configuration in `src/index.js` to include your actual domain:

```javascript
'https://makemyknot.com',
'https://www.makemyknot.com',
'https://api.makemyknot.com'
```

## 📊 **Admin Dashboard Integration**

### **Frontend Integration**
Update your frontend admin panel to connect to the backend:

```javascript
// Frontend API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.makemyknot.com/api'
  : 'http://localhost:4000/api';

// Fetch leads for admin
async function fetchLeads() {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

// Fetch questionnaires for admin
async function fetchQuestionnaires() {
  const response = await fetch(`${API_BASE_URL}/questionnaires`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}
```

## 🧪 **Testing the APIs**

### **Test Lead Submission (Anyone can do this)**
```bash
curl -X POST https://api.makemyknot.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "phone": "+919876543210",
    "answers": {"looking_for": "Marriage"},
    "source": "website"
  }'
```

### **Test Assessment Submission (Anyone can do this)**
```bash
curl -X POST https://api.makemyknot.com/api/questionnaires/public \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "userName": "Test User",
    "responses": {"values": ["Family", "Trust"]},
    "userType": "lead"
  }'
```

## 🔒 **Security Features**

- ✅ **Public APIs**: Only lead generation and assessments are public
- ✅ **Protected Admin**: All admin functions require authentication  
- ✅ **CORS Protection**: Only allowed domains can make requests
- ✅ **Rate Limiting**: Prevents API abuse
- ✅ **Input Validation**: All data is validated before saving
- ✅ **Secure Headers**: Helmet.js provides security headers

## 📈 **Monitoring & Analytics**

### **Health Check**
```bash
GET http://localhost:4000/api/health
```

### **Admin Analytics (Protected)**
```bash
GET http://localhost:4000/api/leads/analytics/summary
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔄 **Data Flow**

1. **Public User** fills out lead form on your website
2. **Frontend** sends POST request to `/api/leads` (no auth needed)
3. **Data** is saved to MongoDB Atlas permanently
4. **Admin** logs into protected admin panel
5. **Admin** views leads and assessments through protected endpoints
6. **All data persists** across sessions and server restarts

## 🚨 **Important Notes**

- **MongoDB Atlas IP**: Your IP (49.43.169.102) is whitelisted ✅
- **Default Admin**: Username `admin`, Password `admin123` (CHANGE THIS!)
- **Public Access**: Only `/api/leads` and `/api/questionnaires/public/*` are public
- **Admin Access**: All other endpoints require authentication
- **Data Persistence**: Everything saves to MongoDB Atlas permanently

## 🆘 **Troubleshooting**

### **Connection Issues**
```bash
# Test database connection
node setup-db.js
```

### **CORS Issues**
Add your domain to the CORS whitelist in `src/index.js`

### **Admin Login Issues**
Reset admin password through MongoDB Atlas dashboard

### **API Testing**
Use the provided test script:
```bash
node public-api-test.js
```

---

## ✅ **Ready for Production!**

Your system is now configured so that:
- **Anyone worldwide** can submit leads and assessments
- **All data saves permanently** to MongoDB Atlas  
- **Admin panel remains secure** and accessible only to you
- **Real-time monitoring** and analytics are available

Deploy to your hosting provider and your lead generation system will be live! 🚀