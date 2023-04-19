<template>
    <div class="toast" :style="{ background: background, color: color }">
        <span>{{ value }}</span>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
defineProps<{
    background: string,
    color: string,
    value: string
}>()

//TODO:实现一个Toast组件
</script>

<style lang="less" scoped>
@keyframes leave {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

.enter {
    animation: leave .3s reverse;
}

.leave {
    animation: leave .3s;
}

.toast {
    position: fixed;
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
}
</style>