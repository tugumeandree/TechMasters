import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/lib/models/Notification';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const read = searchParams.get('read');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Build query
    const query: any = { userId };
    if (read !== null && read !== undefined) {
      query.read = read === 'true';
    }
    if (type) query.type = type;

    // Get notifications
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    // Get unread count
    const unreadCount = await Notification.countDocuments({
      userId,
      read: false
    });

    return NextResponse.json({
      notifications,
      unreadCount,
      count: notifications.length
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      userId,
      type,
      title,
      message,
      actionLabel,
      actionUrl,
      metadata
    } = body;

    // Validation
    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create notification
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      actionLabel,
      actionUrl,
      metadata,
      read: false
    });

    return NextResponse.json(
      { notification, message: 'Notification created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { notificationId, notificationIds, userId, read } = body;

    if (notificationId) {
      // Mark single notification as read/unread
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { read },
        { new: true }
      );

      if (!notification) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        notification,
        message: 'Notification updated successfully'
      });
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark multiple notifications
      await Notification.updateMany(
        { _id: { $in: notificationIds } },
        { read }
      );

      return NextResponse.json({
        message: `${notificationIds.length} notifications updated successfully`
      });
    } else if (userId) {
      // Mark all notifications for user
      const result = await Notification.updateMany(
        { userId, read: !read },
        { read }
      );

      return NextResponse.json({
        message: `${result.modifiedCount} notifications updated successfully`,
        modifiedCount: result.modifiedCount
      });
    } else {
      return NextResponse.json(
        { error: 'notificationId, notificationIds, or userId is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
