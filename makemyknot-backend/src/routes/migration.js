const express = require('express');
const router = express.Router();

// Import models
const User = require('../models/User');
const Lead = require('../models/Lead');
const Questionnaire = require('../models/QuestionnaireResponse');

// Migrate leads from localStorage to MongoDB
router.post('/leads', async (req, res) => {
  try {
    const leadData = req.body;
    
    // Check if lead already exists
    const existingLead = await Lead.findOne({ 
      $or: [
        { email: leadData.email },
        { migrationId: leadData.id }
      ]
    });
    
    if (existingLead) {
      return res.json({
        status: 'success',
        message: 'Lead already exists',
        data: { lead: existingLead }
      });
    }
    
    // Create new lead with migration data
    const newLead = new Lead({
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      answers: leadData.answers,
      status: leadData.status || 'new',
      source: leadData.source || 'website',
      leadScore: leadData.leadScore,
      notes: leadData.notes,
      assignedTo: leadData.assignedTo,
      followUpDate: leadData.followUpDate,
      isActive: leadData.isActive !== false,
      migrationId: leadData.id,
      migratedFromLocalStorage: true,
      createdAt: leadData.createdAt ? new Date(leadData.createdAt) : new Date(),
      updatedAt: leadData.updatedAt ? new Date(leadData.updatedAt) : new Date()
    });
    
    await newLead.save();
    
    res.json({
      status: 'success',
      message: 'Lead migrated successfully',
      data: { lead: newLead }
    });
  } catch (error) {
    console.error('Lead migration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to migrate lead',
      error: error.message
    });
  }
});

// Migrate questionnaires from localStorage to MongoDB
router.post('/questionnaires', async (req, res) => {
  try {
    const questionnaireData = req.body;
    
    // Check if questionnaire already exists
    const existingQuestionnaire = await Questionnaire.findOne({ 
      migrationId: questionnaireData.id 
    });
    
    if (existingQuestionnaire) {
      return res.json({
        status: 'success',
        message: 'Questionnaire already exists',
        data: { questionnaire: existingQuestionnaire }
      });
    }
    
    // Create new questionnaire with migration data
    const newQuestionnaire = new Questionnaire({
      userId: questionnaireData.userId,
      leadId: questionnaireData.leadId,
      userEmail: questionnaireData.userEmail,
      userName: questionnaireData.userName,
      userPhone: questionnaireData.userPhone,
      userType: questionnaireData.userType || 'lead',
      responses: questionnaireData.responses,
      completedAt: questionnaireData.completedAt ? new Date(questionnaireData.completedAt) : null,
      isComplete: questionnaireData.isComplete || false,
      source: questionnaireData.source || 'website',
      completionTime: questionnaireData.completionTime,
      migrationId: questionnaireData.id,
      migratedFromLocalStorage: true,
      createdAt: questionnaireData.createdAt ? new Date(questionnaireData.createdAt) : new Date(),
      updatedAt: questionnaireData.updatedAt ? new Date(questionnaireData.updatedAt) : new Date()
    });
    
    await newQuestionnaire.save();
    
    res.json({
      status: 'success',
      message: 'Questionnaire migrated successfully',
      data: { questionnaire: newQuestionnaire }
    });
  } catch (error) {
    console.error('Questionnaire migration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to migrate questionnaire',
      error: error.message
    });
  }
});

// Migrate users from localStorage to MongoDB
router.post('/users', async (req, res) => {
  try {
    const userData = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: userData.email },
        { migrationId: userData.id }
      ]
    });
    
    if (existingUser) {
      return res.json({
        status: 'success',
        message: 'User already exists',
        data: { user: existingUser }
      });
    }
    
    // Create new user with migration data
    const newUser = new User({
      firstName: userData.name ? userData.name.split(' ')[0] : '',
      lastName: userData.name ? userData.name.split(' ').slice(1).join(' ') : '',
      email: userData.email,
      phoneNumber: userData.phone,
      age: userData.age,
      bio: userData.bio,
      location: {
        city: userData.location,
        country: 'India' // Default
      },
      preferences: {
        education: userData.education,
        occupation: userData.profession,
        interests: userData.interests,
      },
      values: userData.values,
      partnerPreferences: userData.partnerPreferences,
      profileComplete: userData.profileComplete || false,
      questionnaireComplete: userData.questionnaireComplete || false,
      subscription: userData.subscription,
      verification: {
        isEmailVerified: userData.isVerified || false,
        isPhoneVerified: false
      },
      migrationId: userData.id,
      migratedFromLocalStorage: true,
      // For demo purposes only - in production, passwords should be properly hashed
      passwordHash: userData.passwordHash || 'migrated-demo-user',
      createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date()
    });
    
    await newUser.save();
    
    res.json({
      status: 'success',
      message: 'User migrated successfully',
      data: { user: newUser }
    });
  } catch (error) {
    console.error('User migration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to migrate user',
      error: error.message
    });
  }
});

// Migrate admin data from localStorage to MongoDB
router.post('/admin', async (req, res) => {
  try {
    const { key, data } = req.body;
    
    // Store admin data in a generic collection for now
    // In production, you might want to create specific models for different admin data types
    const AdminData = require('../models/AdminData'); // You'll need to create this model
    
    const existingData = await AdminData.findOne({ key });
    
    if (existingData) {
      // Update existing data
      existingData.data = data;
      existingData.updatedAt = new Date();
      await existingData.save();
      
      return res.json({
        status: 'success',
        message: 'Admin data updated successfully',
        data: { adminData: existingData }
      });
    }
    
    // Create new admin data
    const newAdminData = new AdminData({
      key,
      data,
      migratedFromLocalStorage: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newAdminData.save();
    
    res.json({
      status: 'success',
      message: 'Admin data migrated successfully',
      data: { adminData: newAdminData }
    });
  } catch (error) {
    console.error('Admin data migration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to migrate admin data',
      error: error.message
    });
  }
});

// Get migration status
router.get('/status', async (req, res) => {
  try {
    const [leadCount, questionnaireCount, userCount] = await Promise.all([
      Lead.countDocuments({ migratedFromLocalStorage: true }),
      Questionnaire.countDocuments({ migratedFromLocalStorage: true }),
      User.countDocuments({ migratedFromLocalStorage: true })
    ]);
    
    res.json({
      status: 'success',
      data: {
        migratedCounts: {
          leads: leadCount,
          questionnaires: questionnaireCount,
          users: userCount
        },
        totalMigrated: leadCount + questionnaireCount + userCount
      }
    });
  } catch (error) {
    console.error('Migration status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get migration status',
      error: error.message
    });
  }
});

module.exports = router;
