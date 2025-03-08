<script setup lang="ts">
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import { formatDisplayKey } from "~/src/modules/Onboarding/utils/onboardingUtils";

	const onboardingStore = useOnboardingStore();

	const accepted = ref(false);
	const questions = onboardingStore.questions;
	const answers = onboardingStore.answers;

	const flattenedAnswers = computed(() => {
		return questions.reduce(
			(acc, question) => {
				const originalKey = question.key;
				const displayKey = formatDisplayKey(originalKey);
				// Map through each field, get the corresponding answer, filter out empty strings, and join them with a comma.
				const answerText = question.fields
					.map((field) => {
						let answer = answers[originalKey]?.[field.key] ?? "";
						if (Array.isArray(answer)) {
							answer = answer.join(", ");
						}
						return answer;
					})
					.filter((text) => text !== "")
					.join(", ");

				// Store both the original key and the answer text.
				acc[displayKey] = {
					originalKey,
					answer: answerText,
				};
				return acc;
			},
			{} as Record<string, { originalKey: string; answer: string }>,
		);
	});
</script>

<template>
	<div>
		<!-- page label -->
		<p class="text-2xl mb-[20px] font-semibold">review of application</p>

		<!-- answer fields -->
		<div
			v-for="(value, displayKey) in flattenedAnswers"
			:key="value.originalKey"
			class="mb-2"
		>
			<span class="font-medium">{{ displayKey }}</span>
			<div
				class="w-full bg-gray-100 text-gray-700 px-5 py-5 rounded-md flex justify-between items-center"
			>
				<span>{{ value.answer }}</span>
				<button
					@click="
						() => {
							onboardingStore.cameFromReview = true;
							// Use the original key for navigation
							onboardingStore.jumpToQuestion(
								onboardingStore.getQuestionStepByKey(value.originalKey),
							);
						}
					"
					class="underline"
				>
					edit
				</button>
			</div>
		</div>

		<!-- TOS checkbox -->
		<div class="mt-3">
			<input type="checkbox" id="tos" v-model="onboardingStore.isTOSAccepted" />
			<label for="tos" class="mx-2">
				i accept creatormate's
				<a href="/#" class="underline">privacy policy</a>
				and
				<a href="/#" class="underline">terms of service</a>
			</label>
		</div>
	</div>
</template>
