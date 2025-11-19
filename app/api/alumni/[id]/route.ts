import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Alumni from '@/lib/models/Alumni';

// GET /api/alumni/[id] - Fetch specific alumni profile
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const alumni = await Alumni.findById(params.id)
      .populate('userId', 'name email profilePicture')
      .populate('cohortId', 'name startDate endDate')
      .lean();

    if (!alumni) {
      return NextResponse.json(
        { success: false, error: 'Alumni profile not found' },
        { status: 404 }
      );
    }

    // Filter sensitive data based on privacy settings
    if (!alumni.shareMetrics) {
      delete alumni.startupMetrics;
    }

    return NextResponse.json({
      success: true,
      alumni
    });
  } catch (error: any) {
    console.error('Error fetching alumni profile:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/alumni/[id] - Update alumni profile
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const { action, ...data } = body;

    const alumni = await Alumni.findById(params.id);
    if (!alumni) {
      return NextResponse.json(
        { success: false, error: 'Alumni profile not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'update-profile': {
        // Update basic profile information
        const allowedFields = [
          'currentStatus', 'companyName', 'position', 'companyWebsite',
          'willingToHelp', 'areasOfExpertise', 'openToOpportunities',
          'linkedIn', 'twitter', 'github', 'portfolio',
          'profileVisibility', 'shareMetrics'
        ];
        
        allowedFields.forEach(field => {
          if (data[field] !== undefined) {
            (alumni as any)[field] = data[field];
          }
        });
        break;
      }

      case 'update-metrics': {
        // Update startup metrics
        const { startupMetrics } = data;
        if (!startupMetrics) {
          return NextResponse.json(
            { success: false, error: 'startupMetrics object is required' },
            { status: 400 }
          );
        }
        alumni.startupMetrics = {
          ...alumni.startupMetrics?.toObject(),
          ...startupMetrics
        };
        break;
      }

      case 'add-achievement': {
        // Add new achievement
        const { achievement } = data;
        if (!achievement || !achievement.title || !achievement.type) {
          return NextResponse.json(
            { success: false, error: 'Achievement title and type are required' },
            { status: 400 }
          );
        }
        alumni.achievements.push({
          ...achievement,
          date: achievement.date || new Date()
        });
        break;
      }

      case 'become-mentor': {
        // Convert alumni to mentor
        const { areasOfExpertise } = data;
        alumni.isMentor = true;
        alumni.mentoringSince = new Date();
        if (areasOfExpertise) {
          alumni.areasOfExpertise = areasOfExpertise;
        }
        break;
      }

      case 'log-mentor-session': {
        // Increment mentor sessions count
        alumni.sessionsGiven = (alumni.sessionsGiven || 0) + 1;
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    await alumni.save();

    const updatedAlumni = await Alumni.findById(params.id)
      .populate('userId', 'name email profilePicture')
      .populate('cohortId', 'name')
      .lean();

    return NextResponse.json({
      success: true,
      alumni: updatedAlumni
    });
  } catch (error: any) {
    console.error('Error updating alumni profile:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/alumni/[id] - Delete alumni profile
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const alumni = await Alumni.findByIdAndDelete(params.id);

    if (!alumni) {
      return NextResponse.json(
        { success: false, error: 'Alumni profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Alumni profile deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting alumni profile:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
