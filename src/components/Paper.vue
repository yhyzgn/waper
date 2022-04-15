<template>
  <div class="dv-paper-container">
    <el-image
        fit="contain"
        :lazy="true"
        :src="src"/>
  </div>
</template>

<script setup>
defineProps({
  src: String
})
</script>

<style scoped lang="scss">
.dv-paper-container {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
}
</style>
