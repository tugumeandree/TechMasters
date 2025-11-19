'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Lock, Lightbulb, Target, Code, TrendingUp } from 'lucide-react';
import { ProgramStage } from '@/types';

interface StageProgressTrackerProps {
  currentStage: ProgramStage;
}

interface StageInfo {
  id: ProgramStage;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  status: 'completed' | 'current' | 'locked';
  milestones: string[];
  duration: string;
}

export default function StageProgressTracker({ currentStage }: StageProgressTrackerProps) {
  const stageOrder: ProgramStage[] = ['research', 'skilling', 'development', 'business'];
  const currentIndex = stageOrder.indexOf(currentStage);

  const stages: StageInfo[] = [
    {
      id: 'research',
      name: 'Research & Ideation',
      description: 'Identify real-world problems and validate technology solutions',
      icon: <Lightbulb className="h-6 w-6" />,
      progress: currentIndex > 0 ? 100 : currentIndex === 0 ? 65 : 0,
      status: currentIndex > 0 ? 'completed' : currentIndex === 0 ? 'current' : 'locked',
      milestones: [
        'Market analysis and trend spotting',
        'Literature review and gap identification',
        'User interviews with stakeholders',
        'Gate Review: Problem-solution validation'
      ],
      duration: '4 weeks'
    },
    {
      id: 'skilling',
      name: 'Skilling & Capacity Building',
      description: 'Acquire technical and soft skills to execute your project',
      icon: <Target className="h-6 w-6" />,
      progress: currentIndex > 1 ? 100 : currentIndex === 1 ? 45 : 0,
      status: currentIndex > 1 ? 'completed' : currentIndex === 1 ? 'current' : 'locked',
      milestones: [
        'Complete technical workshops',
        'Soft skills and project management training',
        'Tool training and hands-on practice',
        'Gate Review: Competency validation'
      ],
      duration: '6 weeks'
    },
    {
      id: 'development',
      name: 'Product Development',
      description: 'Build your MVP using agile development practices',
      icon: <Code className="h-6 w-6" />,
      progress: currentIndex > 2 ? 100 : currentIndex === 2 ? 30 : 0,
      status: currentIndex > 2 ? 'completed' : currentIndex === 2 ? 'current' : 'locked',
      milestones: [
        'Agile sprint cycles and prototyping',
        'User testing and feedback integration',
        'Iterative design refinement',
        'Gate Review: MVP readiness'
      ],
      duration: '8 weeks'
    },
    {
      id: 'business',
      name: 'Business Development',
      description: 'Create business model and prepare for market launch',
      icon: <TrendingUp className="h-6 w-6" />,
      progress: currentIndex > 3 ? 100 : currentIndex === 3 ? 15 : 0,
      status: currentIndex > 3 ? 'completed' : currentIndex === 3 ? 'current' : 'locked',
      milestones: [
        'Business model canvas and IP strategy',
        'Go-to-market strategy development',
        'Investor pitch and demo day prep',
        'Final Review: Launch readiness'
      ],
      duration: '8 weeks'
    }
  ];

  const currentStageInfo = stages.find(s => s.id === currentStage);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Your Journey</h3>
        <p className="text-gray-600 mt-1">Track your progress through the TechMasters program</p>
      </div>

      {/* Visual Progress Timeline */}
      <div className="relative mb-8">
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
          />
        </div>
        
        <div className="relative flex justify-between">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex flex-col items-center" style={{ width: '25%' }}>
              <div 
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${stage.status === 'completed' ? 'bg-green-500 text-white' : ''}
                  ${stage.status === 'current' ? 'bg-primary-500 text-white ring-4 ring-primary-100' : ''}
                  ${stage.status === 'locked' ? 'bg-gray-200 text-gray-400' : ''}
                `}
              >
                {stage.status === 'completed' ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : stage.status === 'locked' ? (
                  <Lock className="h-5 w-5" />
                ) : (
                  stage.icon
                )}
              </div>
              <p className={`
                mt-2 text-sm font-medium text-center
                ${stage.status === 'current' ? 'text-primary-600' : 'text-gray-600'}
              `}>
                {stage.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stage.duration}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Current Stage Details */}
      {currentStageInfo && (
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">{currentStageInfo.icon}</span>
                Current Stage: {currentStageInfo.name}
              </h4>
              <p className="text-sm text-gray-600 mt-1">{currentStageInfo.description}</p>
            </div>
            <span className="text-2xl font-bold text-primary-600">
              {currentStageInfo.progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-white rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
                style={{ width: `${currentStageInfo.progress}%` }}
              />
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h5 className="text-sm font-semibold text-gray-700 mb-3">Stage Milestones:</h5>
            <ul className="space-y-2">
              {currentStageInfo.milestones.map((milestone, index) => {
                const isCompleted = index < Math.floor(currentStageInfo.progress / 25);
                return (
                  <li key={index} className="flex items-start">
                    <div className={`
                      mt-0.5 mr-3 flex-shrink-0
                      ${isCompleted ? 'text-green-500' : 'text-gray-400'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`
                      text-sm
                      ${isCompleted ? 'text-gray-700 line-through' : 'text-gray-900'}
                    `}>
                      {milestone}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Next Gate Review Alert */}
          {currentStageInfo.progress > 70 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">
                🎯 Gate Review Coming Up!
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Prepare for your stage gate review. Schedule a session with your mentor to review your progress.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">
            {stages.filter(s => s.status === 'completed').length}
          </p>
          <p className="text-xs text-gray-600 mt-1">Stages Completed</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">
            {currentStageInfo ? currentStageInfo.milestones.filter((_, i) => i < Math.floor(currentStageInfo.progress / 25)).length : 0}
          </p>
          <p className="text-xs text-gray-600 mt-1">Milestones Achieved</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">
            {stages.length - currentIndex - 1}
          </p>
          <p className="text-xs text-gray-600 mt-1">Stages Remaining</p>
        </div>
      </div>
    </div>
  );
}
