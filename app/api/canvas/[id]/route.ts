import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ProjectCanvas from '@/lib/models/ProjectCanvas';

// GET /api/canvas/[id] - Fetch specific canvas
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const version = searchParams.get('version');

    const canvas = await ProjectCanvas.findById(params.id)
      .populate('projectId', 'name description currentStage')
      .populate('teamId', 'name members')
      .populate('lastEditedBy', 'name email')
      .populate('versions.savedBy', 'name')
      .lean();

    if (!canvas) {
      return NextResponse.json(
        { success: false, error: 'Canvas not found' },
        { status: 404 }
      );
    }

    // If specific version requested, return that version
    if (version) {
      const versionNum = parseInt(version);
      const versionData = canvas.versions.find(
        (v: any) => v.versionNumber === versionNum
      );
      if (!versionData) {
        return NextResponse.json(
          { success: false, error: 'Version not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        canvas: {
          ...canvas,
          sections: versionData.snapshot,
          currentVersion: versionNum,
          isHistoricalVersion: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      canvas
    });
  } catch (error: any) {
    console.error('Error fetching canvas:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/canvas/[id] - Update canvas
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const { action, section, data, userId, changesSummary } = body;

    const canvas = await ProjectCanvas.findById(params.id);
    if (!canvas) {
      return NextResponse.json(
        { success: false, error: 'Canvas not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'update-section': {
        if (!section || !data) {
          return NextResponse.json(
            { success: false, error: 'section and data are required' },
            { status: 400 }
          );
        }

        // Update the specific section
        (canvas.sections as any)[section] = {
          ...(canvas.sections as any)[section]?.toObject(),
          ...data,
          lastUpdated: new Date()
        };

        // Update tracking
        canvas.lastEditedBy = userId;
        canvas.lastEditedAt = new Date();
        break;
      }

      case 'save-version': {
        // Create a new version snapshot
        const newVersion = canvas.currentVersion + 1;
        
        canvas.versions.push({
          versionNumber: newVersion,
          stage: data.stage,
          savedAt: new Date(),
          savedBy: userId,
          snapshot: canvas.sections,
          changesSummary: changesSummary || 'Manual save'
        });

        canvas.currentVersion = newVersion;
        break;
      }

      case 'restore-version': {
        const { versionNumber } = data;
        const version = canvas.versions.find(
          (v: any) => v.versionNumber === versionNumber
        );
        
        if (!version) {
          return NextResponse.json(
            { success: false, error: 'Version not found' },
            { status: 404 }
          );
        }

        // Save current state as a version before restoring
        canvas.versions.push({
          versionNumber: canvas.currentVersion + 1,
          stage: 'backup',
          savedAt: new Date(),
          savedBy: userId,
          snapshot: canvas.sections,
          changesSummary: 'Backup before restore'
        });

        // Restore the version
        canvas.sections = version.snapshot;
        canvas.currentVersion = canvas.currentVersion + 1;
        canvas.lastEditedBy = userId;
        canvas.lastEditedAt = new Date();
        break;
      }

      case 'bulk-update': {
        // Update multiple sections at once
        if (!data.sections) {
          return NextResponse.json(
            { success: false, error: 'sections data is required' },
            { status: 400 }
          );
        }

        Object.keys(data.sections).forEach(sectionName => {
          (canvas.sections as any)[sectionName] = {
            ...(canvas.sections as any)[sectionName]?.toObject(),
            ...data.sections[sectionName],
            lastUpdated: new Date()
          };
        });

        canvas.lastEditedBy = userId;
        canvas.lastEditedAt = new Date();
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    await canvas.save();

    const updatedCanvas = await ProjectCanvas.findById(params.id)
      .populate('projectId', 'name description')
      .populate('teamId', 'name members')
      .populate('lastEditedBy', 'name')
      .lean();

    return NextResponse.json({
      success: true,
      canvas: updatedCanvas
    });
  } catch (error: any) {
    console.error('Error updating canvas:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/canvas/[id] - Delete canvas
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const canvas = await ProjectCanvas.findByIdAndDelete(params.id);

    if (!canvas) {
      return NextResponse.json(
        { success: false, error: 'Canvas not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Canvas deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting canvas:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
