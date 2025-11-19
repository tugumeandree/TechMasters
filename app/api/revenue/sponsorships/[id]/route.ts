import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import Sponsorship from '@/models/Sponsorship';
import SponsorshipPackage from '@/models/SponsorshipPackage';

// GET /api/revenue/sponsorships/:id
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

    const sponsorship = await Sponsorship.findById(params.id)
      .populate('partner')
      .populate('package')
      .populate('createdBy', 'name email');

    if (!sponsorship) {
      return NextResponse.json(
        { success: false, error: 'Sponsorship not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sponsorship
    });
  } catch (error: any) {
    console.error('Error fetching sponsorship:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/revenue/sponsorships/:id
export async function PUT(
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

    const updates = await req.json();
    const oldSponsorship = await Sponsorship.findById(params.id);

    if (!oldSponsorship) {
      return NextResponse.json(
        { success: false, error: 'Sponsorship not found' },
        { status: 404 }
      );
    }

    // Update package sponsor count if status changed
    if (updates.status && updates.status !== oldSponsorship.status) {
      if (updates.status === 'active' && oldSponsorship.status !== 'active') {
        await SponsorshipPackage.findByIdAndUpdate(
          oldSponsorship.package,
          { $inc: { currentSponsors: 1 } }
        );
      } else if (oldSponsorship.status === 'active' && updates.status !== 'active') {
        await SponsorshipPackage.findByIdAndUpdate(
          oldSponsorship.package,
          { $inc: { currentSponsors: -1 } }
        );
      }
    }

    const sponsorship = await Sponsorship.findByIdAndUpdate(
      params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('partner')
      .populate('package');

    return NextResponse.json({
      success: true,
      data: sponsorship
    });
  } catch (error: any) {
    console.error('Error updating sponsorship:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
