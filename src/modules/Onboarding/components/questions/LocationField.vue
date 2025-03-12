<script setup lang="ts">
	import type { LocationField } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

	const props = defineProps<{
		field: LocationField;
	}>();

	const onboardingStore = useOnboardingStore();

	const searchQuery = ref("");

	// Hard-coded list of popular cities.
	const popularCities: string[] = [
		"New York, USA",
		"London, UK",
		"Tokyo, Japan",
		"Paris, France",
		"Amsterdam, Netherlands",
		"Berlin, Germany",
	];

	// The list of cities displayed in the results tab.
	// Initially shows popular cities.
	const results = ref<string[]>([...popularCities]);

	// Get key of current question
	const questionKey = computed(() => onboardingStore.currentQuestion!.key);

	// Create a computed property to manage the selected city.
	// This field is designed to allow only a single selection.
	const value = computed<string>({
		get: () => {
			if (!onboardingStore.answers[questionKey.value]) {
				onboardingStore.answers[questionKey.value] = {};
			}
			const currentValue =
				onboardingStore.answers[questionKey.value][props.field.key];
			return typeof currentValue === "string" ? currentValue : "";
		},
		set: (newValue: string) => {
			if (!onboardingStore.answers[questionKey.value]) {
				onboardingStore.answers[questionKey.value] = {};
			}
			onboardingStore.setAnswer(props.field.key, newValue);
		},
	});

	// Filter the results to exclude the currently selected city.
	const filteredResults = computed(() => {
		return value.value
			? results.value.filter((city) => city !== value.value)
			: results.value;
	});

	// Watch the search query for changes.
	watch(searchQuery, async (newQuery) => {
		// If the search query is empty, reset to popular cities.
		if (!newQuery.trim()) {
			results.value = [...popularCities];
			return;
		}

		try {
			const response = await fetch(
				`API/onboarding/countries?search=${newQuery}`,
			);
			if (response.ok) {
				const json = await response.json();
				// Parse and update results
				if (json.success && json.data && Array.isArray(json.data.results)) {
					results.value = json.data.results;
				} else {
					console.error("Unexpected response structure:", json);
				}
			} else {
				console.error("Error fetching data:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	});

	// When a city is selected, update the stored value.
	function selectCity(city: string) {
		value.value = city;
	}

	function removeCity(city: string) {
		value.value = "";
	}

	// Clears the current search query.
	function clearSearch() {
		searchQuery.value = "";
	}
</script>

<template>
	<div class="location-field">
		<!-- Search bar -->
		<div class="mb-4 mt-3">
			<div class="relative">
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Search cities"
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

		<!-- Display the currently selected city -->
		<div class="mt-4 mb-4">
			<p class="mb-2 font-medium">selected city</p>
			<button
				v-if="value"
				@click="removeCity(value)"
				class="px-3 py-1 bg-black text-white rounded-lg transition"
			>
				{{ value }}
			</button>
			<p v-if="!value" class="text-gray-500 mt-2 italic">
				no city has been selected.
			</p>
		</div>

		<!-- Results Tab -->
		<div class="mb-4">
			<p class="mb-2 font-medium">select your city</p>
			<div class="flex flex-wrap gap-1 mt-2">
				<button
					v-for="city in filteredResults"
					:key="city"
					@click="selectCity(city)"
					:class="
						value === city
							? 'px-3 py-1 bg-black text-white rounded-lg transition'
							: 'px-3 py-1 bg-gray-100 hover:bg-gray-200 text-black rounded-lg transition'
					"
				>
					{{ city }}
				</button>
			</div>
			<p
				v-if="filteredResults.length === 0 && searchQuery"
				class="text-gray-500 mt-2 italic"
			>
				no cities match your search.
			</p>
		</div>
	</div>
</template>
