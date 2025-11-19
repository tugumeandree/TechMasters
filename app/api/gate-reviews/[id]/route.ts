import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GateReview from '@/lib/models/GateReview';
import Project from '@/lib/models/Project';

// GET /api/gate-reviews/[id] - Get specific gate review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const gateReview = await GateReview.findById(params.id)
      .populate('projectId', 'name description stage')
      .populate('teamId', 'name members')
      .populate('reviewPanel.reviewerId', 'name email role profileImage')
      .populate('decision.decisionMaker', 'name email role')
      .lean();

    if (!gateReview) {
      return NextResponse.json(
        { error: 'Gate review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ gateReview });
  } catch (error) {
    console.error('Error fetching gate review:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gate review' },
      { status: 500 }
    );
  }
}

// PATCH /api/gate-reviews/[id] - Update gate review
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const { action } = body;

    const gateReview: any = await GateReview.findById(params.id);
    
    if (!gateReview) {
      return NextResponse.json(
        { error: 'Gate review not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'submit':
        // Team submits their materials
        if (gateReview.status !== 'scheduled') {
          return NextResponse.json(
            { error: 'Gate review cannot be submitted in current status' },
            { status: 400 }
          );
        }
        
        gateReview.submission = body.submission;
        gateReview.status = 'submitted';
        gateReview.submittedAt = new Date();
        break;

      case 'add-review':
        // Reviewer adds their feedback
        const reviewerIndex = gateReview.reviewPanel.findIndex(
          (r: any) => r.reviewerId.toString() === body.reviewerId
        );
        
        if (reviewerIndex === -1) {
          return NextResponse.json(
            { error: 'Reviewer not in panel' },
            { status: 403 }
          );
        }

        gateReview.reviewPanel[reviewerIndex] = {
          ...gateReview.reviewPanel[reviewerIndex],
          status: 'completed',
          recommendation: body.recommendation,
          feedback: body.feedback,
          completedAt: new Date()
        };

        // Update status to under-review if not already
        if (gateReview.status === 'submitted') {
          gateReview.status = 'under-review';
        }
        break;

      case 'make-decision':
        // Final decision by admin/program manager
        gateReview.decision = {
          outcome: body.outcome,
          feedback: body.feedback,
          actionItems: body.actionItems || [],
          decisionMaker: body.decisionMaker,
          decisionDate: new Date()
        };
        
        gateReview.status = body.outcome;
        gateReview.reviewedAt = new Date();

        if (body.outcome === 'revision-requested') {
          gateReview.revisionCount += 1;
          gateReview.revisionDeadline = body.revisionDeadline;
        }

        // If approved, update project stage
        if (body.outcome === 'approved') {
          const project = await Project.findById(gateReview.projectId);
          if (project) {
            const stageOrder = ['research', 'skilling', 'development', 'business'];
            const currentIndex = stageOrder.indexOf(gateReview.stage);
            if (currentIndex < stageOrder.length - 1) {
              project.stage = stageOrder[currentIndex + 1];
              await project.save();
            }
          }
        }
        break;

      case 'update-criteria':
        // Update review criteria scores
        gateReview.criteria = body.criteria;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    await gateReview.save();

    return NextResponse.json({
      message: 'Gate review updated successfully',
      gateReview
    });
  } catch (error) {
    console.error('Error updating gate review:', error);
    return NextResponse.json(
      { error: 'Failed to update gate review' },
      { status: 500 }
    );
  }
}
