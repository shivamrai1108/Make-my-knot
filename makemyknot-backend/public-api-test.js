// Public API Testing Script
// This script helps you test the public endpoints from anywhere

const API_BASE_URL = 'http://localhost:4000/api'; // Change this to your production URL when deployed

// Test Lead Submission (Public Access)
async function testLeadSubmission() {
  const leadData = {
    name: "Test User",
    email: "test@example.com",
    phone: "+919876543210",
    answers: {
      "looking_for": "Serious relationship",
      "age_preference": "25-30",
      "location": "Delhi",
      "profession": "Software Engineer"
    },
    source: "website"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    });

    const result = await response.json();
    console.log('Lead Submission Test:', result);
    return result;
  } catch (error) {
    console.error('Lead Submission Error:', error);
  }
}

// Test Questionnaire Submission (Public Access)
async function testQuestionnaireSubmission() {
  const questionnaireData = {
    userEmail: "test@example.com",
    userName: "Test User",
    userPhone: "+919876543210",
    userType: "lead",
    source: "website",
    responses: {
      "relationship_goals": "Marriage",
      "family_importance": "Very Important",
      "career_ambition": "High",
      "lifestyle_preferences": ["Health-conscious", "Travel"],
      "values": ["Honesty", "Loyalty", "Family"]
    },
    completionTime: 300,
    metadata: {
      browser: "Chrome",
      device: "Desktop"
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}/questionnaires/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionnaireData)
    });

    const result = await response.json();
    console.log('Questionnaire Submission Test:', result);
    return result;
  } catch (error) {
    console.error('Questionnaire Submission Error:', error);
  }
}

// Test Admin Login (Protected)
async function testAdminLogin() {
  const loginData = {
    username: "admin",
    password: "admin123"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const result = await response.json();
    console.log('Admin Login Test:', result);
    return result;
  } catch (error) {
    console.error('Admin Login Error:', error);
  }
}

// Test Health Check
async function testHealthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const result = await response.json();
    console.log('Health Check:', result);
    return result;
  } catch (error) {
    console.error('Health Check Error:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Running Public API Tests...\n');
  
  console.log('1. Testing Health Check...');
  await testHealthCheck();
  
  console.log('\n2. Testing Lead Submission...');
  await testLeadSubmission();
  
  console.log('\n3. Testing Questionnaire Submission...');
  await testQuestionnaireSubmission();
  
  console.log('\n4. Testing Admin Login...');
  await testAdminLogin();
  
  console.log('\n✅ All tests completed!');
}

// For Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testLeadSubmission,
    testQuestionnaireSubmission,
    testAdminLogin,
    testHealthCheck,
    runAllTests
  };
}

// For browser environment
if (typeof window !== 'undefined') {
  window.MakeMyKnotAPI = {
    testLeadSubmission,
    testQuestionnaireSubmission,
    testAdminLogin,
    testHealthCheck,
    runAllTests
  };
}

// Auto-run if called directly
if (typeof require !== 'undefined' && require.main === module) {
  // Install fetch for Node.js if needed
  if (typeof fetch === 'undefined') {
    global.fetch = require('node-fetch');
  }
  runAllTests();
}