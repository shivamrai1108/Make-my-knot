// Run this script in your browser console (F12 -> Console) while on localhost:3000
// This will test the exact same API call that your form should be making

async function testBrowserFormSubmission() {
  console.log('🔍 DEBUG: Testing browser form submission...');
  
  // Get the API URL from environment (same as your app uses)
  const API_BASE_URL = 'http://localhost:4000/api'; // Your configured URL
  
  console.log('🔍 DEBUG: Browser API_BASE_URL:', API_BASE_URL);
  console.log('🔍 DEBUG: Current page origin:', window.location.origin);

  // Sample form data that matches your LeadQuestionnaire.tsx structure
  const leadData = {
    name: 'Browser Test User',
    email: 'browsertest@example.com',
    phone: '9876543210',
    password: 'TestPass123!',
    dateOfBirth: '1995-01-01',
    countryCode: '+91',
    source: 'website',
    answers: {
      matchmaking_experience: 'Yes',
      gender_identity: 'Man',
      open_to_meeting: 'Women',
      preferred_age_range: '25-35',
      current_location: 'Delhi',
      // Include all fields that form collects
      dateOfBirth: '1995-01-01',
      countryCode: '+91',
      fullPhoneNumber: '+919876543210',
      biodataFileName: null,
      hasBiodata: false,
      hasPassword: true
    }
  };

  console.log('🔍 DEBUG: Payload to send:', leadData);
  console.log('🔍 DEBUG: Full API URL:', `${API_BASE_URL}/leads`);

  try {
    console.log('🔄 Attempt 1: Making API request...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('🔍 DEBUG: Response status:', response.status);
    console.log('🔍 DEBUG: Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DEBUG: Error response text:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ DEBUG: Success response:', result);
    
    return result;
  } catch (error) {
    console.error('❌ DEBUG: Browser form submission failed:', error.message);
    console.error('❌ DEBUG: Error details:', error);
    throw error;
  }
}

// Test CORS preflight
async function testCORS() {
  console.log('🔍 Testing CORS...');
  
  try {
    const response = await fetch('http://localhost:4000/api/health', {
      method: 'GET',
    });
    
    console.log('✅ CORS test passed - Health endpoint accessible');
    console.log('Response:', await response.json());
  } catch (error) {
    console.error('❌ CORS test failed:', error);
  }
}

// Run tests
console.log('🚀 Starting browser debugging...');

// Test CORS first
testCORS().then(() => {
  // Then test form submission
  return testBrowserFormSubmission();
}).then(result => {
  console.log('🎉 Browser form submission test PASSED!');
  console.log('✅ Lead saved with ID:', result.data.lead._id);
  console.log('✅ Lead email:', result.data.lead.email);
}).catch(error => {
  console.log('💥 Browser form submission test FAILED!');
  console.error('❌ Error:', error);
});

// Instructions
console.log(`
📋 INSTRUCTIONS:
1. Open your browser to http://localhost:3000
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Copy and paste this entire script
5. Press Enter to run
6. Check the results above
`);