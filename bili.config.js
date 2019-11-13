'use strict'

const vue = require('rollup-plugin-vue')

module.exports = {
  dir: 'docs',
  js: 'buble',
  input: 'src/Index.vue',
  format: [ 'es', 'cjs', 'umd' ],
  plugins: [
    vue({
      css: false,
      style: { trim: false }
    })
  ]
}
