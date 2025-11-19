import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ProjectCanvas from '@/lib/models/ProjectCanvas';

// GET /api/canvas - Fetch all project canvases
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const teamId = searchParams.get('teamId');

    // Build query
    const query: any = {};
    if (projectId) {
      query.projectId = projectId;
    }
    if (teamId) {
      query.teamId = teamId;
    }

    const canvases = await ProjectCanvas.find(query)
      .populate('projectId', 'name description currentStage')
      .populate('teamId', 'name members')
      .populate('lastEditedBy', 'name')
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      canvases
    });
  } catch (error: any) {
    console.error('Error fetching canvases:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/canvas - Create a new project canvas
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { projectId, teamId, sections } = body;

    // Validation
    if (!projectId || !teamId) {
      return NextResponse.json(
        { success: false, error: 'projectId and teamId are required' },
        { status: 400 }
      );
    }

    // Check if canvas already exists
    const existingCanvas = await ProjectCanvas.findOne({ projectId });
    if (existingCanvas) {
      return NextResponse.json(
        { success: false, error: 'Canvas already exists for this project' },
        { status: 400 }
      );
    }

    // Create canvas with initial sections
    const canvas = await ProjectCanvas.create({
      projectId,
      teamId,
      sections: sections || {},
      currentVersion: 1,
      versions: []
    });

    const populatedCanvas = await ProjectCanvas.findById(canvas._id)
      .populate('projectId', 'name description')
      .populate('teamId', 'name members')
      .lean();

    return NextResponse.json({
      success: true,
      canvas: populatedCanvas
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating canvas:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
