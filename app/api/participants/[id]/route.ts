import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Team from '@/lib/models/Team';
import Project from '@/lib/models/Project';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;

    // Find participant
    const participant = await User.findById(id).select('-password');
    
    if (!participant || participant.role !== 'participant') {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    // Get team info
    let teamInfo = null;
    if (participant.teamId) {
      const team = await Team.findById(participant.teamId)
        .populate('leaderId', 'name email')
        .populate('members', 'name email profileImage')
        .populate('mentors', 'name email expertise');
      
      if (team) {
        // Get project info
        const project = await Project.findOne({ teamId: team._id });
        
        teamInfo = {
          id: team._id,
          name: team.name,
          projectName: team.projectName,
          leader: team.leaderId,
          members: team.members,
          mentors: team.mentors,
          currentStage: team.currentStage,
          project: project
        };
      }
    }

    return NextResponse.json({
      participant: {
        id: participant._id,
        name: participant.name,
        email: participant.email,
        role: participant.role,
        phone: participant.phone,
        location: participant.location,
        bio: participant.bio,
        skills: participant.skills,
        currentStage: participant.currentStage || 'research',
        profileImage: participant.profileImage,
        cohortId: participant.cohortId,
        applicationId: participant.applicationId
      },
      team: teamInfo
    });
  } catch (error) {
    console.error('Error fetching participant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
