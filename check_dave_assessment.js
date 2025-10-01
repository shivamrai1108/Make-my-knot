const { MongoClient } = require('mongodb');

async function checkDaveAssessment() {
  const uri = 'mongodb+srv://makemyknot:bCCFXmOj8BtuRuJA@makemyknot.fxqto.mongodb.net/?retryWrites=true&w=majority&appName=makemyknot';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db('makemyknot');
    
    // Check Dave's lead data
    console.log('\n📋 Searching for Dave in leads collection...');
    const leadsCollection = db.collection('leads');
    
    // Search by email and lead ID
    const lead = await leadsCollection.findOne({
      $or: [
        { email: 'dave@gmail.com' },
        { _id: '68dd0c04c73fe43d97299834' },
        { id: '68dd0c04c73fe43d97299834' }
      ]
    });
    
    if (lead) {
      console.log('✅ Found Dave in leads:');
      console.log({
        id: lead._id,
        name: lead.name,
        email: lead.email,
        status: lead.status,
        answers: Object.keys(lead.answers || {})
      });
    } else {
      console.log('❌ Dave not found in leads collection');
      
      // Try broader search
      const allLeads = await leadsCollection.find({ 
        email: { $regex: 'dave', $options: 'i' } 
      }).limit(5).toArray();
      console.log('\n🔍 Found similar leads:', allLeads.map(l => ({ 
        id: l._id, 
        name: l.name, 
        email: l.email 
      })));
    }
    
    // Check assessments collection for Dave
    console.log('\n🎯 Searching for Dave in assessments collection...');
    const assessmentsCollection = db.collection('assessments');
    
    const assessments = await assessmentsCollection.find({
      $or: [
        { email: 'dave@gmail.com' },
        { leadId: '68dd0c04c73fe43d97299834' },
        { name: { $regex: 'dave', $options: 'i' } }
      ]
    }).toArray();
    
    console.log(`Found ${assessments.length} assessments for Dave:`);
    assessments.forEach(assessment => {
      console.log({
        id: assessment._id,
        name: assessment.name,
        email: assessment.email,
        leadId: assessment.leadId,
        isComplete: assessment.isComplete,
        completionPercentage: assessment.completionPercentage,
        responseCount: Object.keys(assessment.responses || {}).length,
        createdAt: assessment.createdAt
      });
    });
    
    // Check questionnaires collection too
    console.log('\n📝 Searching in questionnaires collection...');
    const questionnairesCollection = db.collection('questionnaireresponses');
    
    const questionnaires = await questionnairesCollection.find({
      $or: [
        { userEmail: 'dave@gmail.com' },
        { leadId: '68dd0c04c73fe43d97299834' },
        { userName: { $regex: 'dave', $options: 'i' } }
      ]
    }).toArray();
    
    console.log(`Found ${questionnaires.length} questionnaire responses for Dave:`);
    questionnaires.forEach(q => {
      console.log({
        id: q._id,
        userName: q.userName,
        userEmail: q.userEmail,
        leadId: q.leadId,
        isComplete: q.isComplete,
        responseCount: Object.keys(q.responses || {}).length,
        createdAt: q.createdAt
      });
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkDaveAssessment().catch(console.error);