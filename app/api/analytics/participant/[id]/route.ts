import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ParticipantMetrics } from '@/lib/models/Metrics';
import User from '@/lib/models/User';
import MentorSession from '@/lib/models/MentorSession';
import ValidationActivity from '@/lib/models/ValidationActivity';
import Project from '@/lib/models/Project';
import Team from '@/lib/models/Team';
import Resource from '@/lib/models/Resource';
import Activity from '@/lib/models/Activity';

// GET /api/analytics/participant/[id] - Get participant analytics
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const fresh = searchParams.get('fresh') === 'true';

    // Get cached metrics
    const cachedMetrics = await ParticipantMetrics.findOne({ 
      participantId: params.id 
    })
      .populate('participantId', 'name email currentStage')
      .populate('cohortId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // If no cached metrics or requesting fresh data
    if (!cachedMetrics || fresh) {
      const freshMetrics = await calculateParticipantMetrics(params.id);
      return NextResponse.json({
        success: true,
        metrics: freshMetrics,
        cached: false
      });
    }

    return NextResponse.json({
      success: true,
      metrics: cachedMetrics,
      cached: true
    });
  } catch (error: any) {
    console.error('Error fetching participant analytics:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Helper function to calculate participant metrics
async function calculateParticipantMetrics(participantId: string) {
  // Get participant
  const participant = await User.findById(participantId);
  if (!participant) {
    throw new Error('Participant not found');
  }

  // Get participant's team
  const team = await Team.findOne({ members: participantId });
  
  // Get participant's project
  const project = team ? await Project.findOne({ team: team._id }) : null;

  // Get all mentor sessions
  const sessions = await MentorSession.find({ participant: participantId });
  const completedSessions = sessions.filter(s => s.status === 'completed');

  // Get validation activities
  const validationActivities = team 
    ? await ValidationActivity.find({ teamId: team._id, status: 'completed' })
    : [];

  // Get resources accessed (would need resource access tracking)
  const resourcesAccessed = await Resource.find({});

  // Get activities
  const activities = await Activity.find({ user: participantId });
  const lastActivity = activities.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  // Calculate days in program (from cohort start or first activity)
  const firstActivity = activities.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )[0];
  const daysInProgram = firstActivity 
    ? Math.floor((Date.now() - new Date(firstActivity.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Engagement metrics
  const engagement = {
    sessionsAttended: completedSessions.length,
    totalSessions: sessions.length,
    attendanceRate: sessions.length > 0 
      ? (completedSessions.length / sessions.length) * 100 
      : 0,
    mentorSessionsCompleted: completedSessions.length,
    resourcesAccessed: activities.filter(a => a.type === 'resource_accessed').length,
    lastActive: lastActivity ? lastActivity.createdAt : null
  };

  // Progress metrics
  const stageOrder = ['research', 'skilling', 'development', 'business'];
  const currentStageIndex = stageOrder.indexOf(participant.currentStage || 'research');
  
  const progress = {
    currentStage: participant.currentStage,
    stagesCompleted: currentStageIndex,
    daysInProgram,
    outputsCompleted: project?.outputs?.filter(o => o.completed).length || 0,
    outcomesAchieved: project?.outcomes?.filter(o => o.achieved).length || 0
  };

  // Validation metrics
  const validation = {
    interviewsConducted: validationActivities.filter(v => v.type === 'customer-interview').length,
    userTestsCompleted: validationActivities.filter(v => v.type === 'user-testing').length,
    validationScore: validationActivities.length > 0
      ? validationActivities.reduce((sum, v) => sum + (v.validationScore || 0), 0) / validationActivities.length
      : 0
  };

  // Outcomes metrics
  const outcomes = {
    projectStatus: project?.status || 'not-started',
    funding: project?.fundingRaised || 0,
    customers: project?.customers || 0,
    revenue: project?.revenue || 0,
    teamRole: team?.members.find((m: any) => m.toString() === participantId) ? 'member' : 'none'
  };

  // Skills metrics
  const avgRating = completedSessions.length > 0
    ? completedSessions.reduce((sum, s) => sum + (s.feedback?.rating || 0), 0) / completedSessions.length
    : 0;

  const skills = {
    technicalSkillsGained: participant.skills || [],
    businessSkillsGained: [],
    certificationsEarned: [],
    mentorRating: avgRating
  };

  // Network metrics
  const mentorConnections = [...new Set(sessions.map(s => s.mentor.toString()))].length;
  
  const network = {
    mentorConnections,
    peerConnections: team?.members.length || 0,
    partnerConnections: 0,
    alumniConnections: 0
  };

  return {
    participantId,
    cohortId: participant.cohort,
    engagement,
    progress,
    validation,
    outcomes,
    skills,
    network
  };
}

// POST /api/analytics/participant/[id] - Generate and cache participant metrics
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Calculate fresh metrics
    const calculatedMetrics = await calculateParticipantMetrics(params.id);

    // Save to database
    const metrics = await ParticipantMetrics.create(calculatedMetrics);

    const populatedMetrics = await ParticipantMetrics.findById(metrics._id)
      .populate('participantId', 'name email')
      .populate('cohortId', 'name')
      .lean();

    return NextResponse.json({
      success: true,
      metrics: populatedMetrics
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error generating participant metrics:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
