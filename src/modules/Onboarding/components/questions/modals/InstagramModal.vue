<script setup lang="ts">
	import type {
		SocialMediaFieldType,
		ValidationAnswer,
	} from "~/src/modules/Onboarding/types/onboardingTypes";

	const props = defineProps<{
		field: SocialMediaFieldType;
		initialValue?: string;
	}>();

	const emit = defineEmits(["confirm", "close"]);

	const localValue = ref(props.initialValue);
	const isTouched = ref(false);
	const error = ref("");

	// Validation function
	function validate(): ValidationAnswer {
		if (!localValue || localValue.value === "") {
			return { valid: false, errorMessage: "username cannot be empty" };
		}
		if (localValue.value!.length > 100) {
			return {
				valid: false,
				errorMessage: "username cannot exceed 100 characters",
			};
		}
		return { valid: true };
	}

	function handleInput(event: Event) {
		localValue.value = (event.target as HTMLInputElement).value;
		isTouched.value = true; // Mark as touched when the user types
		const { valid, errorMessage } = validate();
		error.value = !valid && errorMessage ? errorMessage : "";
	}

	// Handle escape key press
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Escape") {
			emit("close");
		}
	}

	// Add event listener when component is mounted
	onMounted(() => {
		window.addEventListener("keydown", handleKeyDown);
	});

	// Remove event listener when component is unmounted
	onUnmounted(() => {
		window.removeEventListener("keydown", handleKeyDown);
	});
</script>

<template>
	<div
		class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30"
	>
		<div
			class="bg-white p-6 rounded-lg shadow-xl w-[600px] relative mx-5 pb-20"
		>
			<button
				class="absolute top-5 right-6 text-gray-500 hover:text-gray-700"
				@click="emit('close')"
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
			<h2 class="text-lg font-semibold mb-4">link your instagram account</h2>

			<p class="mb-4 text-[#3C3C3C]">
				select which of your linked instagram account you'd like to submit with
				your application.
			</p>

			<!-- input field -->
			<div class="mb-3">
				<div class="relative">
					<input
						class="w-full pl-10 bg-gray-100 text-gray-700 px-5 py-5 rounded-md focus:outline-none"
						placeholder="username"
						:value="localValue"
						@input="handleInput"
						@keydown.enter.prevent="emit('confirm', localValue)"
					/>
					<div
						class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
					>
						<img src="/icons/instagram_op.svg" alt="" class="w-5 h-5" />
					</div>
				</div>
				<!-- Error Message -->
				<p v-if="isTouched && error" class="text-red-500 text-sm mt-1">
					{{ error }}
				</p>
			</div>

			<button
				class="absolute bottom-8 right-6 bg-black text-white px-5 py-2 rounded-lg disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
				:disabled="!validate().valid"
				@click="emit('confirm', localValue)"
			>
				link to creatormate
			</button>
		</div>
	</div>
</template>
