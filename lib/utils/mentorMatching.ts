import User from '../models/User';
import MentorSession from '../models/MentorSession';
import { MentorType } from '@/types';

interface MentorMatchCriteria {
  participantId: string;
  projectCategory?: string;
  requiredSkills?: string[];
  preferredIndustry?: string;
  participantTimezone?: string;
  mentorType?: MentorType;
  minRating?: number;
}

interface MentorScore {
  mentorId: string;
  mentor: any;
  score: number;
  breakdown: {
    expertiseMatch: number;
    industryMatch: number;
    availabilityMatch: number;
    ratingScore: number;
    projectNeedsMatch: number;
  };
}

// Weights for different matching criteria
const WEIGHTS = {
  expertise: 0.35,        // 35% - Most important
  projectNeeds: 0.25,     // 25% - Project-specific requirements
  rating: 0.20,           // 20% - Past performance
  industry: 0.15,         // 15% - Industry experience
  availability: 0.05      // 5% - Timezone/availability
};

/**
 * Calculate Jaccard similarity between two sets
 * Used for comparing skill sets and expertise areas
 */
function jaccardSimilarity(set1: string[], set2: string[]): number {
  if (set1.length === 0 && set2.length === 0) return 0;
  if (set1.length === 0 || set2.length === 0) return 0;

  const s1 = new Set(set1.map(s => s.toLowerCase().trim()));
  const s2 = new Set(set2.map(s => s.toLowerCase().trim()));
  
  const intersection = new Set([...s1].filter(x => s2.has(x)));
  const union = new Set([...s1, ...s2]);
  
  return intersection.size / union.size;
}

/**
 * Calculate expertise match score
 * Compares mentor's expertise with participant's required skills
 */
function calculateExpertiseMatch(
  mentorExpertise: string[],
  requiredSkills: string[]
): number {
  if (!requiredSkills || requiredSkills.length === 0) return 0.5; // Neutral score
  if (!mentorExpertise || mentorExpertise.length === 0) return 0;

  return jaccardSimilarity(mentorExpertise, requiredSkills);
}

/**
 * Calculate industry match score
 * Checks if mentor has experience in participant's industry
 */
function calculateIndustryMatch(
  mentorCompany: string | undefined,
  preferredIndustry: string | undefined,
  projectCategory: string | undefined
): number {
  if (!preferredIndustry && !projectCategory) return 0.5; // Neutral score
  
  let score = 0;
  const companyLower = (mentorCompany || '').toLowerCase();
  const industryLower = (preferredIndustry || '').toLowerCase();
  const categoryLower = (projectCategory || '').toLowerCase();

  // Direct industry match
  if (industryLower && companyLower.includes(industryLower)) {
    score += 0.5;
  }

  // Category match (e.g., "FinTech" in company name)
  if (categoryLower && companyLower.includes(categoryLower)) {
    score += 0.5;
  }

  return Math.min(score, 1.0);
}

/**
 * Calculate timezone availability match
 * Checks if mentor and participant have overlapping working hours
 */
