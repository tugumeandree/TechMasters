'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { teamPreferencesSchema, TeamPreferencesFormData } from '@/lib/validations/application';
import { Users, UserPlus, Handshake } from 'lucide-react';
import TeamMatchingSection from './TeamMatchingSection';

interface TeamPreferencesStepProps {
  defaultValues?: TeamPreferencesFormData;
  onNext: (data: TeamPreferencesFormData) => void;
  onBack: () => void;
  onSave: (data: Partial<TeamPreferencesFormData>) => void;
}

const roleOptions = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'UI/UX Designer', 'Product Manager', 'Marketing Specialist',
  'Business Development', 'Data Scientist'
];

export default function TeamPreferencesStep({ defaultValues, onNext, onBack, onSave }: TeamPreferencesStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TeamPreferencesFormData>({
    resolver: zodResolver(teamPreferencesSchema),
    defaultValues: defaultValues || {
      hasTeam: false,
      lookingForMembers: false,
      willingToJoinExistingTeam: false,
    },
  });

  const hasTeam = watch('hasTeam');
  const lookingForMembers = watch('lookingForMembers');
  const [showMatching, setShowMatching] = useState(false);

  const handleBlur = () => {
    const currentData = watch();
    onSave(currentData);
  };

  const handleTeamMatch = (member: any) => {
    alert(`Connection request sent to ${member.name}! You'll be notified if they accept.`);
  };

  const toggleRole = (role: string) => {
    const currentRoles = watch('desiredRoles') || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    setValue('desiredRoles', newRoles);
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-8">
      {/* Has Team */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Do you already have a team?
        </label>
        <Controller
          name="hasTeam"
          control={control}
          render={({ field }) => (
            <div className="grid md:grid-cols-2 gap-4">
              <label
                className={`relative flex items-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                }`}
              >
                <input
                  type="radio"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  className="sr-only"
                />
                <Users className="h-8 w-8 text-primary-600 mr-4" />
                <div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white block">
                    Yes, I have a team
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    We're applying together
                  </span>
                </div>
              </label>

              <label
                className={`relative flex items-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value === false
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                }`}
              >
                <input
                  type="radio"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  className="sr-only"
                />
                <UserPlus className="h-8 w-8 text-primary-600 mr-4" />
                <div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white block">
                    No, I'm solo
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I'm applying individually
                  </span>
                </div>
              </label>
            </div>
          )}
        />
      </div>

      {/* Team Size (if has team) */}
      {hasTeam && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            How many people are in your team?
          </label>
          <Controller
            name="teamSize"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="1"
                max="10"
                value={field.value || ''}
                onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                onBlur={handleBlur}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="e.g., 3"
              />
            )}
          />
          {errors.teamSize && (
            <p className="mt-1 text-sm text-red-600">{errors.teamSize.message}</p>
          )}
        </div>
      )}

      {/* Looking for Members */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Are you looking for additional team members?
        </label>
        <Controller
          name="lookingForMembers"
          control={control}
          render={({ field }) => (
            <div className="grid md:grid-cols-2 gap-4">
              <label
                className={`relative flex items-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value
                    ? 'border-secondary-600 bg-secondary-50 dark:bg-secondary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-secondary-400'
                }`}
              >
                <input
                  type="radio"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  className="sr-only"
                />
                <Handshake className="h-8 w-8 text-secondary-600 mr-4" />
                <div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white block">
                    Yes
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I want to find teammates
                  </span>
                </div>
              </label>

              <label
                className={`relative flex items-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value === false
                    ? 'border-secondary-600 bg-secondary-50 dark:bg-secondary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-secondary-400'
                }`}
              >
                <input
                  type="radio"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  className="sr-only"
                />
                <div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white block">
                    No
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    My team is complete
                  </span>
                </div>
              </label>
            </div>
          )}
        />
      </div>

      {/* Desired Roles (if looking for members) */}
      {lookingForMembers && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            What roles are you looking for? (Select all that apply)
          </label>
          <Controller
            name="desiredRoles"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {roleOptions.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      field.value?.includes(role)
                        ? 'border-secondary-600 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-secondary-400'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          />
          {errors.desiredRoles && (
            <p className="mt-2 text-sm text-red-600">{errors.desiredRoles.message}</p>
          )}
        </div>
      )}

      {/* Team Matching Section */}
      {lookingForMembers && (
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setShowMatching(!showMatching)}
            className="w-full text-left px-4 py-3 bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-primary-900 dark:text-primary-100 font-semibold">
                🔍 Browse potential team members
              </span>
              <span className="text-sm text-primary-600 dark:text-primary-400">
                {showMatching ? 'Hide' : 'Show'}
              </span>
            </div>
          </button>
          
          {showMatching && (
            <div className="mt-4">
              <TeamMatchingSection onMatch={handleTeamMatch} />
            </div>
          )}
        </div>
      )}

      {/* Willing to Join Existing Team */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Are you willing to join an existing team?
        </label>
        <Controller
          name="willingToJoinExistingTeam"
          control={control}
          render={({ field }) => (
            <div className="grid md:grid-cols-2 gap-4">
              <label
                className={`relative flex items-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                }`}
              >
                <input
                  type="radio"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  className="sr-only"
                />
                <div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white block">
                    Yes
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Open to joining others
                  </span>
                </div>
              </label>

              <label
                className={`relative flex items-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  field.value === false
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                }`}
              >
                <input
                  type="radio"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  className="sr-only"
                />
                <div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white block">
                    No
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Prefer to work solo/with my team
                  </span>
                </div>
              </label>
            </div>
          )}
        />
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-lg"
        >
          Next Step
        </button>
      </div>
    </form>
  );
}
