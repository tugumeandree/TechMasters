import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISponsorshipBenefit {
  category: 'brand_exposure' | 'talent_access' | 'innovation' | 'engagement' | 'networking' | 'content';
  description: string;
  value?: string;
}

export interface ISponsorshipPackage extends Document {
  name: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'custom';
  annualInvestment: number;
  currency: string;
  benefits: ISponsorshipBenefit[];
  maxSponsors?: number;
  currentSponsors: number;
  features: {
    brandExposure: {
      logoOnWebsite: boolean;
      logoOnMaterials: boolean;
      socialMediaMentions: number;
      blogPosts: number;
    };
    talentAccess: {
      jobPostings: number;
      resumeDatabase: boolean;
      exclusiveRecruitingEvents: number;
      earlyAccessToGraduates: boolean;
    };
    innovation: {
      accessToProjects: boolean;
      pitchSessionAccess: boolean;
      ipRightsFirstLook: boolean;
      challengeHosting: boolean;
    };
    engagement: {
      mentorSlots: number;
      workshopOpportunities: number;
      judgingOpportunities: number;
      networkingEvents: number;
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SponsorshipBenefitSchema = new Schema({
  category: {
    type: String,
    enum: ['brand_exposure', 'talent_access', 'innovation', 'engagement', 'networking', 'content'],
    required: true
  },
  description: { type: String, required: true },
  value: { type: String }
});

const SponsorshipPackageSchema: Schema = new Schema({
  name: { type: String, required: true },
  tier: {
    type: String,
    enum: ['platinum', 'gold', 'silver', 'bronze', 'custom'],
    required: true
  },
  annualInvestment: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  benefits: [SponsorshipBenefitSchema],
  maxSponsors: { type: Number },
  currentSponsors: { type: Number, default: 0 },
  features: {
    brandExposure: {
      logoOnWebsite: { type: Boolean, default: false },
      logoOnMaterials: { type: Boolean, default: false },
      socialMediaMentions: { type: Number, default: 0 },
      blogPosts: { type: Number, default: 0 }
    },
    talentAccess: {
      jobPostings: { type: Number, default: 0 },
      resumeDatabase: { type: Boolean, default: false },
      exclusiveRecruitingEvents: { type: Number, default: 0 },
      earlyAccessToGraduates: { type: Boolean, default: false }
    },
    innovation: {
      accessToProjects: { type: Boolean, default: false },
      pitchSessionAccess: { type: Boolean, default: false },
      ipRightsFirstLook: { type: Boolean, default: false },
      challengeHosting: { type: Boolean, default: false }
    },
    engagement: {
      mentorSlots: { type: Number, default: 0 },
      workshopOpportunities: { type: Number, default: 0 },
      judgingOpportunities: { type: Number, default: 0 },
      networkingEvents: { type: Number, default: 0 }
    }
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const SponsorshipPackage: Model<ISponsorshipPackage> = 
  mongoose.models.SponsorshipPackage || mongoose.model<ISponsorshipPackage>('SponsorshipPackage', SponsorshipPackageSchema);

export default SponsorshipPackage;
