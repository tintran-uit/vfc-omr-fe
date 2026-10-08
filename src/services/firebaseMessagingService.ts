import { getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
  type Messaging,
} from 'firebase/messaging'
import {
  getFirebaseVapidKey,
  getFirebaseWebConfig,
  isFirebaseConfigured,
  type FirebaseWebConfig,
} from '@/config/firebaseConfig'
import apiClient from '@/services/apiClient'

const TOKEN_STORAGE_KEY = 'fcm_web_token'

export type PushPermission = NotificationPermission | 'unsupported'

export type PushSetupStatus =
  | 'unsupported'
  | 'not-configured'
  | 'denied'
  | 'default'
  | 'granted'

export type PushTokenPayload = {
  token: string
  platform: 'web'
}

export type PushSetupResult = {
  status: PushSetupStatus
  token: string | null
}

type ForegroundHandler = (payload: MessagePayload) => void

let messaging: Messaging | null = null
let foregroundBound = false
const foregroundHandlers = new Set<ForegroundHandler>()

export function isWebPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

export function getPushPermission(): PushPermission {
  if (!isWebPushSupported()) return 'unsupported'
  return Notification.permission
}

export async function savePushToken(payload: PushTokenPayload): Promise<void> {
  await apiClient.post(
    '/notifications/tokens',
    {
      device_token: payload.token,
      device_type: payload.platform,
    },
    false
  )
}

export function onForegroundMessage(handler: ForegroundHandler): () => void {
  foregroundHandlers.add(handler)
  return () => foregroundHandlers.delete(handler)
}

export async function enableWebPush(): Promise<PushSetupResult> {
  const supported = await browserSupportsFcm()
  if (!supported) return { status: 'unsupported', token: null }
  if (!isFirebaseConfigured()) return { status: 'not-configured', token: null }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    return { status: permission, token: null }
  }

  return registerGrantedToken()
}

export async function syncWebPushIfGranted(): Promise<PushSetupResult> {
  const supported = await browserSupportsFcm()
  if (!supported) return { status: 'unsupported', token: null }
  if (!isFirebaseConfigured()) return { status: 'not-configured', token: null }
  if (Notification.permission !== 'granted') {
    return { status: Notification.permission, token: null }
  }

  return registerGrantedToken()
}

/** Ask when permission is still default. Refresh the token when it is already granted. */
export async function ensureWebPush(): Promise<PushSetupResult> {
  if (typeof Notification === 'undefined') return { status: 'unsupported', token: null }
  if (Notification.permission === 'denied') return { status: 'denied', token: null }
  if (Notification.permission === 'granted') return syncWebPushIfGranted()
  return enableWebPush()
}

async function browserSupportsFcm(): Promise<boolean> {
  if (!isWebPushSupported()) return false
  try {
    return await isSupported()
  } catch {
    return false
  }
}

async function registerGrantedToken(): Promise<PushSetupResult> {
  try {
    const token = await fetchFcmToken()
    if (!token) return { status: 'granted', token: null }

    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    await savePushToken({ token, platform: 'web' })

    bindForegroundMessages()
    return { status: 'granted', token }
  } catch (error) {
    console.warn('Firebase messaging setup failed', error)
    return { status: 'granted', token: null }
  }
}

async function fetchFcmToken(): Promise<string | null> {
  const app = ensureFirebaseApp()
  const swRegistration = await registerMessagingWorker(getFirebaseWebConfig())
  messaging = getMessaging(app)

  const token = await getToken(messaging, {
    vapidKey: getFirebaseVapidKey(),
    serviceWorkerRegistration: swRegistration,
  })

  return token || null
}

function ensureFirebaseApp(): FirebaseApp {
  const existing = getApps()[0]
  if (existing) return existing
  return initializeApp(getFirebaseWebConfig())
}

async function registerMessagingWorker(config: FirebaseWebConfig): Promise<ServiceWorkerRegistration> {
  const params = new URLSearchParams({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  })

  const registration = await navigator.serviceWorker.register(
    `/firebase-messaging-sw.js?${params.toString()}`,
    { scope: '/' }
  )
  await navigator.serviceWorker.ready
  return registration
}

function bindForegroundMessages() {
  if (!messaging || foregroundBound) return
  foregroundBound = true

  onMessage(messaging, (payload) => {
    foregroundHandlers.forEach((handler) => handler(payload))
    showForegroundNotification(payload)
  })
}

function showForegroundNotification(payload: MessagePayload) {
  const notification = payload.notification
  if (!notification || Notification.permission !== 'granted') return

  const title = notification.title || 'Notification'
  try {
    new Notification(title, {
      body: notification.body || '',
      icon: notification.icon || '/favicon-32x32.png',
      data: payload.data,
    })
  } catch {
    // Some browsers only allow the service worker to display notifications.
  }
}
