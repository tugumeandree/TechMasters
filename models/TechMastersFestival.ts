import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITechMastersFestival extends Document {
  // Festival metadata
  name: string;
  edition: number; // e.g., 1st Annual, 2nd Annual
  year: number;
  theme: string;
  tagline: string;
  
  // Dates & location
  startDate: Date;
  endDate: Date;
  duration: number; // days
  format: 'virtual' | 'in-person' | 'hybrid';
  
  // Physical location (if applicable)
  venue?: {
    name: string;
    address: string;
    city: string;
    country: string;
    capacity: number;
  };
  
  // Virtual platform (if applicable)
  virtualPlatform?: {
    platform: string; // e.g., Hopin, Zoom, custom
    url: string;
    capacity: number;
  };
  
  // Participating cohorts
  cohorts: {
    cohortId: mongoose.Types.ObjectId;
    showcaseSlots: number;
    teamsShowcasing: mongoose.Types.ObjectId[];
  }[];
  
  // Main tracks/themes
  tracks: {
    name: string; // e.g., "HealthTech Innovations", "FinTech Revolution"
    description: string;
    focusAreas: string[];
    teamsCount: number;
  }[];
  
  // Showcase areas
  showcases: {
    type: 'main-stage-pitch' | 'startup-expo' | 'innovation-lab' | 'poster-session' | 'demo-booth';
    title: string;
    teamsParticipating: {
      teamId: mongoose.Types.ObjectId;
      projectId: mongoose.Types.ObjectId;
      cohortId: mongoose.Types.ObjectId;
      boothNumber?: string;
      pitchSlot?: Date;
      awards?: string[];
    }[];
  }[];
  
  // Attendees
  attendees: {
    totalRegistered: number;
    totalAttended: number;
    breakdown: {
      participants: number;
      alumni: number;
      mentors: number;
      investors: number;
      corporatePartners: number;
      media: number;
      government: number;
      publicGuest: number;
    };
    internationalAttendees: number;
    countriesRepresented: string[];
  };
  
  // Keynote speakers
  keynoteSpeakers: {
    name: string;
    title: string;
    organization: string;
    biography: string;
    photo?: string;
    sessionTitle: string;
    sessionTime: Date;
  }[];
  
  // Panels & workshops
  sessions: {
    type: 'panel' | 'workshop' | 'masterclass' | 'fireside-chat' | 'keynote';
    title: string;
    description: string;
    speakers: {
      name: string;
      organization: string;
      role: string;
    }[];
    startTime: Date;
    endTime: Date;
    venue?: string; // Room/stage name
    capacity?: number;
    registrations?: number;
  }[];
  
  // Competitions & awards
  competitions: {
    name: string;
    category: string;
    prize: number;
    currency: string;
    judges: {
      name: string;
      organization: string;
      expertise: string;
    }[];
    finalists: mongoose.Types.ObjectId[]; // Team IDs
    winner?: mongoose.Types.ObjectId;
    runnerUp?: mongoose.Types.ObjectId;
    judgingCriteria: {
      criterion: string;
      weight: number;
    }[];
  }[];
  
  // Sponsors
  sponsors: {
    organizationName: string;
    logo?: string;
    tier: 'title' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'inkind';
    contribution: number;
    benefits: string[];
  }[];
  
  // Networking
  networking: {
    investorMeetings: number;
    corporateConnections: number;
    collaborationsFormed: number;
    hiringLeads: number;
  };
  
  // Media coverage
  media: {
    pressReleases: number;
    mediaOutlets: string[];
    socialMediaReach: number;
    eventHashtag: string;
    livestreamViews?: number;
    recordings: {
      title: string;
      url: string;
      views: number;
    }[];
  };
  
  // Impact metrics
  outcomes: {
    fundingCommitments: number; // Total funding commitments made at event
    pilotProjectsInitiated: number;
    partnershipsFormed: number;
    jobOffersExtended: number;
    mediaImpressions: number;
    attendeeSatisfaction: number; // 0-10 scale
    npsScore?: number; // Net Promoter Score
  };
  
  // Budget
  budget: {
    totalBudget: number;
    sponsorshipRevenue: number;
    ticketRevenue: number;
    expenses: {
      venue: number;
      catering: number;
      technology: number;
      marketing: number;
      production: number;
      other: number;
    };
    profitLoss: number;
    currency: string;
  };
  
  // Registration
  registration: {
    ticketPrice: number;
    earlyBirdPrice?: number;
    studentPrice?: number;
    vipPrice?: number;
    registrationDeadline: Date;
    registrationUrl: string;
    capacity: number;
  };
  
  // Status
  status: 'planning' | 'announced' | 'registration-open' | 'sold-out' | 'in-progress' | 'completed' | 'cancelled';
  
  // Post-event
  postEvent?: {
    highlightsVideo?: string;
    photoGallery?: string[];
    pressKit?: string;
    impactReport?: string;
    attendeeFeedback: {
      totalResponses: number;
      averageRating: number;
      testimonials: {
        attendeeName: string;
        attendeeType: string;
        quote: string;
      }[];
    };
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const TechMastersFestivalSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  edition: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  theme: String,
  tagline: String,
  
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: Number,
  format: {
    type: String,
    enum: ['virtual', 'in-person', 'hybrid'],
    required: true
  },
  
  venue: {
    name: String,
    address: String,
    city: String,
    country: String,
    capacity: Number
  },
  
  virtualPlatform: {
    platform: String,
    url: String,
    capacity: Number
  },
  
  cohorts: [{
    cohortId: {
      type: Schema.Types.ObjectId,
      ref: 'Cohort'
    },
    showcaseSlots: Number,
    teamsShowcasing: [{
      type: Schema.Types.ObjectId,
      ref: 'Team'
    }]
  }],
  
  tracks: [{
    name: String,
    description: String,
    focusAreas: [String],
    teamsCount: Number
  }],
  
  showcases: [{
    type: {
      type: String,
      enum: ['main-stage-pitch', 'startup-expo', 'innovation-lab', 'poster-session', 'demo-booth']
    },
    title: String,
    teamsParticipating: [{
      teamId: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
      },
      projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
      },
      cohortId: {
        type: Schema.Types.ObjectId,
        ref: 'Cohort'
      },
      boothNumber: String,
      pitchSlot: Date,
      awards: [String]
    }]
  }],
  
  attendees: {
    totalRegistered: {
      type: Number,
      default: 0
    },
    totalAttended: {
      type: Number,
      default: 0
    },
    breakdown: {
      participants: { type: Number, default: 0 },
      alumni: { type: Number, default: 0 },
      mentors: { type: Number, default: 0 },
      investors: { type: Number, default: 0 },
      corporatePartners: { type: Number, default: 0 },
      media: { type: Number, default: 0 },
      government: { type: Number, default: 0 },
      publicGuest: { type: Number, default: 0 }
    },
    internationalAttendees: {
      type: Number,
      default: 0
    },
    countriesRepresented: [String]
  },
  
  keynoteSpeakers: [{
    name: String,
    title: String,
    organization: String,
    biography: String,
    photo: String,
    sessionTitle: String,
    sessionTime: Date
  }],
  
  sessions: [{
    type: {
      type: String,
      enum: ['panel', 'workshop', 'masterclass', 'fireside-chat', 'keynote']
    },
    title: String,
    description: String,
    speakers: [{
      name: String,
      organization: String,
      role: String
    }],
    startTime: Date,
    endTime: Date,
    venue: String,
    capacity: Number,
    registrations: Number
  }],
  
  competitions: [{
    name: String,
    category: String,
    prize: Number,
    currency: String,
    judges: [{
      name: String,
      organization: String,
      expertise: String
    }],
    finalists: [{
      type: Schema.Types.ObjectId,
      ref: 'Team'
    }],
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    runnerUp: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    judgingCriteria: [{
      criterion: String,
      weight: Number
    }]
  }],
  
  sponsors: [{
    organizationName: String,
    logo: String,
    tier: {
      type: String,
      enum: ['title', 'platinum', 'gold', 'silver', 'bronze', 'inkind']
    },
    contribution: Number,
    benefits: [String]
  }],
  
  networking: {
    investorMeetings: { type: Number, default: 0 },
    corporateConnections: { type: Number, default: 0 },
    collaborationsFormed: { type: Number, default: 0 },
    hiringLeads: { type: Number, default: 0 }
  },
  
  media: {
    pressReleases: Number,
    mediaOutlets: [String],
    socialMediaReach: Number,
    eventHashtag: String,
    livestreamViews: Number,
    recordings: [{
      title: String,
      url: String,
      views: Number
    }]
  },
  
  outcomes: {
    fundingCommitments: Number,
    pilotProjectsInitiated: Number,
    partnershipsFormed: Number,
    jobOffersExtended: Number,
    mediaImpressions: Number,
    attendeeSatisfaction: Number,
    npsScore: Number
  },
  
  budget: {
    totalBudget: Number,
    sponsorshipRevenue: Number,
    ticketRevenue: Number,
    expenses: {
      venue: Number,
      catering: Number,
      technology: Number,
      marketing: Number,
      production: Number,
      other: Number
    },
    profitLoss: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  registration: {
    ticketPrice: Number,
    earlyBirdPrice: Number,
    studentPrice: Number,
    vipPrice: Number,
    registrationDeadline: Date,
    registrationUrl: String,
    capacity: Number
  },
  
  status: {
    type: String,
    enum: ['planning', 'announced', 'registration-open', 'sold-out', 'in-progress', 'completed', 'cancelled'],
    default: 'planning'
  },
  
  postEvent: {
    highlightsVideo: String,
    photoGallery: [String],
    pressKit: String,
    impactReport: String,
    attendeeFeedback: {
      totalResponses: Number,
      averageRating: Number,
      testimonials: [{
        attendeeName: String,
        attendeeType: String,
        quote: String
      }]
    }
  }
}, {
  timestamps: true
});

// Indexes
TechMastersFestivalSchema.index({ year: 1, edition: 1 });
TechMastersFestivalSchema.index({ status: 1 });
TechMastersFestivalSchema.index({ startDate: 1 });

const TechMastersFestival: Model<ITechMastersFestival> = 
  mongoose.models.TechMastersFestival || mongoose.model<ITechMastersFestival>('TechMastersFestival', TechMastersFestivalSchema);

export default TechMastersFestival;
