'use strict'
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: '@import "~common/scss/variables.scss";@import "~common/scss/mixins.scss";'
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('common', resolve('src/common'))
      .set('component', resolve('src/component'))
      .set('pages', resolve('src/pages'))
      .set('store', resolve('src/store'))
      .set('router', resolve('src/router'))
    config.module.rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10240 }))
  }
}
