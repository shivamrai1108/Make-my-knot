const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
require('dotenv').config();

async function setupDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully!');
    
    // Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      console.log('✅ Super admin already exists:', existingSuperAdmin.email);
    } else {
      console.log('🔧 Creating default super admin...');
      
      // Create default super admin
      const superAdmin = await Admin.create({
        username: 'admin',
        email: 'admin@makemyknot.com',
        password: 'admin123',
        firstName: 'Super',
        lastName: 'Admin',
        phoneNumber: '+919758909099',
        role: 'super_admin',
        permissions: Admin.getDefaultPermissions('super_admin'),
        isVerified: true,
        isActive: true,
        settings: {
          dashboard: {
            theme: 'light',
            defaultTab: 'dashboard',
            notifications: {
              email: true,
              browser: true,
              sms: false
            }
          },
          crm: {
            provider: 'none',
            isEnabled: false,
            syncFrequency: 60,
            autoSync: false
          },
          system: {
            maintenanceMode: false,
            debugMode: false,
            logLevel: 'info'
          }
        }
      });
      
      console.log('✅ Super admin created successfully!');
      console.log('📧 Email:', superAdmin.email);
      console.log('👤 Username:', superAdmin.username);
      console.log('🔒 Password: admin123');
      console.log('⚠️  Please change the default password after first login!');
    }
    
    // Create some sample admin data
    const AdminData = require('./src/models/AdminData');
    
    const sampleAdminData = [
      {
        key: 'dashboard_settings',
        data: {
          theme: 'light',
          language: 'en',
          timezone: 'Asia/Kolkata',
          dateFormat: 'DD/MM/YYYY',
          currency: 'INR'
        }
      },
      {
        key: 'crm_settings',
        data: {
          provider: 'none',
          isEnabled: false,
          lastSync: null,
          syncFrequency: 60,
          autoSync: false
        }
      },
      {
        key: 'system_settings',
        data: {
          maintenanceMode: false,
          debugMode: true,
          logLevel: 'info',
          backupEnabled: true,
          backupFrequency: 'daily'
        }
      },
      {
        key: 'notification_settings',
        data: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          webhookUrl: '',
          slackIntegration: false
        }
      }
    ];
    
    for (const data of sampleAdminData) {
      const existingData = await AdminData.findOne({ key: data.key });
      if (!existingData) {
        await AdminData.create(data);
        console.log(`✅ Created admin data: ${data.key}`);
      }
    }
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the backend server: npm start or node src/index.js');
    console.log('2. Login to admin panel with:');
    console.log('   - Username: admin');
    console.log('   - Password: admin123');
    console.log('3. Change the default admin password');
    console.log('4. Configure CRM and other settings as needed');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.message.includes('IP')) {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Go to MongoDB Atlas dashboard');
      console.log('2. Navigate to Network Access');
      console.log('3. Add your current IP address to the whitelist');
      console.log('4. Or add 0.0.0.0/0 for development (not recommended for production)');
      console.log('5. Run this script again after updating IP whitelist');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

setupDatabase();