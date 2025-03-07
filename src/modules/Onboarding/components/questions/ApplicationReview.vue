<script setup lang="ts">
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

	const onboardingStore = useOnboardingStore();

	const accepted = ref(false);
</script>

<template>
	<div>
		<!-- page label -->
		<p class="text-2xl mb-[20px] font-semibold">review of application</p>

		<!-- answer fields -->
		<div>
			<div class="mb-3">
				<span> test label </span>
				<div
					class="w-full bg-gray-100 text-gray-700 px-5 py-5 rounded-md flex justify-between items-center"
				>
					<span>test</span>
					<a href="#" class="underline">link</a>
				</div>
			</div>

			<div class="mb-3">
				<span> test label </span>
				<div
					class="w-full bg-gray-100 text-gray-700 px-5 py-5 rounded-md flex justify-between items-center"
				>
					<span>test</span>
					<a href="#" class="underline">link</a>
				</div>
			</div>
		</div>

		<!-- TOS checkbox -->
		<div class="mt-3">
			<input type="checkbox" id="tos" v-model="accepted" />
			<label for="tos" class="mx-2">
				i accept creatormate's
				<a href="/#" class="underline">privacy policy</a>
				and
				<a href="/#" class="underline">terms of service</a>
			</label>
		</div>
	</div>
</template>
