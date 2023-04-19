<script setup lang="ts">
/*
 * @Author: kanoqwq
 * @Email: kanoqwq@qq.com
 * @Date: 2023-04-17 14:47:15
 * @Last Modified by: kanoqwq
 * @Last Modified time: 2023-04-17 14:52:24
 * @Description: Description
 */
import { ref, onMounted } from 'vue';
import Search from './components/Search.vue'
// iconfont
import '@/assets/js/iconfont.js'
import useStore from './store'

const Configs = useStore.Configs();
let background = Configs.getBackgroundImage(-1)
let main = ref<HTMLDivElement>()

//挂载完毕后添加背景
onMounted(() => {
  if (main.value) {
    main.value.style.backgroundImage = `url(${background})`
  }
})
</script>
<template>
  <div class="main" ref="main">
    <Search />
  </div>
</template>

<style scoped lang="less">
.main {
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}
</style>
