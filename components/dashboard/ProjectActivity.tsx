'use client';

import { GitCommit, MessageSquare, CheckSquare, Users, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'commit' | 'comment' | 'milestone' | 'team' | 'update';
  title: string;
  description: string;
  author: string;
  timestamp: Date;
  metadata?: {
    branch?: string;
    filesChanged?: number;
    additions?: number;
    deletions?: number;
  };
}

export default function ProjectActivity() {
  // Mock data - will be replaced with API call
  const activities: Activity[] = [
    {
      id: '1',
      type: 'commit',
      title: 'Implemented user authentication flow',
      description: 'Added JWT-based authentication with refresh tokens',
      author: 'Alex Johnson',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      metadata: {
        branch: 'feature/auth',
        filesChanged: 8,
        additions: 234,
        deletions: 45
      }
    },
    {
      id: '2',
      type: 'milestone',
      title: 'MVP Core Features Complete',
      description: 'All essential features for the MVP have been implemented',
      author: 'Team',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    },
    {
      id: '3',
      type: 'comment',
      title: 'Design feedback on landing page',
      description: 'Suggested improvements to the hero section and CTA placement',
      author: 'Sarah Chen',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: '4',
      type: 'team',
      title: 'New team member joined',
      description: 'Maria Garcia joined as Frontend Developer',
      author: 'System',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: '5',
      type: 'commit',
      title: 'Database schema optimization',
      description: 'Added indexes and optimized queries for better performance',
      author: 'James Wilson',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      metadata: {
        branch: 'main',
        filesChanged: 3,
        additions: 67,
        deletions: 23
      }
    },
    {
      id: '6',
      type: 'update',
      title: 'Sprint planning completed',
      description: 'Defined tasks for the next 2-week sprint',
      author: 'Team',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'commit':
        return <GitCommit className="h-5 w-5" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5" />;
      case 'milestone':
        return <CheckSquare className="h-5 w-5" />;
      case 'team':
        return <Users className="h-5 w-5" />;
      case 'update':
        return <Clock className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'commit':
        return 'bg-blue-100 text-blue-600';
      case 'comment':
        return 'bg-purple-100 text-purple-600';
      case 'milestone':
        return 'bg-green-100 text-green-600';
      case 'team':
        return 'bg-orange-100 text-orange-600';
      case 'update':
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-600 mt-1">
            Latest updates from your project
          </p>
        </div>
        <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
          View All →
        </button>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Activity Items */}
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative flex gap-4">
              {/* Icon */}
              <div className={`
                relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                ${getActivityColor(activity.type)}
              `}>
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{activity.author}</span>
                  
                  {/* Commit Metadata */}
                  {activity.type === 'commit' && activity.metadata && (
                    <>
                      <span>•</span>
                      <span className="text-green-600">+{activity.metadata.additions}</span>
                      <span className="text-red-600">-{activity.metadata.deletions}</span>
                      <span>•</span>
                      <span>{activity.metadata.filesChanged} files</span>
                      {activity.metadata.branch && (
                        <>
                          <span>•</span>
                          <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                            {activity.metadata.branch}
                          </code>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {activities.filter(a => a.type === 'commit').length}
          </p>
          <p className="text-xs text-gray-600 mt-1">Commits This Week</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {activities.filter(a => a.type === 'milestone').length}
          </p>
          <p className="text-xs text-gray-600 mt-1">Milestones Reached</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">4</p>
          <p className="text-xs text-gray-600 mt-1">Team Members</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-6">
        <a 
          href="#"
          className="block w-full py-2.5 text-center border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
        >
          View Project Repository →
        </a>
      </div>
    </div>
  );
}
