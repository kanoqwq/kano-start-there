<template>
    <!-- 添加链接按钮 -->
    <div @click="addLink" class="addlink flex justify-center items-center dark:dark-add-btn dark:hover:dark-add-btn-hover">
        <div class="">
            +
        </div>
    </div>
    <!-- 添加链接对话框 -->
    <Teleport to="body">
        <Transition name="fade">
            <div class="settings" v-if="dialogisDisplay">
                <div class="mask" @click="dialogisDisplay = false"></div>
                <div class="model dark:dark-settings-model">
                    <div class="option flex">
                        <div v-if="dialogisDisplay" class=" flex flex-col">
                            <div class="flex mt-3 mb-3 items-center">
                                <span>收藏链接：</span>
                                <input class="rounded mr-1 input" type="text" v-model="link.href">
                            </div>
                            <div class="flex mt-3 mb-3 items-center">
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
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>
import { ref, reactive, toRaw } from "vue"
import useStore from '@/store'
import { LinkObj } from "@/types/global";
import { Toast } from "../Toast";
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
            background: "black",
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
}

.addlink:hover {
    background-color: rgba(0, 0, 0, .4);
}

@media(max-width:650px) {
    .option {
        height: 100% !important;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        span,
        input,
        button {
            margin: 5px;
        }

        .input {
            height: 30px;
        }

    }
}


.settings {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(10px);

    .mask {
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, .3);
    }

    .model {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        max-width: 600px;
        overflow: hidden;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -60%);
        width: 70%;
        padding: 40px 0;
        background-color: rgba(255, 255, 255, .3);
        color: #000;
        border-radius: 10px;
        box-shadow: 0px 0px 15px #000;

        .option {
            // height: 40px;
            overflow: hidden;
            margin: 10px 0;
            align-items: center;

            .input {
                padding: 8px;
                background-color: rgb(31 41 55 / .5);
                outline: none;
            }
        }
    }
}


.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>