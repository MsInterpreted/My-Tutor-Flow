import { app } from '../firebaseConfig';

let messaging = null;

// Lazy-load Firebase messaging (only when needed)
async function getMessagingInstance() {
  if (messaging) return messaging;
  try {
    const { getMessaging, isSupported } = await import('firebase/messaging');
    const supported = await isSupported();
    if (!supported) {
      console.warn('Firebase Messaging is not supported in this browser');
      return null;
    }
    messaging = getMessaging(app);
    return messaging;
  } catch (err) {
    console.warn('Failed to initialize Firebase Messaging:', err.message);
    return null;
  }
}

class PushNotificationService {
  constructor() {
    this.token = null;
    this.onMessageCallback = null;
  }

  // Check if push notifications are supported
  isSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Get current permission status
  getPermissionStatus() {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission; // 'granted', 'denied', 'default'
  }

  // Request notification permission and get FCM token
  async requestPermission() {
    if (!this.isSupported()) {
      return { granted: false, reason: 'unsupported' };
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { granted: false, reason: 'denied' };
      }

      const token = await this.getToken();
      return { granted: true, token };
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return { granted: false, reason: err.message };
    }
  }

  // Get FCM token
  async getToken() {
    try {
      const msg = await getMessagingInstance();
      if (!msg) return null;

      const { getToken } = await import('firebase/messaging');
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

      const token = await getToken(msg, {
        vapidKey: vapidKey || undefined,
      });

      if (token) {
        this.token = token;
        // Store token for the current user
        await this.saveTokenToFirestore(token);
        return token;
      }
      return null;
    } catch (err) {
      console.error('Error getting FCM token:', err);
      return null;
    }
  }

  // Save FCM token to Firestore for the current user
  async saveTokenToFirestore(token) {
    try {
      const { getAuth } = await import('firebase/auth');
      const { getFirestore, doc, setDoc, arrayUnion } = await import('firebase/firestore');
      const auth = getAuth();
      const db = getFirestore();

      if (auth.currentUser) {
        await setDoc(
          doc(db, 'users', auth.currentUser.uid),
          {
            fcmTokens: arrayUnion(token),
            lastTokenUpdate: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error('Error saving FCM token:', err);
    }
  }

  // Listen to foreground messages
  async onForegroundMessage(callback) {
    try {
      const msg = await getMessagingInstance();
      if (!msg) return null;

      const { onMessage } = await import('firebase/messaging');
      this.onMessageCallback = callback;

      return onMessage(msg, (payload) => {
        const { title, body, icon } = payload.notification || {};
        const data = payload.data || {};

        if (callback) {
          callback({
            title: title || 'New Notification',
            body: body || '',
            icon,
            data,
          });
        }
      });
    } catch (err) {
      console.error('Error setting up foreground message listener:', err);
      return null;
    }
  }

  // Show a local notification (for foreground messages)
  showLocalNotification(title, body, options = {}) {
    if (Notification.permission !== 'granted') return;

    const notification = new Notification(title, {
      body,
      icon: '/assets/logos/tdla-icon.png',
      badge: '/assets/logos/tdla-icon.png',
      tag: options.tag || 'tdla-notification',
      data: options.data,
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      if (options.onClick) options.onClick();
      notification.close();
    };

    return notification;
  }

  // Get notification preferences from localStorage
  getPreferences() {
    try {
      const prefs = localStorage.getItem('tdla_notification_prefs');
      return prefs ? JSON.parse(prefs) : {
        sessionReminders: true,
        overdueInvoices: true,
        attendanceUpdates: true,
        enabled: true,
      };
    } catch {
      return {
        sessionReminders: true,
        overdueInvoices: true,
        attendanceUpdates: true,
        enabled: true,
      };
    }
  }

  // Save notification preferences
  savePreferences(prefs) {
    try {
      localStorage.setItem('tdla_notification_prefs', JSON.stringify(prefs));
    } catch (err) {
      console.error('Error saving notification preferences:', err);
    }
  }
}

const pushNotificationService = new PushNotificationService();
export default pushNotificationService;
