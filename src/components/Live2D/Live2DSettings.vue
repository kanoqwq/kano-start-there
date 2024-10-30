<template>
  <div class="L2dList">
    <ul class="list" ref="scrollList">
      <li
        class="dark:dark-text dark:dark-btn rounded dark:hover:dark-input"
        v-for="(item, index) in l2DList"
        :key="item"
        @click="selected(index)"
        :class="{ active: item.active }">
        {{ item.message }}
      </li>
    </ul>
    <div class="flex justify-end mt-2">
      <Button @click="save">保存修改</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import useStore from '@/store';
import { Toast } from '../Toast';
import Button from '../Button/Button.vue';
const l2DList = ref<any>({});
const selectedIndex = ref<number>(0);
const Configs = useStore.Configs();
const scrollList = ref();
const getL2DList = async () => {
  try {
    let { messages } = await (
      await fetch('./assets/Live2d/model_list.json')
    ).json();

    l2DList.value = messages.map((item: any) => ({
      message: item,
      active: false,
    }));
    l2DList.value[Configs.modId].active = true;
  } catch {
    Toast({
      value: '获取Live2d列表失败',
      color: 'yellow',
      duration: 2000,
      background: '#00000099',
    });
  }
};

const init = () => {
  l2DList.value = l2DList.value.map((item: any) => ({
    ...item,
    active: false,
  }));
};

const selected = (index: number) => {
  init();
  selectedIndex.value = index;
  l2DList.value[index].active = true;
};

const save = () => {
  Configs.setModelId(selectedIndex.value);
  Toast({
    value: `保存成功！1秒后自动刷新页面！`,
    color: 'green',
    duration: 1000,
    background: '#00000099',
    success() {
      location.reload();
    },
  });
};

onMounted(() => {
  getL2DList().then(() => {
    nextTick(() => {
      setTimeout(() => {
        scrollList.value.children[Configs.modId].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }, 300);
    });
  });
});
</script>

<style scoped lang="less">
.L2dList {
  .list {
    overflow-y: auto;
    height: 100%;
    max-height: 150px;
    li {
      user-select: none;
      box-sizing: border-box;
      margin: 10px 0;
      padding: 10px;
      transition: all 0.2s;
      background-color: #ffffff33;
      &:hover {
        background-color: #ffffff7e;
      }
      &.active {
        background-color: #35e685b0 !important;
      }
    }
  }
}
</style>
