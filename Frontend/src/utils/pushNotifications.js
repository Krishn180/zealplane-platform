import axios from 'axios';

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Converts a base64 string to a Uint8Array for VAPID applicationServerKey
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if the browser supports push notifications
 */
export function isPushNotificationSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/**
 * Register Service Worker and subscribe user to push notifications
 * @param {Object} metadata - Optional context { topic, franchise, slug }
 */
export async function subscribeToPushNotifications(metadata = {}) {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications are not supported in this browser.');
  }

  // 1. Request user permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  // 2. Register Service Worker
  const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  await navigator.serviceWorker.ready;

  // 3. Get Public VAPID Key from Backend
  const keyResponse = await axios.get(`${API_BASE_URL}/notification/vapid-key`);
  const publicKey = keyResponse.data.publicKey;

  if (!publicKey) {
    throw new Error('VAPID public key not available from server.');
  }

  // 4. Subscribe with PushManager
  const applicationServerKey = urlBase64ToUint8Array(publicKey);
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  });

  // 5. Send subscription to Backend with topic/franchise context
  await axios.post(`${API_BASE_URL}/notification/subscribe`, {
    subscription: subscription.toJSON(),
    topic: metadata.topic || 'general',
    franchise: metadata.franchise || '',
    articleSlug: metadata.slug || ''
  });

  // Store subscription flag in localStorage
  localStorage.setItem('zp_push_subscribed', 'true');
  localStorage.setItem('zp_push_prompt_dismissed', 'true');

  return true;
}

/**
 * Check if the user is already subscribed
 */
export async function isUserSubscribed() {
  if (!isPushNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    const registration = await navigator.serviceWorker.getRegistration('/sw.js');
    if (!registration) return false;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch (err) {
    return false;
  }
}
