'use client';

import { Search, Wrench, Rocket, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

interface StageProps {
  icon: React.ReactNode;
  stage: string;
  title: string;
  description: string;
  outputs: string[];
  outcomes: string[];
  color: string;
  position: 'left' | 'right';
}

function StageCard({ icon, stage, title, description, outputs, outcomes, color, position }: StageProps) {
  return (
    <div className={`flex gap-8 items-center ${position === 'right' ? 'flex-row-reverse' : ''}`}>
      {/* Content */}
      <div className={`flex-1 ${position === 'right' ? 'text-right' : 'text-left'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-300 dark:hover:border-primary-600">
          <div className={`flex items-center gap-3 mb-4 ${position === 'right' ? 'justify-end' : ''}`}>
            <div className={`p-3 ${color} rounded-xl text-white`}>
              {icon}
            </div>
            <div>
              <div className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                {stage}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {description}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Outputs (What You Build)
              </h4>
              <ul className="space-y-2">
                {outputs.map((output, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-primary-500 mt-1">→</span>
                    <span>{output}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Outcomes (What You Become)
              </h4>
              <ul className="space-y-2">
                {outcomes.map((outcome, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-secondary-500 mt-1">→</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline dot */}
      <div className="relative flex flex-col items-center">
        <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center text-white shadow-lg z-10`}>
          {icon}
        </div>
        <div className="w-1 h-32 bg-gradient-to-b from-primary-300 to-secondary-300 dark:from-primary-700 dark:to-secondary-700" />
      </div>

      {/* Spacer */}
      <div className="flex-1" />
    </div>
  );
}

export default function JourneyTimeline() {
  const stages = [
    {
      icon: <Search className="h-8 w-8" />,
      stage: 'Stage 1',
      title: 'Research',
      description: 'Discover and validate real problems worth solving. Deep customer discovery and market analysis.',
      outputs: [
        'Problem statement document',
        'Customer personas',
        'Market research report'
      ],
      outcomes: [
        'Problem-solving mindset',
        'Research skills development'
      ],
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      position: 'left' as const
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      stage: 'Stage 2',
      title: 'Skilling',
      description: 'Build technical and business capabilities. Learn, experiment, and develop your prototype.',
      outputs: [
        'Working prototype/MVP',
        'Skill certifications',
        'Technical documentation'
      ],
      outcomes: [
        'Technical proficiency',
        'Business literacy',
        'Design thinking mastery'
      ],
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      position: 'right' as const
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      stage: 'Stage 3',
      title: 'Development',
      description: 'Build, test, and refine your product with real users. Iterate based on feedback and data.',
      outputs: [
        'Production-ready product',
        'User test results',
        'Development roadmap',
        'Team structure'
      ],
      outcomes: [
        'Execution capability',
        'User empathy',
        'Team leadership'
      ],
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      position: 'left' as const
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      stage: 'Stage 4',
      title: 'Business',
      description: 'Launch to market, acquire customers, secure funding, and scale your innovation.',
      outputs: [
        'Business plan',
        'Investor pitch deck',
        'Financial projections',
        'Funding secured'
      ],
      outcomes: [
        'Business acumen',
        'Investor relations',
        'Growth mindset',
        'Financial management'
      ],
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      position: 'right' as const
    }
  ];

  return (
    <section className="py-24 px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full text-sm font-semibold text-primary-700 dark:text-primary-300 mb-4">
            🎯 Your Innovation Journey
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Four Stages to
            <span className="gradient-text block mt-2">Transform Your Idea</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our proven pipeline takes you from research to market—with quality gates, 
            expert mentorship, and real-world validation at every step.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative space-y-8">
          {stages.map((stage, index) => (
            <div 
              key={stage.stage}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <StageCard {...stage} />
            </div>
          ))}
          
          {/* End marker */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <CheckCircle className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-20 grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl">
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">4</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Structured Stages</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl">
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">12</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Quality Gates</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl">
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">50+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hours of Mentorship</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl">
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">6-12</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Months Duration</div>
          </div>
        </div>
      </div>
    </section>
  );
}
