import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Alumni from '@/lib/models/Alumni';

// GET /api/alumni - Fetch alumni directory with filters
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const cohortId = searchParams.get('cohortId');
    const currentStatus = searchParams.get('currentStatus');
    const isMentor = searchParams.get('isMentor');
    const visibility = searchParams.get('visibility') || 'alumni-only';

    // Build query
    const query: any = {};
    
    // Visibility filter
    if (visibility === 'public') {
      query.profileVisibility = 'public';
    } else if (visibility === 'alumni-only') {
      query.profileVisibility = { $in: ['public', 'alumni-only'] };
    }

    if (cohortId) {
      query.cohortId = cohortId;
    }
    if (currentStatus) {
      query.currentStatus = currentStatus;
    }
    if (isMentor !== null) {
      query.isMentor = isMentor === 'true';
    }

    const alumni = await Alumni.find(query)
      .populate('userId', 'name email profilePicture')
      .populate('cohortId', 'name')
      .sort({ graduationDate: -1 })
      .lean();

    // Filter out sensitive data based on privacy settings
    const filteredAlumni = alumni.map((alum: any) => {
      if (!alum.shareMetrics) {
        delete alum.startupMetrics;
      }
      return alum;
    });

    return NextResponse.json({
      success: true,
      alumni: filteredAlumni,
      total: filteredAlumni.length
    });
  } catch (error: any) {
    console.error('Error fetching alumni:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/alumni - Create alumni profile
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      userId,
      cohortId,
      graduationDate,
      currentStatus,
      companyName,
      position,
      willingToHelp,
      areasOfExpertise
    } = body;

    // Validation
    if (!userId || !cohortId || !graduationDate || !currentStatus) {
      return NextResponse.json(
        { success: false, error: 'userId, cohortId, graduationDate, and currentStatus are required' },
        { status: 400 }
      );
    }

    // Check if alumni profile already exists
    const existingAlumni = await Alumni.findOne({ userId });
    if (existingAlumni) {
      return NextResponse.json(
        { success: false, error: 'Alumni profile already exists for this user' },
        { status: 400 }
      );
    }

    // Create alumni profile
    const alumni = await Alumni.create({
      userId,
      cohortId,
      graduationDate,
      currentStatus,
      companyName,
      position,
      willingToHelp: willingToHelp !== undefined ? willingToHelp : true,
      areasOfExpertise: areasOfExpertise || []
    });

    const populatedAlumni = await Alumni.findById(alumni._id)
      .populate('userId', 'name email profilePicture')
      .populate('cohortId', 'name')
      .lean();

    return NextResponse.json({
      success: true,
      alumni: populatedAlumni
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating alumni profile:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
