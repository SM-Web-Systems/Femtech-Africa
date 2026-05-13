const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();

// Expo Push API endpoint
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

// Register push token
router.post('/register', authenticateToken, async (req, res) => {
  try {
    const { pushToken, platform, deviceName } = req.body;
    const userId = req.user.userId;

    if (!pushToken) {
      return res.status(400).json({ error: 'Push token is required' });
    }

    // Upsert notification record
    await prisma.notification.upsert({
      where: {
        userId_pushToken: {
          userId,
          pushToken,
        },
      },
      update: {
        platform,
        deviceName,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        userId,
        pushToken,
        platform: platform || 'unknown',
        deviceName: deviceName || 'Unknown Device',
        isActive: true,
      },
    });

    console.log(`Push token registered for user ${userId}`);
    res.json({ success: true, message: 'Push token registered' });
  } catch (error) {
    console.error('Error registering push token:', error);
    res.status(500).json({ error: 'Failed to register push token' });
  }
});

// Unregister push token
router.post('/unregister', authenticateToken, async (req, res) => {
  try {
    const { pushToken } = req.body;
    const userId = req.user.userId;

    if (!pushToken) {
      return res.status(400).json({ error: 'Push token is required' });
    }

    await prisma.notification.updateMany({
      where: {
        userId,
        pushToken,
      },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    console.log(`Push token unregistered for user ${userId}`);
    res.json({ success: true, message: 'Push token unregistered' });
  } catch (error) {
    console.error('Error unregistering push token:', error);
    res.status(500).json({ error: 'Failed to unregister push token' });
  }
});

// Get user's notification preferences
router.get('/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      // Create default preferences
      preferences = await prisma.notificationPreference.create({
        data: {
          userId,
          appointments: true,
          milestones: true,
          healthTips: true,
          promotions: false,
          quietHoursStart: '22:00',
          quietHoursEnd: '07:00',
        },
      });
    }

    res.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

// Update notification preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { appointments, milestones, healthTips, promotions, quietHoursStart, quietHoursEnd } = req.body;

    const preferences = await prisma.notificationPreference.upsert({
      where: { userId },
      update: {
        appointments,
        milestones,
        healthTips,
        promotions,
        quietHoursStart,
        quietHoursEnd,
        updatedAt: new Date(),
      },
      create: {
        userId,
        appointments: appointments ?? true,
        milestones: milestones ?? true,
        healthTips: healthTips ?? true,
        promotions: promotions ?? false,
        quietHoursStart: quietHoursStart || '22:00',
        quietHoursEnd: quietHoursEnd || '07:00',
      },
    });

    res.json(preferences);
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update notification preferences' });
  }
});

// Get notification history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 20, offset = 0 } = req.query;

    const notifications = await prisma.notificationLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notification history:', error);
    res.status(500).json({ error: 'Failed to fetch notification history' });
  }
});

// Send push notification (internal helper function)
async function sendPushNotification(pushTokens, title, body, data = {}) {
  const messages = pushTokens.map(token => ({
    to: token,
    sound: 'default',
    title,
    body,
    data,
  }));

  try {
    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    console.log('Push notification sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

// Send notification to specific user (internal API)
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { targetUserId, title, body, data, type } = req.body;
    
    // For now, allow users to send to themselves (for testing)
    // In production, restrict to admin only
    const userId = targetUserId || req.user.userId;

    // Get user's active push tokens
    const tokens = await prisma.notification.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: { pushToken: true },
    });

    if (tokens.length === 0) {
      return res.status(404).json({ error: 'No active push tokens found' });
    }

    const pushTokens = tokens.map(t => t.pushToken);
    await sendPushNotification(pushTokens, title, body, { ...data, type });

    // Log the notification
    await prisma.notificationLog.create({
      data: {
        userId,
        title,
        body,
        type: type || 'general',
        data: data || {},
      },
    });

    res.json({ success: true, message: 'Notification sent', recipients: pushTokens.length });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Test notification endpoint
router.post('/test', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const tokens = await prisma.notification.findMany({
      where: { userId, isActive: true },
      select: { pushToken: true },
    });

    if (tokens.length === 0) {
      return res.status(404).json({ error: 'No push tokens registered. Enable notifications first.' });
    }

    const pushTokens = tokens.map(t => t.pushToken);
    await sendPushNotification(
      pushTokens,
      '🎉 Test Notification',
      'Push notifications are working! You\'ll receive appointment reminders and health tips here.',
      { type: 'test' }
    );

    res.json({ success: true, message: 'Test notification sent!' });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

module.exports = router;
