'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillsAssessmentSchema, SkillsAssessmentFormData } from '@/lib/validations/application';
import { X } from 'lucide-react';

interface SkillsAssessmentStepProps {
  defaultValues?: SkillsAssessmentFormData;
  onNext: (data: SkillsAssessmentFormData) => void;
  onBack: () => void;
  onSave: (data: Partial<SkillsAssessmentFormData>) => void;
}

const technicalSkillsOptions = [
  'JavaScript/TypeScript', 'Python', 'Java', 'C#', 'React', 'Angular', 'Vue.js',
  'Node.js', 'Django', 'Spring Boot', 'Mobile Dev', 'Cloud (AWS/Azure/GCP)',
  'DevOps', 'Docker', 'Kubernetes', 'SQL', 'NoSQL', 'UI/UX Design'
];

const businessSkillsOptions = [
  'Business Strategy', 'Marketing', 'Sales', 'Financial Planning', 'Operations',
  'Product Management', 'Project Management', 'Market Research', 'Fundraising'
];

const softSkillsOptions = [
  'Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Critical Thinking',
  'Adaptability', 'Time Management', 'Creativity', 'Presentation Skills'
];

const areasOfInterestOptions = [
  'Frontend Development', 'Backend Development', 'Full Stack', 'Mobile Development',
  'Data Science', 'Machine Learning', 'Cybersecurity', 'Cloud Computing',
  'Business Development', 'Product Design', 'Marketing'
];

export default function SkillsAssessmentStep({ defaultValues, onNext, onBack, onSave }: SkillsAssessmentStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SkillsAssessmentFormData>({
    resolver: zodResolver(skillsAssessmentSchema),
    defaultValues,
  });

  const handleBlur = () => {
    const currentData = watch();
    onSave(currentData);
  };

  const toggleSkill = (field: keyof SkillsAssessmentFormData, value: string) => {
    const currentValues = watch(field) as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setValue(field, newValues);
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-8">
      {/* Technical Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Technical Skills * (Select all that apply)
        </label>
        <Controller
          name="technicalSkills"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {technicalSkillsOptions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill('technicalSkills', skill)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    field.value.includes(skill)
                      ? 'border-primary-600 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        />
        {errors.technicalSkills && (
          <p className="mt-2 text-sm text-red-600">{errors.technicalSkills.message}</p>
        )}
      </div>

      {/* Business Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Business Skills * (Select all that apply)
        </label>
        <Controller
          name="businessSkills"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {businessSkillsOptions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill('businessSkills', skill)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    field.value.includes(skill)
                      ? 'border-secondary-600 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-secondary-400'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        />
        {errors.businessSkills && (
          <p className="mt-2 text-sm text-red-600">{errors.businessSkills.message}</p>
        )}
      </div>

      {/* Soft Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Soft Skills * (Select all that apply)
        </label>
        <Controller
          name="softSkills"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {softSkillsOptions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill('softSkills', skill)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    field.value.includes(skill)
                      ? 'border-purple-600 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        />
        {errors.softSkills && (
          <p className="mt-2 text-sm text-red-600">{errors.softSkills.message}</p>
        )}
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Experience Level *
        </label>
        <Controller
          name="experienceLevel"
          control={control}
          render={({ field }) => (
            <div className="grid md:grid-cols-3 gap-4">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <label
                  key={level}
                  className={`relative flex flex-col p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    field.value === level
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                  }`}
                >
                  <input
                    type="radio"
                    {...field}
                    value={level}
                    checked={field.value === level}
                    className="sr-only"
                  />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {level}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {level === 'beginner' && '0-2 years of experience'}
                    {level === 'intermediate' && '2-5 years of experience'}
                    {level === 'advanced' && '5+ years of experience'}
                  </span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.experienceLevel && (
          <p className="mt-2 text-sm text-red-600">{errors.experienceLevel.message}</p>
        )}
      </div>

      {/* Areas of Interest */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Areas of Interest * (Select all that apply)
        </label>
        <Controller
          name="areasOfInterest"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {areasOfInterestOptions.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleSkill('areasOfInterest', area)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    field.value.includes(area)
                      ? 'border-green-600 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          )}
        />
        {errors.areasOfInterest && (
          <p className="mt-2 text-sm text-red-600">{errors.areasOfInterest.message}</p>
        )}
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
