'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectIdeaSchema, ProjectIdeaFormData } from '@/lib/validations/application';

interface ProjectIdeaStepProps {
  defaultValues?: ProjectIdeaFormData;
  onNext: (data: ProjectIdeaFormData) => void;
  onBack: () => void;
  onSave: (data: Partial<ProjectIdeaFormData>) => void;
}

const categories = [
  'FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'E-Commerce',
  'SaaS', 'Mobile Apps', 'AI/ML', 'IoT', 'Other'
];

export default function ProjectIdeaStep({ defaultValues, onNext, onBack, onSave }: ProjectIdeaStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProjectIdeaFormData>({
    resolver: zodResolver(projectIdeaSchema),
    defaultValues,
  });

  const handleBlur = () => {
    const currentData = watch();
    onSave(currentData);
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Project Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Project Title *
        </label>
        <input
          {...register('title')}
          onBlur={handleBlur}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
          placeholder="My Innovative Solution"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Category & Stage */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <select
            {...register('category')}
            onBlur={handleBlur}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Stage *
          </label>
          <select
            {...register('stage')}
            onBlur={handleBlur}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select stage</option>
            <option value="idea">Idea</option>
            <option value="prototype">Prototype</option>
            <option value="mvp">MVP</option>
            <option value="launched">Launched</option>
          </select>
          {errors.stage && (
            <p className="mt-1 text-sm text-red-600">{errors.stage.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Project Description * (min 50 characters)
        </label>
        <textarea
          {...register('description')}
          onBlur={handleBlur}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
          placeholder="Describe your project in detail..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Problem Statement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Problem Statement * (min 50 characters)
        </label>
        <textarea
          {...register('problemStatement')}
          onBlur={handleBlur}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
          placeholder="What problem are you solving?"
        />
        {errors.problemStatement && (
          <p className="mt-1 text-sm text-red-600">{errors.problemStatement.message}</p>
        )}
      </div>

      {/* Proposed Solution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Proposed Solution * (min 50 characters)
        </label>
        <textarea
          {...register('proposedSolution')}
          onBlur={handleBlur}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
          placeholder="How does your solution address the problem?"
        />
        {errors.proposedSolution && (
          <p className="mt-1 text-sm text-red-600">{errors.proposedSolution.message}</p>
        )}
      </div>

      {/* Target Market */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Market *
        </label>
        <textarea
          {...register('targetMarket')}
          onBlur={handleBlur}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
          placeholder="Who are your target users/customers?"
        />
        {errors.targetMarket && (
          <p className="mt-1 text-sm text-red-600">{errors.targetMarket.message}</p>
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
