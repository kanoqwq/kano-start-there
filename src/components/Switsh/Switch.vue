<template>
<div>
	<label>
		<div :class="{ active: modelValue }"
			class="switch text-center rounded dark:dark-btn p-2 bg-stone-300 transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
			{{ text }}</div>
		<input class="inline-block w-5 h-5 align-sub" type="checkbox" :checked="modelValue ? true : false"
			@click="toggle" />
	</label>
</div>
</template>

<script lang="ts" setup>
	import { ref } from "vue";

	defineProps<{
		text: string,
		modelValue: Boolean,
	}>()

	const emit = defineEmits(['update:modelValue']);

	const toggle = (e: any) => {
		emit('update:modelValue', e.target.checked)
	};
</script>

<style lang="less" scoped>
	.switch {
		padding: 6px 10px;
		user-select: none;
	}

	input {
		display: none;
	}

	.active {
		background-color: #41B883;
		color: #fff;
	}
</style>
