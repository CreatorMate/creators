<script setup lang="ts">
	import type { DateFieldType } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import { validateDateField } from "~/src/modules/Onboarding/utils/onboardingValidators";

	const props = defineProps<{
		field: DateFieldType;
	}>();

	const emit = defineEmits<{
		(e: "enter", inputEl: HTMLInputElement | null): void;
	}>();

	const onboardingStore = useOnboardingStore();

	// Get key of current question
	const questionKey = computed(() => onboardingStore.currentQuestion!.key);

	// Local state for tracking if field has been touched
	const isTouched = ref(false);

	// Local state for field-specific error message
	const fieldError = ref("");

	const inputEl = ref<HTMLInputElement | null>(null);

	const value = computed({
		get: () => {
			// Initialize the question's answer object if it doesn't exist
			if (!onboardingStore.answers[questionKey.value]) {
				onboardingStore.answers[questionKey.value] = {};
			}
			// Return the current value or empty string
			return onboardingStore.answers[questionKey.value][props.field.key] || "";
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

	// Function to validate the date field and update the error message
	function validateField() {
		const { valid, errorMessage } = validateDateField(
			props.field,
			value.value as Date,
		);
		fieldError.value = !valid && errorMessage ? errorMessage : "";
	}

	// Mark field as touched and run validation
	function markAsTouched() {
		isTouched.value = true;
		onboardingStore.setFieldTouched(questionKey.value, props.field.key);
		validateField();
	}

	function handleEnter() {
		emit("enter", inputEl.value);
	}

	// Expose a focus method so the parent can programmatically focus this field.
	defineExpose({
		focus: () => {
			inputEl.value?.focus();
		},
	});

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

		<input
			v-model="value"
			ref="inputEl"
			class="w-full h-[72px] bg-gray-100 text-gray-700 px-5 py-5 rounded-md focus:outline-none"
			type="date"
			@blur="markAsTouched"
			@keydown.enter.prevent="handleEnter"
		/>
		<!-- Field-specific error message -->
		<p v-if="isTouched && fieldError" class="text-red-500 text-sm mt-1">
			{{ fieldError }}
		</p>
	</div>
</template>
