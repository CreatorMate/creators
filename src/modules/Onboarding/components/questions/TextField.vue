<script setup lang="ts">
	import type { TextFieldType } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import { validateTextField } from "~/src/modules/Onboarding/utils/onboardingValidators";

	const props = defineProps<{
		field: TextFieldType;
	}>();

	const emit = defineEmits<{
		(e: "enter", inputEl: HTMLInputElement | null): void;
	}>();

	const onboardingStore = useOnboardingStore();

	// Get key of current question
	const questionKey = computed(() => onboardingStore.currentQuestion!.key);

	// Check if field has an icon
	const hasIcon = computed(() => !!props.field.icon);

	// Local state for tracking if field has been touched
	const isTouched = ref(false);

	// Local state for field-specific error message
	const fieldError = ref("");

	// Track validation state
	const isValid = ref(false);

	const inputEl = ref<HTMLInputElement | null>(null);

	const value = ref(
		onboardingStore.answers[questionKey.value]?.[props.field.key] || "",
	);

	// Function to validate the text field and update the error message
	function validateField() {
		const { valid, errorMessage } = validateTextField(
			props.field,
			value.value as string,
		);
		fieldError.value = !valid && errorMessage ? errorMessage : "";
		isValid.value = valid;
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

	// Restrict input and show error when max is reached
	function handleKeyDown(e: KeyboardEvent) {
		const max = props.field.maxLength;
		// Allow control keys
		const allowedKeys = [
			"Backspace",
			"Delete",
			"ArrowLeft",
			"ArrowRight",
			"Tab",
		];
		if (
			max &&
			(value.value as string).length >= max &&
			!allowedKeys.includes(e.key)
		) {
			e.preventDefault();
			fieldError.value = `max length of ${max} reached`;
		} else {
			fieldError.value = "";
		}
	}

	// Watch for changes in the field value and revalidate if the field has been touched
	watch(value, () => {
		if (isTouched.value) {
			validateField();
		}
	});

	// Watch for value changes
	watch(value, (newValue) => {
		if (newValue === "" || isValid.value || !isTouched.value) {
			onboardingStore.setAnswer(props.field.key, newValue);
		}
	});

	onMounted(() => {
		// Only validate initially if there's already a value
		if (value.value) {
			isTouched.value = true;
			validateField();
		}
	});

	// Expose a focus method so the parent can programmatically focus this field.
	defineExpose({
		focus: () => {
			inputEl.value?.focus();
		},
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
			<input
				v-model="value"
				ref="inputEl"
				class="w-full h-[72px] bg-gray-100 text-gray-700 px-5 py-5 rounded-md focus:outline-none"
				:class="{
					'pl-10': hasIcon,
				}"
				type="text"
				:placeholder="field.placeholder || ''"
				@blur="markAsTouched"
				@keydown.enter.prevent="handleEnter"
				@keydown="handleKeyDown"
			/>
			<div
				v-if="hasIcon"
				class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
			>
				<img
					v-if="typeof field.icon === 'string'"
					:src="field.icon"
					alt=""
					class="w-5 h-5"
				/>
			</div>
		</div>
		<!-- Field-specific error message -->
		<p v-if="isTouched && fieldError" class="text-red-500 text-sm mt-1">
			{{ fieldError }}
		</p>
	</div>
</template>
