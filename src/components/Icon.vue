<template>
  <el-icon :class="iconClass()" :size="iconSize()">
    <component :is="icons[name]"/>
  </el-icon>
</template>

<script setup>
import * as icons from '@element-plus/icons-vue'

const props = defineProps({
  name: String,
  class: String,
  size: Number
})

const iconClass = () => {
  return props.class
}

const iconSize = () => {
  return props.size || 16
}
</script>

<style scoped>

</style>
