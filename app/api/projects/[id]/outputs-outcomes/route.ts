import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/lib/models/Project';

// GET /api/projects/[id]/outputs-outcomes
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const project: any = await Project.findById(params.id)
      .select('outputs outcomes stage')
      .lean();

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      outputs: project.outputs || [],
      outcomes: project.outcomes || [],
      currentStage: project.stage
    });
  } catch (error) {
    console.error('Error fetching outputs/outcomes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch outputs and outcomes' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/outputs-outcomes
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const { type, data } = body; // type: 'output' | 'outcome'

    const project = await Project.findById(params.id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (type === 'output') {
      if (!project.outputs) {
        project.outputs = [];
      }
      project.outputs.push({
        id: `output-${Date.now()}`,
        ...data,
        completedAt: data.status === 'completed' ? new Date() : undefined
      });
    } else if (type === 'outcome') {
      if (!project.outcomes) {
        project.outcomes = [];
      }
      project.outcomes.push({
        id: `outcome-${Date.now()}`,
        ...data,
        achievedAt: data.achieved ? new Date() : undefined
      });
    }

    await project.save();

    return NextResponse.json({
      message: `${type} added successfully`,
      outputs: project.outputs,
      outcomes: project.outcomes
    });
  } catch (error) {
    console.error('Error adding output/outcome:', error);
    return NextResponse.json(
      { error: 'Failed to add output/outcome' },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id]/outputs-outcomes
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const { type, itemId, updates } = body; // type: 'output' | 'outcome'

    const project = await Project.findById(params.id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (type === 'output') {
      const outputIndex = project.outputs?.findIndex((o: any) => o.id === itemId);
      if (outputIndex !== undefined && outputIndex !== -1 && project.outputs) {
        project.outputs[outputIndex] = {
          ...project.outputs[outputIndex],
          ...updates,
          completedAt: updates.status === 'completed' ? new Date() : project.outputs[outputIndex].completedAt
        };
      }
    } else if (type === 'outcome') {
      const outcomeIndex = project.outcomes?.findIndex((o: any) => o.id === itemId);
      if (outcomeIndex !== undefined && outcomeIndex !== -1 && project.outcomes) {
        project.outcomes[outcomeIndex] = {
          ...project.outcomes[outcomeIndex],
          ...updates,
          achievedAt: updates.achieved ? new Date() : project.outcomes[outcomeIndex].achievedAt
        };
      }
    }

    await project.save();

    return NextResponse.json({
      message: `${type} updated successfully`,
      outputs: project.outputs,
      outcomes: project.outcomes
    });
  } catch (error) {
    console.error('Error updating output/outcome:', error);
    return NextResponse.json(
      { error: 'Failed to update output/outcome' },
      { status: 500 }
    );
  }
}
