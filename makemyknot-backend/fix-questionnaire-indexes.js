const mongoose = require('mongoose');
require('dotenv').config();

async function fixQuestionnaireIndexes() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully!');

    const db = mongoose.connection.db;
    const collection = db.collection('questionnaireresponses');

    console.log('📋 Current indexes:');
    const indexes = await collection.listIndexes().toArray();
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // Drop the problematic unique index on userId
    try {
      await collection.dropIndex('userId_1');
      console.log('✅ Dropped problematic userId_1 index');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️  userId_1 index not found, skipping');
      } else {
        console.log('⚠️  Error dropping userId_1 index:', error.message);
      }
    }

    // Create new sparse indexes
    console.log('🔧 Creating new sparse indexes...');
    
    await collection.createIndex({ userId: 1 }, { sparse: true });
    console.log('✅ Created sparse index on userId');
    
    await collection.createIndex({ userEmail: 1 }, { sparse: true });
    console.log('✅ Created sparse index on userEmail');
    
    await collection.createIndex({ leadId: 1 }, { sparse: true });
    console.log('✅ Created sparse index on leadId');
    
    await collection.createIndex({ userType: 1, createdAt: -1 });
    console.log('✅ Created compound index on userType and createdAt');

    console.log('\n📋 Updated indexes:');
    const newIndexes = await collection.listIndexes().toArray();
    newIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)} ${index.sparse ? '(sparse)' : ''}`);
    });

    console.log('\n🎉 Questionnaire indexes fixed successfully!');
    console.log('Now public questionnaire submissions should work without conflicts.');

  } catch (error) {
    console.error('❌ Failed to fix indexes:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixQuestionnaireIndexes();