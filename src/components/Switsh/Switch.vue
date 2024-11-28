<template>
  <div class="Switch">
    <label class="outer dark:dark-text" :class="class">
      <span class="text">{{ text }}</span>
      <div
        :class="{ active: modelValue }"
        class="switch text-center rounded dark:dark-btn p-2 bg-stone-300 transition-all focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
        <div
          class="dot rounded dark:dark-switch"
          :class="{ 'dark:dark-active-switch': modelValue }"></div>
      </div>
      <input
        class="inline-block w-5 h-5 align-sub"
        type="checkbox"
        :checked="modelValue ? true : false"
        @click="toggle" />
    </label>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  text: string;
  modelValue: boolean;
  class?: string;
}>();

const emit = defineEmits(['update:modelValue']);

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const toggle = (e: any) => {
  emit('update:modelValue', e.target.checked);
};
</script>

<style lang="less" scoped>
.Switch {
  width: 100%;
  display: inline-block;
  .outer {
    overflow: hidden;
    user-select: none;
    .text {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding-right: 4px;
      line-height: 24px;
    }
    .switch {
      display: inline-block;
      position: relative;
      user-select: none;
      height: 24px;
      width: 60px;
      padding: 0;
      .dot {
        position: absolute;
        left: 0;
        height: 100%;
        width: 50%;
        background-color: #eee;
        transition: all 0.3s ease;
      }
    }

    input {
      display: none;
    }

    .active {
      background-color: #41b883;
      color: #fff;
      .dot {
        left: 100%;
        transform: translateX(-96%);
        background-color: #fff !important;
      }
    }
  }
}
</style>
