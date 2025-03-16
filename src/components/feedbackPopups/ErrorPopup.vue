<script setup lang="ts">
	const timeout = new Promise((resolve) => setTimeout(resolve, 10000));
</script>

<template>
	<div
		class="absolute top-8 right-8 w-48 h-32"
		:class="{ 'opacity-0': timeout }"
	>
		<div class="flex flex-col text-center bg-red-400 text-red-50 px-4 py-4">
			<span class="text-lg font-semibold">Error!</span>
			<div>Something went wrong. Please try again later.</div>
		</div>
	</div>
</template>

<style scoped></style>
