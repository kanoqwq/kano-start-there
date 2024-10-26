<template><!-- 收藏夹链接 -->
<div class="linkbutton" @mouseenter="isshowCloseBtn = true" @mouseleave="isshowCloseBtn = false">
    <a :href="href" :target="isBlank ? '_blank' : ''" rel="noreferrer noopener nofollow">
        <img class="topimg" :src="imgUrl" :alt="imgUrl">
        <i v-if="isshowCloseBtn" @click.prevent="isShowConfrim = true"
            class="dark:dark-close-btn close iconfont icon-close"></i>
    </a>
    <Modal :show="isShowConfrim" @close="isShowConfrim = false">
        <div class="confirm ">
            <h1 class="dark:dark-text">确认删除这个标签?</h1>
            <div class="options">
                <button :class="btnClass" @click="close()">确认</button>
                <button :class="btnClass" @click="isShowConfrim = false">取消</button>
            </div>
        </div>
    </Modal>
</div>
</template>
<script lang="ts" setup>
    import useStore from '@/store'
    import { Toast } from '../Toast';
    import { ref } from 'vue';
    import Modal from '@/components/Modal/index.vue'

    const props = defineProps<{
        href: string,
        imgUrl: string,
        isBlank?: boolean,
    }>()

    const Configs = useStore.Configs();

    const isShowConfrim = ref(false)

    const isshowCloseBtn = ref(false)

    let btnClass = "rounded dark:dark-btn p-2 bg-stone-300 transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"


    const close = () => {
        if (props.href) {
            Configs.removeFavLinkByUrl(props.href)
            Toast({
                value: "删除成功~",
                color: 'green',
                duration: 1000,
                background: "#00000099",
            })
        }
    }
</script>

<style lang="less" scoped>
    .confirm {
        width: 100%;

        h1 {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            margin: 20px;
        }

        .options {
            text-align: center;

            button {
                margin: 10px;
            }
        }
    }

    .linkbutton {
        width: 60px;
        position: relative;
        text-align: center;
        user-select: none;

        .close {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 16px;
            transform: translate(20%, -20%);
            font-weight: bolder;
            border-radius: 50%;
            transition: all .2s;
            background-color: #eeeeeeb4;
            opacity: 1;
            padding: 2px;
            text-align: center;
            color: #00000093;
        }

        .close:hover {
            opacity: .5;
        }

        .topimg {
            width: 100%;
            height: 60px;
            border-radius: 20px;
            margin-bottom: 5px;
            transition: all .2s;
            box-shadow: transparent;
        }

        .description {
            font-size: 14px;
            margin: 0 2px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-wrap: break-word;
            font-weight: bold;
        }
    }

    .linkbutton :hover .topimg {
        box-shadow: 1px 1px 10px 1px #00000056;
    }
</style>