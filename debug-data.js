// Debug script to check localStorage data and create test data
console.log('=== DEBUGGING LEAD AND ASSESSMENT DATA ===');

// Check current localStorage data
console.log('1. Current leads in localStorage:');
const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]');
console.log('Leads count:', leads.length);
console.log('Leads data:', leads);

console.log('\n2. Current assessments in localStorage:');
const assessments = JSON.parse(localStorage.getItem('questionnaire_responses') || '[]');
console.log('Assessments count:', assessments.length);
console.log('Assessments data:', assessments);

console.log('\n3. Session storage data:');
console.log('leadSubmitted:', sessionStorage.getItem('leadSubmitted'));
console.log('leadId:', sessionStorage.getItem('leadId'));

// Create test lead data
console.log('\n4. Creating test lead data...');
const testLead = {
  id: `test_lead_${Date.now()}`,
  name: 'Test User',
  email: 'test@makemyknot.com',
  phone: '9876543210',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'new',
  answers: {
    matchmaking_experience: 'No',
    gender_identity: 'Man',
    open_to_meeting: 'Women',
    preferred_age_range: '25-30',
    current_location: 'Mumbai, India'
  },
  isPermanent: true,
  savedToCRM: true
};

// Save test lead
const existingLeads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]');
existingLeads.push(testLead);
localStorage.setItem('makemyknot_leads', JSON.stringify(existingLeads));
console.log('✅ Test lead created with ID:', testLead.id);

// Create test assessment
const testAssessment = {
  id: testLead.id,
  leadId: testLead.id,
  userName: testLead.name,
  userEmail: testLead.email,
  userPhone: testLead.phone,
  userType: 'lead',
  source: 'lead_assessment',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
  isComplete: true,
  responses: {
    spirituality_importance: 'Very Important',
    career_priority: 'Balanced approach',
    communication_style: 'Direct and honest',
    relationship_reasons: ['Love and companionship', 'Family pressure'],
    weekend_preferences: ['Quiet time at home', 'Social gatherings'],
  },
  completionTime: 5
};

// Save test assessment
const existingAssessments = JSON.parse(localStorage.getItem('questionnaire_responses') || '[]');
existingAssessments.push(testAssessment);
localStorage.setItem('questionnaire_responses', JSON.stringify(existingAssessments));
console.log('✅ Test assessment created for lead:', testLead.id);

console.log('\n5. Final data check:');
console.log('Total leads:', JSON.parse(localStorage.getItem('makemyknot_leads') || '[]').length);
console.log('Total assessments:', JSON.parse(localStorage.getItem('questionnaire_responses') || '[]').length);

console.log('\n6. Instructions:');
console.log('- Open the admin panel and check if the test data appears');
console.log('- The test lead should appear in the CRM & Leads section');
console.log('- The test assessment should appear in the Assessments section');
console.log('- If data still doesn\'t show, there may be an issue with the admin panel loading');