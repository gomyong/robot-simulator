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
        name: '로보틱스 디자인 스튜디오 (Robotics Studio)',
        short_name: '로보틱스 랩',
        description:
          '전기 기초부터 ESP32, 기구학, 제어, ROS 2, SLAM까지 45일 아이소메트릭 인터랙티브 로보틱스 학습 스튜디오',
        theme_color: '#F6F7F9',
        background_color: '#F6F7F9',
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'katex-vendor': ['katex'],
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
