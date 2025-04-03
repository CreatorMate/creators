<script setup lang="ts">
	import MobileNavigation from "~/src/components/Navigation/MobileNavigation.vue";
</script>

<template>
	<div class="flex w-full justify-center py-6">
		<NuxtImg class="w-10" src="/logo-light.svg" />
	</div>
	<section class="w-full flex gap-1 text-size-XS">
		<MobileNavigation> </MobileNavigation>
	</section>
</template>
