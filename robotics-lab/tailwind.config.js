/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A2540',
          secondary: '#425466',
          muted: '#697386',
        },
        surface: {
          base: '#FFFFFF',
          recessed: '#F7F8FA',
          subtle: '#F1F3F6',
        },
        line: {
          DEFAULT: '#E6E8EC',
          strong: '#D0D5DD',
        },
        accent: {
          DEFAULT: '#635BFF',
          hover: '#5249F5',
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
