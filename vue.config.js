module.exports = {
  publicPath: './',
  configureWebpack: {
    externals: {
      'pixi.js': 'PIXI',
      zepto: 'Zepto',
      gsap: 'TweenMax'
    }
  },
  productionSourceMap: false,
  devServer: {
    hot: false
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/scss/mixins.scss";
        @import "@/scss/_typo.scss";`
      }
    }
  }
}