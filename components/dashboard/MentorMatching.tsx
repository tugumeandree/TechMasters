'use client';

import { useState, useEffect } from 'react';
import { Star, Briefcase, MapPin, Calendar, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react';

interface MentorMatch {
  mentorId: string;
  name: string;
  email: string;
  mentorType: string;
  expertise: string[];
  company?: string;
  position?: string;
  bio?: string;
  rating?: number;
  sessionsCompleted: number;
  profileImage?: string;
  matchScore: number;
  matchBreakdown: {
    expertiseMatch: number;
    industryMatch: number;
    availabilityMatch: number;
    ratingScore: number;
    projectNeedsMatch: number;
  };
  matchReason: string;
}

interface MentorMatchingProps {
  participantId: string;
}

export default function MentorMatching({ participantId }: MentorMatchingProps) {
  const [recommendations, setRecommendations] = useState<MentorMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [participantId]);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/mentors/match?participantId=${participantId}&limit=5`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getMentorTypeColor = (type: string) => {
    switch (type) {
      case 'technical':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'industry':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'investor':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const requestSession = async (mentorId: string) => {
    // TODO: Implement session request
    console.log('Requesting session with mentor:', mentorId);
    setSelectedMentor(mentorId);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center text-red-600">
          <p>Error loading mentor recommendations: {error}</p>
          <button 
            onClick={fetchRecommendations}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary-600" />
          Recommended Mentors
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Matched based on your skills, project needs, and goals
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No mentor recommendations available at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((mentor) => (
            <div
              key={mentor.mentorId}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
            >
              {/* Header with Photo and Basic Info */}
              <div className="flex items-start gap-4 mb-4">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-xl font-bold">
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">{mentor.name}</h4>
                      {mentor.position && mentor.company && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Briefcase className="h-3.5 w-3.5" />
                          {mentor.position} at {mentor.company}
                        </p>
                      )}
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex-shrink-0">
                      <div className={`text-center px-3 py-1 rounded-full bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200`}>
                        <div className={`text-2xl font-bold ${getMatchScoreColor(mentor.matchScore)}`}>
                          {mentor.matchScore}%
                        </div>
                        <div className="text-xs text-gray-600">Match</div>
                      </div>
                    </div>
                  </div>

                  {/* Mentor Type and Rating */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getMentorTypeColor(mentor.mentorType)}`}>
                      {mentor.mentorType.charAt(0).toUpperCase() + mentor.mentorType.slice(1)} Mentor
                    </span>
                    
                    {mentor.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{mentor.rating.toFixed(1)}</span>
                        <span className="text-gray-500">({mentor.sessionsCompleted} sessions)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {mentor.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {mentor.bio}
                </p>
              )}

              {/* Expertise Tags */}
              {mentor.expertise && mentor.expertise.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {mentor.expertise.length > 4 && (
                      <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-md text-xs">
                        +{mentor.expertise.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Match Reason */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{mentor.matchReason}</span>
                </p>
              </div>

              {/* Match Breakdown */}
              <div className="mb-4">
                <details className="group">
                  <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-900 font-medium">
                    View detailed match breakdown →
                  </summary>
                  <div className="mt-3 space-y-2">
                    {Object.entries(mentor.matchBreakdown).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-32 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 w-10 text-right">
                          {value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => requestSession(mentor.mentorId)}
                  disabled={selectedMentor === mentor.mentorId}
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  {selectedMentor === mentor.mentorId ? 'Request Sent' : 'Request Session'}
                </button>
                <button
                  className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  View Profile
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={fetchRecommendations}
          className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
        >
          ↻ Refresh Recommendations
        </button>
      </div>
    </div>
  );
}
