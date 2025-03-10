<script setup lang="ts">
	import type { SocialMediaField } from "~/src/modules/Onboarding/types/onboardingTypes";

	const props = defineProps<{ field: SocialMediaField }>();
</script>

<template>
	<div
		class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
	>
		<div class="bg-white p-6 rounded-lg shadow-lg w-[400px] relative mx-5">
			<button
				class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
				@click="$emit('close')"
			>
				✖
			</button>
			<h2 class="text-lg font-semibold mb-4">your linked instagram accounts</h2>
			<p class="mb-4 text-[#3C3C3C]">
				select which of your linked instagram accounts you'd like to submit with
				your application.
			</p>
			<button
				class="bg-black text-white w-full py-2 rounded-lg"
				@click="$emit('close')"
			>
				link to creatormate
			</button>
		</div>
	</div>
</template>
