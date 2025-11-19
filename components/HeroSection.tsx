'use client';

import { useState } from 'react';
import { ChevronRight, Rocket, Users, Briefcase, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}

function RoleCard({ icon, title, description, href, color }: RoleCardProps) {
  return (
    <Link href={href}>
      <div className={`group relative overflow-hidden rounded-lg md:rounded-xl p-4 md:p-6 border-2 ${color} hover:shadow-xl transition-all duration-300 transform active:scale-95 md:hover:-translate-y-1 cursor-pointer`}>
        <div className="flex items-start space-x-3 md:space-x-4">
          <div className={`p-2 md:p-3 rounded-lg ${color.replace('border', 'bg').replace('hover:border', 'group-hover:bg')} transition-colors flex-shrink-0`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1.5 md:mb-2">
              {title}
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-3">
              {description}
            </p>
            <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold text-xs md:text-sm">
              Get Started
              <ChevronRight className="ml-1 h-3.5 w-3.5 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HeroSection() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      icon: <Rocket className="h-6 w-6 text-primary-600" />,
      title: 'Participant - Become A TechMaster',
      description: 'Join as a technologist and transform your innovation into a thriving business',
      href: '/apply?role=participant',
      color: 'border-primary-200 hover:border-primary-400',
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-secondary-600" />,
      title: 'Mentor',
      description: 'Share your expertise and guide the next generation of innovators',
      href: '/apply?role=mentor',
      color: 'border-secondary-200 hover:border-secondary-400',
    },
    {
      icon: <Briefcase className="h-6 w-6 text-purple-600" />,
      title: 'Corporate Partner',
      description: 'Browse cutting-edge technologies or let our innovators build solutions for your business challenges',
      href: '/partners/showcase',
      color: 'border-purple-200 hover:border-purple-400',
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        {/* Animated circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left column - Text content */}
          <div className="text-center lg:text-left animate-slide-up">
            <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-xs md:text-sm font-semibold text-primary-700 dark:text-primary-300 mb-4 md:mb-6">
              🚀 Applications Now Open
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
              Transform Your
              <span className="gradient-text block">Innovation</span>
              Into Impact
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed">
              Africa's most <span className="font-semibold text-primary-600 dark:text-primary-400">comprehensive innovation factory</span>—from 
              <span className="font-semibold text-secondary-600 dark:text-secondary-400"> validated research to market launch</span>, with 
              <span className="font-semibold text-purple-600 dark:text-purple-400"> quality gates</span>, 
              <span className="font-semibold text-pink-600 dark:text-pink-400"> real-world validation</span>, and 
              <span className="font-semibold text-orange-600 dark:text-orange-400"> lifelong network access</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start mb-8 md:mb-12">
              <Link
                href="#roles"
                className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold text-white bg-primary-600 rounded-lg shadow-lg hover:bg-primary-500 active:scale-95 md:hover:scale-105 transition-all duration-300"
              >
                Start Your Journey
                <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Link>
              <Link
                href="/program/pillars"
                className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold text-primary-600 bg-white dark:bg-gray-800 dark:text-primary-400 border-2 border-primary-600 rounded-lg shadow-lg hover:bg-primary-50 dark:hover:bg-gray-700 active:scale-95 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5 md:gap-2">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-primary-600" />
                <span>500+ Participants</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-primary-600" />
                <span>100+ Mentors</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-primary-600" />
                <span>50+ Partners</span>
              </div>
            </div>
          </div>

          {/* Right column - Role selection cards */}
          <div id="roles" className="space-y-3 md:space-y-4 animate-slide-up animation-delay-300">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 text-center lg:text-left">
              Choose Your Path
            </h2>
            {roles.map((role) => (
              <RoleCard key={role.title} {...role} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgb(0 0 0 / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(0 0 0 / 0.1) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }
      `}</style>
    </section>
  );
}
