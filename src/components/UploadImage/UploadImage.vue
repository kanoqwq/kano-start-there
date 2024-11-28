<template>
  <div
    class="uploadImage scroll-auto dark:dark-text text-center"
    :style="{ height: '200px' }">
    <div class="icon dark:dark-add-btn m-5" @click="addPicClick">
      <i class="iconfont icon-add-bold"></i>
      <p class="text">设置<br />图片</p>
    </div>
    <div
      v-if="
        Configs.getBackgroundImages() &&
        Configs.getBackgroundImages().length !== 0
      "
      class="icon dark:dark-add-btn m-5"
      @click="isShowConfrim = true">
      <i class="iconfont icon-16trash"></i>
      <p class="text">删除<br />图片</p>
    </div>
    <input
      class="hidden"
      @change="fileChange"
      ref="fileInput"
      type="file"
      accept="image/*" />
  </div>
  <Modal :show="isShowConfrim" @close="isShowConfrim = false" animation="scale">
    <div class="confirm">
      <h1 class="dark:dark-text">确认移除壁纸?</h1>
      <div class="options">
        <button :class="btnClass" @click="removePicClick()">确认</button>
        <button :class="btnClass" @click="isShowConfrim = false">取消</button>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Toast } from '@/components/Toast/index';
import useStore from '@/store';
import Modal from '@/components/Modal/index.vue';
import { useUploadImage } from './useUploadImage';

const emit = defineEmits(['success']);

const btnClass =
  'rounded dark:dark-btn p-2 bg-stone-300 transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50';

const Configs = useStore.Configs();
const isShowConfrim = ref();
const fileInput = ref();
const { change } = useUploadImage({ emit });

const addPicClick = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};
const removePicClick = () => {
  setTimeout(() => {
    Configs.resetBackground();
  }, 300);
  Toast({
    value: '删除成功！',
    color: 'green',
  });
  isShowConfrim.value = false;
  emit('success');
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const fileChange = async (event: any) => {
  try {
    const res = await change(event);
    if (res.data && res.msg === 'ok') {
      Configs.resetBackground();
      Configs.setBackgroundImage(res.data);
      Toast({
        value: '保存成功！',
        color: 'green',
      });
    }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (e: any) {
    Toast({
      value: e.msg,
      color: 'red',
    });
  }
};
</script>
<style lang="less" scoped>
.uploadImage {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-size: cover;
  background-repeat: no-repeat;

  .icon {
    position: relative;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.5);
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      position: absolute;
      font-size: 100px;
      transition: all 0.3s;
    }

    .text {
      opacity: 0;
      position: absolute;
      font-size: 24px;
      line-height: 1.1em;
      transition: all 0.3s;
      user-select: none;
    }

    &:hover {
      i {
        opacity: 0;
      }

      .text {
        opacity: 1;
      }
    }
  }
}
</style>
