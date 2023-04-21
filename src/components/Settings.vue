<template>
    <Transition name="fade">
        <div class="settings" v-show="show">
            <div class="mask" @click.capture="close"></div>
            <div class="model dark:dark-settings-model">
                <div class="tab flex justify-start">
                    <div @click="selectedTabItem = index" v-for="(item, index) in Tabs" :key="index"
                        :class="selectedTabItem == index ? 'tab-active' : ''"
                        class="tab-content flex justify-center items-center">
                        <span>{{ item }}</span>
                    </div>
                </div>
                <div class="option flex" v-if="selectedTabItem == 0">
                    <span class="m-3">背景图片URL:</span>
                    <input class="rounded mr-1 input" type="text" v-model="backgroundImage">
                    <button
                        class="rounded p-2  transition-all bg-gray-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                        @click="submit">保存修改</button>
                </div>
                <div class="option flex" v-if="selectedTabItem == 1">
                    <div>
                        <span class=" mr-3 ">启用Live2D:</span>
                        <input class="inline-block w-5 h-5 align-sub  " type="checkbox" @click="toggleL2D"
                            :checked="l2dEnabled">

                    </div>
                    <button
                        class="rounded p-2 m-3 transition-all bg-gray-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                        @click="submit">保存修改</button>
                </div>
                <div class="option flex" v-if="selectedTabItem == 2">
                    <!-- 收藏夹管理 -->
                    <!-- TODO:详细管理收藏夹 -->
                    <!-- <div>
                        <span>收藏列表：</span>
                        <div v-for="(item, index) in Configs.favLinks" class=" w-10 h-10 ">
                            <img :src="item.imgUrl" />
                        </div>
                    </div> -->
                    <button
                        class="rounded p-2 m-3 transition-all bg-gray-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                        @click="clearFavorite">清空收藏夹</button>
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
const Tabs = ref(["背景", "Live2d", "收藏夹"])
//tab栏当前选择的项目编号（从0开始）
const selectedTabItem = ref(0);
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
        background: "#00000099",
    })
    setTimeout(() => {
        location.reload()
    }, 1500);
}

//点击切换tab
const selectTab = (item: number) => {
    selectedTabItem.value = item

}
//清空收藏夹
const clearFavorite = () => {
    Configs.clearFavLink()
    emit('close')
    Toast({
        value: `操作成功！`,
        color: 'green',
        duration: 1000,
        background: "#00000099",
    })
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
        max-width: 600px;
        overflow: hidden;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -60%);
        width: 70%;
        padding: 40px 0;
        padding-bottom: 20px;
        background-color: rgba(255, 255, 255, .3);
        color: #000;
        border-radius: 10px;

        box-shadow: 0px 0px 15px #000;

        .tab {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 30px;
            background-color: #00000033;

            .tab-content {
                width: 20%;
                height: 100%;
                margin: 0 10px;
                overflow: hidden;
                white-space: nowrap;
                word-wrap: none;
            }

            .tab-active {
                border-bottom: 2px solid #ccc;
            }
        }

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