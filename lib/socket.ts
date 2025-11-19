import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

type SocketServer = SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

let io: SocketServer | null = null;

export const initializeSocketServer = (httpServer: HTTPServer): SocketServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Join user-specific room
    socket.on('join-user-room', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join cohort room
    socket.on('join-cohort-room', (cohortId: string) => {
      socket.join(`cohort:${cohortId}`);
      console.log(`User joined cohort room: ${cohortId}`);
    });

    // Join team room
    socket.on('join-team-room', (teamId: string) => {
      socket.join(`team:${teamId}`);
      console.log(`User joined team room: ${teamId}`);
    });

    // Leave rooms
    socket.on('leave-room', (room: string) => {
      socket.leave(room);
      console.log(`User left room: ${room}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getSocketServer = (): SocketServer | null => {
  return io;
};

// Event emitters for different types of updates
export const emitNotification = (userId: string, notification: any) => {
  if (!io) return;
  io.to(`user:${userId}`).emit('notification', notification);
};

export const emitActivityUpdate = (teamId: string, activity: any) => {
  if (!io) return;
  io.to(`team:${teamId}`).emit('activity-update', activity);
};

export const emitProjectUpdate = (teamId: string, project: any) => {
  if (!io) return;
  io.to(`team:${teamId}`).emit('project-update', project);
};

export const emitMentorSessionUpdate = (participantId: string, session: any) => {
  if (!io) return;
  io.to(`user:${participantId}`).emit('session-update', session);
};

export const emitStageUpdate = (participantId: string, stageData: any) => {
  if (!io) return;
  io.to(`user:${participantId}`).emit('stage-update', stageData);
};

export const emitCohortAnnouncement = (cohortId: string, announcement: any) => {
  if (!io) return;
  io.to(`cohort:${cohortId}`).emit('announcement', announcement);
};

export const emitGateReviewUpdate = (teamId: string, review: any) => {
  if (!io) return;
  io.to(`team:${teamId}`).emit('gate-review-update', review);
};

export const emitChallengeUpdate = (cohortId: string, challenge: any) => {
  if (!io) return;
  io.to(`cohort:${cohortId}`).emit('challenge-update', challenge);
};

export const emitAchievementUnlocked = (participantId: string, achievement: any) => {
  if (!io) return;
  io.to(`user:${participantId}`).emit('achievement-unlocked', achievement);
};

export const emitLeaderboardUpdate = (cohortId: string, leaderboard: any) => {
  if (!io) return;
  io.to(`cohort:${cohortId}`).emit('leaderboard-update', leaderboard);
};
