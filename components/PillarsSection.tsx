'use client';

import { useState } from 'react';
import { Code2, TrendingUp, Users2, DollarSign, CheckCircle2 } from 'lucide-react';
import { Pillar } from '@/types';

const pillars: Pillar[] = [
  {
    id: 'research',
    name: 'Research & Ideation',
    description: 'Identify real-world problems and validate technological solutions',
    icon: 'Code2',
    color: 'from-blue-500 to-cyan-500',
    benefits: [
      'Market analysis and trend spotting',
      'Academic and industry literature review',
      'Identifying technological gaps',
      'User interviews and stakeholder research',
      'Problem-solution hypothesis formulation',
    ],
  },
  {
    id: 'skilling',
    name: 'Skilling & Capacity Building',
    description: 'Equip yourself with the technical and soft skills needed to execute',
    icon: 'TrendingUp',
    color: 'from-green-500 to-emerald-500',
    benefits: [
      'Technical workshops (AI/ML, Cloud, Prototyping)',
      'Soft skills modules (Project management, Critical thinking)',
      'Tool training and hands-on sessions',
      'Expert mentorship matching',
      'Practical competence development',
    ],
  },
  {
    id: 'development',
    name: 'Product Development',
    description: 'Transform your idea and skills into a tangible working prototype',
    icon: 'Users2',
    color: 'from-purple-500 to-pink-500',
    benefits: [
      'Agile/Scrum development cycles',
      'Access to labs and development kits',
      'Build-review sessions with mentors',
      'User testing and feedback integration',
      'Iterative design and refinement',
    ],
  },
  {
    id: 'business',
    name: 'Business Development',
    description: 'Prepare your product for market and create a sustainable business model',
    icon: 'DollarSign',
    color: 'from-orange-500 to-red-500',
    benefits: [
      'Business model canvas workshops',
      'IP and patent guidance',
      'Go-to-market strategy development',
      'Pitch practice and investor demos',
      'Financial projections and funding access',
    ],
  },
];

const iconMap = {
  Code2: Code2,
  TrendingUp: TrendingUp,
  Users2: Users2,
  DollarSign: DollarSign,
};

export default function PillarsSection() {
  const [activePillar, setActivePillar] = useState<string | null>(null);

  return (
    <section className="py-20 px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Your Complete
            <span className="gradient-text"> Innovation Journey</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From idea to market: A proven four-stage process that transforms technology innovations into thriving businesses
          </p>
          <p className="text-md text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mt-4">
            With <span className="font-semibold text-purple-600">expert mentorship</span> and <span className="font-semibold text-pink-600">funding opportunities</span> supporting you at every stage
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => {
            const Icon = iconMap[pillar.icon as keyof typeof iconMap];
            const isActive = activePillar === pillar.id;

            return (
              <div
                key={pillar.id}
                className="group relative animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setActivePillar(pillar.id)}
                onMouseLeave={() => setActivePillar(null)}
              >
                <div
                  className={`relative h-full bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer
                    ${isActive 
                      ? 'border-transparent shadow-2xl transform scale-105 -translate-y-2' 
                      : 'border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg'
                    }
                  `}
                >
                  {/* Gradient background on hover */}
                  {isActive && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-10 rounded-2xl`}
                    />
                  )}

                  {/* Icon */}
                  <div className="relative mb-4">
                    <div
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${pillar.color} transform transition-transform duration-300
                        ${isActive ? 'scale-110 rotate-3' : 'group-hover:scale-105'}
                      `}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {pillar.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {pillar.description}
                    </p>

                    {/* Benefits list */}
                    <div
                      className={`space-y-2 transition-all duration-300 overflow-hidden
                        ${isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                      `}
                    >
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          What you'll get:
                        </p>
                        {pillar.benefits.map((benefit, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hover indicator */}
                    {!isActive && (
                      <div className="mt-4 text-sm text-primary-600 dark:text-primary-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Hover to learn more →
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center animate-slide-up animation-delay-400">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Experience the complete innovation pipeline with expert guidance and funding support
          </p>
          <a
            href="/program/pillars"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Explore the Journey
          </a>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </section>
  );
}
