import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.companyName || !body.contactEmail || !body.problemStatement) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // For now, we'll just send emails (can save to database later)
    
    // Send confirmation email to partner
    try {
      await sendEmail({
        to: body.contactEmail,
        subject: 'Partner Request Received - TechMasters',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🤝 Request Received!</h1>
                </div>
                <div class="content">
                  <p>Hi ${body.contactName},</p>
                  <p>Thank you for your interest in partnering with TechMasters! We've received your solution request.</p>
                  <p><strong>Company:</strong> ${body.companyName}</p>
                  <p><strong>Challenge:</strong> ${body.problemStatement.substring(0, 100)}...</p>
                  <p>Our team will review your request and match you with the most suitable innovators within 2-3 business days.</p>
                  <p>Best regards,<br>The TechMasters Partnership Team</p>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `Hi ${body.contactName},\n\nThank you for your interest in partnering with TechMasters! We've received your solution request for ${body.companyName}.\n\nOur team will review your request and match you with suitable innovators within 2-3 business days.\n\nBest regards,\nThe TechMasters Partnership Team`
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }
    
    // Send notification to admins
    try {
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
      
      if (adminEmails.length > 0) {
        await sendEmail({
          to: adminEmails,
          subject: `🔔 New Partner Request from ${body.companyName}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
                  .content { background: #f9fafb; padding: 30px; }
                  .info-box { background: white; padding: 15px; border-left: 4px solid #9333ea; margin: 15px 0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>🤝 New Partner Solution Request</h2>
                  </div>
                  <div class="content">
                    <div class="info-box">
                      <p><strong>Company:</strong> ${body.companyName}</p>
                      <p><strong>Industry:</strong> ${body.industry}</p>
                      <p><strong>Contact:</strong> ${body.contactName} (${body.position})</p>
                      <p><strong>Email:</strong> ${body.contactEmail}</p>
                      <p><strong>Phone:</strong> ${body.contactPhone}</p>
                      <p><strong>Timeline:</strong> ${body.timeline || 'Not specified'}</p>
                      <p><strong>Budget:</strong> ${body.budget || 'Not specified'}</p>
                    </div>
                    
                    <h3>Problem Statement:</h3>
                    <p>${body.problemStatement}</p>
                    
                    <h3>Desired Outcomes:</h3>
                    <p>${body.desiredOutcomes}</p>
                    
                    ${body.technicalRequirements ? `
                      <h3>Technical Requirements:</h3>
                      <p>${body.technicalRequirements}</p>
                    ` : ''}
                    
                    ${body.additionalInfo ? `
                      <h3>Additional Information:</h3>
                      <p>${body.additionalInfo}</p>
                    ` : ''}
                  </div>
                </div>
              </body>
            </html>
          `,
          text: `New Partner Request\n\nCompany: ${body.companyName}\nIndustry: ${body.industry}\nContact: ${body.contactName} (${body.position})\nEmail: ${body.contactEmail}\nPhone: ${body.contactPhone}\n\nProblem: ${body.problemStatement}\n\nDesired Outcomes: ${body.desiredOutcomes}`
        });
      }
    } catch (notificationError) {
      console.error('Error sending admin notification:', notificationError);
    }
    
    return NextResponse.json(
      { 
        message: 'Partner request submitted successfully',
        success: true
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating partner request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
