<template></template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
//load Live2d
import '@/assets/Live2d/autoload.js'
import { isMobile } from "@/utils/ua";
const scale = ref('1')
// hook
onMounted(() => {
    isMobile() ? scale.value = '.6' : scale.value = '1'
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