<template>
    <Transition name="fade">
        <div class="settings" v-show="show">
            <div class="mask" @click.capture="close"></div>
            <div class="model dark:dark-settings-model">
                <div class="option flex">
                    <span class="m-3">背景图片URL:</span>
                    <input class="rounded mr-1 input" type="text" v-model="backgroundImage">
                </div>
                <div class="option flex">
                    <div>
                        <span class=" mr-3 ">启用Live2D:</span>
                        <!-- <button
                        class="rounded p-2  transition-all bg-gray-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                        >保存修改</button> -->
                        <input class="inline-block w-5 h-5 align-sub  " type="checkbox" @click="toggleL2D"
                            :checked="l2dEnabled">
                    </div>
                </div>
                <div class="option flex">
                    <button
                        class="rounded p-2  transition-all bg-gray-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                        @click="submit">保存修改</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import useStore from '@/store'
import { Toast } from './Toast/index'
const Configs = useStore.Configs()
const backgroundImage = ref(Configs.getBackgroundImage(-1));
const l2dEnabled = ref(Configs.live2dEnabled);
defineProps<{
    show: boolean
}>()
const emit = defineEmits<{
    (event: 'close'): void
}>()

//关闭模态框
const close = (e: Event) => {
    if (e.cancelable) {
        emit('close')
    }
}

//开关live2d
const toggleL2D = (e: Event) => {
    let el = e.target as HTMLInputElement
    l2dEnabled.value = el.checked
}

//提交修改
const submit = () => {
    backgroundImage.value && backgroundImage.value.trim() !== '' ?
        Configs.setBackgroundImage(backgroundImage.value) : Configs.resetBackground()
    l2dEnabled.value ? Configs.toggleLive2d(true) : Configs.toggleLive2d(false)
    Toast({
        value: `保存成功！1秒后自动刷新页面！`,
        color: 'green',
        duration: 1000,
        background: "black",
    })
    setTimeout(() => {
        location.reload()
    }, 1500);
}
</script>

<style  lang="less" scoped>
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
            height: 40px;
            overflow: hidden;
            margin: 10px 0;
            align-items: center;

            .input {
                padding: 10px;
                background-color: rgb(31 41 55 / .5);
                outline: none;
            }

            button {
                height: 100%;
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