import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Partner from '@/lib/models/Partner';

// GET /api/partners - Fetch all partners with optional filters
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const partnershipType = searchParams.get('partnershipType');
    const isPublic = searchParams.get('isPublic');

    // Build query
    const query: any = {};
    if (status) {
      query.status = status;
    }
    if (partnershipType) {
      query.partnershipType = partnershipType;
    }
    if (isPublic !== null) {
      query.isPublic = isPublic === 'true';
    }

    const partners = await Partner.find(query)
      .populate('challenges.interestedTeams', 'name members')
      .populate('challenges.selectedTeams', 'name members')
      .populate('pilots.teamId', 'name members')
      .populate('mentorsProvided', 'name expertise')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      partners,
      total: partners.length
    });
  } catch (error: any) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/partners - Create a new partner
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      organizationName,
      organizationType,
      partnershipType,
      contactPerson,
      industry,
      website
    } = body;

    // Validation
    if (!organizationName || !organizationType || !partnershipType) {
      return NextResponse.json(
        { success: false, error: 'organizationName, organizationType, and partnershipType are required' },
        { status: 400 }
      );
    }

    // Create partner
    const partner = await Partner.create({
      organizationName,
      organizationType,
      partnershipType,
      contactPerson,
      industry,
      website,
      status: 'prospective'
    });

    return NextResponse.json({
      success: true,
      partner
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating partner:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
