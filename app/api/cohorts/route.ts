import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Cohort from '@/lib/models/Cohort';
import Team from '@/lib/models/Team';
import User from '@/lib/models/User';

// GET /api/cohorts - Fetch all cohorts with optional filters
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const includeMetrics = searchParams.get('includeMetrics') === 'true';

    // Build query
    const query: any = {};
    if (status) {
      query.status = status;
    }

    let cohorts;
    if (includeMetrics) {
      cohorts = await Cohort.find(query)
        .populate('participants', 'name email profilePicture')
        .populate('teams', 'name members currentStage')
        .populate('mentors', 'name expertise')
        .sort({ startDate: -1 })
        .lean();
    } else {
      cohorts = await Cohort.find(query)
        .select('name description startDate endDate status participants teams mentors')
        .sort({ startDate: -1 })
        .lean();
    }

    return NextResponse.json({
      success: true,
      cohorts
    });
  } catch (error: any) {
    console.error('Error fetching cohorts:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/cohorts - Create a new cohort
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      name,
      description,
      startDate,
      endDate,
      applicationDeadline,
      maxParticipants,
      participants,
      teams,
      mentors,
      programDirector
    } = body;

    // Validation
    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Name, start date, and end date are required' },
        { status: 400 }
      );
    }

    // Create cohort
    const cohort = await Cohort.create({
      name,
      description,
      startDate,
      endDate,
      applicationDeadline,
      maxParticipants,
      participants: participants || [],
      teams: teams || [],
      mentors: mentors || [],
      programDirector,
      status: new Date(startDate) > new Date() ? 'upcoming' : 'active'
    });

    const populatedCohort = await Cohort.findById(cohort._id)
      .populate('participants', 'name email')
      .populate('teams', 'name members')
      .populate('mentors', 'name expertise')
      .lean();

    return NextResponse.json({
      success: true,
      cohort: populatedCohort
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating cohort:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