function calculateAvailabilityMatch(
  mentorTimezone: string | undefined,
  participantTimezone: string | undefined
): number {
  if (!mentorTimezone || !participantTimezone) return 0.5; // Neutral score

  // Parse timezone offset (e.g., "UTC+3", "GMT-5")
  const parseOffset = (tz: string): number => {
    const match = tz.match(/([+-]?\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const mentorOffset = parseOffset(mentorTimezone);
  const participantOffset = parseOffset(participantTimezone);
  const hoursDiff = Math.abs(mentorOffset - participantOffset);

  // Perfect match: same timezone (1.0)
  // Good match: 1-3 hours difference (0.8)
  // Okay match: 4-6 hours difference (0.5)
  // Poor match: 7+ hours difference (0.2)
  if (hoursDiff === 0) return 1.0;
  if (hoursDiff <= 3) return 0.8;
  if (hoursDiff <= 6) return 0.5;
  return 0.2;
}

/**
 * Calculate rating score
 * Normalizes mentor rating to 0-1 scale
 */
function calculateRatingScore(
  mentorRating: number | undefined,
  minRating: number = 0
): number {
  if (!mentorRating) return 0.5; // Neutral score for new mentors
  
  // Normalize rating (assuming 0-5 scale)
  const normalized = mentorRating / 5.0;
  
  // Apply minimum rating filter
  if (mentorRating < minRating) return 0;
  
  return normalized;
}

/**
 * Calculate project needs match
 * Checks if mentor's type aligns with current project stage needs
 */
function calculateProjectNeedsMatch(
  mentorType: string,
  projectCategory: string | undefined,
  currentStage: string = 'research'
): number {
  const stageNeeds: Record<string, string[]> = {
    research: ['technical', 'industry'],        // Research & Ideation needs domain expertise
    skilling: ['technical', 'industry'],        // Skilling needs technical trainers
    development: ['technical', 'industry'],     // Product Development needs technical guidance
    business: ['investor', 'industry']          // Business Development needs business mentors
  };

  const neededTypes = stageNeeds[currentStage] || ['technical'];
  
  if (neededTypes.includes(mentorType)) {
    return 1.0;
  }
  
  // Partial match
  if (mentorType === 'technical' && currentStage !== 'business') return 0.7;
  if (mentorType === 'industry') return 0.8; // Industry always helpful
  if (mentorType === 'investor' && currentStage === 'development') return 0.5;
  
  return 0.3;
}

/**
 * Main mentor matching algorithm
 * Returns ranked list of mentors based on multiple criteria
 */
export async function matchMentors(
  criteria: MentorMatchCriteria
): Promise<MentorScore[]> {
  try {
    // Find all active mentors
    const mentors = await User.find({ 
      role: 'mentor',
      ...(criteria.mentorType && { mentorType: criteria.mentorType })
    }).lean();

    if (mentors.length === 0) {
      return [];
    }

    // Get participant's past sessions for context
    const pastSessions = await MentorSession.find({
      participantId: criteria.participantId,
      status: 'completed'
    }).lean();

    const mentorsWithPastSessions = new Set(
      pastSessions.map(s => s.mentorId.toString())
    );

    // Calculate scores for each mentor
    const scoredMentors: MentorScore[] = [];

    for (const mentor of mentors) {
      // Calculate individual component scores
      const expertiseMatch = calculateExpertiseMatch(
        mentor.expertise || [],
        criteria.requiredSkills || []
      );

      const industryMatch = calculateIndustryMatch(
        mentor.company,
        criteria.preferredIndustry,
        criteria.projectCategory
      );

      const availabilityMatch = calculateAvailabilityMatch(
        mentor.timezone,
        criteria.participantTimezone
      );

      const ratingScore = calculateRatingScore(
        mentor.rating,
        criteria.minRating
      );

      const projectNeedsMatch = calculateProjectNeedsMatch(
        mentor.mentorType,
        criteria.projectCategory
      );

      // Calculate weighted total score
      const totalScore = 
        (expertiseMatch * WEIGHTS.expertise) +
        (projectNeedsMatch * WEIGHTS.projectNeeds) +
        (ratingScore * WEIGHTS.rating) +
        (industryMatch * WEIGHTS.industry) +
        (availabilityMatch * WEIGHTS.availability);

      // Bonus: Penalize mentors participant has worked with recently (diversity)
      let finalScore = totalScore;
      if (mentorsWithPastSessions.has(mentor._id.toString())) {
        finalScore *= 0.9; // 10% penalty
      }

      // Bonus: Boost highly rated mentors
      if (mentor.rating && mentor.rating >= 4.5) {
        finalScore *= 1.1; // 10% boost
      }

      scoredMentors.push({
        mentorId: mentor._id.toString(),
        mentor,
        score: Math.min(finalScore, 1.0), // Cap at 1.0
        breakdown: {
          expertiseMatch,
          industryMatch,
          availabilityMatch,
          ratingScore,
          projectNeedsMatch
        }
      });
    }

    // Sort by score (highest first)
    return scoredMentors.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error in mentor matching:', error);
    throw error;
  }
}

/**
 * Get mentor recommendations for a participant
 * Returns top N mentors with detailed match explanations
 */
export async function getMentorRecommendations(
  participantId: string,
  limit: number = 5
): Promise<any[]> {
  try {
    // Get participant data
    const participant = await User.findById(participantId).lean();
    
    if (!participant) {
      throw new Error('Participant not found');
    }

    // Build matching criteria from participant profile
    const criteria: MentorMatchCriteria = {
      participantId,
      requiredSkills: participant.skills || [],
      participantTimezone: participant.timezone,
      minRating: 3.5 // Only recommend mentors with 3.5+ rating
    };

    // Get matched mentors
    const matches = await matchMentors(criteria);

    // Return top N with enriched data
    return matches.slice(0, limit).map(match => ({
      mentorId: match.mentorId,
      name: match.mentor.name,
      email: match.mentor.email,
      mentorType: match.mentor.mentorType,
      expertise: match.mentor.expertise,
      company: match.mentor.company,
      position: match.mentor.position,
      bio: match.mentor.bio,
      rating: match.mentor.rating,
      sessionsCompleted: match.mentor.sessionsCompleted || 0,
      profileImage: match.mentor.profileImage,
      matchScore: Math.round(match.score * 100),
      matchBreakdown: {
        expertiseMatch: Math.round(match.breakdown.expertiseMatch * 100),
        industryMatch: Math.round(match.breakdown.industryMatch * 100),
        availabilityMatch: Math.round(match.breakdown.availabilityMatch * 100),
        ratingScore: Math.round(match.breakdown.ratingScore * 100),
        projectNeedsMatch: Math.round(match.breakdown.projectNeedsMatch * 100)
      },
      matchReason: generateMatchReason(match)
    }));
  } catch (error) {
    console.error('Error getting mentor recommendations:', error);
    throw error;
  }
}

/**
 * Generate human-readable explanation for why mentor was matched
 */
function generateMatchReason(match: MentorScore): string {
  const reasons: string[] = [];
  const breakdown = match.breakdown;

  if (breakdown.expertiseMatch > 0.7) {
    reasons.push('Strong expertise match with your skills');
  }

  if (breakdown.projectNeedsMatch > 0.8) {
    reasons.push('Perfect fit for your current stage');
  }

  if (breakdown.ratingScore > 0.8) {
    reasons.push('Highly rated by past participants');
  }

  if (breakdown.industryMatch > 0.5) {
    reasons.push('Experience in your industry');
  }

  if (breakdown.availabilityMatch > 0.7) {
    reasons.push('Compatible timezone');
  }

  if (reasons.length === 0) {
    return 'Good overall match for your needs';
  }

  return reasons.join(' • ');
}

/**
 * Find best mentor for specific expertise
 */
export async function findExpertMentor(
  expertise: string,
  limit: number = 3
): Promise<any[]> {
  try {
    const mentors = await User.find({
      role: 'mentor',
      expertise: { $regex: expertise, $options: 'i' }
    })
    .sort({ rating: -1, sessionsCompleted: -1 })
    .limit(limit)
    .lean();

    return mentors.map(mentor => ({
      mentorId: mentor._id,
      name: mentor.name,
      mentorType: mentor.mentorType,
      expertise: mentor.expertise,
      company: mentor.company,
      rating: mentor.rating,
      sessionsCompleted: mentor.sessionsCompleted
    }));
  } catch (error) {
    console.error('Error finding expert mentor:', error);
    throw error;
  }
}
