import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import Sponsorship from '@/models/Sponsorship';
import Partner from '@/models/Partner';
import SponsorshipPackage from '@/models/SponsorshipPackage';

// GET /api/revenue/sponsorships - Get all sponsorships
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
    const status = searchParams.get('status');
    const partnerId = searchParams.get('partnerId');

    const query: any = {};
    if (status) query.status = status;
    if (partnerId) query.partner = partnerId;

    const sponsorships = await Sponsorship.find(query)
      .populate('partner', 'companyName logo industry')
      .populate('package', 'name tier annualInvestment')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: sponsorships
    });
  } catch (error: any) {
    console.error('Error fetching sponsorships:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/revenue/sponsorships - Create new sponsorship
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

    // Validate partner and package exist
    const partner = await Partner.findById(data.partner);
    if (!partner) {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      );
    }

    const packageData = await SponsorshipPackage.findById(data.package);
    if (!packageData) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    // Create sponsorship with creator
    const sponsorship = await Sponsorship.create({
      ...data,
      createdBy: session.user.id
    });

    // Update package current sponsors count if active
    if (data.status === 'active') {
      await SponsorshipPackage.findByIdAndUpdate(
        data.package,
        { $inc: { currentSponsors: 1 } }
      );
    }

    const populatedSponsorship = await Sponsorship.findById(sponsorship._id)
      .populate('partner', 'companyName logo')
      .populate('package', 'name tier');

    return NextResponse.json({
      success: true,
      data: populatedSponsorship
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating sponsorship:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
