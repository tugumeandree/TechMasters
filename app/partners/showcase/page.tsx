'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Users, Code, Rocket, Heart, DollarSign, Eye, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface Technology {
  id: string;
  name: string;
  description: string;
  category: string;
  stage: string;
  team: string;
  cohort: string;
  tags: string[];
  lookingFor: string[];
  metrics: {
    users?: number;
    revenue?: number;
    growth?: number;
  };
  image?: string;
}

export default function TechnologyShowcasePage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [filteredTechs, setFilteredTechs] = useState<Technology[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'FinTech', 'HealthTech', 'AgriTech', 'EdTech', 'AI/ML', 'E-commerce', 'SaaS', 'Other'];
  const stages = ['All', 'Prototype', 'MVP', 'Growth', 'Scaling'];

  useEffect(() => {
    // Fetch technologies from API
    fetchTechnologies();
  }, []);

  useEffect(() => {
    // Filter technologies
    let filtered = technologies;

    if (searchTerm) {
      filtered = filtered.filter(tech =>
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tech => tech.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedStage !== 'all') {
      filtered = filtered.filter(tech => tech.stage.toLowerCase() === selectedStage.toLowerCase());
    }

    setFilteredTechs(filtered);
  }, [searchTerm, selectedCategory, selectedStage, technologies]);

  const fetchTechnologies = async () => {
    // Mock data for now - replace with API call
    const mockTechs: Technology[] = [
      {
        id: '1',
        name: 'AgriConnect',
        description: 'Digital marketplace connecting farmers directly to buyers, eliminating middlemen and increasing farmer profits by 40%',
        category: 'AgriTech',
        stage: 'MVP',
        team: 'Team AgriInnovate',
        cohort: 'Cohort 2024-Q2',
        tags: ['Agriculture', 'Marketplace', 'Mobile App'],
        lookingFor: ['Investment', 'Pilot Partners', 'Distribution'],
        metrics: { users: 1500, revenue: 25000, growth: 120 },
      },
      {
        id: '2',
        name: 'HealthTrack Pro',
        description: 'AI-powered health monitoring system for chronic disease management with predictive analytics',
        category: 'HealthTech',
        stage: 'Growth',
        team: 'HealthTech Warriors',
        cohort: 'Cohort 2024-Q1',
        tags: ['Healthcare', 'AI', 'Analytics', 'IoT'],
        lookingFor: ['Investment', 'Hospital Partnerships', 'Scaling Support'],
        metrics: { users: 5000, revenue: 150000, growth: 200 },
      },
      {
        id: '3',
        name: 'PayFlow',
        description: 'Cross-border payment solution for African SMEs with real-time currency conversion and low fees',
        category: 'FinTech',
        stage: 'Scaling',
        team: 'FinTech Innovators',
        cohort: 'Cohort 2023-Q4',
        tags: ['Payments', 'FinTech', 'Cross-border', 'API'],
        lookingFor: ['Series A Funding', 'Banking Partnerships', 'Licensing Support'],
        metrics: { users: 12000, revenue: 500000, growth: 300 },
      },
      {
        id: '4',
        name: 'EduLearn AI',
        description: 'Personalized learning platform using AI to adapt curriculum to individual student needs',
        category: 'EdTech',
        stage: 'MVP',
        team: 'EdTech Pioneers',
        cohort: 'Cohort 2024-Q3',
        tags: ['Education', 'AI', 'Personalization', 'Web Platform'],
        lookingFor: ['Pilot Schools', 'Investment', 'Content Partnerships'],
        metrics: { users: 800, revenue: 15000, growth: 150 },
      },
    ];

    setTechnologies(mockTechs);
    setFilteredTechs(mockTechs);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 md:pt-24 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
              Technology Showcase
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
              Browse cutting-edge innovations from Africa's brightest tech minds. Partner, invest, or pilot these solutions for your business.
            </p>
          </div>

          {/* CTA Bar */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg md:rounded-xl p-4 md:p-6 mb-6 md:mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 md:mb-2">Have a specific challenge?</h2>
                <p className="text-sm md:text-base">Let our innovators build a custom solution for your business</p>
              </div>
              <Link
                href="/partners/request"
                className="w-full md:w-auto px-6 md:px-8 py-2.5 md:py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap text-center text-sm md:text-base"
              >
                Request a Solution
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-sm p-4 md:p-6 mb-6 md:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {/* Search */}
              <div className="md:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search technologies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Stage Filter */}
              <div>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  {stages.map(stage => (
                    <option key={stage} value={stage.toLowerCase()}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredTechs.length} {filteredTechs.length === 1 ? 'technology' : 'technologies'}
            </div>
          </div>

          {/* Technologies Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading technologies...</p>
            </div>
          ) : filteredTechs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No technologies found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredTechs.map((tech) => (
                <div
                  key={tech.id}
                  className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all p-4 md:p-6 border border-gray-200 dark:border-gray-700"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                        {tech.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2">
                        <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-xs font-semibold">
                          {tech.category}
                        </span>
                        <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-semibold">
                          {tech.stage}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-3 md:mb-4 line-clamp-3">
                    {tech.description}
                  </p>

                  {/* Metrics */}
                  {tech.metrics && (
                    <div className="grid grid-cols-3 gap-1.5 md:gap-2 mb-3 md:mb-4 p-2 md:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      {tech.metrics.users && (
                        <div className="text-center">
                          <Users className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400 mx-auto mb-0.5 md:mb-1" />
                          <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Users</p>
                          <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">
                            {tech.metrics.users.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {tech.metrics.revenue && (
                        <div className="text-center">
                          <DollarSign className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400 mx-auto mb-0.5 md:mb-1" />
                          <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                          <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">
                            ${(tech.metrics.revenue / 1000).toFixed(0)}k
                          </p>
                        </div>
                      )}
                      {tech.metrics.growth && (
                        <div className="text-center">
                          <TrendingUp className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400 mx-auto mb-0.5 md:mb-1" />
                          <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Growth</p>
                          <p className="text-xs md:text-sm font-bold text-green-600">
                            +{tech.metrics.growth}%
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                    {tech.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px] md:text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Looking For */}
                  <div className="mb-3 md:mb-4">
                    <p className="text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 md:mb-2">
                      Looking for:
                    </p>
                    <div className="flex flex-wrap gap-1 md:gap-1.5">
                      {tech.lookingFor.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 md:px-2 py-0.5 md:py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-[10px] md:text-xs font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 md:px-4 py-2 md:py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:scale-95 transition-all text-xs md:text-sm font-semibold">
                      View Details
                    </button>
                    <button className="px-3 md:px-4 py-2 md:py-2.5 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 active:scale-95 transition-all text-xs md:text-sm font-semibold">
                      <Heart className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
