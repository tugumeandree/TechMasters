'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  { id: 1, title: 'Personal Info', description: 'Tell us about yourself' },
  { id: 2, title: 'Project Idea', description: 'Share your innovation' },
  { id: 3, title: 'Skills', description: 'Assess your capabilities' },
  { id: 4, title: 'Team', description: 'Team preferences' },
  { id: 5, title: 'Documents', description: 'Upload required files' },
  { id: 6, title: 'Review', description: 'Review and submit' },
];

interface FormWizardProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  completedSteps: Set<number>;
}

export default function FormWizard({ currentStep, onStepChange, completedSteps }: FormWizardProps) {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'participant';

  return (
    <div className="w-full py-8">
      {/* Role indicator */}
      <div className="mb-8 text-center">
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
          Applying as: {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
      </div>

      {/* Progress steps - Desktop */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.has(step.id);
            const isClickable = step.id <= currentStep || isCompleted;

            return (
              <div key={step.id} className="flex-1 relative">
                <div className="flex items-center">
                  {/* Step circle */}
                  <button
                    onClick={() => isClickable && onStepChange(step.id)}
                    disabled={!isClickable}
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold transition-all
                      ${isActive 
                        ? 'border-primary-600 bg-primary-600 text-white scale-110 shadow-lg' 
                        : isCompleted
                          ? 'border-green-600 bg-green-600 text-white'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400'
                      }
                      ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </button>

                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2">
                      <div
                        className={`h-full transition-all ${
                          completedSteps.has(step.id)
                            ? 'bg-green-600'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Step label */}
                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-32 text-center">
                  <div
                    className={`text-sm font-semibold mb-1 ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress steps - Mobile */}
      <div className="lg:hidden">
        <div className="relative max-w-md mx-auto">
          {/* Current step display */}
          <div className="text-center mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Step {currentStep} of {steps.length}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {steps[currentStep - 1].title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {/* Progress bar */}
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-600 to-secondary-600 transition-all duration-500"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => (step.id <= currentStep || completedSteps.has(step.id)) && onStepChange(step.id)}
                disabled={step.id > currentStep && !completedSteps.has(step.id)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${currentStep === step.id
                    ? 'bg-primary-600 text-white scale-110'
                    : completedSteps.has(step.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600'
                  }
                  ${(step.id <= currentStep || completedSteps.has(step.id)) ? 'cursor-pointer' : 'cursor-not-allowed'}
                `}
              >
                {completedSteps.has(step.id) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
