<script setup lang="ts">
	import type { SocialMediaField } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

	const props = defineProps<{
		field: SocialMediaField;
	}>();

	const { field } = toRefs(props);

	const onboardingStore = useOnboardingStore();

	const questionKey = computed(() => onboardingStore.currentQuestion!.key);
</script>

<template>
	<div class="flex w-[638px] flex-col items-start gap-6">
		<div class="flex w-full items-center justify-between">
			<div class="flex w-[351.5px] items-center gap-3">
				<img
					:src="field.socialMediaIcon"
					alt=""
					class="w-6 h-6 flex-shrink-0 aspect-square"
				/>
				<p
					class="text-black text-[16px] font-medium leading-[24px] tracking-[-0.32px]"
				>
					{{ field.socialMediaName }}
					<span v-if="field.required"> (required)</span>
					<span v-else class="opacity-50"> (optional) </span>
				</p>
			</div>

			<button class="px-5 py-2 bg-gray-100 rounded-lg">connect</button>
		</div>
	</div>
</template>
