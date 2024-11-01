<template>
  <div
    class="favlinks flex justify-around absolute"
    :style="style"
    v-if="!editMode || !Configs.links.length">
    <template v-for="item in Configs.links">
      <LinkButton
        :clickable="true"
        :showOpt="false"
        :href="item.href"
        :id="item.id"
        :imgUrl="item.imgUrl"
        :isBlank="item.isBlank" />
    </template>
    <AddLink v-if="Configs.links.length < 4" />
  </div>
  <div v-else class="favlinks flex justify-around absolute" :style="style">
    <template v-for="item in Configs.links">
      <LinkButton
        @click="edit(item)"
        :clickable="false"
        :showOpt="true"
        :href="item.href"
        :id="item.id"
        :imgUrl="item.imgUrl"
        :isBlank="item.isBlank" />
    </template>
    <AddLink v-if="Configs.links.length < 4" />
    <AddLink
      ref="addLinkBtn"
      hideBtn
      :data="editData"
      :showEdit="editLinkShow"
      @onclose="onClose" />
  </div>
</template>

<script lang="ts" setup>
import LinkButton from './LinkButton.vue';
import AddLink from './AddLink.vue';
import useStore from '@/store/';
import { ref } from 'vue';

defineProps({
  style: Object,
  editMode: {
    type: Boolean,
    default: false,
  },
});
const Configs = useStore.Configs();
const editData = ref({
  id: -1,
  imgUrl: '',
  href: '',
  isBlank: true,
});
const addLinkBtn = ref();
const editLinkShow = ref(false);

const edit = (item: any) => {
  editLinkShow.value = true;
  editData.value = {
    id: item.id,
    imgUrl: item.imgUrl,
    href: item.href,
    isBlank: item.isBlank,
  };
};
const onClose = () => {
  editLinkShow.value = false;
};
</script>

<style lang="less" scoped>
.favlinks {
  top: 100px;
  width: 100%;
  height: 60px;
}
</style>
