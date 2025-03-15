<script setup lang="ts">
	import type { SocialMediaFieldType } from "~/src/modules/Onboarding/types/onboardingTypes";
	import TextField from "~/src/modules/Onboarding/components/questions/TextField.vue";
	import type { TextFieldType } from "~/src/modules/Onboarding/types/onboardingTypes";

	const props = defineProps<{ field: SocialMediaFieldType }>();

	const emit = defineEmits(["close"]);

	const instagramTextField = ref<InstanceType<typeof TextField> | null>(null);
	const isValid = ref(false); // Track validation state

	const usernameInputField: TextFieldType = {
		key: "instagram_handle",
		label: "username",
		type: "text",
		required: true,
		maxLength: 255,
		placeholder: "@username",
		icon: "/icons/instagram_op.svg",
	};

	// Function to handle validation updates from the TextField
	const handleValidationChange = (valid: boolean) => {
		isValid.value = valid;
	};

	// Handle escape key press
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			emit("close");
		}
	};

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
				@click="$emit('close')"
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

			<TextField
				:field="usernameInputField"
				ref="instagramTextField"
				@validation-change="handleValidationChange"
			/>

			<button
				class="absolute bottom-8 right-6 bg-black text-white px-5 py-2 rounded-lg disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
				:disabled="!isValid"
				@click="$emit('close')"
			>
				link to creatormate
			</button>
		</div>
	</div>
</template>
