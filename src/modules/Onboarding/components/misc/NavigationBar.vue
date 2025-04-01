<script setup lang="ts">
	import BackButton from "~/src/modules/Onboarding/components/buttons/BackButton.vue";
	import LogoComponent from "~/src/modules/Onboarding/components/misc/LogoComponent.vue";
	import ActionButton from "~/src/modules/Onboarding/components/buttons/ActionButton.vue";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

	const onboardingStore = useOnboardingStore();

	const emit = defineEmits<{
		(e: "back"): void;
		(e: "save-and-exit"): void;
	}>();
</script>

<template>
	<nav
		class="relative w-full flex items-center text-center px-12 py-6 justify-center"
	>
		<!-- Back Button -->
		<BackButton
			v-if="
				onboardingStore.canGoBack &&
				!onboardingStore.cameFromReview &&
				!onboardingStore.isReviewStep
			"
			:isMobile="false"
			@click="emit('back')"
		/>
		<BackButton
			v-if="
				onboardingStore.canGoBack &&
				!onboardingStore.cameFromReview &&
				!onboardingStore.isReviewStep
			"
			:isMobile="true"
			@click="emit('back')"
		/>

		<!-- Logo and Progress Container -->
		<div class="flex flex-col items-center">
			<LogoComponent :isMobile="false" />
			<LogoComponent :isMobile="true" />
		</div>

		<!-- Action Buttons - Desktop -->
		<div class="absolute right-[15%] hidden lg:flex space-x-2">
			<ActionButton
				v-if="!onboardingStore.cameFromReview && !onboardingStore.isReviewStep"
				:to="'/submission/status'"
				:isMobile="false"
				@click="emit('save-and-exit')"
			>
				save & exit
			</ActionButton>
		</div>

		<!-- Action Buttons - Mobile -->
		<div class="absolute right-4 flex items-center space-x-2 lg:hidden">
			<ActionButton
				v-if="!onboardingStore.cameFromReview && !onboardingStore.isReviewStep"
				:to="'/submission/status'"
				:isMobile="true"
				@click="emit('save-and-exit')"
			>
				save & exit
			</ActionButton>
		</div>
	</nav>
</template>
