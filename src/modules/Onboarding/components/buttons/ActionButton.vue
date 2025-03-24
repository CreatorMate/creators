<script setup lang="ts">
	import type { RouteLocationRaw } from "vue-router";

	const props = defineProps<{
		to: RouteLocationRaw;
		isMobile?: boolean;
	}>();
</script>

<template>
	<NuxtLink
		:to="to"
		:class="[
			isMobile ? 'text-sm px-3 py-2' : 'px-5 py-2 hover:bg-[#E9E9E9]',
			'flex items-center gap-2 rounded-lg transition-all duration-150',
		]"
	>
		<slot></slot>
	</NuxtLink>
</template>
