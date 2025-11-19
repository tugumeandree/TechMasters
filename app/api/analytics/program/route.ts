import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ProgramMetrics, ParticipantMetrics } from '@/lib/models/Metrics';
import Cohort from '@/lib/models/Cohort';
import User from '@/lib/models/User';
import Team from '@/lib/models/Team';
import Project from '@/lib/models/Project';
import MentorSession from '@/lib/models/MentorSession';
import ValidationActivity from '@/lib/models/ValidationActivity';
import GateReview from '@/lib/models/GateReview';

// GET /api/analytics/program - Get program-wide analytics
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const cohortId = searchParams.get('cohortId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    const query: any = {};
    if (cohortId) {
      query.cohortId = cohortId;
    }

    // Get latest program metrics
    const metrics = await ProgramMetrics.find(query)
      .populate('cohortId', 'name startDate endDate')
      .sort({ createdAt: -1 })
      .limit(1)
      .lean();

    // If no cached metrics or need real-time data, calculate fresh
    if (metrics.length === 0 || searchParams.get('fresh') === 'true') {
      const freshMetrics = await calculateProgramMetrics(cohortId, startDate, endDate);
      return NextResponse.json({
        success: true,
        metrics: freshMetrics,
        cached: false
      });
    }

    return NextResponse.json({
      success: true,
      metrics: metrics[0],
      cached: true
    });
  } catch (error: any) {
    console.error('Error fetching program analytics:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Helper function to calculate program metrics
async function calculateProgramMetrics(cohortId?: string | null, startDate?: string | null, endDate?: string | null) {
  const cohortQuery = cohortId ? { cohort: cohortId } : {};
  
  // Get all participants
  const participants = await User.find({ role: 'participant', ...cohortQuery });
  const activeParticipants = participants.filter(p => 
    p.lastActive && new Date(p.lastActive) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  // Get all teams
  const teams = await Team.find(cohortQuery);
  
  // Get all projects
  const projects = await Project.find(cohortQuery);
  
  // Get all sessions
  const sessions = await MentorSession.find({});
  
  // Get validation activities
  const validationActivities = await ValidationActivity.find({ status: 'completed' });
  
  // Get gate reviews
  const gateReviews = await GateReview.find({});
  
  // Calculate engagement
  const engagement = {
    totalParticipants: participants.length,
    activeParticipants: activeParticipants.length,
    avgSessionAttendance: sessions.length / (participants.length || 1),
    mentorEngagementRate: (activeParticipants.length / participants.length) * 100,
    resourceUsageRate: 0 // Would need resource access tracking
  };

  // Calculate progress
  const participantsByStage = {
    research: participants.filter(p => p.currentStage === 'research').length,
    skilling: participants.filter(p => p.currentStage === 'skilling').length,
    development: participants.filter(p => p.currentStage === 'development').length,
    business: participants.filter(p => p.currentStage === 'business').length
  };

  const progress = {
    participantsByStage,
    avgTimePerStage: {
      research: 0,
      skilling: 0,
      development: 0,
      business: 0
    },
    completionRate: (participantsByStage.business / participants.length) * 100,
    dropoutRate: 0, // Would need dropout tracking
    stageProgression: 0
  };

  // Calculate validation
  const validation = {
    totalInterviews: validationActivities.filter(v => v.type === 'customer-interview').length,
    avgInterviewsPerTeam: validationActivities.length / (teams.length || 1),
    totalUserTests: validationActivities.filter(v => v.type === 'user-testing').length,
    pilotCustomers: validationActivities.filter(v => v.type === 'pilot-customer').length,
    avgValidationScore: validationActivities.reduce((sum, v) => sum + (v.validationScore || 0), 0) / (validationActivities.length || 1)
  };

  // Calculate outcomes
  const outcomes = {
    projectsLaunched: projects.filter(p => p.status === 'active' || p.status === 'completed').length,
    fundingRaised: projects.reduce((sum, p) => sum + (p.fundingRaised || 0), 0),
    revenueGenerated: projects.reduce((sum, p) => sum + (p.revenue || 0), 0),
    customersAcquired: projects.reduce((sum, p) => sum + (p.customers || 0), 0),
    jobsCreated: 0, // Would need job tracking
    participantsHired: 0 // Would need employment tracking
  };

  // Calculate quality
  const avgRatings = sessions.reduce((sum, s) => sum + (s.feedback?.rating || 0), 0) / (sessions.length || 1);
  const passedReviews = gateReviews.filter(r => r.decision === 'approved').length;
  
  const quality = {
    avgMentorRating: avgRatings,
    avgProgramSatisfaction: 0, // Would need satisfaction surveys
    avgProjectQuality: 0, // Would need quality scores
    gateReviewPassRate: (passedReviews / (gateReviews.length || 1)) * 100
  };

  // Team metrics
  const teamMetrics = {
    totalTeams: teams.length,
    avgTeamSize: teams.reduce((sum, t) => sum + t.members.length, 0) / (teams.length || 1),
    teamsFormed: teams.length
  };

  // Partner metrics - would need Partner model data
  const partnerships = {
    activePartners: 0,
    challengesPosted: 0,
    pilotsCompleted: 0,
    participantsHired: 0
  };

  return {
    cohortId,
    periodStart: startDate ? new Date(startDate) : null,
    periodEnd: endDate ? new Date(endDate) : null,
    engagement,
    progress,
    validation,
    outcomes,
    quality,
    teams: teamMetrics,
    partnerships
  };
}

// POST /api/analytics/program - Generate and cache program metrics
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { cohortId, periodStart, periodEnd } = body;

    // Calculate fresh metrics
    const calculatedMetrics = await calculateProgramMetrics(
      cohortId,
      periodStart,
      periodEnd
    );

    // Save to database
    const metrics = await ProgramMetrics.create(calculatedMetrics);

    return NextResponse.json({
      success: true,
      metrics
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error generating program metrics:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
