import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Project from '@/lib/models/Project';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;

    // Find participant
    const participant = await User.findById(id);
    
    if (!participant || participant.role !== 'participant') {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    // Get current stage from participant or project
    let currentStage = participant.currentStage || 'research';
    let progress = {
      ideation: 0,
      validation: 0,
      development: 0,
      scaling: 0
    };

    // If participant has a team, get project progress
    if (participant.teamId) {
      const project = await Project.findOne({ teamId: participant.teamId });
      
      if (project) {
        currentStage = project.stage;
        progress = project.progress;
      }
    }

    // Calculate overall progress
    const stageOrder = ['ideation', 'validation', 'development', 'scaling'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const overallProgress = Math.round(
      (Object.values(progress).reduce((sum: number, val) => sum + val, 0) / 4)
    );

    return NextResponse.json({
      currentStage,
      progress,
      overallProgress,
      completedStages: currentIndex,
      totalStages: 4,
      nextStage: currentIndex < 3 ? stageOrder[currentIndex + 1] : null
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
