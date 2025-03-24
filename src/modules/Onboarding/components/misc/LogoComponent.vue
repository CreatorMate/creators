<script setup lang="ts">
	const props = defineProps<{
		isMobile: {
			type: Boolean;
			default: false;
		};
	}>();
</script>

<template>
	<div>
		<!-- Desktop Logo -->
		<img
			v-if="!isMobile"
			src="/creatormate.svg"
			alt="creatormate-logo"
			class="h-[15.134px] w-[128px] hidden lg:block"
		/>
		<!-- Mobile Logo -->
		<img
			v-else
			src="/logo.png"
			alt="cm"
			class="h-[10px] w-[26.6px] block lg:hidden"
		/>
	</div>
</template>
