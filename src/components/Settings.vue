<template>
    <Transition name="fade">
        <div class="settings" v-show="show">
            <div class="mask" @click.capture="close"></div>
            <div class="model dark:dark-settings-model">
                <div class="background-set flex">
                    <span class="m-3">背景图片URL:</span>
                    <input class="rounded mr-1 input" type="text" v-model="backgroundImage">
                    <button
                        class="rounded p-2  transition-all bg-gray-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                        @click="modifyBg">修改</button>
                    <button
                        class="rounded p-2 ml-1 transition-all bg-gray-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                        @click="resetBg">重置</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import useStore from '../store'
import { Toast } from './Toast/index'
const Configs = useStore.Configs()

defineProps<{
    show: boolean
}>()
const emit = defineEmits<{
    (event: 'close'): void
}>()

const backgroundImage = ref(Configs.getBackgroundImage(-1));

//关闭模态框
const close = (e: Event) => {
    if (e.cancelable) {
        emit('close')
    }
}


const modifyBg = () => {
    if (backgroundImage.value && backgroundImage.value.trim()) {
        Configs.setBackgroundImage(backgroundImage.value);
        Toast({
            value: '设置背景成功！，请手动刷新页面',
            color: 'green',
            duration: 1000,
            background: "black",
        })
    }
}

const resetBg = () => {
    Configs.resetBackground();
    Toast({
        value: '清除背景成功！，请手动刷新页面',
        color: 'green',
        duration: 1000,
        background: "black",
    })
}
</script>

<style  lang="less" scoped>
@media(max-width:650px) {
    .background-set {
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
        // min-width: 500px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -60%);
        width: 70%;
        height: 400px;
        background-color: rgba(255, 255, 255, .3);
        color: #000;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0px 0px 15px #000;

        .background-set {
            height: 40px;
            overflow: hidden;

            .input {
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