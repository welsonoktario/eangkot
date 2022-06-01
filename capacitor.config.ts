import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.eangkot.com",
  appName: "eAngkot",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    cleartext: true,
  },
};

export default config;
