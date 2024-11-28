<template>
  <div class="searchEngineListBox dark:dark-text select-none">
    <div
      class="inner"
      v-for="item in searchEngines"
      :key="item.id"
      @click="selectItem(item.id)"
      :class="item.active ? 'active' : ''"
    >
      <i
        :class="`icon kano-icon dark:dark-kano-icon iconfont dark:dark-icon ${item.icon}`"
      ></i>
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useStore from "@/store";
import { ref } from "vue";
const searchEnginesStore = useStore.searchEngines();
const searchEngines = ref(
  searchEnginesStore.getSearchEngines.map((item) => ({
    ...item,
    active: searchEnginesStore.selectedEngine === item.id,
  }))
);

const selectItem = (id: number) => {
  searchEnginesStore.setSelectedEngine(id);
  // biome-ignore lint/complexity/noForEach: <explanation>
  searchEngines.value.forEach((item) => {item.active = false});
  // biome-ignore lint/complexity/noForEach: <explanation>
  searchEngines.value.forEach(item=>{
    if(item.id === id){
      item.active = true
    }
  })
};
</script>

<style scoped>
@media (max-width: 650px) {
  .searchEngineListBox {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}
@media (min-width: 510px) and (max-width: 650px) {
  .searchEngineListBox {
    grid-template-columns: repeat(4, 1fr) !important;
  }
}
@media (min-width: 400px) and (max-width: 510px) {
  .searchEngineListBox {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}
@media (min-width: 0px) and (max-width: 400px) {
  .searchEngineListBox {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
.searchEngineListBox {
  display: grid;
  gap: 15px;
  justify-items: center;
  grid-template-columns: repeat(5, 1fr);
  text-align: center;
  .inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 70px;
    padding: 4px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    border: 1px dashed #eeeeee66;
    transition: all 0.3s;
    &.active {
      background-color: #ffffff3a;
    }
    &:active {
      background-color: #ffffff7a;
    }
    i {
      margin: 0;
      font-size: 30px;
    }
    span {
      display: block;
      margin-top: 4px;
      width: 100%;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      word-wrap: none;
      text-overflow: ellipsis;
    }
  }
}
</style>
