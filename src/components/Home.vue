<template>
  <div class="container mx-auto flex justify-center items-center">
    <div class="search flex rounded border border-gray-900">
      <div class="search-engine flex items-center"><span>{{ searchEngines[0].name }}</span></div>
      <input type="text" class="border border-gray-300">
      <button class="search-btn border">搜索</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
let searchEngines = reactive([{
  name: '百度搜索',
  url: 'https://baidu.com'
}])
</script>

<style scoped lang="less">
.container {
  height: 100%;
  .search {
    height: 50px;
  }
}
</style>
