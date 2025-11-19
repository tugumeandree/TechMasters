import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGlobalPartner extends Document {
  // Partner institution
  organizationName: string;
  country: string;
  city: string;
  region: 'Africa' | 'Asia' | 'Europe' | 'North America' | 'South America' | 'Middle East' | 'Oceania';
  organizationType: 'university' | 'incubator' | 'accelerator' | 'innovation-hub' | 'government' | 'corporate';
  
  // Contact information
  primaryContact: {
    name: string;
    email: string;
    phone?: string;
    position: string;
  };
  website?: string;
  
  // Partnership details
  partnershipType: 'exchange-program' | 'dual-cohort' | 'mentor-sharing' | 'resource-sharing' | 'joint-demo-day' | 'curriculum-license';
  status: 'prospective' | 'negotiating' | 'active' | 'inactive' | 'completed';
  
  // Agreement terms
  agreementStartDate?: Date;
  agreementEndDate?: Date;
  agreementDocumentUrl?: string;
  
  // Exchange capacity
  capacity: {
    maxParticipantsPerYear: number;
    maxMentorsShared: number;
  };
  
  // Focus areas
  focusAreas: string[]; // e.g., ['AI/ML', 'FinTech', 'HealthTech']
  
  // Metrics
  metrics: {
    participantsExchanged: number;
    mentorsShared: number;
    jointProjects: number;
    eventsHosted: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface IExchangeProgram extends Document {
  // Program metadata
  name: string;
  description: string;
  programType: 'outbound' | 'inbound' | 'virtual-exchange';
  
  // Partner & location
  partnerId: mongoose.Types.ObjectId;
  hostCountry: string;
  hostCity: string;
  
  // Cohort link
  cohortId?: mongoose.Types.ObjectId; // If tied to specific cohort
  
  // Timeline
  startDate: Date;
  endDate: Date;
  duration: number; // weeks
  applicationDeadline: Date;
  
  // Participants
  participants: {
    userId: mongoose.Types.ObjectId;
    cohortId: mongoose.Types.ObjectId;
    status: 'applied' | 'accepted' | 'confirmed' | 'completed' | 'withdrawn';
    appliedAt: Date;
    acceptedAt?: Date;
    departureDate?: Date;
    returnDate?: Date;
    completionReport?: string; // URL
  }[];
  
  maxParticipants: number;
  
  // Program structure
  activities: {
    type: 'workshop' | 'site-visit' | 'networking' | 'mentor-session' | 'hackathon' | 'cultural';
    title: string;
    date?: Date;
    description?: string;
  }[];
  
  // Logistics
  logistics: {
    accommodationProvided: boolean;
    travelStipendProvided: boolean;
    visaSupport: boolean;
    localTransportation: boolean;
  };
  
  costs: {
    programFee: number;
    scholarshipsAvailable: number;
    travelBudget?: number;
    accommodationBudget?: number;
    currency: string;
  };
  
  // Learning outcomes
  learningOutcomes: string[];
  
  // Status
  status: 'planning' | 'open-applications' | 'selection' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  
  // Results
  outcomes?: {
    participantsCompleted: number;
    projectsCreated: number;
    partnershipsFormed: number;
    averageSatisfaction: number;
    keyLearnings: string[];
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface IInternationalEvent extends Document {
  // Event metadata
  name: string;
  description: string;
  eventType: 'global-summit' | 'regional-meetup' | 'virtual-conference' | 'hackathon' | 'demo-day' | 'alumni-reunion';
  
  // Location
  format: 'virtual' | 'in-person' | 'hybrid';
  country?: string;
  city?: string;
  venue?: string;
  virtualPlatform?: string;
  
  // Date & time
  startDate: Date;
  endDate: Date;
  timezone: string;
  
  // Attendees
  expectedAttendees: number;
  registeredAttendees: number;
  attendees: {
    userId: mongoose.Types.ObjectId;
    userType: 'participant' | 'alumni' | 'mentor' | 'partner' | 'guest';
    cohortId?: mongoose.Types.ObjectId;
    country: string;
    registeredAt: Date;
    attended: boolean;
  }[];
  
  // Representing countries
  countriesRepresented: string[];
  
  // Agenda
  agenda: {
    time: string;
    activity: string;
    speaker?: string;
    speakerOrg?: string;
    description?: string;
  }[];
  
  // Partners
  organizingPartners: mongoose.Types.ObjectId[];
  sponsors?: {
    organizationName: string;
    sponsorshipLevel: 'title' | 'platinum' | 'gold' | 'silver' | 'bronze';
    contribution: number;
  }[];
  
  // Outcomes
  outcomes?: {
    totalAttendance: number;
    networksFormed: number;
    dealsInitiated: number;
    mediaReach: number;
    recordings: string[]; // URLs
  };
  
  // Registration
  registrationUrl?: string;
  registrationFee?: number;
  currency?: string;
  
  status: 'planning' | 'open-registration' | 'closed-registration' | 'in-progress' | 'completed' | 'cancelled';
  
  createdAt: Date;
  updatedAt: Date;
}

const GlobalPartnerSchema: Schema = new Schema({
  organizationName: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: String,
  region: {
    type: String,
    enum: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Middle East', 'Oceania'],
    required: true
  },
  organizationType: {
    type: String,
    enum: ['university', 'incubator', 'accelerator', 'innovation-hub', 'government', 'corporate'],
    required: true
  },
  
  primaryContact: {
    name: String,
    email: String,
    phone: String,
    position: String
  },
  website: String,
  
  partnershipType: {
    type: String,
    enum: ['exchange-program', 'dual-cohort', 'mentor-sharing', 'resource-sharing', 'joint-demo-day', 'curriculum-license'],
    required: true
  },
  status: {
    type: String,
    enum: ['prospective', 'negotiating', 'active', 'inactive', 'completed'],
    default: 'prospective'
  },
  
  agreementStartDate: Date,
  agreementEndDate: Date,
  agreementDocumentUrl: String,
  
  capacity: {
    maxParticipantsPerYear: Number,
    maxMentorsShared: Number
  },
  
  focusAreas: [String],
  
  metrics: {
    participantsExchanged: {
      type: Number,
      default: 0
    },
    mentorsShared: {
      type: Number,
      default: 0
    },
    jointProjects: {
      type: Number,
      default: 0
    },
    eventsHosted: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

const ExchangeProgramSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  programType: {
    type: String,
    enum: ['outbound', 'inbound', 'virtual-exchange'],
    required: true
  },
  
  partnerId: {
    type: Schema.Types.ObjectId,
    ref: 'GlobalPartner',
    required: true
  },
  hostCountry: String,
  hostCity: String,
  
  cohortId: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort'
  },
  
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: Number,
  applicationDeadline: Date,
  
  participants: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    cohortId: {
      type: Schema.Types.ObjectId,
      ref: 'Cohort'
    },
    status: {
      type: String,
      enum: ['applied', 'accepted', 'confirmed', 'completed', 'withdrawn'],
      default: 'applied'
    },
    appliedAt: Date,
    acceptedAt: Date,
    departureDate: Date,
    returnDate: Date,
    completionReport: String
  }],
  
  maxParticipants: Number,
  
  activities: [{
    type: {
      type: String,
      enum: ['workshop', 'site-visit', 'networking', 'mentor-session', 'hackathon', 'cultural']
    },
    title: String,
    date: Date,
    description: String
  }],
  
  logistics: {
    accommodationProvided: Boolean,
    travelStipendProvided: Boolean,
    visaSupport: Boolean,
    localTransportation: Boolean
  },
  
  costs: {
    programFee: Number,
    scholarshipsAvailable: Number,
    travelBudget: Number,
    accommodationBudget: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  learningOutcomes: [String],
  
  status: {
    type: String,
    enum: ['planning', 'open-applications', 'selection', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'planning'
  },
  
  outcomes: {
    participantsCompleted: Number,
    projectsCreated: Number,
    partnershipsFormed: Number,
    averageSatisfaction: Number,
    keyLearnings: [String]
  }
}, {
  timestamps: true
});

const InternationalEventSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  eventType: {
    type: String,
    enum: ['global-summit', 'regional-meetup', 'virtual-conference', 'hackathon', 'demo-day', 'alumni-reunion'],
    required: true
  },
  
  format: {
    type: String,
    enum: ['virtual', 'in-person', 'hybrid'],
    required: true
  },
  country: String,
  city: String,
  venue: String,
  virtualPlatform: String,
  
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  timezone: String,
  
  expectedAttendees: Number,
  registeredAttendees: {
    type: Number,
    default: 0
  },
  attendees: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    userType: {
      type: String,
      enum: ['participant', 'alumni', 'mentor', 'partner', 'guest']
    },
    cohortId: {
      type: Schema.Types.ObjectId,
      ref: 'Cohort'
    },
    country: String,
    registeredAt: Date,
    attended: Boolean
  }],
  
  countriesRepresented: [String],
  
  agenda: [{
    time: String,
    activity: String,
    speaker: String,
    speakerOrg: String,
    description: String
  }],
  
  organizingPartners: [{
    type: Schema.Types.ObjectId,
    ref: 'GlobalPartner'
  }],
  
  sponsors: [{
    organizationName: String,
    sponsorshipLevel: {
      type: String,
      enum: ['title', 'platinum', 'gold', 'silver', 'bronze']
    },
    contribution: Number
  }],
  
  outcomes: {
    totalAttendance: Number,
    networksFormed: Number,
    dealsInitiated: Number,
    mediaReach: Number,
    recordings: [String]
  },
  
  registrationUrl: String,
  registrationFee: Number,
  currency: String,
  
  status: {
    type: String,
    enum: ['planning', 'open-registration', 'closed-registration', 'in-progress', 'completed', 'cancelled'],
    default: 'planning'
  }
}, {
  timestamps: true
});

// Indexes
GlobalPartnerSchema.index({ country: 1, status: 1 });
GlobalPartnerSchema.index({ region: 1 });
GlobalPartnerSchema.index({ status: 1 });

ExchangeProgramSchema.index({ partnerId: 1, status: 1 });
ExchangeProgramSchema.index({ startDate: 1, endDate: 1 });
ExchangeProgramSchema.index({ status: 1 });

InternationalEventSchema.index({ startDate: 1, eventType: 1 });
InternationalEventSchema.index({ status: 1 });
InternationalEventSchema.index({ country: 1 });

const GlobalPartner: Model<IGlobalPartner> = mongoose.models.GlobalPartner || mongoose.model<IGlobalPartner>('GlobalPartner', GlobalPartnerSchema);
const ExchangeProgram: Model<IExchangeProgram> = mongoose.models.ExchangeProgram || mongoose.model<IExchangeProgram>('ExchangeProgram', ExchangeProgramSchema);
const InternationalEvent: Model<IInternationalEvent> = mongoose.models.InternationalEvent || mongoose.model<IInternationalEvent>('InternationalEvent', InternationalEventSchema);

export { GlobalPartner, ExchangeProgram, InternationalEvent };
export default GlobalPartner;
