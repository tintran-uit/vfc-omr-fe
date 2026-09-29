export type FirebaseWebConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

function envValue(key: keyof ImportMetaEnv): string {
  return String(import.meta.env[key] ?? '').trim()
}

export function getFirebaseWebConfig(): FirebaseWebConfig {
  return {
    apiKey: envValue('VITE_FIREBASE_API_KEY'),
    authDomain: envValue('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: envValue('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: envValue('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: envValue('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: envValue('VITE_FIREBASE_APP_ID'),
  }
}

export function getFirebaseVapidKey(): string {
  return envValue('VITE_FIREBASE_VAPID_KEY')
}

export function isFirebaseConfigured(): boolean {
  const config = getFirebaseWebConfig()
  return Boolean(
    config.apiKey &&
      config.projectId &&
      config.messagingSenderId &&
      config.appId &&
      getFirebaseVapidKey()
  )
}
