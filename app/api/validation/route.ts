import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ValidationActivity from '@/lib/models/ValidationActivity';

// GET /api/validation - Fetch validation activities
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const teamId = searchParams.get('teamId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    // Build query
    const query: any = {};
    if (projectId) {
      query.projectId = projectId;
    }
    if (teamId) {
      query.teamId = teamId;
    }
    if (type) {
      query.type = type;
    }
    if (status) {
      query.status = status;
    }

    const activities = await ValidationActivity.find(query)
      .populate('projectId', 'name description')
      .populate('teamId', 'name members')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate validation statistics
    const stats = {
      total: activities.length,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      averageValidationScore: 0
    };

    let scoreSum = 0;
    let scoreCount = 0;

    activities.forEach((activity: any) => {
      // Type stats
      stats.byType[activity.type] = (stats.byType[activity.type] || 0) + 1;
      
      // Status stats
      stats.byStatus[activity.status] = (stats.byStatus[activity.status] || 0) + 1;
      
      // Average score
      if (activity.validationScore) {
        scoreSum += activity.validationScore;
        scoreCount++;
      }
    });

    if (scoreCount > 0) {
      stats.averageValidationScore = scoreSum / scoreCount;
    }

    return NextResponse.json({
      success: true,
      activities,
      stats
    });
  } catch (error: any) {
    console.error('Error fetching validation activities:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/validation - Create validation activity
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      projectId,
      teamId,
      type,
      interviewDetails,
      questions,
      findings,
      testingDetails,
      testResults,
      surveyDetails,
      surveyResults,
      pilotDetails,
      pilotResults,
      attachments,
      overallInsights,
      actionItems,
      pivotRequired,
      validationScore,
      tags
    } = body;

    // Validation
    if (!projectId || !teamId || !type) {
      return NextResponse.json(
        { success: false, error: 'projectId, teamId, and type are required' },
        { status: 400 }
      );
    }

    // Create validation activity
    const activity = await ValidationActivity.create({
      projectId,
      teamId,
      type,
      interviewDetails,
      questions,
      findings,
      testingDetails,
      testResults,
      surveyDetails,
      surveyResults,
      pilotDetails,
      pilotResults,
      attachments,
      overallInsights,
      actionItems,
      pivotRequired,
      validationScore,
      tags,
      status: 'completed'
    });

    const populatedActivity = await ValidationActivity.findById(activity._id)
      .populate('projectId', 'name description')
      .populate('teamId', 'name members')
      .lean();

    return NextResponse.json({
      success: true,
      activity: populatedActivity
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating validation activity:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
