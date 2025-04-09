
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.deepakjain',
  appName: 'DEEPAK P JAIN',
  webDir: 'dist',
  server: {
    url: "https://0ac36a51-db48-484e-aef8-70ddeadb5d73.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  android: {
    backgroundColor: "#ffffff"
  }
};

export default config;
