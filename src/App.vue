<script setup lang="ts">
/*
 * @Author: kanoqwq
 * @Email: kanoqwq@qq.com
 * @Date: 2023-04-17 14:47:15
 * @Last Modified by: minikano
 * @Last Modified time: 2024-11-28 08:28:35
 * @Description: Description
 */
import { ref, onMounted, watch, computed } from "vue";
import Search from "./components/Search.vue";
// iconfont
import "@/assets/js/iconfont.js";
import Live2D from "@/components/Live2D/index.vue";
import useStore from "./store";

const Configs = useStore.Configs();
const bg = ref<HTMLDivElement>();
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
  mask.value?.classList.remove("kano-blur");
  bg.value?.classList.remove("kano-scale");
};
const onFocus = () => {
  mask.value?.classList.add("kano-blur");
  bg.value?.classList.add("kano-scale");
};

const search = ref()
const mainClick = (e: MouseEvent) => {
  //capture mask element
  if (e.target === mask.value) {
    console.log(search.value.blur(e));
    // onBlur()
  }
};
</script>
<template>
  <div class="main" @click.capture="mainClick">
    <div class="mask" ref="mask"></div>
    <div class="bg" ref="bg">
      <div class="beian dark:dark-text dark:dark-beian">
        <span>湘ICP备20011733号-1 | 湘公网安备 43120202000238号</span>
      </div>
    </div>
    <Search ref="search" @blur="onBlur" @focus="onFocus" />
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
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;

  .bg {
    position: fixed;
    display: flex;
    align-items: end;
    justify-content: center;
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

    .beian {
      padding: 10px;
      border-radius: 8px;
      margin: 4px;
      backdrop-filter: blur(10px);
      background-color: rgba(255, 255, 255, 0.2);
      font-size: 10px;
    }
  }

  .mask {
    position: fixed;
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
