<script setup lang="ts">
/*
 * @Author: kanoqwq
 * @Email: kanoqwq@qq.com
 * @Date: 2023-04-17 14:47:15
 * @Last Modified by: kanoqwq
 * @Last Modified time: 2024-10-29 20:49:15
 * @Description: Description
 */
import { ref, onMounted, watch, computed } from 'vue';
import Search from './components/Search.vue';
// iconfont
import '@/assets/js/iconfont.js';
import Live2D from '@/components/Live2D/index.vue';
import useStore from './store';

const Configs = useStore.Configs();
let bg = ref<HTMLDivElement>();
const mask = ref<HTMLDivElement>();

const background = computed(() => Configs.getBackgroundImage(-1));

watch(background, () => {
  if (bg.value) {
    bg.value.style.backgroundImage = `url(${background.value})`;
  }
});

//挂载完毕后添加背景
onMounted(() => {
  if (bg.value) {
    bg.value.style.backgroundImage = `url(${background.value})`;
  }
});

const onBlur = () => {
  mask.value && mask.value.classList.remove('kano-blur');
  bg.value && bg.value.classList.remove('kano-scale');
};
const onFocus = () => {
  mask.value && mask.value.classList.add('kano-blur');
  bg.value && bg.value.classList.add('kano-scale');
};
</script>
<template>
  <div class="main">
    <div class="mask" ref="mask"></div>
    <div class="bg" ref="bg"></div>
    <Search @blur="onBlur" @focus="onFocus" />
    <Live2D />
  </div>
</template>

<style scoped lang="less">
.kano-blur {
  backdrop-filter: blur(10px);
}
.kano-scale {
  transform: scale(1.1);
}
.main {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  .bg {
    position: absolute;
    z-index: 1;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    transition: transform 0.5s;
  }

  .mask {
    position: absolute;
    z-index: 2;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    transition: backdrop-filter 0.3s;
  }
}
</style>
