import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.alirezagoodarzi.voicegym',
  appName: 'VoiceGym',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#2D6A4F',
      showSpinner: false,
    }
  }
}

export default config
