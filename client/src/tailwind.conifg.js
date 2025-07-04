// tailwind.config.js
module.exports = {
  mode: 'jit',
  theme: {
    extend: {
      flex: {
        // enable flex-1, flex-2, … flex-9, etc.
        '9': '9 1 0%',
        '1': '1 1 0%'
      }
    }
  }
}
