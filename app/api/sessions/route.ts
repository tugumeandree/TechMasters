import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MentorSession from '@/lib/models/MentorSession';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get('participantId');
    const teamId = searchParams.get('teamId');
    const status = searchParams.get('status') || 'scheduled';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!participantId && !teamId) {
      return NextResponse.json(
        { error: 'participantId or teamId is required' },
        { status: 400 }
      );
    }

    // Build query
    const query: any = { status };
    if (participantId) {
      query.participantId = participantId;
    }
    if (teamId) {
      query.teamId = teamId;
    }

    // Get upcoming sessions
    const sessions = await MentorSession.find(query)
      .where('date').gte(new Date())
      .sort({ date: 1 })
      .limit(limit)
      .populate('mentorId', 'name email expertise mentorType company profileImage')
      .populate('participantId', 'name email')
      .populate('teamId', 'name projectName');

    // Transform data
    const transformedSessions = sessions.map(session => ({
      id: session._id,
      mentorId: session.mentorId._id,
      mentorName: session.mentorId.name,
      mentorType: session.mentorId.mentorType || 'Technical Mentor',
      mentorExpertise: session.mentorId.expertise,
      mentorCompany: session.mentorId.company,
      participantId: session.participantId?._id,
      teamId: session.teamId?._id,
      teamName: session.teamId?.name,
      date: session.date,
      duration: session.duration,
      type: session.type,
      status: session.status,
      topic: session.topic,
      notes: session.notes,
      meetingLink: session.meetingLink,
      feedback: session.feedback,
      createdAt: session.createdAt
    }));

    return NextResponse.json({
      sessions: transformedSessions,
      count: transformedSessions.length
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
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
      mentorId,
      participantId,
      teamId,
      date,
      duration,
      type,
      topic,
      meetingLink
    } = body;

    // Validation
    if (!mentorId || !date || !duration || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!participantId && !teamId) {
      return NextResponse.json(
        { error: 'Either participantId or teamId is required' },
        { status: 400 }
      );
    }

    // Create session
    const session = await MentorSession.create({
      mentorId,
      participantId,
      teamId,
      date: new Date(date),
      duration,
      type,
      topic,
      meetingLink,
      status: 'scheduled'
    });

    return NextResponse.json(
      { session, message: 'Session scheduled successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
