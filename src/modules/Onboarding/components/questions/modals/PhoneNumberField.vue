<script setup lang="ts">
	import { ref, computed, watch, onMounted } from "vue";
	import {
		getCountries,
		getCountryCallingCode,
		parsePhoneNumberFromString,
	} from "libphonenumber-js";
	import type { PhoneNumberFieldType } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

	const props = defineProps<{
		field: PhoneNumberFieldType;
	}>();

	const emit = defineEmits<{
		(e: "enter", inputEl: HTMLInputElement | null): void;
	}>();

	// Dynamic list of countries and their calling codes.
	// This uses the `libphonenumber-js` library
	const allCountries = getCountries().map((countryCode) => ({
		code: `+${getCountryCallingCode(countryCode)}`,
		country: countryCode,
	}));

	const dropdownOpen = ref(false);
	const searchQuery = ref("");

	// Filter country codes when searching
	const filteredCountryCodes = computed(() => {
		if (!searchQuery.value) return allCountries;
		return allCountries.filter(
			(c) =>
				c.country.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
				c.code.includes(searchQuery.value),
		);
	});

	const onboardingStore = useOnboardingStore();
	const questionKey = computed(() => onboardingStore.currentQuestion!.key);

	const isTouched = ref(false);
	const fieldError = ref("");
	const isValid = ref(false);
	const inputEl = ref<HTMLInputElement | null>(null);

	// Default to the first country code in the list (or a user-provided default).
	const selectedCountryCode = ref(allCountries[0].code);
	const value = ref("");

	function validateField() {
		const fullPhoneNumber = `${selectedCountryCode.value}${value.value}`;
		const phoneNumber = parsePhoneNumberFromString(fullPhoneNumber);
		if (!phoneNumber || !phoneNumber.isValid()) {
			fieldError.value = `${props.field.label} is not a valid phone number`;
			isValid.value = false;
		} else {
			fieldError.value = "";
			isValid.value = true;
		}
	}

	function markAsTouched() {
		isTouched.value = true;
		onboardingStore.setFieldTouched(questionKey.value, props.field.key);
		validateField();
	}

	function handleEnter() {
		emit("enter", inputEl.value);
	}

	// Restrict input for the phone number field to only allow digit input
	function handleKeyDown(e: KeyboardEvent) {
		const allowedKeys = [
			"Backspace",
			"Delete",
			"ArrowLeft",
			"ArrowRight",
			"Tab",
		];
		if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
			e.preventDefault();
		}
	}

	// Select country when user selects a country from the dropdown
	function selectCountry(code: string) {
		selectedCountryCode.value = code;
		dropdownOpen.value = false;
		searchQuery.value = "";
	}

	watch([value, selectedCountryCode], () => {
		if (isTouched.value) {
			validateField();
		}
	});

	// Watch for changes to update store answer
	watch([value, selectedCountryCode], ([newValue, newCountryCode]) => {
		const fullPhoneNumber = `${newCountryCode}${newValue}`;
		if (newValue === "" || isValid.value || !isTouched.value) {
			onboardingStore.setAnswer(props.field.key, fullPhoneNumber);
		}
	});

	// On mount, we parse any existing phone number in the store
	onMounted(() => {
		const savedValue =
			onboardingStore.answers[questionKey.value]?.[props.field.key] || "";

		// Parse and split prefix
		if (savedValue) {
			const phoneNumber = parsePhoneNumberFromString(savedValue as string);
			if (phoneNumber && phoneNumber.isValid()) {
				const prefix = `+${phoneNumber.countryCallingCode}`;
				const matchedCountry = allCountries.find((c) => c.code === prefix);
				selectedCountryCode.value = matchedCountry
					? matchedCountry.code
					: prefix;

				value.value = phoneNumber.nationalNumber;
			} else {
				selectedCountryCode.value =
					props.field.defaultCountryCode || allCountries[0].code;
				value.value = "";
			}
			isTouched.value = true;
			validateField();
		} else {
			// If there's no saved value, just use the default
			selectedCountryCode.value =
				props.field.defaultCountryCode || allCountries[0].code;
		}
	});

	defineExpose({
		focus: () => {
			inputEl.value?.focus();
		},
	});
</script>

<template>
	<div class="mb-4">
		<span class="block mb-2 font-medium">
			{{ field.label || "" }}
			<span v-if="field.required"> (required)</span>
			<span v-else class="opacity-50"> (optional)</span>
		</span>

		<!-- prefix + phone number container -->
		<div
			class="flex items-center h-[72px] bg-gray-100 text-gray-700 rounded-md relative focus:outline-none"
		>
			<!-- country code dropdown area -->
			<div class="relative">
				<div
					@click="dropdownOpen = !dropdownOpen"
					class="px-3 py-3 border-r border-gray-300 cursor-pointer min-w-[80px] text-center"
				>
					<span v-if="!dropdownOpen">{{ selectedCountryCode }}</span>
					<span v-else>Select</span>
				</div>

				<!-- dropdown menu -->
				<div
					v-if="dropdownOpen"
					class="absolute top-full left-0 z-20 w-[250px] bg-white border rounded-md shadow-lg overflow-hidden"
				>
					<!-- search bar -->
					<div class="p-2 border-b">
						<input
							type="text"
							v-model="searchQuery"
							placeholder="Search country..."
							class="w-full px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-blue-200"
						/>
					</div>

					<!-- list of matching countries -->
					<ul class="max-h-60 overflow-y-auto">
						<li
							v-for="country in filteredCountryCodes"
							:key="country.code + country.country"
							@click="selectCountry(country.code)"
							class="px-3 py-2 hover:bg-gray-50 cursor-pointer flex justify-between"
						>
							<span>{{ country.code }}</span>
							<span class="text-gray-500">{{ country.country }}</span>
						</li>
					</ul>
				</div>
			</div>

			<!-- phone input field -->
			<input
				v-model="value"
				ref="inputEl"
				class="flex-1 h-full bg-transparent px-4 py-3 focus:outline-none"
				type="tel"
				:placeholder="field.placeholder || 'Enter phone number'"
				@blur="markAsTouched"
				@keydown.enter.prevent="handleEnter"
				@keydown="handleKeyDown"
			/>
		</div>

		<!-- field-specific error message -->
		<p v-if="isTouched && fieldError" class="text-red-500 text-sm mt-1">
			{{ fieldError }}
		</p>
	</div>
</template>
