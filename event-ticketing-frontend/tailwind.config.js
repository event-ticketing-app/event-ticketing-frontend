module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  // Keep Tailwind's CSS variables (gradients, blur, scale...) but skip its reset,
  // so Angular Material styles stay untouched.
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
