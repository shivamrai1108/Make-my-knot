#!/usr/bin/env node

/**
 * MongoDB Assessment Collection Update Script
 * This script will:
 * 1. Connect to MongoDB
 * 2. Create the Assessment collection with proper indexes
 * 3. Migrate existing questionnaire data to Assessment format
 * 4. Test the Assessment API endpoints
 * 5. Verify data integrity
 */

const { MongoClient } = require('mongodb');

// MongoDB connection details
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shivamrai:Test%40123@cluster0.z8mhs.mongodb.net/makemyknot?retryWrites=true&w=majority';
const DATABASE_NAME = 'makemyknot';

// Assessment schema structure
const ASSESSMENT_SCHEMA = {
  name: { type: 'string', required: true },
  email: { type: 'string', required: true },
  phone: { type: 'string', required: true },
  responses: {
    spirituality_importance: 'string',
    premarital_counseling: 'string',
    shared_interests_importance: 'string',
    relocation_openness: 'string',
    children_perspective: 'string',
    caste_importance: 'string',
    weekend_preferences: 'array',
    family_independence_scenario: 'string',
    hobbies_activities: 'array',
    drinking_habits: 'string',
    smoking_habits: 'string',
    relationship_reasons: 'array',
    career_opportunity_scenario: 'string',
    family_gathering_scenario: 'string'
  },
  completionTime: 'number',
  isComplete: 'boolean',
  completedAt: 'date',
  source: 'string',
  leadId: 'string',
  userId: 'objectId',
  ipAddress: 'string',
  userAgent: 'string',
  submittedFrom: 'string',
  createdAt: 'date',
  updatedAt: 'date'
};

