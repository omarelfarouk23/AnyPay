import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type PushNotificationConfig = {
  onForeground?: (notification: Notifications.Notification) => void;
  onBackground?: (notification: Notifications.Notification) => void;
  onTap?: (notification: Notifications.Notification) => void;
};

class PushNotificationService {
  private onForeground?: PushNotificationConfig['onForeground'];
  private onBackground?: PushNotificationConfig['onBackground'];
  private onTap?: PushNotificationConfig['onTap'];
  private foregroundSub?: Notifications.Subscription;
  private responseSub?: Notifications.Subscription;

  constructor() {}

  configure(config: PushNotificationConfig): void {
    this.onForeground = config.onForeground;
    this.onBackground = config.onBackground;
    this.onTap = config.onTap;

    Notifications.setNotificationHandler({
      handleNotification: async () => {
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        } as Notifications.NotificationBehavior;
      },
    });

    this.foregroundSub = Notifications.addNotificationReceivedListener(
      this.handleForegroundNotification,
    );
    this.responseSub = Notifications.addNotificationResponseReceivedListener(
      this.handleNotificationResponse,
    );
  }

  private handleForegroundNotification = (notification: Notifications.Notification) => {
    if (this.onForeground) this.onForeground(notification);
  };

  private handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    if (this.onTap) this.onTap(response.notification);
  };

  async requestPermissions(): Promise<boolean> {
  const existing = (await Notifications.getPermissionsAsync()) as any;
  if (existing?.granted || existing?.status === 'granted') {
    return true;
  }
  const res = (await Notifications.requestPermissionsAsync()) as any;
  return Boolean(res?.granted || res?.status === 'granted');
}

  async getDevicePushToken(): Promise<string | null> {
    if (!(await this.requestPermissions())) {
      return null;
    }
    try {
      const { data } = await Notifications.getDevicePushTokenAsync();
      return data;
    } catch (error) {
      console.error('[PushNotification] Error getting push token:', error);
      return null;
    }
  }

async scheduleLocalNotification(
    title: string,
    body: string,
    triggerSeconds?: number,
  ): Promise<string | null> {
    const notificationId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const trigger: any = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: triggerSeconds && triggerSeconds > 0 ? triggerSeconds : 1,
      repeats: false,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority:
          Platform.OS === 'android'
            ? Notifications.AndroidNotificationPriority.HIGH
            : undefined,
      },
      trigger,
    });
    return notificationId;
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  addForegroundListener(
    callback: (notification: Notifications.Notification) => void,
  ): void {
    this.foregroundSub = Notifications.addNotificationReceivedListener(callback);
  }

  addResponseListener(
    callback: (response: Notifications.NotificationResponse) => void,
  ): void {
    this.responseSub = Notifications.addNotificationResponseReceivedListener(callback);
  }

  removeAllListeners(): void {
    this.foregroundSub?.remove();
    this.responseSub?.remove();
  }
}

export const pushNotificationService = new PushNotificationService();
export default pushNotificationService;