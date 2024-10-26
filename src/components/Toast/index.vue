<template>
<div class="toast" :style="{ background: background}">
    <span :style="{ 'font-weight': fontWeight as any, color: color + ' !important' }">{{ value }}</span>
</div>
</template>

<script setup lang='ts'>
    defineProps<{
        background: string,
        color: string,
        value: string,
        fontWeight: string
    }>()
</script>

<style lang="less" scoped>
    @keyframes leave {
        0% {
            top: 20px;
        }

        50% {
            top: 40px;
        }

        100% {
            opacity: 0;
            top: -20px;
            font-size: 0;
        }
    }

    .enter {
        animation: leave .3s reverse cubic-bezier(0.5, 0.59, 0, 1);
    }

    .leave {
        animation: leave .3s cubic-bezier(0.5, 0.59, 0, 1);
    }

    .toast {
        position: fixed;
        z-index: 114514;
        display: flex;
        z-index: 114514;
        justify-content: center;
        align-items: center;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 20px;
        color: #000;
        border-radius: 10px;
        background-color: #fff;
        opacity: .85;
    }
</style>