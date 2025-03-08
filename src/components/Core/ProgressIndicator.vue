<script setup lang="ts">
	const props = defineProps<{
		step: number;
		total: number;
		width?: number;
		height?: number;
	}>();

	const { step, total, width, height } = toRefs(props);

	const stepWidth = computed(() => width?.value ?? 24); // Default: 24px
	const stepHeight = computed(() => height?.value ?? 4); // Default: 4px
</script>

<template>
	<section class="w-full">
		<div class="flex items-center gap-1">
			<div
				v-for="index in total"
				:key="index"
				class="rounded-md"
				:style="{
					width: `${stepWidth}px`,
					height: `${stepHeight}px`,
					borderRadius: '2px',
					backgroundColor: index <= step ? 'black' : '#E5E7EB',
				}"
			></div>
		</div>
	</section>
</template>
