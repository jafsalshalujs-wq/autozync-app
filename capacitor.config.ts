import type { CapacitorConfig } from '@capacitor/cli'

const hostedAppUrl = process.env.CAPACITOR_SERVER_URL

const config: CapacitorConfig = {
  appId: 'com.autozync.app',
  appName: 'AutoZync',
  webDir: 'capacitor-web',
  server: hostedAppUrl
    ? {
        url: hostedAppUrl,
        cleartext: false,
      }
    : undefined,
}

export default config
