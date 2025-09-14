const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Send welcome email to new users
  async sendWelcomeEmail(userEmail, userName) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@makemyknot.com',
      to: userEmail,
      subject: '🎉 Welcome to Make My Knot - Your Journey to Love Begins!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Make My Knot</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; }
            .container { background: white; margin: 20px; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 10px 0; }
            .features { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; }
            .feature { flex: 1; min-width: 200px; text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; }
            .heart { font-size: 24px; margin-bottom: 10px; }
            @media (max-width: 600px) { .features { flex-direction: column; } .container { margin: 10px; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💒 Welcome to Make My Knot!</h1>
              <p>Hi ${userName}, your journey to finding love starts here!</p>
            </div>
            
            <div class="content">
              <h2>🎊 Congratulations on joining our family!</h2>
              <p>We're thrilled to have you join thousands of people who have found their perfect life partners through Make My Knot. Our AI-powered platform combines 75 years of matchmaking expertise with cutting-edge technology to help you find meaningful connections.</p>
              
              <div class="features">
                <div class="feature">
                  <div class="heart">🤖</div>
                  <h3>AI Matching</h3>
                  <p>Advanced compatibility analysis using 50+ factors</p>
                </div>
                <div class="feature">
                  <div class="heart">❤️</div>
                  <h3>Quality Matches</h3>
                  <p>3-5 carefully curated matches per week</p>
                </div>
                <div class="feature">
                  <div class="heart">🎯</div>
                  <h3>Success Rate</h3>
                  <p>91% of our users find meaningful relationships</p>
                </div>
              </div>
              
              <h2>🚀 Get Started:</h2>
              <ol>
                <li><strong>Complete Your Profile:</strong> Add photos and details about yourself</li>
                <li><strong>Take the Compatibility Quiz:</strong> Help our AI understand your preferences</li>
                <li><strong>Review Your Matches:</strong> Start connecting with compatible partners</li>
                <li><strong>Chat & Connect:</strong> Use our secure messaging system</li>
              </ol>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://make-my-knot-kappa.vercel.app/dashboard" class="button">Complete Your Profile →</a>
              </div>
              
              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>💡 Pro Tip</h3>
                <p>Users with complete profiles get 3x more quality matches! Take 5 minutes to add your photos and complete the compatibility quiz.</p>
              </div>
              
              <h2>📞 Need Help?</h2>
              <p>Our support team is here to help you every step of the way:</p>
              <ul>
                <li>📧 Email: support@makemyknot.com</li>
                <li>💬 Live Chat: Available on our website</li>
                <li>📱 Phone: +91-XXXX-XXXXXX</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Made with ❤️ by Make My Knot Team</p>
              <p>Follow us: 
                <a href="#" style="color: #667eea;">Facebook</a> | 
                <a href="#" style="color: #667eea;">Instagram</a> | 
                <a href="#" style="color: #667eea;">Twitter</a>
              </p>
              <p><a href="#" style="color: #6c757d;">Unsubscribe</a> | <a href="#" style="color: #6c757d;">Privacy Policy</a></p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully to:', userEmail);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  // Send match notification
  async sendMatchNotification(userEmail, userName, matchName, compatibilityScore) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@makemyknot.com',
      to: userEmail,
      subject: `💕 New ${compatibilityScore}% Compatible Match Found!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%); color: white; padding: 30px; text-align: center;">
            <h1>💕 New Match Found!</h1>
            <p>Hi ${userName}, we found someone special for you!</p>
          </div>
          
          <div style="padding: 30px;">
            <h2>🎯 ${compatibilityScore}% Compatible Match</h2>
            <p>We're excited to introduce you to <strong>${matchName}</strong>! Based on our advanced compatibility analysis, you two have exceptional potential together.</p>
            
            <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="margin: 0; color: #1e40af;">Compatibility Score</h3>
              <div style="font-size: 48px; font-weight: bold; color: #ff6b6b; margin: 10px 0;">${compatibilityScore}%</div>
              <p style="margin: 0; color: #6b7280;">Exceptional match potential!</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://make-my-knot-kappa.vercel.app/matches" style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">View Match Profile →</a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; text-align: center;">Don't wait too long - great matches don't stay available forever!</p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Match notification sent successfully to:', userEmail);
    } catch (error) {
      console.error('Failed to send match notification:', error);
      throw error;
    }
  }

  // Send password reset email
  async sendPasswordReset(userEmail, resetToken) {
    const resetUrl = `https://make-my-knot-kappa.vercel.app/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@makemyknot.com',
      to: userEmail,
      subject: '🔐 Reset Your Make My Knot Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
          <h1 style="color: #333; text-align: center;">🔐 Password Reset Request</h1>
          
          <p>Hi there!</p>
          <p>We received a request to reset your password for your Make My Knot account. Click the button below to reset it:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Reset Password</a>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.</p>
          </div>
          
          <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
            Need help? Contact us at support@makemyknot.com
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully to:', userEmail);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  }

  // Send subscription confirmation email
  async sendSubscriptionConfirmation(userEmail, userName, planName, amount) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@makemyknot.com',
      to: userEmail,
      subject: '🎊 Subscription Activated - Welcome to Premium!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center;">
            <h1>🎊 Welcome to Premium!</h1>
            <p>Hi ${userName}, your subscription is now active!</p>
          </div>
          
          <div style="padding: 30px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <h2 style="margin: 0;">${planName}</h2>
              <p style="font-size: 24px; margin: 10px 0;">${amount}/month</p>
            </div>
            
            <h2>🚀 Your Premium Benefits:</h2>
            <ul style="line-height: 1.8;">
              <li>✅ Unlimited premium matches</li>
              <li>✅ Advanced compatibility filters</li>
              <li>✅ Priority customer support</li>
              <li>✅ Read receipts and typing indicators</li>
              <li>✅ Profile boost and visibility</li>
              <li>✅ Video calling features</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://make-my-knot-kappa.vercel.app/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Explore Premium Features →</a>
            </div>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px;">
              <h3>💡 Quick Start Tips:</h3>
              <p>1. Complete your premium profile for better matches<br>
                 2. Use advanced filters to find your ideal partner<br>
                 3. Start conversations with unlimited messaging</p>
            </div>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Subscription confirmation sent successfully to:', userEmail);
    } catch (error) {
      console.error('Failed to send subscription confirmation:', error);
      throw error;
    }
  }

  // Test email configuration
  async testEmailConfiguration() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready to send emails');
      return true;
    } catch (error) {
      console.error('❌ Email service configuration error:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
