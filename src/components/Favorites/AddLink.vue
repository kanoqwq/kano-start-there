<template>
    <!-- 添加链接按钮 -->
    <div @click="addLink" class="addlink flex justify-center items-center dark:dark-add-btn dark:hover:dark-add-btn-hover">
        <div class="">
            <svg class="add-icon" aria-hidden="false">
                <use xlink:href="#icon-add-bold"></use>
            </svg>
        </div>
    </div>
    <!-- 添加链接对话框 -->
    <Modal :show="dialogisDisplay" @close="dialogisDisplay = false">
        <template #default>
            <div class=" p-5 pt-3 ">
                <div class="option flex">
                    <div class="flex flex-col">
                        <div class="item flex mt-3 mb-3 items-center">
                            <span>收藏链接：</span>
                            <input class="rounded mr-1 input" type="text" v-model="link.href">
                        </div>
                        <div class="item flex mt-3 mb-3 items-center">
                            <span>图标地址：</span>
                            <input class="rounded mr-1 input" type="text" v-model="link.imgUrl">
                        </div>
                        <div class="flex mt-3 mb-3 items-center">
                            <span>以新标签页打开：</span>
                            <input class="rounded mr-1 input w-5 h-5" type="checkbox" v-model="link.isBlank">
                        </div>
                        <button @click="save"
                            class="rounded p-2 transition-all bg-gray-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">保存</button>
                    </div>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script lang="ts" setup>
import { ref, reactive, toRaw } from "vue"
import useStore from '@/store'
import { LinkObj } from "@/types/global";
import { Toast } from "../Toast";
import Modal from "@/components/Modal/index.vue"
const Configs = useStore.Configs();
const dialogisDisplay = ref(false)
const link = reactive<LinkObj>({
    imgUrl: '',
    href: '',
    isBlank: true
})


const addLink = () => {
    dialogisDisplay.value = true
}

//保存
const save = () => {
    try {
        Configs.setFavLink(toRaw(link))
        dialogisDisplay.value = false
        //清空并初始化
        link.href = ""
        link.imgUrl = ""
        link.isBlank = true
    } catch (e: any) {
        Toast({
            value: e.message,
            color: 'red',
            duration: 1000,
            background: "#00000099",
        })
    }
}
</script>

<style lang="less" scoped>
.addlink {
    width: 60px;
    height: 100%;
    border-radius: 20px;
    background-color: rgba(0, 0, 0, .2);
    backdrop-filter: blur(10px);
    transition: all .3s;

    .add-icon {
        fill: red !important;
        width: 25px;
        height: 25px;
    }
}

.addlink:hover {
    background-color: rgba(0, 0, 0, .4);
}
</style>