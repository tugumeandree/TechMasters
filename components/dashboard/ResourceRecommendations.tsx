'use client';

import { BookOpen, Video, FileText, Wrench, ExternalLink, Star } from 'lucide-react';
import { ProgramStage, Resource } from '@/types';

interface ResourceRecommendationsProps {
  currentStage: ProgramStage;
}

interface RecommendedResource extends Resource {
  rating?: number;
  duration?: string;
  featured?: boolean;
}

export default function ResourceRecommendations({ currentStage }: ResourceRecommendationsProps) {
  // Mock data - will be replaced with API call based on current stage
  const stageResources: Record<ProgramStage, RecommendedResource[]> = {
    research: [
      {
        id: 'r1',
        title: 'Market Analysis & Trend Spotting',
        type: 'video',
        url: '#',
        description: 'Learn to identify technological gaps and opportunities',
        stage: 'research',
        rating: 4.8,
        duration: '45 min',
        featured: true
      },
      {
        id: 'r2',
        title: 'Literature Review Framework',
        type: 'document',
        url: '#',
        description: 'Academic and industry research methodology',
        stage: 'research',
        rating: 4.6,
        featured: false
      },
      {
        id: 'r3',
        title: 'Stakeholder Interview Guide',
        type: 'link',
        url: '#',
        description: 'Conducting effective user interviews',
        stage: 'research',
        rating: 4.9,
        featured: false
      }
    ],
    skilling: [
      {
        id: 'r4',
        title: 'Technical Workshops Catalog',
        type: 'document',
        url: '#',
        description: 'AI/ML, Cloud, IoT, and prototyping training',
        stage: 'skilling',
        rating: 4.7,
        duration: '30 min',
        featured: true
      },
      {
        id: 'r5',
        title: 'Project Management Essentials',
        type: 'video',
        url: '#',
        description: 'Agile, Scrum, and team collaboration',
        stage: 'skilling',
        rating: 4.5,
        duration: '60 min',
        featured: false
      },
      {
        id: 'r6',
        title: 'Development Tools Masterclass',
        type: 'tool',
        url: '#',
        description: 'Hands-on training with industry tools',
        stage: 'skilling',
        rating: 4.8,
        featured: false
      }
    ],
    development: [
      {
        id: 'r7',
        title: 'Agile MVP Development',
        type: 'video',
        url: '#',
        description: 'Sprint cycles and iterative development',
        stage: 'development',
        rating: 4.9,
        duration: '75 min',
        featured: true
      },
      {
        id: 'r8',
        title: 'User Testing Framework',
        type: 'document',
        url: '#',
        description: 'Feedback integration and design refinement',
        stage: 'development',
        rating: 4.6,
        featured: false
      },
      {
        id: 'r9',
        title: 'Prototyping Lab Access',
        type: 'link',
        url: '#',
        description: '3D printers, dev kits, and equipment',
        stage: 'development',
        rating: 4.4,
        featured: false
      }
    ],
    business: [
      {
        id: 'r10',
        title: 'Business Model Canvas Workshop',
        type: 'video',
        url: '#',
        description: 'Create sustainable business models',
        stage: 'business',
        rating: 4.8,
        duration: '90 min',
        featured: true
      },
      {
        id: 'r11',
        title: 'IP and Patent Guidance',
        type: 'document',
        url: '#',
        description: 'Protect your innovations',
        stage: 'business',
        rating: 4.9,
        featured: false
      },
      {
        id: 'r12',
        title: 'Investor Pitch Preparation',
        type: 'link',
        url: '#',
        description: 'Demo day and pitch deck development',
        stage: 'business',
        rating: 4.7,
        featured: false
      }
    ]
  };

  const resources = stageResources[currentStage] || [];

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'link':
        return <BookOpen className="h-5 w-5" />;
      case 'tool':
        return <Wrench className="h-5 w-5" />;
    }
  };

  const getResourceColor = (type: Resource['type']) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-600';
      case 'document':
        return 'bg-blue-100 text-blue-600';
      case 'link':
        return 'bg-green-100 text-green-600';
      case 'tool':
        return 'bg-purple-100 text-purple-600';
    }
  };

  const stageName = currentStage.charAt(0).toUpperCase() + currentStage.slice(1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Recommended Resources</h3>
        <p className="text-sm text-gray-600 mt-1">
          Curated for <span className="font-semibold text-primary-600">{stageName}</span> stage
        </p>
      </div>

      <div className="space-y-4">
        {resources.map((resource) => (
          <div 
            key={resource.id} 
            className={`
              relative border rounded-lg p-4 hover:shadow-md transition-all duration-200
              ${resource.featured ? 'border-primary-300 bg-primary-50' : 'border-gray-200'}
            `}
          >
            {resource.featured && (
              <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </div>
            )}

            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                ${getResourceColor(resource.type)}
              `}>
                {getResourceIcon(resource.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {resource.title}
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  {resource.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {resource.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{resource.rating}</span>
                    </div>
                  )}
                  {resource.duration && (
                    <>
                      <span>•</span>
                      <span>{resource.duration}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="capitalize">{resource.type}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <a
              href={resource.url}
              className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Access Resource
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ))}
      </div>

      {/* Browse All Resources */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors">
          Browse All Resources →
        </button>
      </div>

      {/* Quick Tip */}
      <div className="mt-4 p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
        <p className="text-xs font-semibold text-gray-700 mb-1">💡 Pro Tip</p>
        <p className="text-xs text-gray-600">
          Complete featured resources first - they're specifically chosen to help you progress through the {stageName} stage faster.
        </p>
      </div>
    </div>
  );
}
