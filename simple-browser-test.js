// Copy and paste this script into your browser console (F12 -> Console) while on localhost:3000
// This will test your environment and API connectivity

console.log('🚀 Starting browser environment and API test...');

// Test 1: Check environment variables
console.log('\n📊 Environment Check:');
console.log('- Current URL:', window.location.href);
console.log('- Origin:', window.location.origin);

// Test 2: Check if Next.js environment variables are available
console.log('\n🔧 Next.js Environment Variables:');
console.log('- NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

// Test 3: Test API connectivity
async function testAPI() {
  console.log('\n🌐 API Connectivity Test:');
  
  const apiUrl = 'http://localhost:4000/api';
  console.log('- Testing health endpoint:', `${apiUrl}/health`);
  
  try {
    const response = await fetch(`${apiUrl}/health`);
    const data = await response.json();
    console.log('✅ Health check passed:', data);
    
    // Test leads endpoint
    console.log('\n- Testing leads endpoint...');
    const testData = {
      name: 'Browser API Test',
      email: 'browserapitest@example.com',
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
        current_location: 'Delhi'
      }
    };
    
    const leadResponse = await fetch(`${apiUrl}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    if (leadResponse.ok) {
      const leadResult = await leadResponse.json();
      console.log('✅ Lead API test passed:', leadResult);
      console.log('✅ Lead saved with ID:', leadResult.data.lead._id);
      return true;
    } else {
      const errorText = await leadResponse.text();
      console.error('❌ Lead API test failed:', leadResponse.status, errorText);
      return false;
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    return false;
  }
}

// Test 4: Check if saveLead function is available
console.log('\n📦 Module Availability:');
try {
  console.log('- Checking if saveLead is available globally...');
  // Note: This will likely fail since modules aren't global, but worth checking
  if (typeof saveLead !== 'undefined') {
    console.log('✅ saveLead function is globally available');
  } else {
    console.log('⚠️ saveLead function not globally available (this is normal in Next.js)');
  }
} catch (error) {
  console.log('⚠️ Module check failed (this is normal):', error.message);
}

// Run the API test
testAPI().then(success => {
  console.log('\n🎯 Test Results:');
  if (success) {
    console.log('✅ All API tests passed! Your backend is working correctly.');
    console.log('🔍 If your form still doesn\'t work, the issue is in the frontend form logic.');
  } else {
    console.log('❌ API tests failed. Check your backend server.');
  }
}).catch(error => {
  console.error('💥 Test execution failed:', error);
});

// Instructions
console.log(`
📋 NEXT STEPS:
1. Copy this entire script
2. Open browser to http://localhost:3000
3. Press F12 and go to Console tab
4. Paste and press Enter
5. Check the results above
6. Then try submitting your actual form and watch for debug logs
`);