import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: '로보틱스 디자인 랩 (Robotics Lab)',
        short_name: '로보틱스 랩',
        description: 'ESP32 하드웨어 · 2축 기구학 · 초음파 센서 · PID 제어를 3D로 학습하는 인터랙티브 엔지니어링 랩',
        theme_color: '#0B0F17',
        background_color: '#0B0F17',
        display: 'standalone',
        orientation: 'any',
        lang: 'ko',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,json}'],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
});
