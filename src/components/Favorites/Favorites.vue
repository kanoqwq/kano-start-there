<template>
<div class="favlinks flex justify-around absolute">
    <template v-for="item in Configs.links">
        <LinkButton :href="item.href" :imgUrl="item.imgUrl" :isBlank="item.isBlank" />
    </template>
    <AddLink v-if="Configs.links.length < 4" />
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