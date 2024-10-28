<template>
  <!-- 添加链接按钮 -->
  <div
    v-if="!hideBtn"
    @click="addLink"
    class="addlink flex justify-center items-center dark:dark-add-btn dark:hover:dark-add-btn-hover">
    <div class="">
      <svg class="add-icon" aria-hidden="false">
        <use xlink:href="#icon-add-bold"></use>
      </svg>
    </div>
  </div>
  <!-- 添加链接对话框 -->
  <Modal :show="dialogisDisplay" @close="onClose">
    <template #default>
      <div class="p-5 pt-3">
        <div class="option flex">
          <div class="flex flex-col dark:dark-text">
            <div class="item flex mt-3 mb-3 items-center">
              <span>收藏链接：</span>
              <input
                class="rounded mr-1 input dark:dark-input"
                type="text"
                v-model="link.href" />
            </div>
            <div class="item flex mt-3 mb-3 items-center">
              <span>图标地址：</span>
              <input
                class="rounded mr-1 input dark:dark-input"
                type="text"
                v-model="link.imgUrl" />
              <Button @click="onUpload"
                ><i class="iconfont icon-upload"></i>
                <input
                  class="hidden"
                  @change="fileChange"
                  ref="fileInput"
                  type="file"
                  accept="image/*" />
              </Button>
            </div>
            <div class="flex mt-3 mb-3 items-center">
              <span>以新标签页打开：</span>
              <input
                class="rounded mr-1 input w-5 h-5 dark:dark-input"
                type="checkbox"
                v-model="link.isBlank" />
            </div>
            <Button @click="save">保存</Button>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { ref, reactive, toRaw, watch } from 'vue';
import useStore from '@/store';
import { LinkObj } from '@/types/global';
import { Toast } from '../Toast';
import Modal from '@/components/Modal/index.vue';
import Button from '../Button/Button.vue';
import { useUploadImage } from '../UploadImage/useUploadImage';

const props = defineProps<{
  hideBtn?: boolean;
  data?: LinkObj;
  showEdit?: boolean;
}>();
const emit = defineEmits(['onclose']);
const Configs = useStore.Configs();
const dialogisDisplay = ref(false);
const { change } = useUploadImage({ emit, maxUploadSize: 2 });

const link = reactive<LinkObj>({
  imgUrl: '',
  href: '',
  isBlank: true,
});

watch(
  () => props.showEdit,
  () => {
    dialogisDisplay.value = props.showEdit;
  }
);

watch(
  () => props.data,
  () => {
    if (props.data) {
      link.imgUrl = props.data.imgUrl;
      link.href = props.data.href;
      link.isBlank = props.data.isBlank;
    }
  }
);

const addLink = () => {
  dialogisDisplay.value = true;
};

const fileInput = ref();

const onUpload = () => {
  fileInput.value && fileInput.value.click();
  console.log('upload');
};

const fileChange = async (e: Event) => {
  try {
    let res = await change(e);
    if (res.data && res.msg == 'ok') {
      link.imgUrl = res.data;
      Toast({
        value: '上传成功！',
        color: 'green',
        duration: 1000,
      });
    }
  } catch (e: any) {
    Toast({
      value: e.msg,
      color: 'red',
    });
  }
};

//保存
const save = () => {
  try {
    if (props.showEdit) {
      Configs.updateFavLink(toRaw(link));
    } else {
      Configs.setFavLink(toRaw(link));
    }
    //清空并初始化
    link.href = '';
    link.imgUrl = '';
    link.isBlank = true;
    Toast({
      value: props.showEdit ? '保存成功~' : '添加成功~',
      color: 'green',
      duration: 1000,
      background: '#00000099',
    });
  } catch (e: any) {
    Toast({
      value: e.message,
      color: 'red',
      duration: 1000,
      background: '#00000099',
    });
  } finally {
    dialogisDisplay.value = false;
    emit('onclose');
  }
};
const onClose = () => {
  dialogisDisplay.value = false;
  emit('onclose');
};
</script>

<style lang="less" scoped>
.addlink {
  width: 60px;
  height: 100%;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s;

  .add-icon {
    fill: red !important;
    width: 25px;
    height: 25px;
  }
}

.addlink:hover {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
