import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.eangkot.app',
  appName: 'eAngkot',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    cleartext: true,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
}

export default config
