<template>
  <div ref="tab" class="tab flex justify-around">
    <div
      @click="onClick($event, index)"
      v-for="(item, index) in tabs"
      :key="index"
      class="tab-content flex justify-center items-center dark:dark-text">
      {{ item }}
    </div>
    <div ref="tabIndicator" class="tab-indicator dark:dark-bg dark:dark-shadow "></div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
const emits = defineEmits(['select']);
const props = defineProps<{
  tabs: Array<any>;
}>();

const selectedItem = ref<{ target?: any; index?: number }>({ index: 0 });
const tabIndicator = ref();
const tab = ref();

const onClick = (e: Event, index: number) => {
  tabClick(e);
  selectedItem.value = {
    target: e.target,
    index,
  };
  emits('select', index);
};

//tab指示器随动
const tabClick = (e: any) => {
  const tabItemLeft = e.target.getBoundingClientRect().left;
  const tabLeft = tab.value.getBoundingClientRect().left;
  tabIndicator.value.style.left = tabItemLeft - tabLeft + 'px';
};

const autoResize = () => {
  if (selectedItem.value.target && tabIndicator.value) {
    const selectRect = selectedItem.value.target.getBoundingClientRect();
    tabIndicator.value.style.width = selectRect.width + 'px';
    tabIndicator.value.style.height = selectRect.height + 'px';
    selectedItem.value.target.click();
  } else {
    if (tab.value && tabIndicator.value) {
      const firstEle = tab.value.children[0];
      const firstEleRect = firstEle.getBoundingClientRect();
      tabIndicator.value.style.width = firstEleRect.width + 'px';
      tabIndicator.value.style.height = firstEleRect.height + 'px';
      firstEle.click();
    }
  }
};

onMounted(() => {
  nextTick(() => {
    autoResize();
  });
  setTimeout(() => {
    autoResize();
  }, 300);
  window.onresize = () => {
    autoResize();
  };
});
</script>

<style lang="less" scoped>
.tab {
  --tab-height: 30px;
  position: relative;
  user-select: none;
  flex-shrink: 0;
  .tab-content {
    z-index: 10;
  }
  .tab-indicator {
    position: absolute;
    z-index: 9;
    height: 2px;
    background-color: #fff;
    width: 20px;
    top: 0;
    /*初始化位置可能有bug*/
    transition: left 0.3s;
    /*left: 0;*/
    opacity: 0.6;
    border-radius: 10px;
    box-shadow: 0px 0px 15px #ffffff96;
  }
}
</style>
