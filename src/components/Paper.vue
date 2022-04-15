<template>
  <div class="dv-paper-container" @mouseenter="mouseOver = true" @mouseleave="mouseOver = false">
    <el-image
      class="img-paper"
      fit="cover"
      :src="src"
      :scroll-container="scrollContainer">
      <template #placeholder>
        <div class="img-slot">
          <icon name="Loading" :size="24"/>
        </div>
      </template>
      <template #error>
        <div class="img-slot">
          <el-empty :image-size="32" description="加载失败"/>
        </div>
      </template>
    </el-image>

    <transition name="el-zoom-in-top">
      <div class="dv-pp-header" v-show="mouseOver">
        <div class="dv-hd-item">{{ resolution }}</div>
        <div class="dv-hd-item">{{ calcSizeLabel() }}</div>
      </div>
    </transition>

    <div class="dv-pp-footer">
      <icon class="ic-ft-ops-item" name="Star" :size="1"/>
      <icon class="ic-ft-ops-item" name="Download" :size="16"/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  src: String,
  scrollContainer: HTMLElement,
  resolution: String,
  size: Number,
})

const mouseOver = $ref(false)

const calcSizeLabel = () => {
  let sz = props.size
  if (!sz || sz < 0) {
    return '0 B'
  }

  sz /= 1024
  if (sz < 1024) {
    return `${sz.toFixed(2)} KB`
  }

  sz /= 1024
  return `${sz.toFixed(2)} MB`
}
</script>

<style scoped lang="scss">
.dv-paper-container {
  width: 100%;
  position: relative;

  /* display: block 解决了空白边框问题 */
  .img-paper {
    width: 100%;
    aspect-ratio: 16/9;
    display: block;
    vertical-align: middle;

    .img-slot {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  .dv-pp-header {
    position: absolute;
    width: 100%;
    padding: 8px;
    left: 0;
    top: 0;
    z-index: 2;
    color: white;
    background: #00000099;
    display: flex;
    flex-direction: row;
    font-size: .8em;
    justify-content: space-between;
  }

  .dv-pp-footer {
    background: $primaryAccent;
    width: 100%;
    padding: 8px;
    display: flex;
    flex-direction: row;
    font-size: .8em;
    justify-content: space-between;
    color: $fontPrimaryColor;

    .ic-ft-ops-item:hover {
      cursor: pointer;
    }
  }
}

.dv-paper-container:hover {
  box-shadow: $primaryShadow;
}
</style>
