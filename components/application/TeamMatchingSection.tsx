'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface TeamMemberSearch {
  name: string;
  skills: string[];
  interests: string[];
}

interface TeamMatchingProps {
  onMatch: (member: TeamMemberSearch) => void;
}

export default function TeamMatchingSection({ onMatch }: TeamMatchingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Mock data - in production, this would come from an API
  const suggestedMatches: TeamMemberSearch[] = [
    {
      name: 'Sarah K.',
      skills: ['Frontend Development', 'UI/UX Design'],
      interests: ['HealthTech', 'EdTech']
    },
    {
      name: 'James M.',
      skills: ['Backend Development', 'DevOps'],
      interests: ['FinTech', 'AgriTech']
    },
    {
      name: 'Amina H.',
      skills: ['Product Management', 'Marketing'],
      interests: ['E-Commerce', 'SaaS']
    },
  ];

  const skillOptions = [
    'Frontend Development',
    'Backend Development',
    'UI/UX Design',
    'Product Management',
    'Marketing',
    'Business Development',
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border border-blue-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        🤝 Find Potential Team Members
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Search for other applicants with complementary skills
      </p>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by skills or interests..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Skill filters */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by skills:</p>
        <div className="flex flex-wrap gap-2">
          {skillOptions.map(skill => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedSkills.includes(skill)
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              {skill}
              {selectedSkills.includes(skill) && (
                <X className="inline-block h-3 w-3 ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested matches */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Suggested matches:</p>
        {suggestedMatches.map((match, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-primary-400 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900 dark:text-white">{match.name}</h5>
                <div className="mt-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Skills:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {match.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Interests:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {match.interests.map(interest => (
                      <span
                        key={interest}
                        className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onMatch(match)}
                className="ml-4 px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-500 transition-colors"
              >
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
        💡 Team matching helps you find complementary skills. You'll be notified if there's mutual interest.
      </p>
    </div>
  );
}
