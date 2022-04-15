<template>
  <el-config-provider :locale="zhCn">
    <router-view/>
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import {ipcRenderer} from 'electron'
import {toast} from '@/toast'
import {useSettings} from '@/store'

// 加载配置文件信息
const storeSettings = useSettings()
console.log('Settings loaded: ', storeSettings.settings)

ipcRenderer.on('error', (e, arg) => {
  toast.error(arg)
})
</script>
<style lang="scss">
* {
  box-sizing: inherit;
  padding: 0;
  margin: 0;
  // scroll-behavior: smooth;
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

  .no-select {
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
  }
}

/* 滚动条整体样式 */
::-webkit-scrollbar {
  width: 8px; /* 竖向滚动条的宽度 */
  height: 8px; /* 横向滚动条的高度 */
}

/* 滚动条轨道的样式 */
::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 2px;
}

/* 滚动条里面的小方块 */
::-webkit-scrollbar-thumb {
  background: $primaryAccent;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: $primaryColor;
}

::-webkit-scrollbar-corner {
  background: $blackAlphaColor;
}
</style>

<style scoped lang="scss">
::v-deep(.el-input__suffix) {
  right: 0;
}

::v-deep(.el-input__suffix-inner) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
