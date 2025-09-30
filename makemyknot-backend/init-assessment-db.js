/**
 * Assessment Collection Initialization Script
 * Run this on Railway backend to initialize Assessment collection
 */

const mongoose = require('mongoose');
const Assessment = require('./src/models/Assessment');
const Lead = require('./src/models/Lead');

// Sample assessment data
const SAMPLE_ASSESSMENTS = [
  {
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
    source: 'sample_data',
    submittedFrom: 'initialization'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com', 
    phone: '9876543211',
    responses: {
      spirituality_importance: 'Somewhat important',
      premarital_counseling: 'I prefer not to.',
      shared_interests_importance: 'Very important',
      relocation_openness: 'Yes, but only within a specific region or country.',
      children_perspective: 'I am open to it, but it\'s not a priority.',
      caste_importance: 'Yes, somewhat',
      weekend_preferences: ['Socializing with friends', 'Going out for drinks or dinner'],
      family_independence_scenario: 'I would prioritize my parents\' wishes and explain to my partner that living with my family is a non-negotiable part of my life and values.',
      hobbies_activities: ['Sports', 'Listening to music', 'Watching movies/shows'],
      drinking_habits: 'Yes, socially',
      smoking_habits: 'Sometimes',
      relationship_reasons: ['To build a family', 'Life is easier with a partner'],
      career_opportunity_scenario: 'I\'d be supportive but would want to have a serious conversation about the practical details, like our jobs, finances, and how we\'d maintain the relationship long-distance.',
      family_gathering_scenario: 'The Dutiful Relative: "I would prioritize the family gathering, as it is an important obligation, and explain to my partner that we can have our private time later."'
    },
    completionTime: 8,
    isComplete: true,
    completedAt: new Date(),
    source: 'sample_data',
    submittedFrom: 'initialization'
  }
];

async function initializeAssessmentCollection() {
  try {
    console.log('🚀 Initializing Assessment collection...');
    
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ MongoDB not connected. Make sure the server is running with proper DB connection.');
      return;
    }
    
    console.log('✅ MongoDB connected successfully');
    
    // Check if Assessment collection exists
    const collections = await mongoose.connection.db.listCollections({ name: 'assessments' }).toArray();
    
    if (collections.length === 0) {
      console.log('🆕 Assessment collection does not exist, it will be created automatically');
    } else {
      console.log('📋 Assessment collection already exists');
    }
    
    // Count existing assessments
    const existingCount = await Assessment.countDocuments();
    console.log(`📊 Found ${existingCount} existing assessments`);
    
    // Create sample assessments if collection is empty
    if (existingCount === 0) {
      console.log('📝 Creating sample assessment data...');
      
      for (const sampleData of SAMPLE_ASSESSMENTS) {
        try {
          const assessment = new Assessment(sampleData);
          await assessment.save();
          console.log(`✅ Created sample assessment for ${sampleData.name}`);
        } catch (error) {
          console.error(`❌ Failed to create sample assessment for ${sampleData.name}:`, error.message);
        }
      }
    }
    
    // Test Assessment model
    console.log('\n🧪 Testing Assessment model...');
    
    const totalAssessments = await Assessment.countDocuments();
    const completeAssessments = await Assessment.countDocuments({ isComplete: true });
    
    console.log(`📊 Total assessments: ${totalAssessments}`);
    console.log(`✅ Complete assessments: ${completeAssessments}`);
    
    // Test aggregation
    const sourceStats = await Assessment.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);
    
    console.log('📈 Assessments by source:');
    sourceStats.forEach(stat => {
      console.log(`  - ${stat._id}: ${stat.count}`);
    });
    
    // Test recent assessments
    const recentAssessments = await Assessment.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name email isComplete createdAt');
    
    console.log('\n📋 Recent assessments:');
    recentAssessments.forEach(assessment => {
      console.log(`  - ${assessment.name} (${assessment.email}) - ${assessment.isComplete ? 'Complete' : 'Incomplete'}`);
    });
    
    console.log('\n🎉 Assessment collection initialization completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Total assessments: ${totalAssessments}`);
    console.log(`   - Complete assessments: ${completeAssessments}`);
    console.log(`   - Assessment model is working correctly`);
    console.log(`   - Ready for API endpoints`);
    
    return {
      totalAssessments,
      completeAssessments,
      sourceStats,
      recentAssessments
    };
    
  } catch (error) {
    console.error('❌ Assessment collection initialization failed:', error);
    throw error;
  }
}

// Export for use in other files
module.exports = { initializeAssessmentCollection, SAMPLE_ASSESSMENTS };

// If running directly
if (require.main === module) {
  console.log('⚠️ This script should be run from within the Railway backend environment');
  console.log('💡 Add this to your backend startup or run via API endpoint');
}