const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    hot: true,
  },
  configureWebpack: {
    watchOptions: {
      poll: true,
    },
  },
  transpileDependencies: true
})
