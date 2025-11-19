'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FormWizard from '@/components/FormWizard';
import PersonalInfoStep from '@/components/application/PersonalInfoStep';
import ProjectIdeaStep from '@/components/application/ProjectIdeaStep';
import SkillsAssessmentStep from '@/components/application/SkillsAssessmentStep';
import TeamPreferencesStep from '@/components/application/TeamPreferencesStep';
import DocumentUploadStep from '@/components/application/DocumentUploadStep';
import ReviewStep from '@/components/application/ReviewStep';
import {
  PersonalInfoFormData,
  ProjectIdeaFormData,
  SkillsAssessmentFormData,
  TeamPreferencesFormData,
} from '@/lib/validations/application';

const LOCAL_STORAGE_KEY = 'techmasters_application_draft';

export default function ApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formData, setFormData] = useState<{
    personalInfo?: PersonalInfoFormData;
    projectIdea?: ProjectIdeaFormData;
    skillsAssessment?: SkillsAssessmentFormData;
    teamPreferences?: TeamPreferencesFormData;
  }>({});

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed.data || {});
        setCurrentStep(parsed.currentStep || 1);
        setCompletedSteps(new Set(parsed.completedSteps || []));
      } catch (error) {
        console.error('Failed to load saved draft:', error);
      }
    }
  }, []);

  // Auto-save draft with visual feedback
  const saveDraft = (data: Partial<typeof formData>) => {
    setIsSaving(true);
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        data: updatedData,
        currentStep,
        completedSteps: Array.from(completedSteps),
        savedAt: new Date().toISOString(),
      })
    );
    
    // Show saved feedback
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 500);
  };

  const handleStepComplete = (step: number, data: any) => {
    const stepKey = [
      'personalInfo',
      'projectIdea',
      'skillsAssessment',
      'teamPreferences',
    ][step - 1];

    const updatedData = {
      ...formData,
      [stepKey]: data,
    };

    setFormData(updatedData);
    setCompletedSteps(prev => new Set([...prev, step]));
    
    // Save to localStorage
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        data: updatedData,
        currentStep: step + 1,
        completedSteps: Array.from(new Set([...completedSteps, step])),
        savedAt: new Date().toISOString(),
      })
    );

    // Move to next step
    setCurrentStep(step + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    try {
      // In production, send to API
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Clear draft
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        // Redirect to success page
        router.push('/apply/success');
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 md:pt-24 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 px-4">
              TechMasters Application
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 px-4">
              Complete all steps to submit your application
            </p>
            
            {/* Auto-save indicator */}
            <div className="flex items-center justify-center gap-2 mt-2 md:mt-3">
              {isSaving ? (
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  <Save className="h-3.5 w-3.5 md:h-4 md:w-4 animate-pulse" />
                  <span>Saving...</span>
                </div>
              ) : lastSaved ? (
                <div className="flex items-center gap-2 text-xs md:text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>Saved {lastSaved.toLocaleTimeString()}</span>
                </div>
              ) : (
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-500">
                  Your progress is automatically saved
                </p>
              )}
            </div>
          </div>

          {/* Progress Wizard */}
          <FormWizard
            currentStep={currentStep}
            onStepChange={handleStepChange}
            completedSteps={completedSteps}
          />

          {/* Form Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 mt-6 md:mt-8">
            {currentStep === 1 && (
              <PersonalInfoStep
                defaultValues={formData.personalInfo}
                onNext={(data) => handleStepComplete(1, data)}
                onSave={(data) => saveDraft({ personalInfo: data as PersonalInfoFormData })}
              />
            )}

            {currentStep === 2 && (
              <ProjectIdeaStep
                defaultValues={formData.projectIdea}
                onNext={(data) => handleStepComplete(2, data)}
                onBack={handleBack}
                onSave={(data) => saveDraft({ projectIdea: data as ProjectIdeaFormData })}
              />
            )}

            {currentStep === 3 && (
              <SkillsAssessmentStep
                defaultValues={formData.skillsAssessment}
                onNext={(data) => handleStepComplete(3, data)}
                onBack={handleBack}
                onSave={(data) => saveDraft({ skillsAssessment: data as SkillsAssessmentFormData })}
              />
            )}

            {currentStep === 4 && (
              <TeamPreferencesStep
                defaultValues={formData.teamPreferences}
                onNext={(data) => handleStepComplete(4, data)}
                onBack={handleBack}
                onSave={(data) => saveDraft({ teamPreferences: data as TeamPreferencesFormData })}
              />
            )}

            {currentStep === 5 && (
              <DocumentUploadStep
                onNext={() => setCurrentStep(6)}
                onBack={handleBack}
              />
            )}

            {currentStep === 6 && (
              <ReviewStep
                data={formData}
                onBack={handleBack}
                onEdit={handleStepChange}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
