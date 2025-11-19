import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import User from '../lib/models/User';
import Team from '../lib/models/Team';
import Project from '../lib/models/Project';
import MentorSession from '../lib/models/MentorSession';
import Activity from '../lib/models/Activity';
import Resource from '../lib/models/Resource';
import Notification from '../lib/models/Notification';
import Partner from '../lib/models/Partner';
import SponsorshipPackage from '../models/SponsorshipPackage';
import Sponsorship from '../models/Sponsorship';
import ParticipantSubscription from '../models/ParticipantSubscription';
import RevenueTransaction from '../models/RevenueTransaction';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/techmasters';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    await Project.deleteMany({});
    await MentorSession.deleteMany({});
    await Activity.deleteMany({});
    await Resource.deleteMany({});
    await Notification.deleteMany({});
    await SponsorshipPackage.deleteMany({});
    await Sponsorship.deleteMany({});
    await ParticipantSubscription.deleteMany({});
    await RevenueTransaction.deleteMany({});
    await Partner.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const hashedPassword = await hash('password123', 12);
    
    const participant1 = await User.create({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: hashedPassword,
      role: 'participant',
      phone: '+254712345678',
      location: 'Nairobi, Kenya',
      timezone: 'Africa/Nairobi',
      bio: 'Passionate about building innovative tech solutions',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      currentStage: 'development',
      profileImage: '/avatars/alex.jpg'
    });

    const mentor1 = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      password: hashedPassword,
      role: 'mentor',
      mentorType: 'technical',
      expertise: ['Full-Stack Development', 'System Architecture', 'Cloud Computing'],
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      timezone: 'America/Los_Angeles',
      bio: 'Helping the next generation of African tech leaders',
      rating: 4.8,
      sessionsCompleted: 45,
      profileImage: '/avatars/sarah.jpg'
    });

    const mentor2 = await User.create({
      name: 'Michael Torres',
      email: 'michael@example.com',
      password: hashedPassword,
      role: 'mentor',
      mentorType: 'industry',
      expertise: ['Business Strategy', 'Go-to-Market', 'Product Management'],
      company: 'StartupHub',
      position: 'Head of Product',
      timezone: 'Europe/London',
      rating: 4.6,
      sessionsCompleted: 38,
      profileImage: '/avatars/michael.jpg'
    });

    const mentor3 = await User.create({
      name: 'Rachel Kim',
      email: 'rachel@example.com',
      password: hashedPassword,
      role: 'mentor',
      mentorType: 'investor',
      timezone: 'Asia/Singapore',
      expertise: ['Venture Capital', 'Pitch Decks', 'Fundraising'],
      company: 'Venture Partners',
      position: 'Investment Partner',
      rating: 4.9,
      sessionsCompleted: 52,
      profileImage: '/avatars/rachel.jpg'
    });

    console.log('👥 Created users');

    // Create team
    const team = await Team.create({
      name: 'TechSolutions',
      projectName: 'AgriTech Platform',
      cohortId: new mongoose.Types.ObjectId(),
      members: [participant1._id],
      leaderId: participant1._id,
      currentStage: 'development',
      mentors: [mentor1._id, mentor2._id],
      isActive: true
    });

    // Update participant with team
    participant1.teamId = team._id;
    await participant1.save();

    console.log('👥 Created team');

    // Create project
    const project = await Project.create({
      teamId: team._id,
      name: 'AgriTech Platform',
      description: 'Connecting farmers with buyers and providing market insights',
      category: 'Agriculture',
      stage: 'development',
      progress: {
        research: 100,
        skilling: 100,
        development: 30,
        business: 0
      },
      milestones: [
        {
          id: 'm1',
          title: 'Market research completed',
          description: 'Analyzed agricultural market gaps and opportunities',
          dueDate: new Date('2025-11-25'),
          completed: true,
          stage: 'research'
        },
        {
          id: 'm2',
          title: 'Technical skills training',
          description: 'Completed IoT and mobile development workshops',
          dueDate: new Date('2025-12-05'),
          completed: true,
          stage: 'skilling'
        },
        {
          id: 'm3',
          title: 'MVP development in progress',
          description: 'Building mobile app and IoT sensor integration',
          dueDate: new Date('2025-12-15'),
          completed: false,
          stage: 'development'
        },
        {
          id: 'm4',
          title: 'User testing planned',
          description: 'Test MVP with pilot farmers',
          dueDate: new Date('2025-12-30'),
          completed: false,
          stage: 'development'
        }
      ],
      repositoryUrl: 'https://github.com/techsolutions/agritech',
      metrics: {
        users: 0,
        revenue: 0,
        growth: 0
      }
    });

    console.log('📁 Created project');

    // Create mentor sessions
    const sessions = await MentorSession.insertMany([
      {
        mentorId: mentor1._id,
        participantId: participant1._id,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        duration: 60,
        type: 'one-on-one',
        status: 'scheduled',
        topic: 'MVP Architecture Review',
        meetingLink: 'https://meet.google.com/abc-defg-hij'
      },
      {
        mentorId: mentor2._id,
        teamId: team._id,
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        duration: 45,
        type: 'group',
        status: 'scheduled',
        topic: 'Go-to-Market Strategy Workshop',
        meetingLink: 'https://zoom.us/j/123456789'
      },
      {
        mentorId: mentor3._id,
        participantId: participant1._id,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        duration: 30,
        type: 'one-on-one',
        status: 'scheduled',
        topic: 'Pitch Deck Feedback',
        meetingLink: 'https://meet.google.com/xyz-abcd-efg'
      }
    ]);

    console.log('📅 Created mentor sessions');

    // Create activities
    const activities = await Activity.insertMany([
      {
        teamId: team._id,
        projectId: project._id,
        userId: participant1._id,
        type: 'commit',
        title: 'Implemented user authentication flow',
        description: 'Added JWT-based authentication with refresh tokens',
        author: 'Alex Johnson',
        metadata: {
          branch: 'feature/auth',
          filesChanged: 8,
          additions: 234,
          deletions: 45
        }
      },
      {
        teamId: team._id,
        projectId: project._id,
        userId: participant1._id,
        type: 'milestone',
        title: 'Customer Validation Complete',
        description: 'Completed 20 customer interviews with positive feedback',
        author: 'Team'
      },
      {
        teamId: team._id,
        userId: mentor1._id,
        type: 'comment',
        title: 'Design feedback on landing page',
        description: 'Suggested improvements to the hero section and CTA placement',
        author: 'Sarah Chen'
      }
    ]);

    console.log('📊 Created activities');

    // Create resources
    const resources = await Resource.insertMany([
      {
        title: 'Market Analysis Framework',
        description: 'Comprehensive guide to analyzing market trends and gaps',
        type: 'document',
        url: '#',
        stage: 'research',
        pillar: 'research',
        rating: 4.7,
        duration: '30 min',
        featured: true,
        tags: ['research', 'market-analysis'],
        isActive: true
      },
      {
        title: 'Technical Skills Bootcamp',
        description: 'AI/ML, IoT, and cloud development training modules',
        type: 'video',
        url: '#',
        stage: 'skilling',
        pillar: 'skilling',
        rating: 4.5,
        duration: '60 min',
        featured: false,
        tags: ['training', 'technical-skills'],
        isActive: true
      },
      {
        title: 'Agile Development Tools',
        description: 'Essential tools and frameworks for MVP development',
        type: 'tool',
        url: '#',
        stage: 'development',
        pillar: 'development',
        rating: 4.8,
        featured: false,
        tags: ['agile', 'prototyping'],
        isActive: true
      }
    ]);

    console.log('📚 Created resources');

    // Create notifications
    const notifications = await Notification.insertMany([
      {
        userId: participant1._id,
        type: 'gate-review',
        title: 'Gate Review Scheduled',
        message: 'Your Validation stage gate review is scheduled for next Monday at 2:00 PM. Prepare your presentation and ensure all milestones are complete.',
        read: false,
        actionLabel: 'Prepare Review',
        actionUrl: '#',
        metadata: {
          priority: 'high'
        }
      },
      {
        userId: participant1._id,
        type: 'success',
        title: 'Milestone Completed!',
        message: "Congratulations! You've completed the 'Customer Validation' milestone. Your progress has been updated.",
        read: false
      },
      {
        userId: participant1._id,
        type: 'reminder',
        title: 'Mentor Session Tomorrow',
        message: "Don't forget about your session with Sarah Chen tomorrow at 10:00 AM. Topic: MVP Architecture Review",
        read: true,
        actionLabel: 'View Details',
        actionUrl: '#',
        metadata: {
          sessionId: sessions[0]._id,
          priority: 'medium'
        }
      }
    ]);

    console.log('🔔 Created notifications');

    // Create sponsorship packages
    const platinumPackage = await SponsorshipPackage.create({
      name: 'Platinum Partnership',
      tier: 'platinum',
      annualInvestment: 100000,
      currency: 'USD',
      benefits: [
        { category: 'brand_exposure', description: 'Premium logo placement on website and all materials', value: 'Homepage hero section' },
        { category: 'talent_access', description: 'Exclusive first access to all graduates', value: '30 days early access' },
        { category: 'innovation', description: 'Host corporate challenges and access all IP', value: 'Unlimited challenges' },
        { category: 'engagement', description: 'Unlimited mentor slots and workshop hosting', value: 'Unlimited' }
      ],
      maxSponsors: 3,
      currentSponsors: 1,
      features: {
        brandExposure: {
          logoOnWebsite: true,
          logoOnMaterials: true,
          socialMediaMentions: 52,
          blogPosts: 12
        },
        talentAccess: {
          jobPostings: 999,
          resumeDatabase: true,
          exclusiveRecruitingEvents: 12,
          earlyAccessToGraduates: true
        },
        innovation: {
          accessToProjects: true,
          pitchSessionAccess: true,
          ipRightsFirstLook: true,
          challengeHosting: true
        },
        engagement: {
          mentorSlots: 999,
          workshopOpportunities: 24,
          judgingOpportunities: 12,
          networkingEvents: 12
        }
      },
      isActive: true
    });

    const goldPackage = await SponsorshipPackage.create({
      name: 'Gold Partnership',
      tier: 'gold',
      annualInvestment: 50000,
      currency: 'USD',
      benefits: [
        { category: 'brand_exposure', description: 'Logo on website and event materials', value: 'Partners page featured' },
        { category: 'talent_access', description: 'Access to graduate resume database', value: 'Full database access' },
        { category: 'innovation', description: 'Host 2 corporate challenges per year', value: '2 challenges/year' },
        { category: 'engagement', description: '10 mentor slots and 4 workshops', value: '10 mentors + 4 workshops' }
      ],
      maxSponsors: 5,
      currentSponsors: 2,
      features: {
        brandExposure: {
          logoOnWebsite: true,
          logoOnMaterials: true,
          socialMediaMentions: 24,
          blogPosts: 6
        },
        talentAccess: {
          jobPostings: 50,
          resumeDatabase: true,
          exclusiveRecruitingEvents: 4,
          earlyAccessToGraduates: false
        },
        innovation: {
          accessToProjects: true,
          pitchSessionAccess: true,
          ipRightsFirstLook: false,
          challengeHosting: true
        },
        engagement: {
          mentorSlots: 10,
          workshopOpportunities: 4,
          judgingOpportunities: 4,
          networkingEvents: 4
        }
      },
      isActive: true
    });

    const silverPackage = await SponsorshipPackage.create({
      name: 'Silver Partnership',
      tier: 'silver',
      annualInvestment: 25000,
      currency: 'USD',
      benefits: [
        { category: 'brand_exposure', description: 'Logo on partners page', value: 'Partners page listing' },
        { category: 'talent_access', description: '20 job postings per year', value: '20 postings' },
        { category: 'engagement', description: '5 mentor slots and 2 workshops', value: '5 mentors + 2 workshops' }
      ],
      maxSponsors: 10,
      currentSponsors: 3,
      features: {
        brandExposure: {
          logoOnWebsite: true,
          logoOnMaterials: false,
          socialMediaMentions: 12,
          blogPosts: 2
        },
        talentAccess: {
          jobPostings: 20,
          resumeDatabase: false,
          exclusiveRecruitingEvents: 2,
          earlyAccessToGraduates: false
        },
        innovation: {
          accessToProjects: false,
          pitchSessionAccess: true,
          ipRightsFirstLook: false,
          challengeHosting: false
        },
        engagement: {
          mentorSlots: 5,
          workshopOpportunities: 2,
          judgingOpportunities: 2,
          networkingEvents: 2
        }
      },
      isActive: true
    });

    console.log('💎 Created sponsorship packages');

    // Use existing participants for sponsorship instead of creating new partners for now
    // This avoids model conflicts during seeding

    // Create sponsorships
    const techCorpSponsorship = await Sponsorship.create({
      partner: participant1._id, // Using participant as temporary partner for seeding
      package: platinumPackage._id,
      status: 'active',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      totalInvestment: 100000,
      currency: 'USD',
      paymentSchedule: {
        frequency: 'quarterly',
        installments: [
          { amount: 25000, dueDate: new Date('2025-01-15'), status: 'paid', paidDate: new Date('2025-01-10') },
          { amount: 25000, dueDate: new Date('2025-04-15'), status: 'paid', paidDate: new Date('2025-04-12') },
          { amount: 25000, dueDate: new Date('2025-07-15'), status: 'paid', paidDate: new Date('2025-07-10') },
          { amount: 25000, dueDate: new Date('2025-10-15'), status: 'pending' }
        ]
      },
      milestones: [
        {
          name: 'Q1 Brand Activation',
          description: 'Logo placement and social media campaign',
          dueDate: new Date('2025-03-31'),
          status: 'completed',
          completedDate: new Date('2025-03-28')
        },
        {
          name: 'Q2 Innovation Challenge',
          description: 'Host first corporate challenge on AI/ML',
          dueDate: new Date('2025-06-30'),
          status: 'completed',
          completedDate: new Date('2025-06-25')
        },
        {
          name: 'Q3 Talent Pipeline',
          description: 'Interview at least 20 participants',
          dueDate: new Date('2025-09-30'),
          status: 'pending'
        }
      ],
      deliverables: [],
      metrics: {
        logoImpressions: 150000,
        socialMediaReach: 85000,
        talentsRecruited: 5,
        eventsAttended: 8,
        projectsReviewed: 12
      },
      createdBy: participant1._id
    });

    console.log('🤝 Created sponsorships');

    // Create participant subscriptions
    const alexSubscription = await ParticipantSubscription.create({
      participant: participant1._id,
      subscriptionType: 'full_program',
      pricingModel: 'isa',
      pricing: {
        baseAmount: 0,
        currency: 'USD',
        paymentSchedule: 'monthly',
        totalAmount: 0
      },
      isa: {
        percentage: 10,
        incomeThreshold: 50000,
        maxPaymentMonths: 36,
        capAmount: 30000,
        paymentsMade: 0,
        totalPaid: 0
      },
      payments: [],
      status: 'active',
      startDate: new Date('2025-01-15'),
      accessIncludes: {
        platformAccess: true,
        mentorshipHours: 50,
        workshopAccess: true,
        projectReviews: 12,
        careerServices: true,
        alumniNetwork: true,
        certificateEligible: true
      }
    });

    console.log('💳 Created participant subscriptions');

    // Create revenue transactions
    const revenueTransactions = await RevenueTransaction.create([
      {
        transactionType: 'sponsorship',
        source: {
          type: 'organization',
          id: participant1._id,
          name: 'TechCorp Global'
        },
        sponsorship: techCorpSponsorship._id,
        amount: 25000,
        currency: 'USD',
        paymentMethod: 'wire',
        transactionId: 'TXN-2025-001-SPO',
        status: 'completed',
        transactionDate: new Date('2025-01-10'),
        processingDate: new Date('2025-01-10'),
        settlementDate: new Date('2025-01-12'),
        processingFees: 50,
        netAmount: 24950,
        accountingCategory: 'sponsorship_revenue',
        fiscalYear: 2025,
        fiscalQuarter: 1,
        invoiceNumber: 'INV-2025-001',
        notes: 'Q1 2025 Platinum Sponsorship Payment'
      },
      {
        transactionType: 'sponsorship',
        source: {
          type: 'organization',
          id: participant1._id,
          name: 'TechCorp Global'
        },
        sponsorship: techCorpSponsorship._id,
        amount: 25000,
        currency: 'USD',
        paymentMethod: 'wire',
        transactionId: 'TXN-2025-002-SPO',
        status: 'completed',
        transactionDate: new Date('2025-04-12'),
        processingDate: new Date('2025-04-12'),
        settlementDate: new Date('2025-04-14'),
        processingFees: 50,
        netAmount: 24950,
        accountingCategory: 'sponsorship_revenue',
        fiscalYear: 2025,
        fiscalQuarter: 2,
        invoiceNumber: 'INV-2025-002',
        notes: 'Q2 2025 Platinum Sponsorship Payment'
      },
      {
        transactionType: 'sponsorship',
        source: {
          type: 'organization',
          id: participant1._id,
          name: 'TechCorp Global'
        },
        sponsorship: techCorpSponsorship._id,
        amount: 25000,
        currency: 'USD',
        paymentMethod: 'wire',
        transactionId: 'TXN-2025-003-SPO',
        status: 'completed',
        transactionDate: new Date('2025-07-10'),
        processingDate: new Date('2025-07-10'),
        settlementDate: new Date('2025-07-12'),
        processingFees: 50,
        netAmount: 24950,
        accountingCategory: 'sponsorship_revenue',
        fiscalYear: 2025,
        fiscalQuarter: 3,
        invoiceNumber: 'INV-2025-003',
        notes: 'Q3 2025 Platinum Sponsorship Payment'
      }
    ]);

    console.log('💰 Created revenue transactions');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Users: 4 (1 participant, 3 mentors)`);
    console.log(`  - Teams: 1`);
    console.log(`  - Projects: 1`);
    console.log(`  - Mentor Sessions: ${sessions.length}`);
    console.log(`  - Activities: ${activities.length}`);
    console.log(`  - Resources: ${resources.length}`);
    console.log(`  - Notifications: ${notifications.length}`);
    console.log(`  - Sponsorship Packages: 3 (Platinum, Gold, Silver)`);
    console.log(`  - Active Sponsorships: 1`);
    console.log(`  - Participant Subscriptions: 1`);
    console.log(`  - Revenue Transactions: ${revenueTransactions.length}`);
    console.log('\n💰 Revenue Summary:');
    console.log(`  - Total Revenue (2025): $${revenueTransactions.reduce((sum, t) => sum + t.netAmount, 0).toLocaleString()}`);
    console.log(`  - Active Sponsorships Value: $100,000`);
    console.log('\n🔑 Login credentials:');
    console.log(`  Email: alex@example.com`);
    console.log(`  Password: password123`);
    console.log(`\n  Mentor Email: sarah@example.com`);
    console.log(`  Password: password123\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
