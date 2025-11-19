'use client';

import { 
  Target, 
  Users, 
  TrendingUp, 
  Award, 
  Handshake, 
  GraduationCap,
  Lightbulb,
  BarChart3,
  Calendar,
  Map,
  Trophy,
  Zap
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlights: string[];
}

function FeatureCard({ icon, title, description, highlights }: FeatureCardProps) {
  return (
    <div className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl text-white group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <ul className="space-y-2 mt-4">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-primary-500 mt-1">✓</span>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FeaturesShowcase() {
  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Stage-Gate Quality Control',
      description: 'Rigorous validation checkpoints ensure excellence at every stage of your journey.',
      highlights: [
        'Multi-expert review panels',
        'Structured feedback and scoring',
        'Clear progression criteria',
        'Revision support and guidance'
      ]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Intelligent Team Formation',
      description: 'AI-powered matching connects you with complementary team members based on skills, roles, and vision.',
      highlights: [
        'Smart skill and role matching',
        'Project idea alignment',
        'Work style compatibility',
        'Mutual interest detection'
      ]
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: 'Real-World Validation Tools',
      description: 'Systematic customer discovery and market validation to prove your concept before building.',
      highlights: [
        'Customer interview tracking',
        'User testing frameworks',
        'Pilot customer management',
        'Data-driven pivot decisions'
      ]
    },
    {
      icon: <Map className="h-6 w-6" />,
      title: 'Living Project Canvas',
      description: 'Your project evolves through a comprehensive canvas that grows with you across all stages.',
      highlights: [
        'Problem, solution, market, business',
        'Version control and history',
        'Team collaboration',
        'Stage-specific guidance'
      ]
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Real-Time Analytics',
      description: 'Data-driven insights into your progress, engagement, and outcomes at every step.',
      highlights: [
        'Personal progress dashboard',
        'Validation metrics',
        'Skill development tracking',
        'Network growth visualization'
      ]
    },
    {
      icon: <Handshake className="h-6 w-6" />,
      title: 'Corporate Partnerships',
      description: 'Direct access to real-world challenges, pilot opportunities, and hiring pathways from top companies.',
      highlights: [
        'Industry challenge briefs',
        'Paid pilot projects',
        'Hiring pipeline access',
        'Resource credits and tools'
      ]
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: 'Thriving Alumni Network',
      description: 'Stay connected with a growing community of successful founders, innovators, and industry leaders.',
      highlights: [
        'Alumni mentorship program',
        'Success story showcase',
        'Networking opportunities',
        'Continued learning access'
      ]
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Enhanced Mentor Access',
      description: 'Multiple touchpoints with experts through 1-on-1 sessions, office hours, and group workshops.',
      highlights: [
        'Weekly office hours',
        'Masterclass workshops',
        'Industry panels',
        'Video call integration'
      ]
    },
    {
      icon: <Map className="h-6 w-6" />,
      title: 'Customized Learning Paths',
      description: 'Industry-specific journeys tailored to MedTech, FinTech, SaaS, Hardware, and more.',
      highlights: [
        'Category-specific milestones',
        'Curated resources',
        'Expert guidance by sector',
        'Success metrics tracking'
      ]
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: 'Execution Rewards',
      description: 'Earn grants, unlock achievements, and climb leaderboards as you hit milestones.',
      highlights: [
        'Milestone-based grants',
        'Achievement badges',
        'Performance leaderboards',
        'Funding opportunities'
      ]
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Demo Day Pipeline',
      description: 'Showcase your innovation to investors, partners, and media at professionally organized pitch events.',
      highlights: [
        'Investor introductions',
        'Pitch coaching',
        'Professional judging',
        'Media coverage'
      ]
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Real-Time Collaboration',
      description: 'Stay connected with instant notifications, live updates, and seamless team coordination.',
      highlights: [
        'Live activity feeds',
        'Instant notifications',
        'Team chat integration',
        'Progress updates'
      ]
    }
  ];

  return (
    <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-sm font-semibold text-primary-700 dark:text-primary-300 mb-4">
            🚀 World-Class Infrastructure
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything You Need to
            <span className="gradient-text block mt-2">Build and Scale</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From idea validation to market launch, we've built a comprehensive ecosystem 
            that supports every step of your innovation journey.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Join hundreds of innovators already transforming their ideas into reality
          </p>
          <a
            href="#roles"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Start Your Journey Today
            <Award className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
