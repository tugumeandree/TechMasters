'use client';

import { useState } from 'react';
import { Bell, X, AlertCircle, CheckCircle, Info, Calendar, TrendingUp } from 'lucide-react';

interface Notification {
  id: string;
  type: 'gate-review' | 'success' | 'info' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'gate-review',
      title: 'Gate Review Scheduled',
      message: 'Your Validation stage gate review is scheduled for next Monday at 2:00 PM. Prepare your presentation and ensure all milestones are complete.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: false,
      actionLabel: 'Prepare Review',
      actionUrl: '#'
    },
    {
      id: '2',
      type: 'success',
      title: 'Milestone Completed!',
      message: 'Congratulations! You\'ve completed the "Customer Validation" milestone. Your progress has been updated.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Mentor Session Tomorrow',
      message: 'Don\'t forget about your session with Sarah Chen tomorrow at 10:00 AM. Topic: MVP Architecture Review',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: true,
      actionLabel: 'View Details',
      actionUrl: '#'
    }
  ]);

  const [showAll, setShowAll] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 3);

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'gate-review':
        return <AlertCircle className="h-5 w-5" />;
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'reminder':
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'gate-review':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'success':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'info':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'reminder':
        return 'bg-purple-100 text-purple-600 border-purple-200';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No new notifications</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-100">
        {displayedNotifications.map((notification) => (
          <div 
            key={notification.id}
            className={`
              px-6 py-4 transition-colors
              ${!notification.read ? 'bg-primary-50/30' : 'bg-white hover:bg-gray-50'}
            `}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border
                ${getNotificationColor(notification.type)}
              `}>
                {getNotificationIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    {notification.title}
                    {!notification.read && (
                      <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                    )}
                  </h4>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {notification.message}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(notification.timestamp)}
                  </span>

                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                    {notification.actionLabel && (
                      <a
                        href={notification.actionUrl}
                        className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        {notification.actionLabel} →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Toggle */}
      {notifications.length > 3 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            {showAll ? '↑ Show Less' : `↓ View ${notifications.length - 3} More Notifications`}
          </button>
        </div>
      )}
    </div>
  );
}
