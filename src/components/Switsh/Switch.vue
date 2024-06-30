<template>
<div>
	<label>
		<div :class="{ active: modelValue }"
			class="text-center switch rounded transition-all bg-gray-600 hover:bg-gray-500 ">
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
