module.exports = {
  loader: 'postcss-loader',
  plugins: {
    /*
    stage共分为5个阶段，分别是：
      stage-0 非官方草案
      stage-1 编辑草案或早期工作草案
      stage-2 工作草案
      stage-3 候选版本
      stage-4 推荐标准
     */
    'postcss-preset-env': {stage: 4}
  }
}
