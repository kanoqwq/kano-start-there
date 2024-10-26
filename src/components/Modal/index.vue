<template>
<Teleport to="body">
    <Transition name="fade">
        <div class="modal-box" v-show="show">
            <div class="mask" @click.capture="close"></div>
            <div class="modal dark:dark-modal">
                <slot name="default">
                    template
                </slot>
            </div>
        </div>
    </Transition>
</Teleport>
</template>

<script setup lang='ts'>
    defineProps<{
        show: boolean
    }>()
    const emit = defineEmits<{
        (event: 'close'): void
    }>()

    //关闭模态框
    const close = (e: Event) => {
        if (e.cancelable) {
            emit('close')
        }
    }
</script>

<style lang="less">
    @media(max-width:650px) {
        .item {
            flex-direction: column;
        }

        .option {
            height: 100% !important;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            span,
            input,
            button {
                margin: 5px;
            }

            .input {
                height: 30px;
            }

        }
    }

    .modal-box {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        width: 100vw;
        height: 100vh;
        backdrop-filter: blur(10px);

        .mask {
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, .3);
        }

        .modal {
            position: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            max-width: 600px;
            overflow: hidden;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -60%);
            width: 70%;
            background-color: rgba(255, 255, 255, .3);
            color: #000;
            border-radius: 10px;
            box-shadow: 0px 0px 15px #ffffff96;


            .tab {
                width: 100%;
                height: 30px;
                margin-bottom: 10px;

                .tab-content {
                    width: 20%;
                    height: 100%;
                    margin: 0 10px;
                    overflow: hidden;
                    white-space: nowrap;
                    word-wrap: none;
                }

                .tab-active {
                    border-bottom: 2px solid #ccc;
                }
            }

            .option {
                overflow: hidden;
                margin: 10px 0;
                align-items: center;

                .input {
                    padding: 10px;
                    background-color: rgb(31 41 55 / .5);
                    outline: none;
                }

                button {
                    height: 100%;
                }
            }
        }
    }


    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.3s ease;
        transform: scale(1);

    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
        transform: scale(1.2);

    }
</style>