import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"TechMasters" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

// Email templates
export const emailTemplates = {
  applicationReceived: (applicantName: string, applicationId: string) => ({
    subject: 'Application Received - TechMasters',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Application Received!</h1>
            </div>
            <div class="content">
              <p>Hi ${applicantName},</p>
              <p>Thank you for applying to TechMasters! We've successfully received your application.</p>
              <p><strong>Application ID:</strong> ${applicationId}</p>
              <p>Our team will review your application and get back to you within 5-7 business days.</p>
              <p>In the meantime, feel free to explore our resources and connect with our community.</p>
              <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3001'}/dashboard" class="button">Track Your Application</a>
              <p>Best regards,<br>The TechMasters Team</p>
            </div>
            <div class="footer">
              <p>TechMasters | Building the Future of Innovation</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${applicantName},\n\nThank you for applying to TechMasters! We've successfully received your application (ID: ${applicationId}).\n\nOur team will review your application and get back to you within 5-7 business days.\n\nBest regards,\nThe TechMasters Team`
  }),

  newApplicationNotification: (applicantName: string, applicantEmail: string, applicationId: string, projectTitle: string) => ({
    subject: `🔔 New Application Received from ${applicantName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .info-box { background: white; padding: 15px; border-left: 4px solid #6366f1; margin: 15px 0; border-radius: 4px; }
            .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📥 New Application Alert</h2>
            </div>
            <div class="content">
              <p>A new application has been submitted to TechMasters:</p>
              
              <div class="info-box">
                <p><strong>Applicant:</strong> ${applicantName}</p>
                <p><strong>Email:</strong> ${applicantEmail}</p>
                <p><strong>Project Title:</strong> ${projectTitle}</p>
                <p><strong>Application ID:</strong> ${applicationId}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>

              <p>Please review the application in the admin dashboard.</p>
              
              <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3001'}/dashboard/admin/applications/${applicationId}" class="button">Review Application →</a>
            </div>
            <div class="footer">
              <p>TechMasters Admin System</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `New Application Received\n\nApplicant: ${applicantName}\nEmail: ${applicantEmail}\nProject: ${projectTitle}\nApplication ID: ${applicationId}\nSubmitted: ${new Date().toLocaleString()}\n\nPlease review in the admin dashboard.`
  }),

  applicationStatusUpdate: (applicantName: string, status: string, feedback?: string) => ({
    subject: `Application Status Update - TechMasters`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; }
            .status-accepted { background: #10b981; color: white; }
            .status-rejected { background: #ef4444; color: white; }
            .status-interview { background: #f59e0b; color: white; }
            .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Status Update</h1>
            </div>
            <div class="content">
              <p>Hi ${applicantName},</p>
              <p>Your TechMasters application status has been updated:</p>
              <p><span class="status-badge status-${status.toLowerCase()}">${status.toUpperCase()}</span></p>
              ${feedback ? `<p><strong>Feedback:</strong> ${feedback}</p>` : ''}
              <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3001'}/dashboard" class="button">View Details</a>
              <p>Best regards,<br>The TechMasters Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${applicantName},\n\nYour TechMasters application status has been updated: ${status.toUpperCase()}\n\n${feedback ? `Feedback: ${feedback}\n\n` : ''}Best regards,\nThe TechMasters Team`
  })
};
