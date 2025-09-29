// Debug script to test the lead form submission issue
const API_BASE_URL = 'http://localhost:4000/api';

async function testFormSubmission() {
  console.log('🔍 DEBUG: Testing form submission...');
  console.log('🔍 DEBUG: API_BASE_URL:', API_BASE_URL);

  // Sample form data that matches your form structure
  const leadData = {
    name: 'Form Debug Test',
    email: 'formdebug@example.com',
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

  console.log('🔍 DEBUG: Payload to send:', leadData);
  console.log('🔍 DEBUG: Full API URL:', `${API_BASE_URL}/leads`);

  try {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    console.log('🔍 DEBUG: Response status:', response.status);
    console.log('🔍 DEBUG: Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DEBUG: Error response text:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ DEBUG: Success response:', result);
    
    return result;
  } catch (error) {
    console.error('❌ DEBUG: Form submission failed:', error.message);
    throw error;
  }
}

// Run the test
testFormSubmission()
  .then(result => {
    console.log('🎉 Form submission test PASSED!');
    console.log('Lead saved:', result.data.lead.email);
  })
  .catch(error => {
    console.log('💥 Form submission test FAILED!');
    console.error('Error:', error);
  });