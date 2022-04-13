<template>
  <el-config-provider :locale="zhCn">
    <router-view/>
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'</script>

<style lang="scss">
* {
  box-sizing: inherit;
  padding: 0;
  margin: 0;
}

// 自定义进度条颜色
#nprogress .bar {
  background: $primaryColor !important; //自定义颜色
}

body {
  margin: 0;
  box-sizing: border-box;
  background-color: $primaryBgColor;

  #app {
    position: relative;
    font-family: Consolas, 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
}
</style>