async function connectToMongoDB() {
  console.log('🔗 Connecting to MongoDB...');
  console.log('📍 URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
  
  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  await client.connect();
  console.log('✅ Connected to MongoDB successfully');
  
  return client;
}

async function createAssessmentCollection(db) {
  console.log('\n📦 Setting up Assessment collection...');
  
  // Check if collection exists
  const collections = await db.listCollections({ name: 'assessments' }).toArray();
  
  if (collections.length === 0) {
    console.log('🆕 Creating new Assessment collection...');
    await db.createCollection('assessments');
  } else {
    console.log('📋 Assessment collection already exists');
  }
  
  const assessmentCollection = db.collection('assessments');
  
  // Create indexes for better performance
  console.log('📊 Creating indexes...');
  
  await assessmentCollection.createIndex({ email: 1 }, { unique: false }); // Not unique to allow updates
  await assessmentCollection.createIndex({ leadId: 1 });
  await assessmentCollection.createIndex({ userId: 1 });
  await assessmentCollection.createIndex({ createdAt: -1 });
  await assessmentCollection.createIndex({ isComplete: 1, completedAt: -1 });
  await assessmentCollection.createIndex({ source: 1 });
  
  console.log('✅ Assessment collection and indexes created successfully');
  
  return assessmentCollection;
}

async function migrateExistingData(db, assessmentCollection) {
  console.log('\n🔄 Checking for existing questionnaire data to migrate...');
  
  // Get existing questionnaire responses
  const questionnaireCollection = db.collection('questionnaireresponses');
  const existingQuestionnaires = await questionnaireCollection.find({}).toArray();
  
  console.log(`📊 Found ${existingQuestionnaires.length} existing questionnaire responses`);
  
  if (existingQuestionnaires.length === 0) {
    console.log('ℹ️ No existing questionnaire data to migrate');
    return;
  }
  
  // Get leads collection for user info
  const leadsCollection = db.collection('leads');
  const existingLeads = await leadsCollection.find({}).toArray();
  
  console.log(`📊 Found ${existingLeads.length} existing leads`);
  
  let migratedCount = 0;
  
  for (const questionnaire of existingQuestionnaires) {
    try {
      // Find corresponding lead if leadId exists
      let userInfo = {
        name: questionnaire.userName || 'Unknown User',
        email: questionnaire.userEmail || 'unknown@example.com',
        phone: questionnaire.userPhone || ''
      };
      
      if (questionnaire.leadId) {
        const lead = existingLeads.find(l => 
          l._id.toString() === questionnaire.leadId || l.id === questionnaire.leadId
        );
        
        if (lead) {
          userInfo = {
            name: lead.name || userInfo.name,
            email: lead.email || userInfo.email,
            phone: lead.phone || userInfo.phone
          };
        }
      }
      
      // Check if this assessment already exists in Assessment collection
      const existingAssessment = await assessmentCollection.findOne({
        email: userInfo.email.toLowerCase()
      });
      
      if (existingAssessment) {
        console.log(`⚠️ Assessment for ${userInfo.email} already exists, skipping...`);
        continue;
      }
      
      // Create new assessment document
      const assessmentDoc = {
        name: userInfo.name,
        email: userInfo.email.toLowerCase(),
        phone: userInfo.phone,
        responses: questionnaire.responses || {},
        completionTime: questionnaire.completionTime || 0,
        isComplete: questionnaire.isComplete || false,
        completedAt: questionnaire.completedAt ? new Date(questionnaire.completedAt) : null,
        source: questionnaire.source || 'migrated_data',
        leadId: questionnaire.leadId || null,
        userId: questionnaire.userId || null,
        ipAddress: questionnaire.metadata?.ipAddress || null,
        userAgent: questionnaire.metadata?.userAgent || null,
        submittedFrom: 'migration',
        createdAt: questionnaire.createdAt ? new Date(questionnaire.createdAt) : new Date(),
        updatedAt: questionnaire.updatedAt ? new Date(questionnaire.updatedAt) : new Date()
      };
      
      await assessmentCollection.insertOne(assessmentDoc);
      migratedCount++;
      
      console.log(`✅ Migrated assessment for ${userInfo.name} (${userInfo.email})`);
      
    } catch (error) {
      console.error(`❌ Failed to migrate questionnaire ${questionnaire._id}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Migration complete! Migrated ${migratedCount} assessments`);
}

async function createSampleAssessment(assessmentCollection) {
  console.log('\n📝 Creating sample assessment for testing...');
  
  const sampleAssessment = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '9876543210',
    responses: {
      spirituality_importance: 'Very important',
      premarital_counseling: 'I\'m open to it.',
      shared_interests_importance: 'Somewhat important',
      relocation_openness: 'Yes, I\'m fully open to relocating.',
      children_perspective: 'I definitely want children.',
      caste_importance: 'Not at all',
      weekend_preferences: ['Reading', 'Traveling'],
      family_independence_scenario: 'I would speak with both my parents and my partner to find a compromise, perhaps by living nearby or making a clear plan for how we can all be together.',
      hobbies_activities: ['Reading', 'Traveling', 'Cooking'],
      drinking_habits: 'No',
      smoking_habits: 'No',
      relationship_reasons: ['Emotional security', 'Having a partner I can trust'],
      career_opportunity_scenario: 'I would fully support them, no questions asked. Their dream is our dream, and we would figure out a way to make it work together.',
      family_gathering_scenario: 'The Compromiser: "I would attend the family gathering for a few hours and then politely excuse ourselves to spend some private time together."'
    },
    completionTime: 12,
    isComplete: true,
    completedAt: new Date(),
    source: 'test_data',
    leadId: null,
    userId: null,
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Test Browser)',
    submittedFrom: 'script',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Check if sample already exists
  const existingSample = await assessmentCollection.findOne({ email: sampleAssessment.email });
  
  if (existingSample) {
    console.log('⚠️ Sample assessment already exists');
  } else {
    await assessmentCollection.insertOne(sampleAssessment);
    console.log('✅ Sample assessment created successfully');
  }
}

async function testAssessmentCollection(assessmentCollection) {
  console.log('\n🧪 Testing Assessment collection...');
  
  // Test 1: Count documents
  const totalCount = await assessmentCollection.countDocuments();
  console.log(`📊 Total assessments in collection: ${totalCount}`);
  
  // Test 2: Count complete assessments
  const completeCount = await assessmentCollection.countDocuments({ isComplete: true });
  console.log(`✅ Complete assessments: ${completeCount}`);
  
  // Test 3: Count by source
  const sourceStats = await assessmentCollection.aggregate([
    { $group: { _id: '$source', count: { $sum: 1 } } }
  ]).toArray();
  
  console.log('📈 Assessments by source:');
  sourceStats.forEach(stat => {
    console.log(`  - ${stat._id}: ${stat.count}`);
  });
  
  // Test 4: Sample recent assessments
  const recentAssessments = await assessmentCollection
    .find({})
    .sort({ createdAt: -1 })
    .limit(3)
    .toArray();
  
  console.log('\n📋 Recent assessments:');
  recentAssessments.forEach(assessment => {
    console.log(`  - ${assessment.name} (${assessment.email}) - ${assessment.isComplete ? 'Complete' : 'Incomplete'}`);
  });
  
  return {
    totalCount,
    completeCount,
    sourceStats,
    recentAssessments
  };
}

async function testAPIEndpoints() {
  console.log('\n🌐 Testing Assessment API endpoints...');
  
  const API_BASE_URL = 'https://makemyknot-backend-production.up.railway.app/api';
  
  try {
    // Test GET /api/assessments/admin
    console.log('📤 Testing GET /api/assessments/admin...');
    const response = await fetch(`${API_BASE_URL}/assessments/admin`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API Test Success - Found ${data.data?.assessments?.length || 0} assessments`);
      
      if (data.data?.assessments?.length > 0) {
        const sample = data.data.assessments[0];
        console.log(`📊 Sample assessment: ${sample.name} (${sample.email})`);
      }
    } else {
      console.log(`❌ API Test Failed - Status: ${response.status}`);
      const errorText = await response.text();
      console.log(`Error: ${errorText}`);
    }
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting MongoDB Assessment Collection Update\n');
  
  let client;
  
  try {
    // Connect to MongoDB
    client = await connectToMongoDB();
    const db = client.db(DATABASE_NAME);
    
    // Create Assessment collection
    const assessmentCollection = await createAssessmentCollection(db);
    
    // Migrate existing data
    await migrateExistingData(db, assessmentCollection);
    
    // Create sample assessment
    await createSampleAssessment(assessmentCollection);
    
    // Test the collection
    const testResults = await testAssessmentCollection(assessmentCollection);
    
    // Test API endpoints
    await testAPIEndpoints();
    
    console.log('\n🎉 MongoDB Assessment collection update completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Total assessments: ${testResults.totalCount}`);
    console.log(`   - Complete assessments: ${testResults.completeCount}`);
    console.log(`   - Collection created with proper indexes`);
    console.log(`   - Sample data available for testing`);
    
  } catch (error) {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 MongoDB connection closed');
    }
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };