'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema, PersonalInfoFormData } from '@/lib/validations/application';
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Linkedin, Github, Globe } from 'lucide-react';

interface PersonalInfoStepProps {
  defaultValues?: PersonalInfoFormData;
  onNext: (data: PersonalInfoFormData) => void;
  onSave: (data: Partial<PersonalInfoFormData>) => void;
}

export default function PersonalInfoStep({ defaultValues, onNext, onSave }: PersonalInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
  });

  // Auto-save on blur
  const handleBlur = () => {
    const currentData = watch();
    onSave(currentData);
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Section header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Tell us about yourself. Fields marked with * are required.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <User className="inline-block h-4 w-4 mr-1" />
            Full Name *
          </label>
          <input
            {...register('fullName')}
            onBlur={handleBlur}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Mail className="inline-block h-4 w-4 mr-1" />
            Email Address *
          </label>
          <input
            {...register('email')}
            onBlur={handleBlur}
            type="email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Phone className="inline-block h-4 w-4 mr-1" />
            Phone Number *
          </label>
          <input
            {...register('phone')}
            onBlur={handleBlur}
            type="tel"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="+254 712 345 678"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date of Birth
          </label>
          <input
            {...register('dateOfBirth')}
            onBlur={handleBlur}
            type="date"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="inline-block h-4 w-4 mr-1" />
            Location *
          </label>
          <input
            {...register('location')}
            onBlur={handleBlur}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="Nairobi, Kenya"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        {/* Education */}
        <div>
          <label htmlFor="education" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <GraduationCap className="inline-block h-4 w-4 mr-1" />
            Education Background *
          </label>
          <input
            {...register('education')}
            onBlur={handleBlur}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="BSc Computer Science"
          />
          {errors.education && (
            <p className="mt-1 text-sm text-red-600">{errors.education.message}</p>
          )}
        </div>

        {/* Current Role */}
        <div>
          <label htmlFor="currentRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Briefcase className="inline-block h-4 w-4 mr-1" />
            Current Role
          </label>
          <input
            {...register('currentRole')}
            onBlur={handleBlur}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="Software Developer"
          />
          {errors.currentRole && (
            <p className="mt-1 text-sm text-red-600">{errors.currentRole.message}</p>
          )}
        </div>

      </div>

      {/* Social/Professional Links Section */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Professional Links</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Add your professional profiles to strengthen your application.</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* LinkedIn */}
          <div>
            <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Linkedin className="inline-block h-4 w-4 mr-1" />
              LinkedIn Profile
            </label>
          <input
            {...register('linkedIn')}
            onBlur={handleBlur}
            type="url"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="https://linkedin.com/in/johndoe"
          />
          {errors.linkedIn && (
            <p className="mt-1 text-sm text-red-600">{errors.linkedIn.message}</p>
          )}
        </div>

          {/* GitHub */}
          <div>
            <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Github className="inline-block h-4 w-4 mr-1" />
              GitHub Profile
            </label>
          <input
            {...register('github')}
            onBlur={handleBlur}
            type="url"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="https://github.com/johndoe"
          />
          {errors.github && (
            <p className="mt-1 text-sm text-red-600">{errors.github.message}</p>
          )}
        </div>

          {/* Portfolio */}
          <div>
            <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Globe className="inline-block h-4 w-4 mr-1" />
              Portfolio Website
            </label>
          <input
            {...register('portfolio')}
            onBlur={handleBlur}
            type="url"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="https://johndoe.com"
          />
          {errors.portfolio && (
            <p className="mt-1 text-sm text-red-600">{errors.portfolio.message}</p>
          )}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>💡 Tip:</strong> Your information is automatically saved as you type. You can leave and come back anytime to continue your application.
        </p>
      </div>

      <div className="flex justify-end pt-6">
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
