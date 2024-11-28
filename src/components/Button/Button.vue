<template>
    <button :style="style" :class="btnClass" @click="onClick">
        <slot name="default">
            Button
        </slot>
    </button>
</template>

<script lang="ts" setup>
    const props = defineEmits<{
        // biome-ignore lint/complexity/noBannedTypes: <explanation>
        click: Function
    }>()
    defineProps<{
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        style?:any
    }>()

    const btnClass = "rounded dark:dark-btn p-2 bg-stone-300 transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"


    const onClick = (e: Event) => {
        props.click?.(e)
    }

</script>

<style scoped></style>