'use client';

import { Calendar, Clock, Video, User, ExternalLink } from 'lucide-react';
import { MentorSession } from '@/types';
import { format, addDays } from 'date-fns';

export default function UpcomingSessions() {
  // Mock data - will be replaced with API call
  const upcomingSessions: (MentorSession & { mentorName: string; mentorType: string })[] = [
    {
      id: '1',
      mentorId: 'm1',
      mentorName: 'Sarah Chen',
      mentorType: 'Technical Mentor',
      participantId: 'p1',
      date: addDays(new Date(), 2),
      duration: 60,
      type: 'one-on-one',
      status: 'scheduled',
      topic: 'MVP Architecture Review',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      createdAt: new Date()
    },
    {
      id: '2',
      mentorId: 'm2',
      mentorName: 'Michael Torres',
      mentorType: 'Industry Mentor',
      teamId: 't1',
      date: addDays(new Date(), 5),
      duration: 45,
      type: 'group',
      status: 'scheduled',
      topic: 'Go-to-Market Strategy Workshop',
      meetingLink: 'https://zoom.us/j/123456789',
      createdAt: new Date()
    },
    {
      id: '3',
      mentorId: 'm3',
      mentorName: 'Rachel Kim',
      mentorType: 'Investor Mentor',
      participantId: 'p1',
      date: addDays(new Date(), 7),
      duration: 30,
      type: 'one-on-one',
      status: 'scheduled',
      topic: 'Pitch Deck Feedback',
      meetingLink: 'https://meet.google.com/xyz-abcd-efg',
      createdAt: new Date()
    }
  ];

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'one-on-one':
        return 'bg-blue-100 text-blue-700';
      case 'group':
        return 'bg-purple-100 text-purple-700';
      case 'workshop':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDaysUntil = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Upcoming Mentor Sessions</h3>
          <p className="text-sm text-gray-600 mt-1">
            {upcomingSessions.length} sessions scheduled
          </p>
        </div>
        <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
          View All →
        </button>
      </div>

      {upcomingSessions.length > 0 ? (
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <div 
              key={session.id} 
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Session Title and Type */}
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{session.topic}</h4>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${getSessionTypeColor(session.type)}
                    `}>
                      {session.type === 'one-on-one' ? '1:1' : 
                       session.type === 'group' ? 'Group' : 'Workshop'}
                    </span>
                  </div>

                  {/* Mentor Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{session.mentorName}</p>
                      <p className="text-xs text-gray-500">{session.mentorType}</p>
                    </div>
                  </div>

                  {/* Date and Time Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{format(session.date, 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{format(session.date, 'h:mm a')} ({session.duration} min)</span>
                    </div>
                  </div>
                </div>

                {/* Days Until Badge */}
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                    {getDaysUntil(session.date)}
                  </span>
                </div>
              </div>

              {/* Join Button */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  <Video className="h-4 w-4" />
                  Join Meeting
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No upcoming sessions scheduled</p>
          <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
            Schedule a Session
          </button>
        </div>
      )}

      {/* Quick Action - Schedule New Session */}
      {upcomingSessions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors">
            + Schedule Another Session
          </button>
        </div>
      )}
    </div>
  );
}
