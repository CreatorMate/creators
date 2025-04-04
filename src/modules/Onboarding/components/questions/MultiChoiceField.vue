<script setup lang="ts">
	import type { MultiChoiceFieldType } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import { validateMultiChoiceField } from "~/src/modules/Onboarding/utils/onboardingValidators";
	import LoadingSpinner from "~/src/components/Loading/LoadingSpinner.vue";
	import { API } from "~/src/utils/API/API";
	import type { APIResponse } from "~/src/api/utils/HonoResponses";

	const props = defineProps<{
		field: MultiChoiceFieldType;
	}>();

	const onboardingStore = useOnboardingStore();

	const options = ref<string[]>([]);
	const loading = ref(false);
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
		if (!options.value) return [];
		if (!searchQuery.value.trim()) return options.value;
		const query = searchQuery.value.toLowerCase();
		return options.value.filter((option) =>
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

	onMounted(async () => {
		// Fetch options from backend
		try {
			const response: APIResponse<{ options: string[] }> = await API.ask(
				`onboarding/field_options?key=${props.field.key}`,
			);
			if (!response.success) {
				console.error("Error fetching options:", response.error);
				return;
			}
			if (response.data) {
				options.value = response.data.options;
				console.log(options);
			}
		} catch (error) {
			console.error("Error fetching options:", error);
		}
	});
</script>

<template>
	<!-- Show Spinner while options are loading -->
	<LoadingSpinner v-if="loading" color="#3498db" :size="30" :large="true" />

	<!-- Once loaded, render the search bar and options -->
	<div v-else>
		<div v-if="hasSearchbar" class="mb-4 mt-3">
			<div class="relative">
				<input
					v-model="searchQuery"
					type="text"
					placeholder="search"
					class="w-full h-[72px] pl-10 bg-gray-100 text-gray-700 px-5 py-5 rounded-md focus:outline-none"
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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>

		<div v-if="options && options.length" class="mb-4">
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
			<p v-if="isTouched && fieldError" class="text-red-500 text-sm mt-1">
				{{ fieldError }}
			</p>
		</div>
	</div>
</template>
