# Participant Dashboard

The TechMasters participant dashboard provides a comprehensive view of a participant's journey through the program.

## Features

### 1. Stage Progression Tracker
- **Location**: Main dashboard top section
- **Purpose**: Visual representation of the 4-stage program journey
- **Features**:
  - Interactive timeline showing all 4 stages (Ideation → Validation → Development → Scaling)
  - Current stage highlighted with progress percentage
  - Completed stages marked with checkmarks
  - Future stages shown as locked
  - Stage-specific milestones with completion tracking
  - Progress bar showing completion within current stage
  - Gate review alerts when approaching stage completion (>70%)
  - Quick stats: stages completed, milestones achieved, stages remaining

### 2. Upcoming Mentor Sessions
- **Location**: Left column (2/3 width)
- **Purpose**: Display scheduled mentorship sessions
- **Features**:
  - List of upcoming sessions with mentor details
  - Session type badges (1:1, Group, Workshop)
  - Date, time, and duration information
  - Days-until countdown badges
  - Topic and mentor specialization display
  - Direct "Join Meeting" links with video icon
  - Quick action to schedule new sessions
  - Empty state with call-to-action

### 3. Recent Project Activity
- **Location**: Left column (below sessions)
- **Purpose**: Timeline of project-related activities
- **Features**:
  - Activity feed with different event types:
    - Git commits with file change stats
    - Milestone completions
    - Team member comments/feedback
    - Team member changes
    - Sprint/planning updates
  - Visual timeline with colored icons per activity type
  - Time stamps (relative time: "2h ago", "1 day ago")
  - Commit metadata (branch, additions, deletions, files changed)
  - Quick stats: commits this week, milestones reached, team size
  - Link to project repository

### 4. Resource Recommendations
- **Location**: Right column (1/3 width)
- **Purpose**: Stage-specific learning resources
- **Features**:
  - Curated resources based on current program stage
  - Resource types: Video, Document, Link, Tool
  - Featured resources highlighted with star badge
  - Resource metadata: rating, duration, type
  - Direct "Access Resource" buttons
  - Browse all resources link
  - Pro tip section with stage-specific advice

### 5. Notification Center
- **Location**: Top of main content area
- **Purpose**: Important alerts and updates
- **Features**:
  - Notification types:
    - Gate reviews (yellow alert badge)
    - Success/achievements (green checkmark)
    - Reminders (purple calendar)
    - General info (blue info icon)
  - Unread count badge
  - Read/unread status indicators
  - Mark as read (individual or all)
  - Dismiss notifications
  - Action buttons for relevant notifications
  - Collapsible view (show more/less)
  - Timestamp display

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Top Navigation Bar                                          │
│  - Menu toggle, TechMasters logo, Search, Notifications     │
└─────────────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────────────────┐
│          │  Welcome Section                                 │
│          ├──────────────────────────────────────────────────┤
│          │  Notification Center (collapsible)               │
│  Sidebar ├──────────────────────────────────────────────────┤
│          │  Stage Progress Tracker (full width)             │
│  - Links ├──────────────────────────────────────────────────┤
│    to:   │  Two-Column Layout                               │
│    • Dash│  ┌─────────────────────┬──────────────────────┐ │
│    • Pro │  │ Upcoming Sessions   │ Resource             │ │
│    • Team│  │ (2/3 width)         │ Recommendations      │ │
│    • Men │  │                     │ (1/3 width)          │ │
│    • Res │  ├─────────────────────┤                      │ │
│    • Chal│  │ Project Activity    │                      │ │
│    • Set │  │                     │                      │ │
│          │  └─────────────────────┴──────────────────────┘ │
└──────────┴──────────────────────────────────────────────────┘
```

## Technical Details

### File Structure
```
app/
  dashboard/
    participant/
      page.tsx                    # Main dashboard layout

components/
  dashboard/
    StageProgressTracker.tsx      # Stage progression component
    UpcomingSessions.tsx          # Mentor sessions list
    ProjectActivity.tsx           # Activity timeline
    ResourceRecommendations.tsx   # Stage-specific resources
    NotificationCenter.tsx        # Notifications panel
```

### Data Sources
Currently using mock data. Will be replaced with:
- API calls to `/api/participants/[id]/progress`
- API calls to `/api/sessions?participantId=...`
- API calls to `/api/activities?teamId=...`
- API calls to `/api/resources?stage=...`
- API calls to `/api/notifications?userId=...`

### State Management
- Local component state for UI interactions (sidebar toggle, notification expansion)
- Mock participant data (will be replaced with session data from NextAuth)
- Will integrate with React Context or state management library for global state

## Usage

Navigate to `/dashboard/participant` to view the dashboard.

### Current Mock Data
- Participant: Alex Johnson
- Team: TechSolutions
- Current Stage: Validation (45% complete)
- 3 upcoming sessions
- 6 recent activities
- Stage-specific resources

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live notifications
2. **Data Persistence**: Connect to MongoDB for actual data
3. **Authentication**: Protect route with NextAuth.js
4. **Responsive Design**: Mobile-optimized layout
5. **Customization**: Allow users to customize dashboard layout
6. **Analytics**: Add charts and graphs for progress visualization
7. **Collaboration**: Team chat/messaging integration
8. **Calendar Integration**: Sync with Google Calendar/Outlook
9. **Gamification**: Points, badges, and leaderboards
10. **Export**: Allow users to export progress reports

## Dependencies

- `lucide-react`: Icons
- `date-fns`: Date formatting and calculations
- `@/types`: TypeScript interfaces
- Tailwind CSS: Styling

## Navigation

The sidebar provides quick access to:
- Dashboard (current)
- My Project
- Team
- Mentors
- Resources
- Challenges
- Settings

Top navigation includes:
- Search functionality
- Notification bell with counter
- User profile dropdown
