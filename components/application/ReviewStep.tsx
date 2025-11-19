'use client';

import { useState } from 'react';
import { CheckCircle2, Edit2, Loader2 } from 'lucide-react';
import { PersonalInfoFormData, ProjectIdeaFormData, SkillsAssessmentFormData, TeamPreferencesFormData } from '@/lib/validations/application';

interface ReviewStepProps {
  data: {
    personalInfo?: PersonalInfoFormData;
    projectIdea?: ProjectIdeaFormData;
    skillsAssessment?: SkillsAssessmentFormData;
    teamPreferences?: TeamPreferencesFormData;
  };
  onBack: () => void;
  onEdit: (step: number) => void;
  onSubmit: () => Promise<void>;
}

export default function ReviewStep({ data, onBack, onEdit, onSubmit }: ReviewStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async () => {
    if (!agreed) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Review Your Application
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please review all information before submitting
        </p>
      </div>

      {/* Personal Info Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Personal Information
          </h4>
          <button
            onClick={() => onEdit(1)}
            className="text-primary-600 hover:text-primary-500 font-medium text-sm flex items-center gap-1"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Name:</span>
            <p className="font-medium text-gray-900 dark:text-white">{data.personalInfo?.fullName}</p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Email:</span>
            <p className="font-medium text-gray-900 dark:text-white">{data.personalInfo?.email}</p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Phone:</span>
            <p className="font-medium text-gray-900 dark:text-white">{data.personalInfo?.phone}</p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Location:</span>
            <p className="font-medium text-gray-900 dark:text-white">{data.personalInfo?.location}</p>
          </div>
        </div>
      </div>

      {/* Project Idea Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Project Idea
          </h4>
          <button
            onClick={() => onEdit(2)}
            className="text-primary-600 hover:text-primary-500 font-medium text-sm flex items-center gap-1"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Project Title:</span>
            <p className="font-medium text-gray-900 dark:text-white">{data.projectIdea?.title}</p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Category:</span>
            <span className="ml-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold">
              {data.projectIdea?.category}
            </span>
            <span className="ml-2 px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full text-xs font-semibold">
              {data.projectIdea?.stage}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Description:</span>
            <p className="text-gray-900 dark:text-white mt-1">{data.projectIdea?.description}</p>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Skills Assessment
          </h4>
          <button
            onClick={() => onEdit(3)}
            className="text-primary-600 hover:text-primary-500 font-medium text-sm flex items-center gap-1"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Experience Level:</span>
            <span className="ml-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold capitalize">
              {data.skillsAssessment?.experienceLevel}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Technical Skills:</span>
            <div className="flex flex-wrap gap-2">
              {data.skillsAssessment?.technicalSkills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Preferences Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Team Preferences
          </h4>
          <button
            onClick={() => onEdit(4)}
            className="text-primary-600 hover:text-primary-500 font-medium text-sm flex items-center gap-1"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-gray-900 dark:text-white">
            <span className="text-gray-600 dark:text-gray-400">Has Team:</span> {data.teamPreferences?.hasTeam ? 'Yes' : 'No'}
          </p>
          <p className="text-gray-900 dark:text-white">
            <span className="text-gray-600 dark:text-gray-400">Looking for Members:</span> {data.teamPreferences?.lookingForMembers ? 'Yes' : 'No'}
          </p>
          <p className="text-gray-900 dark:text-white">
            <span className="text-gray-600 dark:text-gray-400">Willing to Join Team:</span> {data.teamPreferences?.willingToJoinExistingTeam ? 'Yes' : 'No'}
          </p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            I agree to the <a href="/terms" className="text-primary-600 hover:underline">Terms and Conditions</a> and confirm that all information provided is accurate and complete. I understand that providing false information may result in disqualification from the program.
          </span>
        </label>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !agreed}
          className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Submit Application
            </>
          )}
        </button>
      </div>
    </div>
  );
}
