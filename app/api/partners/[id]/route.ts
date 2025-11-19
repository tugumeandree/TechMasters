import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Partner from '@/lib/models/Partner';

// GET /api/partners/[id] - Fetch specific partner
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const partner = await Partner.findById(params.id)
      .populate('challenges.interestedTeams', 'name members currentStage')
      .populate('challenges.selectedTeams', 'name members currentStage')
      .populate('pilots.teamId', 'name members')
      .populate('pilots.projectId', 'name description')
      .populate('mentorsProvided', 'name expertise availability')
      .lean();

    if (!partner) {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      partner
    });
  } catch (error: any) {
    console.error('Error fetching partner:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/partners/[id] - Update partner
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const { action, ...data } = body;

    const partner = await Partner.findById(params.id);
    if (!partner) {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'update-profile': {
        const allowedFields = [
          'organizationName', 'organizationType', 'industry', 'website',
          'logo', 'description', 'contactPerson', 'partnershipType',
          'status', 'startDate', 'endDate', 'satisfactionScore',
          'testimonial', 'isPublic'
        ];
        
        allowedFields.forEach(field => {
          if (data[field] !== undefined) {
            (partner as any)[field] = data[field];
          }
        });
        break;
      }

      case 'post-challenge': {
        const { challenge } = data;
        if (!challenge || !challenge.title || !challenge.problemStatement) {
          return NextResponse.json(
            { success: false, error: 'Challenge title and problemStatement are required' },
            { status: 400 }
          );
        }
        partner.challenges.push({
          ...challenge,
          postedDate: new Date(),
          status: 'open'
        });
        partner.metrics.challengesPosted = (partner.metrics.challengesPosted || 0) + 1;
        break;
      }

      case 'update-challenge': {
        const { challengeId, updates } = data;
        const challengeIndex = partner.challenges.findIndex(
          (c: any) => c._id.toString() === challengeId
        );
        if (challengeIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Challenge not found' },
            { status: 404 }
          );
        }
        partner.challenges[challengeIndex] = {
          ...partner.challenges[challengeIndex].toObject(),
          ...updates
        };
        break;
      }

      case 'team-interest': {
        const { challengeId, teamId } = data;
        const challenge = partner.challenges.find(
          (c: any) => c._id.toString() === challengeId
        );
        if (!challenge) {
          return NextResponse.json(
            { success: false, error: 'Challenge not found' },
            { status: 404 }
          );
        }
        if (!challenge.interestedTeams.includes(teamId)) {
          challenge.interestedTeams.push(teamId);
        }
        break;
      }

      case 'select-teams': {
        const { challengeId, teamIds } = data;
        const challenge = partner.challenges.find(
          (c: any) => c._id.toString() === challengeId
        );
        if (!challenge) {
          return NextResponse.json(
            { success: false, error: 'Challenge not found' },
            { status: 404 }
          );
        }
        challenge.selectedTeams = teamIds;
        challenge.status = 'in-progress';
        break;
      }

      case 'add-pilot': {
        const { pilot } = data;
        if (!pilot || !pilot.teamId || !pilot.projectId) {
          return NextResponse.json(
            { success: false, error: 'Pilot teamId and projectId are required' },
            { status: 400 }
          );
        }
        partner.pilots.push({
          ...pilot,
          status: 'planned'
        });
        break;
      }

      case 'update-pilot': {
        const { pilotId, updates } = data;
        const pilotIndex = partner.pilots.findIndex(
          (p: any) => p._id.toString() === pilotId
        );
        if (pilotIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Pilot not found' },
            { status: 404 }
          );
        }
        partner.pilots[pilotIndex] = {
          ...partner.pilots[pilotIndex].toObject(),
          ...updates
        };
        if (updates.status === 'completed') {
          partner.metrics.pilotsCompleted = (partner.metrics.pilotsCompleted || 0) + 1;
        }
        break;
      }

      case 'add-mentors': {
        const { mentorIds } = data;
        if (!Array.isArray(mentorIds)) {
          return NextResponse.json(
            { success: false, error: 'mentorIds must be an array' },
            { status: 400 }
          );
        }
        partner.mentorsProvided = [...new Set([...partner.mentorsProvided, ...mentorIds])];
        break;
      }

      case 'update-resources': {
        const { resources } = data;
        if (!resources) {
          return NextResponse.json(
            { success: false, error: 'Resources object is required' },
            { status: 400 }
          );
        }
        partner.resources = {
          ...partner.resources.toObject(),
          ...resources
        };
        if (resources.funding) {
          partner.metrics.fundingProvided = 
            (partner.metrics.fundingProvided || 0) + resources.funding;
        }
        break;
      }

      case 'record-hire': {
        const { participantId, role, hireDate } = data;
        if (!participantId || !role) {
          return NextResponse.json(
            { success: false, error: 'participantId and role are required' },
            { status: 400 }
          );
        }
        partner.hiringInterests.hiredParticipants.push({
          participantId,
          role,
          hireDate: hireDate || new Date()
        });
        partner.metrics.participantsHired = (partner.metrics.participantsHired || 0) + 1;
        break;
      }

      case 'update-hiring': {
        const { hiringInterests } = data;
        partner.hiringInterests = {
          ...partner.hiringInterests.toObject(),
          ...hiringInterests
        };
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    await partner.save();

    const updatedPartner = await Partner.findById(params.id)
      .populate('challenges.interestedTeams', 'name')
      .populate('challenges.selectedTeams', 'name')
      .populate('pilots.teamId', 'name')
      .populate('mentorsProvided', 'name')
      .lean();

    return NextResponse.json({
      success: true,
      partner: updatedPartner
    });
  } catch (error: any) {
    console.error('Error updating partner:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/partners/[id] - Delete partner
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const partner = await Partner.findByIdAndDelete(params.id);

    if (!partner) {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Partner deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting partner:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
