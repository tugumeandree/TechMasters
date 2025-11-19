import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { matchMentors, getMentorRecommendations, findExpertMentor } from '@/lib/utils/mentorMatching';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get('participantId');
    const expertise = searchParams.get('expertise');
    const mentorType = searchParams.get('mentorType');
    const limit = parseInt(searchParams.get('limit') || '5');

    // Find expert by expertise area
    if (expertise) {
      const experts = await findExpertMentor(expertise, limit);
      return NextResponse.json({
        mentors: experts,
        count: experts.length,
        matchType: 'expertise-search'
      });
    }

    // Get recommendations for participant
    if (participantId) {
      const recommendations = await getMentorRecommendations(participantId, limit);
      return NextResponse.json({
        recommendations,
        count: recommendations.length,
        matchType: 'personalized'
      });
    }

    return NextResponse.json(
      { error: 'participantId or expertise parameter is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in mentor matching:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      participantId,
      projectCategory,
      requiredSkills,
      preferredIndustry,
      participantTimezone,
      mentorType,
      minRating,
      limit = 10
    } = body;

    if (!participantId) {
      return NextResponse.json(
        { error: 'participantId is required' },
        { status: 400 }
      );
    }

    // Run matching algorithm with custom criteria
    const matches = await matchMentors({
      participantId,
      projectCategory,
      requiredSkills,
      preferredIndustry,
      participantTimezone,
      mentorType,
      minRating
    });

    // Return top matches
    const topMatches = matches.slice(0, limit).map(match => ({
      mentorId: match.mentorId,
      mentor: {
        name: match.mentor.name,
        email: match.mentor.email,
        mentorType: match.mentor.mentorType,
        expertise: match.mentor.expertise,
        company: match.mentor.company,
        position: match.mentor.position,
        bio: match.mentor.bio,
        rating: match.mentor.rating,
        sessionsCompleted: match.mentor.sessionsCompleted,
        profileImage: match.mentor.profileImage,
        linkedIn: match.mentor.linkedIn
      },
      matchScore: Math.round(match.score * 100),
      matchBreakdown: {
        expertiseMatch: Math.round(match.breakdown.expertiseMatch * 100),
        industryMatch: Math.round(match.breakdown.industryMatch * 100),
        availabilityMatch: Math.round(match.breakdown.availabilityMatch * 100),
        ratingScore: Math.round(match.breakdown.ratingScore * 100),
        projectNeedsMatch: Math.round(match.breakdown.projectNeedsMatch * 100)
      }
    }));

    return NextResponse.json({
      matches: topMatches,
      count: topMatches.length,
      criteria: {
        projectCategory,
        requiredSkills,
        preferredIndustry,
        mentorType,
        minRating
      }
    });
  } catch (error) {
    console.error('Error in mentor matching:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
