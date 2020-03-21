module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-px-to-viewport": {
      viewportWidth: 375,//视窗宽度，对应设计稿的宽度
      viewporHeight: 667,//视窗高度，对应设计稿的高度（可以不配置）
      unitPrecision: 5,//指定像素转换的视窗单位的小数位数（有时候无法整除）
      viewPortUnit: 'vw',
      selectorBlackList: ['ignore','tab-bar'],//指定不需要转化的类
      minPixeValue: 1,//小于或者等于‘1px’不转化视窗单位
      mediaQuery: false, //允许媒体查询中转换'px'
      exclude: [/TabBar/]//这个是正则，匹配文件的
    },
  }
}
