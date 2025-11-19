import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import TeamFormation from '@/lib/models/TeamFormation';
import User from '@/lib/models/User';

// GET /api/team-formation - Fetch all team formation profiles
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const cohortId = searchParams.get('cohortId');
    const status = searchParams.get('status');
    const lookingFor = searchParams.get('lookingFor');

    // Build query
    const query: any = {};
    if (cohortId) {
      query.cohortId = cohortId;
    }
    if (status) {
      query.status = status;
    }
    if (lookingFor) {
      query.lookingFor = lookingFor;
    }

    const profiles = await TeamFormation.find(query)
      .populate('participantId', 'name email profilePicture skills')
      .populate('cohortId', 'name')
      .populate('interestedIn', 'name skills')
      .populate('interestedBy', 'name skills')
      .populate('formedTeamId', 'name members')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      profiles,
      total: profiles.length
    });
  } catch (error: any) {
    console.error('Error fetching team formation profiles:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/team-formation - Create team formation profile
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      participantId,
      cohortId,
      lookingFor,
      projectIdea,
      skills,
      role,
      desiredRoles,
      desiredSkills,
      preferences
    } = body;

    // Validation
    if (!participantId || !cohortId || !lookingFor) {
      return NextResponse.json(
        { success: false, error: 'participantId, cohortId, and lookingFor are required' },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existingProfile = await TeamFormation.findOne({ 
      participantId, 
      cohortId,
      status: { $ne: 'closed' }
    });
    
    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Active team formation profile already exists' },
        { status: 400 }
      );
    }

    // Create profile
    const profile = await TeamFormation.create({
      participantId,
      cohortId,
      lookingFor,
      projectIdea,
      skills,
      role,
      desiredRoles,
      desiredSkills,
      preferences
    });

    const populatedProfile = await TeamFormation.findById(profile._id)
      .populate('participantId', 'name email profilePicture')
      .populate('cohortId', 'name')
      .lean();

    return NextResponse.json({
      success: true,
      profile: populatedProfile
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating team formation profile:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
