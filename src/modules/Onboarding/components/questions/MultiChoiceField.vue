<script setup lang="ts">
	import type { MultiChoiceField } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import { validateMultiChoiceField } from "~/src/modules/Onboarding/utils/onboardingUtils";

	const props = defineProps<{
		field: MultiChoiceField;
	}>();

	const onboardingStore = useOnboardingStore();

	const searchQuery = ref("");

	// Get key of current question
	const questionKey = computed(() => onboardingStore.currentQuestion!.key);

	// Check if field has a search bar
	const hasSearchbar = computed(() => props.field.search === true);

	// Local state for tracking if field has been touched
	const isTouched = ref(false);

	// Local state for field-specific error message
	const fieldError = ref("");

	// Computed property for the field value
	const value = computed<string[]>({
		get: () => {
			// Initialize answer object if it doesn't exist
			if (!onboardingStore.answers[questionKey.value]) {
				onboardingStore.answers[questionKey.value] = {};
			}
			const currentValue =
				onboardingStore.answers[questionKey.value][props.field.key];
			// Return an array if the current value is valid, otherwise an empty array
			return Array.isArray(currentValue) ? currentValue : [];
		},
		set: (newValue: string[]) => {
			if (!onboardingStore.answers[questionKey.value]) {
				onboardingStore.answers[questionKey.value] = {};
			}
			onboardingStore.setAnswer(props.field.key, newValue);
		},
	});

	// Filter options based on search query
	const displayedOptions = computed(() => {
		if (!props.field.options) return [];
		if (!searchQuery.value.trim()) return props.field.options;
		const query = searchQuery.value.toLowerCase();
		return props.field.options.filter((option) =>
			option.toLowerCase().includes(query),
		);
	});

	// Function to add an option if not already selected and within maxChoices
	function addOption(item: string) {
		if (Array.isArray(value.value) && !value.value.includes(item)) {
			// If maxChoices exists and adding another option would exceed it, do nothing.
			if (
				props.field.maxChoices &&
				value.value.length >= props.field.maxChoices
			) {
				return;
			}
			// Update value with the new option added
			value.value = [...value.value, item];
		}
	}

	// Function to remove an option
	function removeOption(item: string) {
		if (Array.isArray(value.value)) {
			value.value = value.value.filter((option) => option !== item);
		}
	}

	// Toggle option selection: remove if selected, add if not (only if within maxChoices)
	function toggleOption(item: string) {
		if (Array.isArray(value.value)) {
			if (value.value.includes(item)) {
				removeOption(item);
			} else {
				// Only add if it doesn't exceed maxChoices
				if (
					props.field.maxChoices &&
					value.value.length >= props.field.maxChoices
				) {
					return;
				}
				addOption(item);
			}

			// Mark the field as touched and revalidate on every toggle
			markAsTouched();
		}
	}

	// Function to clear the search query
	function clearSearch() {
		searchQuery.value = "";
	}

	// Function to validate the multi-choice field and update the error message
	function validateField() {
		const { valid, errorMessage } = validateMultiChoiceField(
			props.field,
			value.value,
		);
		fieldError.value = !valid && errorMessage ? errorMessage : "";
	}

	// Mark the field as touched and run validation
	function markAsTouched() {
		isTouched.value = true;
		onboardingStore.setFieldTouched(questionKey.value, props.field.key);
		validateField();
	}

	// Watch for changes in the field value and revalidate if touched
	watch(value, () => {
		if (isTouched.value) {
			validateField();
		}
	});
</script>

<template>
	<!-- Search bar (if applicable) -->
	<div v-if="hasSearchbar" class="mb-4 mt-3">
		<div class="relative">
			<input
				v-model="searchQuery"
				type="text"
				placeholder="search"
				class="w-full pl-10 bg-gray-100 text-gray-700 px-5 py-5 rounded-md focus:outline-none"
			/>
			<div
				class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
			>
				<img
					src="/icons/search.svg"
					alt="Search"
					class="w-4 h-4 text-gray-400"
				/>
			</div>
			<button
				v-if="searchQuery"
				@click="clearSearch"
				class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
			>
				×
			</button>
		</div>
	</div>

	<!-- Options section -->
	<div
		v-if="props.field.options && props.field.options.length > 0"
		class="mb-4"
	>
		<p class="mb-2 font-medium">selected roles:</p>
		<div class="flex flex-wrap gap-1 mt-2">
			<button
				v-for="option in displayedOptions"
				:key="option"
				@click="toggleOption(option)"
				:class="
					value.includes(option)
						? 'px-3 py-1 bg-black text-white rounded-lg transition'
						: 'px-3 py-1 bg-gray-100 hover:bg-gray-200 text-black rounded-lg transition'
				"
				:disabled="
					!value.includes(option) &&
					(props.field.maxChoices
						? value.length >= props.field.maxChoices
						: false)
				"
			>
				{{ option }}
			</button>
		</div>
		<p
			v-if="displayedOptions.length === 0 && searchQuery"
			class="text-gray-500 mt-2 italic"
		>
			no options match your search
		</p>
		<!-- Field-specific error message -->
		<p v-if="isTouched && fieldError" class="text-red-500 text-sm mt-1">
			{{ fieldError }}
		</p>
	</div>
</template>
