import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { notificationService } from '../services/notifications';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  registerForNotifications: () => Promise<void>;
  unregisterNotifications: () => Promise<void>;
  scheduleAppointmentReminder: (id: string, title: string, time: Date) => Promise<string>;
  cancelNotification: (id: string) => Promise<void>;
  clearBadge: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const navigation = useNavigation<any>();
  const { user } = useAuth(); // Use 'user' to check if authenticated

  useEffect(() => {
    // Register for notifications when user is authenticated
    if (user) {
      registerForNotifications();
    }

    // Listen for incoming notifications (foreground)
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
        console.log('Notification received:', notification);
      }
    );

    // Listen for notification interactions
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        handleNotificationResponse(response);
      }
    );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [user]);

  const registerForNotifications = async () => {
    const token = await notificationService.registerForPushNotifications();
    if (token) {
      setExpoPushToken(token);
    }
  };

  const unregisterNotifications = async () => {
    await notificationService.unregisterPushToken();
    setExpoPushToken(null);
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;
    console.log('Notification tapped:', data);

    // Navigate based on notification type
    switch (data?.type) {
      case 'appointment':
        navigation.navigate('Home');
        break;
      case 'milestone':
        navigation.navigate('Milestones');
        break;
      case 'health_alert':
        navigation.navigate('RiskAssessment');
        break;
      case 'daily_tip':
        navigation.navigate('MamaAI');
        break;
      case 'chat':
        navigation.navigate('MamaAI');
        break;
      default:
        navigation.navigate('Home');
    }
  };

  const scheduleAppointmentReminder = async (id: string, title: string, time: Date) => {
    return notificationService.scheduleAppointmentReminder(id, title, time);
  };

  const cancelNotification = async (id: string) => {
    await notificationService.cancelNotification(id);
  };

  const clearBadge = async () => {
    await notificationService.clearBadge();
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        registerForNotifications,
        unregisterNotifications,
        scheduleAppointmentReminder,
        cancelNotification,
        clearBadge,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
