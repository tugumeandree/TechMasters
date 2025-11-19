import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import SponsorshipPackage from '@/models/SponsorshipPackage';

// GET /api/revenue/sponsorship-packages/:id - Get specific package
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const packageData = await SponsorshipPackage.findById(params.id);

    if (!packageData) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: packageData
    });
  } catch (error: any) {
    console.error('Error fetching sponsorship package:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/revenue/sponsorship-packages/:id - Update package
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const updates = await req.json();

    const packageData = await SponsorshipPackage.findByIdAndUpdate(
      params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!packageData) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: packageData
    });
  } catch (error: any) {
    console.error('Error updating sponsorship package:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/revenue/sponsorship-packages/:id - Delete package
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const packageData = await SponsorshipPackage.findByIdAndDelete(params.id);

    if (!packageData) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting sponsorship package:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
