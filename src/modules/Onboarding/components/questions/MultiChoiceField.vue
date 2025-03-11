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

	const value = computed<string[]>({
		get: () => {
			// Initialize answer object if it doesn't exist
			if (!onboardingStore.answers[questionKey.value]) {
				onboardingStore.answers[questionKey.value] = {};
			}
			const currentValue =
				onboardingStore.answers[questionKey.value][props.field.key];
			// If the current value is not an array, return an empty array
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

	// Toggle option selection: add if not selected, remove if selected
	function toggleOption(item: string) {
		if (Array.isArray(value.value)) {
			if (value.value.includes(item)) {
				removeOption(item);
			} else {
				addOption(item);
			}
		}
	}

	function clearSearch() {
		searchQuery.value = "";
	}
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
	</div>
</template>
