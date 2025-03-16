<script setup lang="ts">
	import type { LocationFieldType } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import { popularCities } from "~/src/modules/Onboarding/constants/popularCities";
    import {API} from "~/src/utils/API/API";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";

	const props = defineProps<{
		field: LocationFieldType;
	}>();

	const onboardingStore = useOnboardingStore();

	const searchQuery = ref("");

    //@todo create database for the popular cities, every time someone saves a new one from the ai add it to the popular cities table, when searhing first look in the table before using AI.
	const results = ref<string[]>([...popularCities]);


	const questionKey = computed(() => onboardingStore.currentQuestion!.key);
    let timeoutId: NodeJS.Timeout | null = null;

	// Create a computed property to manage the selected city.
	// This field is designed to allow only a single selection.
	const value = computed<string>({
		get: () => {
			if (!onboardingStore.answers[questionKey.value]) {
				onboardingStore.answers[questionKey.value] = {};
			}
			const currentValue =
				onboardingStore.answers[questionKey.value][props.field.key];
			return typeof currentValue === "string" ? currentValue : ""; // typescript compiler wants to simplify this, but it breaks if you try to do it
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

	async function getNewOptions() {
        // If the search query is empty, reset to popular cities.
        if (!searchQuery.value.trim()) {
            results.value = [...popularCities];
            return;
        }

        const response: APIResponse<{results: string[]}> = await API.ask(`onboarding/countries?search=${searchQuery.value}`)

        if(!response.success) {
            console.error("something went wrong",);
            return;
        }

        results.value = response.data.results;
    };

    const debounce = <T extends (...args: any[]) => any>(
        func: T,
        delay: number
    ) => {
        return (...args: Parameters<T>) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func(...args);
                timeoutId = null;
            }, delay);
        };
    };

    const debouncedFunction = debounce(getNewOptions, 300);

    const handleInput = () => {
        debouncedFunction();
    };

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
                    @input="handleInput()"
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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10
              8.586l4.293-4.293a1 1 0 011.414
              1.414L11.414 10l4.293 4.293a1
              1 0 01-1.414 1.414L10 11.414l-4.293
              4.293a1 1 0 01-1.414-1.414L8.586
              10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
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
