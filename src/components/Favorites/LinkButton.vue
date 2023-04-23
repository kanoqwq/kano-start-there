<template>
    <!-- 收藏夹链接 -->
    <div class="linkbutton">
        <a :href="href" :target="isBlank ? '_blank' : ''" rel="noreferrer noopener nofollow">
            <img class="topimg" :src="imgUrl" :alt="imgUrl">
        </a>
    </div>
</template>
<!-- https://img1.baidu.com/it/u=3587286575,3300833299&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500 -->
<script lang="ts" setup>
defineProps<{
    href: string,
    imgUrl: string,
    isBlank?: boolean,
}>()

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