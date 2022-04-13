<template>
  <el-icon :class="iconClass()">
    <component :is="icons[name]"/>
  </el-icon>
</template>

<script setup>
import * as icons from '@element-plus/icons-vue'

const props = defineProps({
  name: String,
  class: String,
})

const iconClass = () => {
  return props.class
}
</script>

<style scoped>

</style>
