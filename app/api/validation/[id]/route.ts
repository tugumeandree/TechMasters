import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ValidationActivity from '@/lib/models/ValidationActivity';

// GET /api/validation/[id] - Fetch specific validation activity
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const activity = await ValidationActivity.findById(params.id)
      .populate('projectId', 'name description currentStage')
      .populate('teamId', 'name members')
      .lean();

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Validation activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      activity
    });
  } catch (error: any) {
    console.error('Error fetching validation activity:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/validation/[id] - Update validation activity
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const activity = await ValidationActivity.findById(params.id);

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Validation activity not found' },
        { status: 404 }
      );
    }

    // Update all provided fields
    const allowedFields = [
      'interviewDetails', 'questions', 'findings',
      'testingDetails', 'testResults',
      'surveyDetails', 'surveyResults',
      'pilotDetails', 'pilotResults',
      'attachments', 'overallInsights', 'actionItems',
      'pivotRequired', 'validationScore', 'tags', 'status'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        (activity as any)[field] = body[field];
      }
    });

    await activity.save();

    const updatedActivity = await ValidationActivity.findById(params.id)
      .populate('projectId', 'name description')
      .populate('teamId', 'name members')
      .lean();

    return NextResponse.json({
      success: true,
      activity: updatedActivity
    });
  } catch (error: any) {
    console.error('Error updating validation activity:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/validation/[id] - Delete validation activity
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const activity = await ValidationActivity.findByIdAndDelete(params.id);

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Validation activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Validation activity deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting validation activity:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
