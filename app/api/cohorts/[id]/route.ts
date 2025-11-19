import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Cohort from '@/lib/models/Cohort';

// GET /api/cohorts/[id] - Fetch specific cohort with full details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const cohort = await Cohort.findById(params.id)
      .populate('participants', 'name email profilePicture currentStage')
      .populate('teams', 'name members currentStage project')
      .populate('mentors', 'name expertise industry availability')
      .populate('programDirector', 'name email')
      .lean();

    if (!cohort) {
      return NextResponse.json(
        { success: false, error: 'Cohort not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      cohort
    });
  } catch (error: any) {
    console.error('Error fetching cohort:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/cohorts/[id] - Update cohort (multiple actions)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const { action, ...data } = body;

    const cohort = await Cohort.findById(params.id);
    if (!cohort) {
      return NextResponse.json(
        { success: false, error: 'Cohort not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'update-details': {
        // Update basic cohort information
        const { name, description, startDate, endDate, applicationDeadline, maxParticipants } = data;
        if (name) cohort.name = name;
        if (description) cohort.description = description;
        if (startDate) cohort.startDate = startDate;
        if (endDate) cohort.endDate = endDate;
        if (applicationDeadline) cohort.applicationDeadline = applicationDeadline;
        if (maxParticipants) cohort.maxParticipants = maxParticipants;
        break;
      }

      case 'add-participants': {
        // Add participants to cohort
        const { participantIds } = data;
        if (!Array.isArray(participantIds)) {
          return NextResponse.json(
            { success: false, error: 'participantIds must be an array' },
            { status: 400 }
          );
        }
        cohort.participants = [...new Set([...cohort.participants, ...participantIds])];
        break;
      }

      case 'remove-participants': {
        // Remove participants from cohort
        const { participantIds } = data;
        if (!Array.isArray(participantIds)) {
          return NextResponse.json(
            { success: false, error: 'participantIds must be an array' },
            { status: 400 }
          );
        }
        cohort.participants = cohort.participants.filter(
          (id: any) => !participantIds.includes(id.toString())
        );
        break;
      }

      case 'add-teams': {
        // Add teams to cohort
        const { teamIds } = data;
        if (!Array.isArray(teamIds)) {
          return NextResponse.json(
            { success: false, error: 'teamIds must be an array' },
            { status: 400 }
          );
        }
        cohort.teams = [...new Set([...cohort.teams, ...teamIds])];
        break;
      }

      case 'add-mentors': {
        // Add mentors to cohort
        const { mentorIds } = data;
        if (!Array.isArray(mentorIds)) {
          return NextResponse.json(
            { success: false, error: 'mentorIds must be an array' },
            { status: 400 }
          );
        }
        cohort.mentors = [...new Set([...cohort.mentors, ...mentorIds])];
        break;
      }

      case 'add-challenge': {
        // Add a new challenge (hackathon, competition)
        const { challenge } = data;
        if (!challenge || !challenge.title || !challenge.type) {
          return NextResponse.json(
            { success: false, error: 'Challenge title and type are required' },
            { status: 400 }
          );
        }
        cohort.challenges.push(challenge);
        break;
      }

      case 'update-challenge': {
        // Update existing challenge
        const { challengeId, updates } = data;
        const challengeIndex = cohort.challenges.findIndex(
          (c: any) => c._id.toString() === challengeId
        );
        if (challengeIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Challenge not found' },
            { status: 404 }
          );
        }
        cohort.challenges[challengeIndex] = {
          ...cohort.challenges[challengeIndex].toObject(),
          ...updates
        };
        break;
      }

      case 'update-metrics': {
        // Update cohort metrics
        const { metrics } = data;
        if (!metrics) {
          return NextResponse.json(
            { success: false, error: 'Metrics object is required' },
            { status: 400 }
          );
        }
        cohort.metrics = {
          ...cohort.metrics.toObject(),
          ...metrics
        };
        break;
      }

      case 'schedule-demo-day': {
        // Schedule demo day event
        const { demoDay } = data;
        if (!demoDay || !demoDay.date) {
          return NextResponse.json(
            { success: false, error: 'Demo day date is required' },
            { status: 400 }
          );
        }
        cohort.demoDay = demoDay;
        break;
      }

      case 'update-status': {
        // Update cohort status
        const { status } = data;
        if (!['upcoming', 'active', 'completed'].includes(status)) {
          return NextResponse.json(
            { success: false, error: 'Invalid status value' },
            { status: 400 }
          );
        }
        cohort.status = status;
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    await cohort.save();

    const updatedCohort = await Cohort.findById(params.id)
      .populate('participants', 'name email profilePicture')
      .populate('teams', 'name members currentStage')
      .populate('mentors', 'name expertise')
      .lean();

    return NextResponse.json({
      success: true,
      cohort: updatedCohort
    });
  } catch (error: any) {
    console.error('Error updating cohort:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/cohorts/[id] - Delete cohort
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const cohort = await Cohort.findByIdAndDelete(params.id);

    if (!cohort) {
      return NextResponse.json(
        { success: false, error: 'Cohort not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cohort deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting cohort:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
