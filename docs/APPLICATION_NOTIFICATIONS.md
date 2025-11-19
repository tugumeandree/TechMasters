# Application Notification System

## Overview
When applications are submitted through `/apply`, the system automatically:

1. **Saves to database** - Application stored in MongoDB
2. **Sends confirmation email** - Applicant receives confirmation with Application ID
3. **Notifies admins via email** - All admin emails receive new application alert
4. **Creates in-app notifications** - (Optional) Admin dashboard notifications

---

## Setup Instructions

### 1. Email Configuration

#### Option A: Gmail (Recommended for testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Create an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Update .env file**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM=TechMasters <your-email@gmail.com>
ADMIN_EMAILS=admin@techmasters.com,coordinator@techmasters.com
```

#### Option B: SendGrid (Recommended for production)

1. **Create SendGrid account**: https://sendgrid.com
2. **Get API key** from Settings → API Keys
3. **Update email service** to use SendGrid SDK instead of nodemailer

#### Option C: Other SMTP Providers
- **Mailgun**: smtp.mailgun.org (port 587)
- **AWS SES**: email-smtp.region.amazonaws.com (port 587)
- **Outlook**: smtp-mail.outlook.com (port 587)

---

### 2. Admin Email Addresses

Add your admin team emails to `.env`:

```env
ADMIN_EMAILS=admin@techmasters.com,coordinator@techmasters.com,director@techmasters.com
```

These emails will receive notifications when:
- New applications are submitted
- Applications need review
- Important system events occur

---

### 3. Test the System

1. **Start the development server**:
```bash
npm run dev
```

2. **Submit a test application**:
   - Visit: http://localhost:3001/apply
   - Fill out the application form
   - Submit

3. **Check your emails**:
   - Applicant email should receive confirmation
   - Admin emails should receive new application alert

4. **Check the database**:
```bash
# View applications in MongoDB
# Use MongoDB Compass or mongosh CLI
```

---

## Email Templates

### Applicant Confirmation Email
- **Subject**: "Application Received - TechMasters"
- **Content**: Confirmation message with Application ID and tracking link

### Admin Notification Email
- **Subject**: "🔔 New Application Received from [Name]"
- **Content**: Applicant details, project title, review link

### Status Update Email
- **Subject**: "Application Status Update - TechMasters"
- **Content**: Status change (Accepted/Rejected/Interview) with feedback

---

## API Endpoints

### Submit Application
```bash
POST /api/applications
Content-Type: application/json

{
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    ...
  },
  "projectIdea": { ... },
  "skillsAssessment": { ... },
  "teamPreferences": { ... }
}
```

### Get All Applications (Admin)
```bash
GET /api/applications?status=pending&page=1&limit=20
```

### Get Single Application
```bash
GET /api/applications/[applicationId]
```

### Update Application Status (Admin)
```bash
PATCH /api/applications
Content-Type: application/json

{
  "applicationId": "...",
  "status": "accepted",
  "reviewNotes": "Great project idea!",
  "score": {
    "innovation": 9,
    "feasibility": 8,
    "teamFit": 9,
    "commitment": 10
  }
}
```

---

## Real-Time Notifications (Optional)

For instant notifications without refreshing:

### 1. Set up Socket.IO server
```bash
# Already installed: socket.io, socket.io-client
```

### 2. Create server instance
```typescript
// server/socket.ts
import { Server } from 'socket.io';

export function initSocket(server: any) {
  const io = new Server(server);
  
  io.on('connection', (socket) => {
    console.log('Admin connected:', socket.id);
    
    socket.on('join-admin', () => {
      socket.join('admin-room');
    });
  });
  
  return io;
}

// Emit when new application arrives
io.to('admin-room').emit('new-application', applicationData);
```

### 3. Connect from admin dashboard
```typescript
// In admin dashboard component
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

useEffect(() => {
  socket.emit('join-admin');
  
  socket.on('new-application', (data) => {
    // Show toast notification
    // Play sound
    // Update application list
  });
  
  return () => socket.disconnect();
}, []);
```

---

## Monitoring & Logs

### Check Email Delivery
- Monitor console for: "Email sent: [messageId]"
- Check spam folders if emails don't arrive
- Verify SMTP credentials are correct

### Database Checks
```javascript
// Check recent applications
db.applications.find().sort({ submittedAt: -1 }).limit(5)

// Check pending applications
db.applications.countDocuments({ status: 'pending' })

// Check applications by date
db.applications.find({
  submittedAt: { $gte: new Date('2025-01-01') }
})
```

---

## Troubleshooting

### Email Not Sending
1. **Check SMTP credentials** in .env file
2. **Enable "Less secure app access"** (Gmail)
3. **Check firewall** - Port 587 must be open
4. **Review logs** - Check console for error messages

### Admin Not Receiving Emails
1. **Verify ADMIN_EMAILS** in .env
2. **Check spam folder**
3. **Test with personal email** first
4. **Check email provider limits** (Gmail: 500/day)

### Application Not Saving
1. **Check MongoDB connection** - MONGODB_URI in .env
2. **Review validation errors** - Check required fields
3. **Check console logs** - API errors will be logged

---

## Production Checklist

- [ ] Use production SMTP service (SendGrid, AWS SES, Mailgun)
- [ ] Set up email domain authentication (SPF, DKIM, DMARC)
- [ ] Configure rate limiting on API endpoints
- [ ] Add CAPTCHA to prevent spam applications
- [ ] Set up email delivery monitoring (SendGrid webhooks)
- [ ] Create email templates in external service
- [ ] Add email queue for bulk notifications (Bull, BullMQ)
- [ ] Set up admin notification preferences
- [ ] Add Slack/Discord webhook integration
- [ ] Configure backup notification channels

---

## Next Steps

1. **Test the system** with real email addresses
2. **Customize email templates** in `lib/email.ts`
3. **Add Slack notifications** for immediate alerts
4. **Build admin dashboard** to view applications
5. **Add SMS notifications** for urgent alerts (Twilio)
6. **Set up email analytics** to track open rates

---

## Questions?

The system is ready to receive applications! Just configure your email settings and you'll start receiving notifications immediately when someone applies.
