import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import TeamFormation from '@/lib/models/TeamFormation';
import Team from '@/lib/models/Team';

// Helper function to calculate match score
function calculateMatchScore(profile1: any, profile2: any): number {
  let score = 0;
  
  // Skills match (40 points)
  const skillsMatch = profile1.skills.filter((skill: string) =>
    profile2.desiredSkills?.includes(skill)
  ).length;
  score += Math.min(skillsMatch * 10, 40);
  
  // Role match (30 points)
  if (profile2.desiredRoles?.includes(profile1.role)) {
    score += 30;
  }
  
  // Work style match (15 points)
  if (profile1.preferences?.workStyle === profile2.preferences?.workStyle) {
    score += 15;
  }
  
  // Commitment match (15 points)
  if (profile1.preferences?.commitment === profile2.preferences?.commitment) {
    score += 15;
  }
  
  return score;
}

// GET /api/team-formation/[id] - Fetch specific profile
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const profile = await TeamFormation.findById(params.id)
      .populate('participantId', 'name email profilePicture skills')
      .populate('cohortId', 'name')
      .populate('interestedIn', 'name skills role')
      .populate('interestedBy', 'name skills role')
      .populate('matches.userId', 'name skills role')
      .populate('formedTeamId', 'name members')
      .lean();

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile
    });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/team-formation/[id] - Update profile
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const { action, ...data } = body;

    const profile = await TeamFormation.findById(params.id);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'update-profile': {
        const allowedFields = [
          'lookingFor', 'projectIdea', 'skills', 'role',
          'desiredRoles', 'desiredSkills', 'teamSize', 'preferences'
        ];
        
        allowedFields.forEach(field => {
          if (data[field] !== undefined) {
            (profile as any)[field] = data[field];
          }
        });
        break;
      }

      case 'show-interest': {
        const { targetUserId } = data;
        if (!targetUserId) {
          return NextResponse.json(
            { success: false, error: 'targetUserId is required' },
            { status: 400 }
          );
        }
        if (!profile.interestedIn.includes(targetUserId)) {
          profile.interestedIn.push(targetUserId);
        }
        
        // Add to target's interestedBy
        await TeamFormation.updateOne(
          { participantId: targetUserId, cohortId: profile.cohortId },
          { $addToSet: { interestedBy: profile.participantId } }
        );
        
        // Check for mutual interest
        const targetProfile = await TeamFormation.findOne({
          participantId: targetUserId,
          cohortId: profile.cohortId
        });
        
        if (targetProfile?.interestedIn.includes(profile.participantId.toString())) {
          // Mutual interest - create match
          const matchScore = calculateMatchScore(profile, targetProfile);
          
          profile.matches.push({
            userId: targetUserId,
            matchScore,
            status: 'pending',
            matchedAt: new Date()
          });
          
          targetProfile.matches.push({
            userId: profile.participantId,
            matchScore,
            status: 'pending',
            matchedAt: new Date()
          });
          
          await targetProfile.save();
          profile.status = 'in-discussion';
        }
        break;
      }

      case 'accept-match': {
        const { matchUserId } = data;
        const match = profile.matches.find(
          (m: any) => m.userId.toString() === matchUserId
        );
        if (!match) {
          return NextResponse.json(
            { success: false, error: 'Match not found' },
            { status: 404 }
          );
        }
        match.status = 'accepted';
        break;
      }

      case 'decline-match': {
        const { matchUserId } = data;
        const match = profile.matches.find(
          (m: any) => m.userId.toString() === matchUserId
        );
        if (!match) {
          return NextResponse.json(
            { success: false, error: 'Match not found' },
            { status: 404 }
          );
        }
        match.status = 'declined';
        break;
      }

      case 'form-team': {
        const { teamData, memberIds } = data;
        if (!teamData || !memberIds || memberIds.length === 0) {
          return NextResponse.json(
            { success: false, error: 'teamData and memberIds are required' },
            { status: 400 }
          );
        }
        
        // Create new team
        const team = await Team.create({
          ...teamData,
          members: memberIds,
          cohort: profile.cohortId
        });
        
        // Update all member profiles
        await TeamFormation.updateMany(
          { participantId: { $in: memberIds }, cohortId: profile.cohortId },
          {
            formedTeamId: team._id,
            teamFormedAt: new Date(),
            status: 'team-formed'
          }
        );
        
        profile.formedTeamId = team._id;
        profile.teamFormedAt = new Date();
        profile.status = 'team-formed';
        break;
      }

      case 'update-status': {
        const { status } = data;
        if (!['open', 'in-discussion', 'team-formed', 'closed'].includes(status)) {
          return NextResponse.json(
            { success: false, error: 'Invalid status' },
            { status: 400 }
          );
        }
        profile.status = status;
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    await profile.save();

    const updatedProfile = await TeamFormation.findById(params.id)
      .populate('participantId', 'name email profilePicture')
      .populate('interestedIn', 'name skills')
      .populate('interestedBy', 'name skills')
      .populate('matches.userId', 'name skills')
      .populate('formedTeamId', 'name members')
      .lean();

    return NextResponse.json({
      success: true,
      profile: updatedProfile
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/team-formation/[id] - Delete profile
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const profile = await TeamFormation.findByIdAndDelete(params.id);

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
