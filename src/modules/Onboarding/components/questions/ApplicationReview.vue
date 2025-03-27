<script setup lang="ts">
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import { formatDisplayKey } from "~/src/modules/Onboarding/utils/onboardingValidators";

	const onboardingStore = useOnboardingStore();

	const questions = onboardingStore.questions;
	const answers = onboardingStore.answers;

	const flattenedAnswers = computed(() => {
		return questions.map((question) => {
			const originalKey = question.key;
			const displayKey = formatDisplayKey(originalKey);

			// Map each field individually
			const fields = question.fields.map((field) => {
				let answer = answers[originalKey]?.[field.key] ?? "";
				if (Array.isArray(answer)) {
					answer = answer.join(", ");
				}
				return {
					fieldKey: field.key,
					displayField: formatDisplayKey(field.key),
					answer,
				};
			});
			return {
				originalKey,
				displayKey,
				fields,
			};
		});
	});

	onMounted(() => {
		onboardingStore.isTOSAccepted = false;
	});
</script>

<template>
	<div>
		<!-- page label -->
		<p class="text-2xl mb-[20px] font-semibold">review of application</p>

		<!-- answer fields -->
		<div
			v-for="question in flattenedAnswers"
			:key="question.originalKey"
			class="mb-4"
		>
			<p class="font-medium text-lg">{{ question.displayKey }}</p>
			<div v-for="(field, index) in question.fields" :key="index" class="mb-2">
				<div
					class="w-full min-h-[72px] bg-gray-100 text-gray-700 px-5 py-5 rounded-md flex justify-between items-center"
				>
					<div class="max-w-[90%] break-words flex-grow pr-4">
						<!-- Optionally, show the field label -->
						<span class="font-semibold">{{ field.displayField }}: </span>
						<span>{{ field.answer }}</span>
					</div>
					<button
						@click="
							() => {
								onboardingStore.cameFromReview = true;
								// Navigate using the original key (you could enhance this to jump to a specific field if needed)
								onboardingStore.jumpToQuestion(
									onboardingStore.getQuestionStepByKey(question.originalKey),
								);
							}
						"
						class="underline"
					>
						Edit
					</button>
				</div>
			</div>
		</div>

		<!-- TOS checkbox -->
		<div class="mt-3">
			<input type="checkbox" id="tos" v-model="onboardingStore.isTOSAccepted" />
			<label for="tos" class="mx-2">
				i accept creatormate's
				<a
					href="https://creatormate.com/privacy-policy"
					target="_blank"
					class="underline"
					>privacy policy</a
				>
				and
				<a
					href="https://creatormate.com/terms-of-service"
					target="_blank"
					class="underline"
					>terms of service</a
				>
			</label>
		</div>
	</div>
</template>
