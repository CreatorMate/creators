<script setup lang="ts">
	import type { TextAreaFieldType } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import { validateTextareaField } from "~/src/modules/Onboarding/utils/onboardingValidators";

	const props = defineProps<{
		field: TextAreaFieldType;
	}>();

	const onboardingStore = useOnboardingStore();

	// Get key of current question
	const questionKey = computed(() => onboardingStore.currentQuestion!.key);

	// Local state for tracking if field has been touched
	const isTouched = ref(false);

	// Local state for field-specific error message
	const fieldError = ref("");

	const value = computed({
		get: () => {
			// Initialize the question's answer object if it doesn't exist
			if (!onboardingStore.answers[questionKey.value]) {
				onboardingStore.answers[questionKey.value] = {};
			}
			// Return the current value or empty string
			return (
				(onboardingStore.answers[questionKey.value][
					props.field.key
				] as string) || ""
			);
		},
		set: (newValue) => {
			// Initialize the question's answer object if it doesn't exist
			if (!onboardingStore.answers[questionKey.value]) {
				onboardingStore.answers[questionKey.value] = {};
			}
			// Update answer
			onboardingStore.setAnswer(props.field.key, newValue);
		},
	});

	// Function to validate the textarea field and update the error message
	function validateField() {
		const { valid, errorMessage } = validateTextareaField(
			props.field,
			value.value as string,
		);
		fieldError.value = !valid && errorMessage ? errorMessage : "";
	}

	// Mark field as touched and run validation
	function markAsTouched() {
		isTouched.value = true;
		onboardingStore.setFieldTouched(questionKey.value, props.field.key);
		validateField();
	}

	// Watch for changes in the field value and revalidate if the field has been touched
	watch(value, () => {
		if (isTouched.value) {
			validateField();
		}
	});
</script>

<template>
	<div class="mb-4">
		<span class="block mb-2 font-medium"
			>{{ field.label ? field.label : "" }}
			<span v-if="field.required"> (required)</span>
			<span v-else class="opacity-50"> (optional) </span>
		</span>

		<div class="relative">
			<textarea
				v-model="value"
				class="w-full bg-gray-100 text-gray-700 px-5 py-5 h-[150px] rounded-md focus:outline-none"
				type="text"
				:placeholder="field.placeholder || ''"
				@blur="markAsTouched"
			></textarea>
		</div>
		<!-- Field-specific error message -->
		<p v-if="isTouched && fieldError" class="text-red-500 text-sm mt-1">
			{{ fieldError }}
		</p>
	</div>
</template>
