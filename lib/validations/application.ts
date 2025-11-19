import { z } from 'zod';

// Personal Information Schema
export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  education: z.string().min(2, 'Education background is required'),
  currentRole: z.string().optional(),
  linkedIn: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
});

// Project Idea Schema
export const projectIdeaSchema = z.object({
  title: z.string().min(5, 'Project title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  problemStatement: z.string().min(50, 'Problem statement must be at least 50 characters'),
  proposedSolution: z.string().min(50, 'Proposed solution must be at least 50 characters'),
  targetMarket: z.string().min(10, 'Target market description is required'),
  category: z.string().min(1, 'Please select a category'),
  stage: z.enum(['idea', 'prototype', 'mvp', 'launched'], {
    message: 'Please select the current stage',
  }),
});

// Skills Assessment Schema
export const skillsAssessmentSchema = z.object({
  technicalSkills: z.array(z.string()).min(1, 'Select at least one technical skill'),
  businessSkills: z.array(z.string()).min(1, 'Select at least one business skill'),
  softSkills: z.array(z.string()).min(1, 'Select at least one soft skill'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    message: 'Please select your experience level',
  }),
  areasOfInterest: z.array(z.string()).min(1, 'Select at least one area of interest'),
});

// Team Preferences Schema
export const teamPreferencesSchema = z.object({
  hasTeam: z.boolean(),
  teamSize: z.number().min(1).max(10).optional(),
  lookingForMembers: z.boolean(),
  desiredRoles: z.array(z.string()).optional(),
  willingToJoinExistingTeam: z.boolean(),
});

// Complete Application Schema
export const applicationSchema = z.object({
  personalInfo: personalInfoSchema,
  projectIdea: projectIdeaSchema,
  skillsAssessment: skillsAssessmentSchema,
  teamPreferences: teamPreferencesSchema,
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type ProjectIdeaFormData = z.infer<typeof projectIdeaSchema>;
export type SkillsAssessmentFormData = z.infer<typeof skillsAssessmentSchema>;
export type TeamPreferencesFormData = z.infer<typeof teamPreferencesSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
