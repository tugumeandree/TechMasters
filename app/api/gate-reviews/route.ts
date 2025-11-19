import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GateReview from '@/lib/models/GateReview';
import Project from '@/lib/models/Project';

// GET /api/gate-reviews - Get all gate reviews (with filters)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const teamId = searchParams.get('teamId');
    const status = searchParams.get('status');
    const stage = searchParams.get('stage');

    const query: any = {};
    if (projectId) query.projectId = projectId;
    if (teamId) query.teamId = teamId;
    if (status) query.status = status;
    if (stage) query.stage = stage;

    const gateReviews = await GateReview.find(query)
      .populate('projectId', 'name stage')
      .populate('teamId', 'name')
      .populate('reviewPanel.reviewerId', 'name email role')
      .sort({ scheduledDate: -1 })
      .lean();

    return NextResponse.json({ gateReviews });
  } catch (error) {
    console.error('Error fetching gate reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gate reviews' },
      { status: 500 }
    );
  }
}

// POST /api/gate-reviews - Create a new gate review
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { projectId, teamId, stage, scheduledDate, reviewPanel } = body;

    // Validate required fields
    if (!projectId || !teamId || !stage || !scheduledDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Create gate review
    const gateReview = await GateReview.create({
      projectId,
      teamId,
      stage,
      scheduledDate,
      reviewPanel: reviewPanel || [],
      status: 'scheduled',
      revisionCount: 0
    });

    return NextResponse.json({
      message: 'Gate review scheduled successfully',
      gateReview
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating gate review:', error);
    return NextResponse.json(
      { error: 'Failed to create gate review' },
      { status: 500 }
    );
  }
}
