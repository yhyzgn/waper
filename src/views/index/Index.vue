<template>
  <icon class="el-icon--right" name="ArrowRight" @click="handleClick"/>
</template>

<script setup>
import {toast} from '@/toast'

const handleClick = () => {
  toast.success('阿斯蒂芬')
}
</script>

<style scoped>

</style>
