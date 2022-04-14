<template>
  <div class="dv-header-container">
    <div class="dv-header-content">
      <div class="dv-ops">dv-ops</div>
      <div class="dv-count">dv-count</div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.dv-header-container {
  padding: 40px 16px 12px;
  border-bottom: 1px solid $dividerColor;

  .dv-header-content {
    display: flex;
    flex-direction: row;

    .dv-ops {
      flex: 1;
      display: inline-flex;
    }
  }
}
</style>
