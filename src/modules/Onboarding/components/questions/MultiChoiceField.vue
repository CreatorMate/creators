<script setup lang="ts">
	import type { MultiChoiceField } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

	const props = defineProps<{
		field: MultiChoiceField;
	}>();

	const onboardingStore = useOnboardingStore();

	const searchQuery = ref("");

	// Get key of current question
	const questionKey = computed(() => onboardingStore.currentQuestion!.key);

	// Check if field has a search bar
	const hasSearchbar = computed(() => props.field.search === true);

	const value = computed({
		get: () => {
			// Initialize the question's answer object if it doesn't exist
			if (!onboardingStore.answers[questionKey.value]) {
				onboardingStore.answers[questionKey.value] = {};
			}
			// Return the current value or empty string/empty array depending on type
			const currentValue =
				onboardingStore.answers[questionKey.value][props.field.key];

			// If no value exists yet, return empty string or empty array based on field configuration
			if (currentValue === undefined) {
				// Check if field is configured to expect an array
				return [];
			}
			// Return existing value
			return currentValue;
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

	// Filter options based on search query
	const filteredOptions = computed(() => {
		if (!props.field.options) return [];

		// Ensure value.value is treated as an array
		const selectedOptions = Array.isArray(value.value) ? value.value : [];

		if (!searchQuery.value.trim()) {
			// Exclude selected options
			return props.field.options.filter(
				(option) => !selectedOptions.includes(option),
			);
		}

		const query = searchQuery.value.toLowerCase();
		return props.field.options
			.filter((option) => option.toLowerCase().includes(query))
			.filter((option) => !selectedOptions.includes(option)); // Exclude selected options
	});

	function addOption(item: string) {
		if (Array.isArray(value.value) && !value.value.includes(item)) {
			// Create a new array with the item added and update the value
			value.value = [...value.value, item];
		}
	}

	function removeOption(item: string) {
		if (Array.isArray(value.value)) {
			// Update value
			value.value = value.value.filter((option) => option !== item);
		}
	}

	function clearSearch() {
		searchQuery.value = "";
	}
</script>

<template>
	<!-- search bar (if applicable) -->
	<div v-if="hasSearchbar" class="mb-4">
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

	<!-- selected options -->
	<div class="mb-2">
		<p class="mt-2 mb-2 font-medium">selected options:</p>
		<div class="flex flex-wrap gap-2">
			<p
				v-for="option in value"
				:key="option"
				class="px-3 py-1 bg-black text-white rounded-full cursor-pointer"
				@click="removeOption(option as unknown as string)"
			>
				<!-- TODO: fix the type casting of `option` in `removeOption(option)` -->
				{{ option }} ×
			</p>
			<p
				v-if="Array.isArray(value) && value.length === 0"
				class="text-gray-400 italic"
			>
				no options selected
			</p>
		</div>
	</div>

	<!-- available options-->
	<div v-if="field.options && field.options.length > 0" class="mb-4">
		<p class="mb-2 font-medium">available options:</p>
		<div class="flex flex-wrap gap-2 mt-2">
			<button
				v-for="option in filteredOptions"
				:key="option"
				@click="addOption(option)"
				class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
			>
				{{ option }}
			</button>
		</div>
		<p
			v-if="filteredOptions.length === 0 && searchQuery"
			class="text-gray-500 mt-2 italic"
		>
			no options match your search
		</p>
	</div>
</template>
