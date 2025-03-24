<script setup lang="ts">
	const props = defineProps<{
		isMobile: boolean;
		disabled: boolean;
	}>();

	const emit = defineEmits<{
		(e: "click"): void;
	}>();
</script>

<template>
	<button
		:class="[
			isMobile
				? 'fixed bottom-4 mx-auto left-0 right-0 w-[95%]'
				: 'fixed bottom-4 right-[15%]',
			'bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150',
		]"
		@click="emit('click')"
		:disabled="disabled"
	>
		<slot></slot>
	</button>
</template>
