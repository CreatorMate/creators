<script setup lang="ts">
	const props = defineProps<{
		isMobile: boolean;
	}>();

	const emit = defineEmits<{
		(e: "click"): void;
	}>();
</script>

<template>
	<button
		:class="[
			isMobile
				? 'absolute left-4 block lg:hidden'
				: 'absolute left-[15%] hidden lg:block',
			'transition-all duration-150',
		]"
		@click="emit('click')"
	>
		<template v-if="isMobile">
			<img src="/icons/arrow-back.svg" alt="back" class="w-4 h-4" />
		</template>
		<template v-else> back </template>
	</button>
</template>
