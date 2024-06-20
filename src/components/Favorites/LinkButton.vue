<template><!-- 收藏夹链接 -->
<div class="linkbutton" @click="onClose($event, href)">
    <a :href="href" :target="isBlank ? '_blank' : ''" rel="noreferrer noopener nofollow">
        <img class="topimg" :src="imgUrl" :alt="imgUrl">
    </a>
</div>
</template>
<script lang="ts" setup>
    import useStore from '@/store'

    defineProps<{
        href: string,
        imgUrl: string,
        isBlank?: boolean,
    }>()
    const Configs = useStore.Configs();
    const onClose = (e, href: string) => {
        if (e.altKey) {
            e.preventDefault()
            if (href) {
                Configs.removeFavLinkByUrl(href)
            }
        }

    }
</script>

<style lang="less" scoped>
    .linkbutton {
        width: 60px;
        // margin-right: 10%;
        overflow: hidden;
        text-align: center;
        user-select: none;
        transition: all .3s;

        .topimg {
            width: 100%;
            height: 60px;
            border-radius: 20px;
            margin-bottom: 5px;
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

    .linkbutton:hover {
        opacity: 0.4;
    }
</style>