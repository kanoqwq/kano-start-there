<template>
  <div class="toast" :style="{ background: background }">
    <span :style="{ 'font-weight': fontWeight as any, color: color + ' !important' }">{{ value }}</span>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  background: string,
  color: string,
  value: string,
  fontWeight: string
}>()
</script>

<style lang="less" scoped>
@keyframes swipeandscale {
  0% {
    top: -120px;
    opacity: 0;
    font-size: 0;
  }

  50% {
    top: 40px;
  }

  100% {
    top: 20px;
  }
}

.enter {
  animation: swipeandscale .3s cubic-bezier(0.5, 0.59, 0, 1);
}

.leave {
  animation: swipeandscale .3s reverse cubic-bezier(0.5, 0.59, 0, 1);
}

.toast {
  max-width: 400px;
  overflow: hidden;
  position: fixed;
  display: flex;
  z-index: 114514;
  justify-content: center;
  align-items: center;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px;
  color: #000;
  border-radius: 10px;
  background-color: #fff;
  opacity: .85;

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

}
</style>