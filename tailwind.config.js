/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: { fontFamily: { display: ['Space Grotesk','Inter','ui-sans-serif','system-ui'], body: ['Inter','Noto Sans Sinhala','ui-sans-serif','system-ui'] } } },
  plugins: []
};
