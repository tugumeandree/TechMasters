# TechMasters Platform

A comprehensive Next.js 14 platform for TechMasters that supports multiple user types and manages the complete program lifecycle.

## 🚀 Features

### Landing Page
- ✅ Dynamic hero section with role selection
- ✅ Interactive 4-pillars visualization with hover effects
- ✅ Animated stats counter
- ✅ Success stories carousel
- ✅ Responsive navigation with dark/light mode support

### Multi-Step Application Form
- ✅ Personal Information collection
- ✅ Project Idea submission
- ✅ Skills Assessment (technical, business, soft skills)
- ✅ Team Preferences
- ✅ Document Upload (resume, proposal)
- ✅ Review & Submit
- ✅ Auto-save functionality with localStorage
- ✅ Form validation with Zod
- ✅ Progress tracking wizard

### User Types Supported
1. **Participants** - Technologists applying to the program
2. **Mentors** - Technical/Industry/Investor experts
3. **Corporate Partners** - Companies providing challenges
4. **Administrators** - Program management team

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Database**: MongoDB + Mongoose
- **Authentication**: NextAuth.js (to be implemented)
- **Icons**: Lucide React
- **Animation**: Framer Motion

## 📦 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd TechMasters
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file with the following variables:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/techmasters

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Cloudinary (for file uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
RESEND_API_KEY=your_resend_api_key
```

4. Run the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
TechMasters/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── apply/                   # Application flow
│   │   ├── page.tsx            # Multi-step form
│   │   └── success/page.tsx    # Success confirmation
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── Navbar.tsx               # Navigation header
│   ├── Footer.tsx               # Footer component
│   ├── HeroSection.tsx          # Landing hero
│   ├── PillarsSection.tsx       # 4 pillars display
│   ├── StatsCounter.tsx         # Animated counter
│   ├── StatsSection.tsx         # Stats display
│   ├── SuccessStoriesCarousel.tsx # Testimonials
│   ├── FormWizard.tsx           # Progress tracker
│   └── application/             # Form steps
│       ├── PersonalInfoStep.tsx
│       ├── ProjectIdeaStep.tsx
│       ├── SkillsAssessmentStep.tsx
│       ├── TeamPreferencesStep.tsx
│       ├── DocumentUploadStep.tsx
│       └── ReviewStep.tsx
│
├── lib/                          # Utilities & config
│   ├── db.ts                    # MongoDB connection
│   ├── models/                  # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Application.ts
│   │   └── Program.ts
│   └── validations/             # Zod schemas
│       └── application.ts
│
├── types/                        # TypeScript types
│   └── index.ts                 # All type definitions
│
└── public/                       # Static assets
```

## 🎨 Key Pages & Routes

### Public Routes
- `/` - Landing page with hero, pillars, stats, success stories
- `/apply` - Multi-step application form
- `/apply/success` - Application confirmation
- `/program/pillars` - Detailed pillar information
- `/program/success-stories` - All success stories
- `/program/mentors` - Mentor profiles
- `/partners` - Partner information
- `/auth/login` - Login page (to be implemented)
- `/auth/register` - Registration (to be implemented)

### Protected Routes (To be implemented)
- `/dashboard/participant` - Participant dashboard
- `/dashboard/mentor` - Mentor dashboard
- `/dashboard/partner` - Partner dashboard
- `/dashboard/admin` - Admin dashboard

## 🔧 API Routes (To be implemented)

- `POST /api/applications` - Submit application
- `GET /api/applications/:id` - Get application
- `PUT /api/applications/:id` - Update application
- `POST /api/auth/[...nextauth]` - Authentication
- `GET /api/users/me` - Current user

## 🎯 The Four-Stage Innovation Pipeline

TechMasters is an **end-to-end innovation pipeline** that transforms technology ideas into thriving businesses through four structured stages:

1. **Research & Ideation** - Identify real-world problems, conduct market analysis, validate technological solutions
2. **Skilling & Capacity Building** - Acquire technical and soft skills through workshops, tool training, and mentorship matching
3. **Product Development & Prototyping** - Build MVPs using agile methods, iterate with user feedback, access labs and equipment
4. **Business Development & Commercialization** - Create business models, develop IP strategy, pitch to investors, prepare for market launch

### 💡 Value Propositions Supporting Your Journey:
- **Expert Mentorship** - Technical, industry, and investor mentors guide you at every stage
- **Funding Opportunities** - From seed grants to investor connections and demo day presentations

### 📊 Outputs & Outcomes Tracking

TechMasters tracks both **outputs** (tangible deliverables) and **outcomes** (professional transformation):

**Outputs (The "What")**: Measurable results you create during each stage
- Research: Validated reports, POCs, problem statements
- Skilling: Technical competencies, portfolios, tool mastery
- Development: MVP, codebase, documentation, user testing
- Business: Business plans, IP strategy, pitch decks, roadmaps

**Outcomes (The "So What")**: Changes in your capabilities and career
- Mindset shifts (problem-first thinking, product mindset)
- Skill development (T-shaped innovator, strategic thinking)
- Credentials (shipping credibility, certifications)
- Network expansion (mentors, investors, peers)
- Leadership growth (autonomy, strategic influence)
- Career acceleration (Tech Lead, Founder, CTO readiness)

## 📝 Application Form Features

### Auto-Save
- All form data is automatically saved to localStorage
- Users can resume their application at any time
- Progress is preserved across browser sessions

### Validation
- Real-time validation using Zod schemas
- Clear error messages for each field
- Required field indicators

### Multi-Step Process
1. Personal Information (name, email, phone, education, links)
2. Project Idea (title, description, problem, solution, market)
3. Skills Assessment (technical, business, soft skills, experience)
4. Team Preferences (team status, roles needed, joining willingness)
5. Document Upload (resume, proposal)
6. Review & Submit (final confirmation)

## 🚧 Remaining Tasks

### High Priority
- [ ] Implement NextAuth.js authentication
- [ ] Create API routes for data persistence
- [ ] Build dashboard layouts for all user types
- [ ] Implement MongoDB connection and data models
- [ ] Add file upload to Cloudinary
- [ ] Set up email notifications (Resend/SendGrid)

### Medium Priority
- [ ] Create mentor matching algorithm
- [ ] Build session scheduling system
- [ ] Implement cohort management
- [ ] Add analytics dashboard for admins
- [ ] Create resource library
- [ ] Build challenge submission portal

### Nice to Have
- [ ] Real-time notifications (Socket.io/Pusher)
- [ ] Mobile Money payment integration
- [ ] Demo day event management
- [ ] Alumni network directory
- [ ] Video call integration (Zoom/Teams)
- [ ] Advanced search and filtering

## 🎨 Design Features

- Modern, tech-focused aesthetic
- Dark/light mode support (system preference)
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Accessible (WCAG 2.1 guidelines)
- Core Web Vitals optimized

## 🤝 Contributing

This is a proprietary project for TechMasters. For contributions, please contact the project maintainers.

## 📄 License

Copyright © 2025 TechMasters. All rights reserved.

## 📧 Support

For support, email support@techmasters.com or join our Slack community.

---

**Built with ❤️ for TechMasters**
#   T e c h M a s t e r s  
 