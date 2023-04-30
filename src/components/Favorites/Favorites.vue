<template>
    <div class="favlinks flex justify-around absolute">
        <template v-for="item in Configs.favLinks">
            <LinkButton :href="item.href" :imgUrl="item.imgUrl" :isBlank="item.isBlank" />
        </template>

        <!-- <LinkButton href="https://kanokano.cn"
            imgUrl="https://img1.baidu.com/it/u=3587286575,3300833299&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" /> -->
            <AddLink v-if="Configs.favLinks.length < 4" />
    </div>
</template>

<script lang="ts" setup>
import LinkButton from "./LinkButton.vue";
import AddLink from "./AddLink.vue";
import useStore from "@/store/";
const Configs = useStore.Configs()
</script>

<style lang="less" scoped>
.favlinks {
    top: 100px;
    width: 100%;
    height: 60px;
}
</style>