import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import ParticipantSubscription from '@/models/ParticipantSubscription';
import User from '@/models/User';

// GET /api/revenue/subscriptions - Get participant subscriptions
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const participantId = searchParams.get('participantId');
    const status = searchParams.get('status');
    const cohortId = searchParams.get('cohortId');

    const query: any = {};
    
    // Regular users can only see their own subscriptions
    if (session.user.role === 'participant') {
      query.participant = session.user.id;
    } else if (participantId) {
      query.participant = participantId;
    }

    if (status) query.status = status;
    if (cohortId) query.cohort = cohortId;

    const subscriptions = await ParticipantSubscription.find(query)
      .populate('participant', 'name email profile')
      .populate('cohort', 'name startDate endDate')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: subscriptions
    });
  } catch (error: any) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/revenue/subscriptions - Create subscription
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const data = await req.json();

    // Validate participant exists
    const participant = await User.findById(data.participant);
    if (!participant) {
      return NextResponse.json(
        { success: false, error: 'Participant not found' },
        { status: 404 }
      );
    }

    const subscription = await ParticipantSubscription.create(data);

    const populatedSubscription = await ParticipantSubscription.findById(subscription._id)
      .populate('participant', 'name email')
      .populate('cohort', 'name');

    return NextResponse.json({
      success: true,
      data: populatedSubscription
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
