import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import RevenueTransaction from '@/models/RevenueTransaction';

// GET /api/revenue/transactions - Get revenue transactions
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const transactionType = searchParams.get('transactionType');
    const status = searchParams.get('status');
    const fiscalYear = searchParams.get('fiscalYear');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query: any = {};
    if (transactionType) query.transactionType = transactionType;
    if (status) query.status = status;
    if (fiscalYear) query.fiscalYear = parseInt(fiscalYear);

    const transactions = await RevenueTransaction.find(query)
      .populate('subscription')
      .populate('sponsorship')
      .populate('cohort', 'name')
      .sort({ transactionDate: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: transactions
    });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/revenue/transactions - Create transaction
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

    // Calculate fiscal quarter from transaction date
    const transactionDate = new Date(data.transactionDate);
    const month = transactionDate.getMonth() + 1;
    const fiscalQuarter = Math.ceil(month / 3);

    const transaction = await RevenueTransaction.create({
      ...data,
      fiscalYear: transactionDate.getFullYear(),
      fiscalQuarter,
      netAmount: data.amount - (data.processingFees || 0)
    });

    return NextResponse.json({
      success: true,
      data: transaction
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
