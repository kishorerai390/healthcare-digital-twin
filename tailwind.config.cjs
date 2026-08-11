module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        navy: '#050814',
        cyan: '#2ee6f7',
        teal: '#06b6d4'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'ui-monospace', 'monospace']
      }
    }
  },
  plugins: [],
}
