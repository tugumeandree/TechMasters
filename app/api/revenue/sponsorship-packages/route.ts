import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import SponsorshipPackage from '@/models/SponsorshipPackage';

// GET /api/revenue/sponsorship-packages - Get all sponsorship packages
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const tier = searchParams.get('tier');
    const isActive = searchParams.get('isActive');

    const query: any = {};
    if (tier) query.tier = tier;
    if (isActive !== null) query.isActive = isActive === 'true';

    const packages = await SponsorshipPackage.find(query).sort({ annualInvestment: -1 });

    return NextResponse.json({
      success: true,
      data: packages
    });
  } catch (error: any) {
    console.error('Error fetching sponsorship packages:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/revenue/sponsorship-packages - Create new sponsorship package
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const data = await req.json();

    const packageData = await SponsorshipPackage.create(data);

    return NextResponse.json({
      success: true,
      data: packageData
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating sponsorship package:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
