import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import ParticipantSubscription from '@/models/ParticipantSubscription';

// GET /api/revenue/subscriptions/:id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const subscription = await ParticipantSubscription.findById(params.id)
      .populate('participant', 'name email profile')
      .populate('cohort', 'name startDate endDate')
      .populate('financialAid.reviewedBy', 'name email');

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Participants can only view their own subscriptions
    if (
      session.user.role === 'participant' && 
      subscription.participant._id.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subscription
    });
  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/revenue/subscriptions/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const updates = await req.json();

    // Get existing subscription
    const existingSubscription = await ParticipantSubscription.findById(params.id);
    if (!existingSubscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Authorization check
    const isOwnSubscription = existingSubscription.participant.toString() === session.user.id;
    const isAdmin = session.user.role === 'admin' || session.user.role === 'staff';

    if (!isAdmin && !isOwnSubscription) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Participants can only update payment info, not pricing or access
    if (session.user.role === 'participant') {
      const allowedFields = ['payments'];
      const hasDisallowedFields = Object.keys(updates).some(
        key => !allowedFields.includes(key)
      );
      
      if (hasDisallowedFields) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized to update these fields' },
          { status: 403 }
        );
      }
    }

    const subscription = await ParticipantSubscription.findByIdAndUpdate(
      params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('participant', 'name email')
      .populate('cohort', 'name');

    return NextResponse.json({
      success: true,
      data: subscription
    });
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
