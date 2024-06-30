<template>
<Modal :show="isShow" @close="closeSettings">
    <template #default>
        <div class="tab flex justify-start">
            <div @click="selectedTabItem = index" v-for="(item, index) in Tabs" :key="index"
                :class="selectedTabItem == index ? 'tab-active' : ''"
                class="tab-content flex justify-center items-center">
                <span>{{ item }}</span>
            </div>
        </div>
        <div class="mb-2" style="width: 100%;">
            <div class="option flex justify-center" v-if="selectedTabItem == 0">
                <span class="m-3">背景图片URL:</span>
                <input class="rounded mr-1 input" type="text" v-model="backgroundImage">
                <button
                    class="rounded p-2  transition-all bg-gray-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                    @click="submit">保存修改</button>
            </div>
            <div class="option flex justify-center" v-if="selectedTabItem == 1">
                <div>
                    <span class=" mr-3 ">启用Live2D:</span>
                    <input class="inline-block w-5 h-5 align-sub  " type="checkbox" @click="toggleL2D"
                        :checked="l2dEnabled">

                </div>
                <button
                    class="rounded p-2 m-3 transition-all bg-gray-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                    @click="submit">保存修改</button>
            </div>
            <div class="option flex justify-center" v-if="selectedTabItem == 2">
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
            <div class="option flex-col justify-center" v-if="selectedTabItem == 3">
                <div style="max-width: 140px;margin:0 auto">
                    <Switch text='不要CSDN' v-model="noCSDN" />
                </div>
                <div>
                    <h2 class="mt-5 mb-3 text-center" style="font-size: 22px; font-weight:bold">过滤词列表</h2>
                    <ul style="max-height:500px;margin:0 auto" v-if="filterWords.length"
                        class="rounded filterList border-dashed border-2 p-2 pt-1 pb-1 border-pink-200">
                        <li v-for="item in filterWords" :key="item" class="m-1 ml-0 filter-item">
                            <span>{{ item }}</span>
                            <svg class="close" aria-hidden="false" @click="removeWord(item)">
                                <use xlink:href="#icon-close"></use>
                            </svg>
                        </li>
                    </ul>
                    <p v-else class="text-center text-gray-500">
                        暂无数据捏~
                    </p>
                    <div class="mt-3 flex justify-center items-center">
                        <input class="rounded mr-1 input" type="text" v-model.trim="filterWord">
                        <button
                            class="rounded p-2 transition-all bg-gray-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                            @click="addFilterWord">添加</button>
                    </div>
                </div>
            </div>
        </div>
    </template>
</Modal>
</template>

<script setup lang='ts'>
    import Modal from '@/components/Modal/index.vue'
    import { computed, ref, watch } from 'vue'
    import useStore from '@/store'
    import { Toast } from './Toast/index'
    import Switch from './Switsh/Switch.vue'

    const Configs = useStore.Configs()
    const backgroundImage = ref(Configs.getBackgroundImage(-1));
    const l2dEnabled = ref(Configs.live2dEnabled);
    const Tabs = ref(["背景", "Live2d", "收藏夹", "过滤词"])
    //tab栏当前选择的项目编号（从0开始）
    const selectedTabItem = ref(0);
    const isShow = ref(false);
    const noCSDN = ref(Configs.filterWords.indexOf('CSDN') !== -1)
    const filterWords = computed(() => Configs.filterWords)
    const filterWord = ref('')

    const props = defineProps<{
        show: boolean
    }>()

    const emit = defineEmits<{
        (event: 'close'): void
    }>()


    //侦听prop
    watch(() => props.show, () => {
        isShow.value = props.show
    })

    watch(filterWords, (words) => {
        const hasValue = words.indexOf('csdn') !== -1 || words.indexOf('CSDN') !== -1
        if (hasValue) {
            noCSDN.value = true
        } else {
            noCSDN.value = false
        }
    })

    watch(noCSDN, (nValue) => {
        Configs.removeFilterWord("csdn")
        Configs.removeFilterWord("CSDN")
        if (nValue) {
            Configs.setFilterWord("CSDN")
        } 
    })
    //删除过滤词
    const removeWord = (word: string) => {
        Configs.removeFilterWord(word)
    }

    //添加过滤词
    const addFilterWord = () => {
        if (filterWord.value) {
            const res = Configs.setFilterWord(filterWord.value)
            if (!res) {
                Toast({
                    value: `关键词已存在！`,
                    color: 'yellow',
                    duration: 2000,
                    background: "#00000099",
                })
                return;
            }

        }
        filterWord.value = ''
    }

    //关闭settings
    const closeSettings = () => {
        isShow.value = false
        emit('close')
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

<style lang="less" scoped>
    .filterList {
        max-width: 400px;

        .filter-item {
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;

            span {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                word-wrap: none;
                white-space: nowrap;
            }
        }

        .close {
            height: 24px;
            width: 24px;
            margin: 0 5px;

            .close-icon {
                fill: #fff;
            }
        }
    }
</style>