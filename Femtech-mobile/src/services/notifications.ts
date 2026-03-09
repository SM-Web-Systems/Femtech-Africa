import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/client';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushNotificationState {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
}

class NotificationService {
  private expoPushToken: string | null = null;

  async registerForPushNotifications(): Promise<string | null> {
    let token: string | null = null;

    // Must be a physical device
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return null;
    }

    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }

    // Get Expo push token
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      if (!projectId) {
        console.error('Project ID not found');
        return null;
      }
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      token = tokenData.data;
      this.expoPushToken = token;

      // Store locally
      await SecureStore.setItemAsync('push_token', token);

      // Register with backend
      await this.registerTokenWithBackend(token);

      console.log('Push token registered:', token);
    } catch (error) {
      console.error('Error getting push token:', error);
    }

    // Android-specific channel setup
    if (Platform.OS === 'android') {
      await this.setupAndroidChannels();
    }

    return token;
  }

  private async setupAndroidChannels() {
    // Main notifications channel
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E91E63',
    });

    // Appointment reminders
    await Notifications.setNotificationChannelAsync('appointments', {
      name: 'Appointment Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E91E63',
      sound: 'default',
    });

    // Health alerts (high priority)
    await Notifications.setNotificationChannelAsync('health', {
      name: 'Health Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: '#FF5252',
      sound: 'default',
    });

    // Milestones & rewards
    await Notifications.setNotificationChannelAsync('milestones', {
      name: 'Milestones & Rewards',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#4CAF50',
    });

    // Daily tips
    await Notifications.setNotificationChannelAsync('tips', {
      name: 'Daily Health Tips',
      importance: Notifications.AndroidImportance.LOW,
    });
  }

  private async registerTokenWithBackend(token: string) {
    try {
      await apiClient.post('/notifications/register', {
        pushToken: token,
        platform: Platform.OS,
        deviceName: Device.deviceName,
      });
    } catch (error) {
      console.error('Failed to register token with backend:', error);
    }
  }

  async unregisterPushToken() {
    try {
      const token = await SecureStore.getItemAsync('push_token');
      if (token) {
        await apiClient.post('/notifications/unregister', { pushToken: token });
        await SecureStore.deleteItemAsync('push_token');
      }
      this.expoPushToken = null;
    } catch (error) {
      console.error('Failed to unregister push token:', error);
    }
  }

  // Schedule a local notification with time interval trigger
  async scheduleLocalNotification(
    title: string,
    body: string,
    seconds: number,
    data?: Record<string, any>,
    channelId: string = 'default',
    repeats: boolean = false
  ): Promise<string> {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        ...(Platform.OS === 'android' && { channelId }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
        repeats,
      },
    });
    return id;
  }

  // Schedule notification at specific date
  async scheduleNotificationAtDate(
    title: string,
    body: string,
    date: Date,
    data?: Record<string, any>,
    channelId: string = 'default'
  ): Promise<string> {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        ...(Platform.OS === 'android' && { channelId }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    });
    return id;
  }

  // Schedule appointment reminder
  async scheduleAppointmentReminder(
    appointmentId: string,
    title: string,
    appointmentTime: Date,
    reminderMinutesBefore: number = 60
  ): Promise<string> {
    const triggerTime = new Date(appointmentTime.getTime() - reminderMinutesBefore * 60 * 1000);
    const now = new Date();
    
    // Don't schedule if time has passed
    if (triggerTime <= now) {
      console.log('Appointment reminder time has passed');
      return '';
    }

    // Calculate seconds from now
    const secondsFromNow = Math.floor((triggerTime.getTime() - now.getTime()) / 1000);

    return this.scheduleLocalNotification(
      '📅 Appointment Reminder',
      title,
      secondsFromNow,
      { type: 'appointment', appointmentId },
      'appointments',
      false
    );
  }

  // Schedule daily health tip (using calendar trigger for daily repeats)
  async scheduleDailyTip(hour: number = 9, minute: number = 0): Promise<string> {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💡 Daily Health Tip',
        body: 'Tap to get your personalized health tip for today!',
        data: { type: 'daily_tip' },
        sound: true,
        ...(Platform.OS === 'android' && { channelId: 'tips' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats: true,
      },
    });
    return id;
  }

  // Schedule notification after delay (in seconds)
  async scheduleDelayedNotification(
    title: string,
    body: string,
    delaySeconds: number,
    data?: Record<string, any>,
    channelId: string = 'default'
  ): Promise<string> {
    return this.scheduleLocalNotification(
      title,
      body,
      delaySeconds,
      data,
      channelId,
      false
    );
  }

  // Send immediate notification (no delay)
  async sendImmediateNotification(
    title: string,
    body: string,
    data?: Record<string, any>,
    channelId: string = 'default'
  ): Promise<string> {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        ...(Platform.OS === 'android' && { channelId }),
      },
      trigger: null, // null trigger = immediate
    });
    return id;
  }

  // Cancel a scheduled notification
  async cancelNotification(notificationId: string) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Get all scheduled notifications
  async getScheduledNotifications() {
    return Notifications.getAllScheduledNotificationsAsync();
  }

  // Set badge count
  async setBadgeCount(count: number) {
    await Notifications.setBadgeCountAsync(count);
  }

  // Clear badge
  async clearBadge() {
    await Notifications.setBadgeCountAsync(0);
  }

  getToken(): string | null {
    return this.expoPushToken;
  }
}

export const notificationService = new NotificationService();

// Notification response handler type
export type NotificationResponseHandler = (
  response: Notifications.NotificationResponse
) => void;
