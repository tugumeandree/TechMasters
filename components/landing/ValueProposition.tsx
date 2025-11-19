'use client';

import { Shield, Zap, Heart, Globe, Users, TrendingUp } from 'lucide-react';

export default function ValueProposition() {
  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Quality-Driven',
      description: 'Multi-expert review gates ensure excellence at every stage',
      stat: '85% success rate'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Real-World Focus',
      description: 'Validate with actual customers before building',
      stat: '200+ pilot customers'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Team-First',
      description: 'Intelligent matching builds complementary teams',
      stat: '90% team retention'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Data-Driven',
      description: 'Track your progress with comprehensive analytics',
      stat: 'Real-time insights'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Mentor-Backed',
      description: 'Access 100+ experts through multiple formats',
      stat: '4.8/5 avg rating'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Network Effect',
      description: 'Alumni, partners, and peers create lasting opportunities',
      stat: '500+ connections'
    }
  ];

  return (
    <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why TechMasters Wins
          </h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            We're not just another accelerator. We've built the most comprehensive 
            innovation infrastructure in Africa—designed for serious technologists.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="group p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl text-white group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    {value.title}
                  </h3>
                  <p className="text-primary-100 mb-3 text-sm leading-relaxed">
                    {value.description}
                  </p>
                  <div className="text-xs font-semibold text-white bg-white/20 inline-block px-3 py-1 rounded-full">
                    {value.stat}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom comparison */}
        <div className="mt-20 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
            The TechMasters Difference
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="text-lg font-semibold mb-4 text-primary-100">Traditional Accelerators:</div>
              <div className="flex items-start gap-3 text-sm text-primary-100">
                <span className="text-red-300">✗</span>
                <span>Generic curriculum for all</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-primary-100">
                <span className="text-red-300">✗</span>
                <span>Limited mentor access</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-primary-100">
                <span className="text-red-300">✗</span>
                <span>Theory-focused learning</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-primary-100">
                <span className="text-red-300">✗</span>
                <span>No team formation support</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-primary-100">
                <span className="text-red-300">✗</span>
                <span>Ends after demo day</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-lg font-semibold mb-4">TechMasters:</div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-green-300">✓</span>
                <span>Category-specific learning paths</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-green-300">✓</span>
                <span>Office hours, workshops, 1-on-1s</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-green-300">✓</span>
                <span>Real customer validation required</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-green-300">✓</span>
                <span>AI-powered team matching</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-green-300">✓</span>
                <span>Alumni network and Phase 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }
      `}</style>
    </section>
  );
}
