<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Search from './components/Search.vue'
// iconfont
import '../public/js/iconfont.js'
import useStore from './store'
const Configs = useStore.Configs();
let background = Configs.getBackgroundImage(-1)
let main = ref<HTMLDivElement>()

//挂载完毕后添加背景
onMounted(() => {
  if (main.value) {
    main.value.style.backgroundImage = `url(${background})`
    console.log(background);
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
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}
</style>
