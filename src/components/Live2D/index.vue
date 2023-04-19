<template></template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
//load Live2d
import '@/assets/Live2d/autoload.js'
const scale = ref('.5')
// hook
onMounted(() => {
    let init = setInterval(() => {
        let waifu = document.querySelector("#waifu") as HTMLDivElement
        if (waifu) {
            waifu.style.transformOrigin = "bottom"
            waifu.style.transform = `scale(${scale.value})`
            clearInterval(init)
        }
    }, 100)
})
</script>

<style scoped></style>