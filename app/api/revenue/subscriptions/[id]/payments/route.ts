import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import ParticipantSubscription from '@/models/ParticipantSubscription';

// POST /api/revenue/subscriptions/:id/payments - Record a payment
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const paymentData = await req.json();

    const subscription = await ParticipantSubscription.findById(params.id);

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Add payment to payments array
    subscription.payments.push({
      ...paymentData,
      status: 'paid',
      paidDate: new Date()
    });

    await subscription.save();

    return NextResponse.json({
      success: true,
      data: subscription
    });
  } catch (error: any) {
    console.error('Error recording payment:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
