<template></template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { isMobile } from "@/utils/ua";
import useStore from '@/store'
const Configs = useStore.Configs()
const scale = ref('1')

// init and load Live2d
onMounted(() => {
    isMobile() ? scale.value = '.6' : scale.value = '1'
    if (Configs.live2dEnabled) {

        // live2d_path 参数建议使用绝对路径
        // const live2d_path = "https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/";
        const live2d_path = "./assets/Live2d/";
        //是否允许移动端使用
        const allowMobile = true;
        // 封装异步加载资源的方法
        function loadExternalResource(url: string, type: "css" | "js") {
            return new Promise((resolve, reject) => {
                let tag: any;

                if (type === "css") {
                    tag = document.createElement("link");
                    tag.rel = "stylesheet";
                    tag.href = url;
                } else if (type === "js") {
                    tag = document.createElement("script");
                    tag.src = url;
                }
                if (tag) {
                    tag.onload = () => resolve(url);
                    tag.onerror = () => reject(url);
                    document.head.appendChild(tag);
                }
            });
        }

        // 加载 waifu.css live2d.min.js waifu-tips.js
        if (screen.width >= 768 || allowMobile) {
            Promise.all([
                loadExternalResource(live2d_path + "waifu.css", "css"),
                loadExternalResource(live2d_path + "live2d.min.js", "js"),
                loadExternalResource(live2d_path + "waifu-tips.js", "js"),
            ]).then(() => {
                // 配置选项的具体用法见 README.md
                (window as any).initWidget({
                    waifuPath: live2d_path + "waifu-tips.json",
                    // apiPath: "https://live2d.fghrsh.net/api/",
                    // cdnPath: "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/",
                    cdnPath: live2d_path,
                    //移动端无需工具栏
                    tools: !isMobile() ? [
                        "hitokoto",
                        "asteroids",
                        "switch-model",
                        "switch-texture",
                        "photo",
                        "info",
                        "quit",
                    ] : [],
                })

                //（适配移动端）改变大小
                let waifu = document.querySelector("#waifu") as HTMLDivElement
                if (waifu) {
                    waifu.style.transformOrigin = "bottom"
                    waifu.style.transform = `scale(${scale.value})`
                }
            });
        }

        console.log(`
        く__,.ヘヽ.        /  ,ー､ 〉
                ＼ ', !-─‐-i  /  /´
                ／｀ｰ'       L/／｀ヽ､
                /   ／,   /|   ,   ,       ',
            ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
                ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
                !,/7 '0'     ´0iソ|    |
                |.从"    _     ,,,, / |./    |
                ﾚ'| i＞.､,,__  _,.イ /   .i   |
                    ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
                    | |/i 〈|/   i  ,.ﾍ |  i  |
                    .|/ /  ｉ：    ﾍ!    ＼  |
                    kヽ>､ﾊ    _,.ﾍ､    /､!
                    !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
                    ﾚ'ヽL__|___i,___,ンﾚ|ノ
                        ﾄ-,/  |___./
                        'ｰ'    !_,.:
        `);
    }
})

</script>

<style scoped></style>