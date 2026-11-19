/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lab: {
          bg: '#0B0F17',
          surface: '#111827',
          elevated: '#161F30',
          border: '#1E293B',
          borderStrong: '#334155',
          cyan: '#38BDF8',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444',
          violet: '#8B5CF6',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'SF Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};
