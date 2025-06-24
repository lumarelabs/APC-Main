import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '@/app/services/supabase/config';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }

      // Get push token
      if (Platform.OS !== 'web') {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: 'your-expo-project-id', // Replace with your actual project ID
        });
        this.expoPushToken = token.data;
        console.log('Expo push token:', this.expoPushToken);
      }

      // Configure notification channels for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('booking-reminders', {
          name: 'Booking Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#e97d2b',
        });

        await Notifications.setNotificationChannelAsync('booking-updates', {
          name: 'Booking Updates',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#e97d2b',
        });
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  async scheduleBookingReminder(bookingId: string, bookingDate: string, startTime: string, courtName: string) {
    try {
      // Schedule notification 1 hour before booking
      const bookingDateTime = new Date(`${bookingDate}T${startTime}`);
      const reminderTime = new Date(bookingDateTime.getTime() - 60 * 60 * 1000); // 1 hour before

      // Only schedule if reminder time is in the future
      if (reminderTime > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Rezervasyon Hatırlatması',
            body: `${courtName} rezervasyonunuz 1 saat sonra başlayacak!`,
            data: { bookingId, type: 'reminder' },
            sound: true,
          },
          trigger: {
            date: reminderTime,
            channelId: 'booking-reminders',
          },
          identifier: `booking-reminder-${bookingId}`,
        });

        console.log(`Reminder scheduled for booking ${bookingId} at ${reminderTime}`);
      }
    } catch (error) {
      console.error('Error scheduling booking reminder:', error);
    }
  }

  async sendBookingStatusNotification(bookingId: string, status: 'confirmed' | 'canceled', courtName: string) {
    try {
      const title = status === 'confirmed' ? 'Rezervasyon Onaylandı' : 'Rezervasyon İptal Edildi';
      const body = status === 'confirmed' 
        ? `${courtName} rezervasyonunuz onaylandı!`
        : `${courtName} rezervasyonunuz iptal edildi.`;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { bookingId, type: 'status_update', status },
          sound: true,
        },
        trigger: null, // Send immediately
        identifier: `booking-status-${bookingId}-${Date.now()}`,
      });

      console.log(`Status notification sent for booking ${bookingId}: ${status}`);
    } catch (error) {
      console.error('Error sending booking status notification:', error);
    }
  }

  async cancelBookingNotifications(bookingId: string) {
    try {
      // Cancel reminder notification
      await Notifications.cancelScheduledNotificationAsync(`booking-reminder-${bookingId}`);
      console.log(`Cancelled notifications for booking ${bookingId}`);
    } catch (error) {
      console.error('Error cancelling booking notifications:', error);
    }
  }

  async getAllScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Store push token in user profile for server-side notifications
  async storePushToken(userId: string) {
    if (this.expoPushToken) {
      try {
        await supabase
          .from('users')
          .update({ push_token: this.expoPushToken })
          .eq('id', userId);
      } catch (error) {
        console.error('Error storing push token:', error);
      }
    }
  }
}

export const notificationService = NotificationService.getInstance();