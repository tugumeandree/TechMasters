import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import Notification from '@/lib/models/Notification';
import { sendEmail, emailTemplates } from '@/lib/email';

// GET - Fetch applications (admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const cohortId = searchParams.get('cohortId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    
    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (cohortId) query.assignedCohort = cohortId;
    
    // Fetch applications
    const applications = await Application.find(query)
      .sort({ submittedAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('assignedCohort', 'name startDate')
      .populate('assignedTeam', 'name')
      .populate('reviewedBy', 'name email');
    
    // Get total count
    const total = await Application.countDocuments(query);
    
    return NextResponse.json({
      applications,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Submit new application
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.personalInfo?.fullName || !body.personalInfo?.email || !body.projectIdea?.title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check for duplicate email
    const existingApplication = await Application.findOne({
      'personalInfo.email': body.personalInfo.email,
      status: { $in: ['pending', 'under-review', 'interview', 'accepted', 'waitlisted'] }
    });
    
    if (existingApplication) {
      return NextResponse.json(
        { error: 'An active application with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create application
    const application = await Application.create({
      personalInfo: body.personalInfo,
      projectIdea: body.projectIdea,
      skillsAssessment: body.skillsAssessment,
      teamPreferences: body.teamPreferences,
      documents: body.documents,
      status: 'pending',
      submittedAt: new Date()
    });
    
    // Send confirmation email to applicant
    try {
      const confirmationEmail = emailTemplates.applicationReceived(
        application.personalInfo.fullName,
        application._id.toString()
      );
      
      await sendEmail({
        to: application.personalInfo.email,
        subject: confirmationEmail.subject,
        html: confirmationEmail.html,
        text: confirmationEmail.text
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the application if email fails
    }
    
    // Send notification to admins
    try {
      // Get admin emails from environment variable
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
      
      if (adminEmails.length > 0) {
        const adminNotification = emailTemplates.newApplicationNotification(
          application.personalInfo.fullName,
          application.personalInfo.email,
          application._id.toString(),
          application.projectIdea.title
        );
        
        await sendEmail({
          to: adminEmails,
          subject: adminNotification.subject,
          html: adminNotification.html,
          text: adminNotification.text
        });
      }
      
      // Also create in-app notifications for admins
      // Note: You'll need to get admin user IDs from your database
      // For now, we'll skip this or you can add admin user lookup
      
    } catch (notificationError) {
      console.error('Error sending admin notification:', notificationError);
    }
    
    return NextResponse.json(
      { 
        message: 'Application submitted successfully',
        applicationId: application._id,
        application 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update application status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { applicationId, status, reviewNotes, score, reviewedBy, assignedCohort, assignedTeam } = body;
    
    if (!applicationId) {
      return NextResponse.json(
        { error: 'applicationId is required' },
        { status: 400 }
      );
    }
    
    // Update application
    const updateData: any = {};
    if (status) {
      updateData.status = status;
      updateData.reviewedAt = new Date();
    }
    if (reviewNotes) updateData.reviewNotes = reviewNotes;
    if (score) updateData.score = score;
    if (reviewedBy) updateData.reviewedBy = reviewedBy;
    if (assignedCohort) updateData.assignedCohort = assignedCohort;
    if (assignedTeam) updateData.assignedTeam = assignedTeam;
    
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { $set: updateData },
      { new: true }
    );
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    // Send status update email to applicant
    if (status && ['accepted', 'rejected', 'interview'].includes(status)) {
      try {
        const statusEmail = emailTemplates.applicationStatusUpdate(
          application.personalInfo.fullName,
          status,
          reviewNotes
        );
        
        await sendEmail({
          to: application.personalInfo.email,
          subject: statusEmail.subject,
          html: statusEmail.html,
          text: statusEmail.text
        });
      } catch (emailError) {
        console.error('Error sending status update email:', emailError);
      }
    }
    
    return NextResponse.json({
      message: 'Application updated successfully',
      application
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
