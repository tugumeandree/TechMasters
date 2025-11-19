'use client';

import { useState, useEffect } from 'react';
import StageProgressTracker from '@/components/dashboard/StageProgressTracker';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import ProjectActivity from '@/components/dashboard/ProjectActivity';
import ResourceRecommendations from '@/components/dashboard/ResourceRecommendations';
import NotificationCenter from '@/components/dashboard/NotificationCenter';
import OutputsOutcomesTracker from '@/components/dashboard/OutputsOutcomesTracker';
import { Bell, Menu, Search, User } from 'lucide-react';

export default function ParticipantDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<number>(3);

  // Mock participant data - will be replaced with actual data from API
  const participant = {
    name: 'Alex Johnson',
    team: 'TechSolutions',
    currentStage: 'development' as const,
    profileImage: '/profile-placeholder.jpg',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4 flex items-center">
                <h1 className="text-2xl font-bold gradient-text">TechMasters</h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 flex items-center justify-center px-8">
              <div className="max-w-lg w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Search resources, mentors, projects..."
                  />
                </div>
              </div>
            </div>

            {/* Right side - Notifications and Profile */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
                <Bell className="h-6 w-6" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{participant.name}</p>
                  <p className="text-xs text-gray-500">{participant.team}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                  <User className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden fixed h-full z-20`}
        >
          <nav className="mt-8 px-4 space-y-2">
            <a
              href="#"
              className="flex items-center px-4 py-3 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg"
            >
              <span>Dashboard</span>
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <span>My Project</span>
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <span>Team</span>
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <span>Mentors</span>
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <span>Resources</span>
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <span>Challenges</span>
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <span>Settings</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
          <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome back, {participant.name.split(' ')[0]}! 👋
              </h2>
              <p className="mt-2 text-gray-600">
                Here's what's happening with your project today
              </p>
            </div>

            {/* Notifications */}
            <div className="mb-8">
              <NotificationCenter />
            </div>

            {/* Stage Progress Tracker */}
            <div className="mb-8">
              <StageProgressTracker currentStage={participant.currentStage} />
            </div>

            {/* Outputs & Outcomes Tracker */}
            <div className="mb-8">
              <OutputsOutcomesTracker currentStage={participant.currentStage} />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-8">
                <UpcomingSessions />
                <ProjectActivity />
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-8">
                <ResourceRecommendations currentStage={participant.currentStage} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
