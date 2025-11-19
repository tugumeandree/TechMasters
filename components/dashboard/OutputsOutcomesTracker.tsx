'use client';

import { CheckCircle2, Circle, FileText, Award, TrendingUp, Users, Briefcase, Lightbulb } from 'lucide-react';
import { ProgramStage, StageOutput, StageOutcome } from '@/types';

interface OutputsOutcomesTrackerProps {
  currentStage: ProgramStage;
  outputs?: StageOutput[];
  outcomes?: StageOutcome[];
}

export default function OutputsOutcomesTracker({ 
  currentStage, 
  outputs = [], 
  outcomes = [] 
}: OutputsOutcomesTrackerProps) {
  
  // Expected outputs and outcomes for each stage
  const stageDefinitions: Record<ProgramStage, {
    outputs: Array<{ title: string; description: string; type: string }>;
    outcomes: Array<{ title: string; description: string; category: string }>;
  }> = {
    research: {
      outputs: [
        {
          title: 'Validated Research Report',
          description: 'Technical report or project proposal with market validation',
          type: 'deliverable'
        },
        {
          title: 'Proof-of-Concept (POC)',
          description: 'Experimental results demonstrating technical feasibility',
          type: 'artifact'
        },
        {
          title: 'Problem Statement',
          description: 'Clear problem backed by user interviews and market data',
          type: 'documentation'
        }
      ],
      outcomes: [
        {
          title: 'Problem-First Mindset',
          description: 'Shift from technology-first to problem-first thinking',
          category: 'mindset'
        },
        {
          title: 'Research Methodology',
          description: 'Ability to conduct market analysis and validate assumptions',
          category: 'skill'
        }
      ]
    },
    skilling: {
      outputs: [
        {
          title: 'Technical Competencies',
          description: 'Certified completion of technical workshops (AI/ML, IoT, Cloud)',
          type: 'competency'
        },
        {
          title: 'Project Portfolio',
          description: 'Code repositories demonstrating new skills',
          type: 'artifact'
        },
        {
          title: 'Mastered Tools',
          description: 'Proficiency in frameworks, CAD software, cloud platforms',
          type: 'competency'
        }
      ],
      outcomes: [
        {
          title: 'T-Shaped Innovator',
          description: 'Deep technical expertise plus broad business understanding',
          category: 'skill'
        },
        {
          title: 'Increased Marketability',
          description: 'More versatile and valuable skillset',
          category: 'career'
        },
        {
          title: 'Mentor Network',
          description: 'Connected with industry experts and technical mentors',
          category: 'network'
        }
      ]
    },
    development: {
      outputs: [
        {
          title: 'Minimum Viable Product (MVP)',
          description: 'High-fidelity prototype or working product',
          type: 'deliverable'
        },
        {
          title: 'GitHub Repository',
          description: 'Clean, documented, and scalable codebase',
          type: 'artifact'
        },
        {
          title: 'Technical Documentation',
          description: 'Architecture diagrams, deployment scripts, API docs',
          type: 'documentation'
        },
        {
          title: 'User Testing Reports',
          description: 'Feedback from alpha/beta trials',
          type: 'documentation'
        }
      ],
      outcomes: [
        {
          title: 'Product Mindset',
          description: 'Understand trade-offs: features, usability, tech debt, time-to-market',
          category: 'mindset'
        },
        {
          title: 'Shipping Credibility',
          description: 'Tangible proof of ability to deliver products',
          category: 'credential'
        },
        {
          title: 'Enhanced Problem-Solving',
          description: 'Critical thinking and iterative development skills',
          category: 'skill'
        }
      ]
    },
    business: {
      outputs: [
        {
          title: 'Business Plan Contribution',
          description: 'Technical sections of comprehensive business plan',
          type: 'deliverable'
        },
        {
          title: 'IP Protection Strategy',
          description: 'Patent application or intellectual property plan',
          type: 'documentation'
        },
        {
          title: 'Technical Roadmap',
          description: 'Defined product evolution (v1.0, v2.0, scaling plan)',
          type: 'documentation'
        },
        {
          title: 'Investor Pitch Deck',
          description: 'Technical and business pitch for funding',
          type: 'deliverable'
        }
      ],
      outcomes: [
        {
          title: 'Strategic Leadership',
          description: 'Ability to influence company direction and strategy',
          category: 'leadership'
        },
        {
          title: 'Career Acceleration',
          description: 'Qualified for Tech Lead, Founder, or CTO roles',
          category: 'career'
        },
        {
          title: 'Increased Autonomy',
          description: 'Confidence to define roadmaps, not just execute them',
          category: 'leadership'
        },
        {
          title: 'Investor Network',
          description: 'Connections with VCs, angels, and funding opportunities',
          category: 'network'
        }
      ]
    }
  };

  const currentOutputs = stageDefinitions[currentStage]?.outputs || [];
  const currentOutcomes = stageDefinitions[currentStage]?.outcomes || [];

  const getOutputIcon = (type: string) => {
    switch (type) {
      case 'deliverable': return <FileText className="h-5 w-5" />;
      case 'artifact': return <FileText className="h-5 w-5" />;
      case 'competency': return <Award className="h-5 w-5" />;
      case 'documentation': return <FileText className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getOutcomeIcon = (category: string) => {
    switch (category) {
      case 'mindset': return <Lightbulb className="h-5 w-5" />;
      case 'skill': return <TrendingUp className="h-5 w-5" />;
      case 'credential': return <Award className="h-5 w-5" />;
      case 'network': return <Users className="h-5 w-5" />;
      case 'leadership': return <Briefcase className="h-5 w-5" />;
      case 'career': return <TrendingUp className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  const stageName = currentStage.charAt(0).toUpperCase() + currentStage.slice(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Your Transformation Journey</h2>
        <p className="text-blue-100">
          Track your outputs (what you create) and outcomes (how you grow) in the {stageName} stage
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* OUTPUTS Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Outputs</h3>
              <p className="text-sm text-gray-600">Tangible deliverables & artifacts</p>
            </div>
          </div>

          <div className="space-y-4">
            {currentOutputs.map((output, index) => {
              const userOutput = outputs?.find(o => o.title === output.title);
              const isCompleted = userOutput?.status === 'completed';
              
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCompleted 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{output.title}</h4>
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                          {output.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{output.description}</p>
                      {userOutput?.notes && (
                        <p className="text-xs text-gray-500 mt-2 italic">
                          Note: {userOutput.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-blue-900 font-medium">
              💡 The "What": These are measurable results you'll create during this stage
            </p>
          </div>
        </div>

        {/* OUTCOMES Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Outcomes</h3>
              <p className="text-sm text-gray-600">Professional transformation</p>
            </div>
          </div>

          <div className="space-y-4">
            {currentOutcomes.map((outcome, index) => {
              const userOutcome = outcomes?.find(o => o.title === outcome.title);
              const isAchieved = userOutcome?.achieved || false;
              
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isAchieved 
                      ? 'border-purple-200 bg-purple-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${isAchieved ? 'text-purple-600' : 'text-gray-400'}`}>
                      {getOutcomeIcon(outcome.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{outcome.title}</h4>
                        <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                          {outcome.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{outcome.description}</p>
                      {userOutcome?.evidence && (
                        <p className="text-xs text-gray-500 mt-2 italic">
                          Evidence: {userOutcome.evidence}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-lg">
            <p className="text-sm text-purple-900 font-medium">
              🚀 The "So What": Changes in your capabilities, mindset, and career trajectory
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {outputs?.filter(o => o.status === 'completed').length || 0}/{currentOutputs.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Outputs Completed</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              {outcomes?.filter(o => o.achieved).length || 0}/{currentOutcomes.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Outcomes Achieved</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {Math.round(((outputs?.filter(o => o.status === 'completed').length || 0) / currentOutputs.length) * 100) || 0}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Output Progress</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">
              {Math.round(((outcomes?.filter(o => o.achieved).length || 0) / currentOutcomes.length) * 100) || 0}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Transformation</div>
          </div>
        </div>
      </div>

      {/* Transformation Journey Overview */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          From Specialist to Holistic Innovator
        </h3>
        <p className="text-gray-700 mb-4">
          TechMasters transforms your relationship with technology—it stops being an end and becomes 
          a powerful means to create value, solve real problems, and build lasting impact.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">🎯 Before TechMasters</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Technology-first thinking</li>
              <li>• Specialized in one domain</li>
              <li>• Implements specs, follows roadmap</li>
              <li>• Limited business understanding</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">🚀 After TechMasters</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Problem-first, user-centric mindset</li>
              <li>• T-shaped innovator (deep + broad)</li>
              <li>• Defines roadmaps, leads products</li>
              <li>• Strategic business contributor</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
