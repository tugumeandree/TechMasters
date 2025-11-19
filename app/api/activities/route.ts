import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/lib/models/Activity';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!teamId && !projectId && !userId) {
      return NextResponse.json(
        { error: 'teamId, projectId, or userId is required' },
        { status: 400 }
      );
    }

    // Build query
    const query: any = {};
    if (teamId) query.teamId = teamId;
    if (projectId) query.projectId = projectId;
    if (userId) query.userId = userId;
    if (type) query.type = type;

    // Get activities
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email profileImage')
      .populate('teamId', 'name')
      .populate('projectId', 'name');

    // Transform data
    const transformedActivities = activities.map(activity => ({
      id: activity._id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      author: activity.author,
      timestamp: activity.createdAt,
      metadata: activity.metadata,
      user: activity.userId,
      team: activity.teamId,
      project: activity.projectId
    }));

    return NextResponse.json({
      activities: transformedActivities,
      count: transformedActivities.length
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      teamId,
      projectId,
      userId,
      type,
      title,
      description,
      author,
      metadata
    } = body;

    // Validation
    if (!teamId || !userId || !type || !title || !description || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create activity
    const activity = await Activity.create({
      teamId,
      projectId,
      userId,
      type,
      title,
      description,
      author,
      metadata
    });

    return NextResponse.json(
      { activity, message: 'Activity created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
