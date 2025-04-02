<script setup lang="ts">
	import QuestionRenderer from "~/src/modules/Onboarding/components/questions/QuestionRenderer.vue";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import LoadingSpinner from "~/src/components/Loading/LoadingSpinner.vue";
	import ProgressIndicator from "~/src/components/Loading/ProgressIndicator.vue";
	import ApplicationReview from "~/src/modules/Onboarding/components/questions/ApplicationReview.vue";
	import NavigationBar from "~/src/modules/Onboarding/components/misc/NavigationBar.vue";
	import NavigationButton from "~/src/modules/Onboarding/components/buttons/NavigationButton.vue";
	import { useOnboardingActions } from "~/src/modules/Onboarding/composables/useOnboardingActions";
	import { useOnboardingInit } from "~/src/modules/Onboarding/composables/useOnboardingInit";

	useHead({
		title: "apply - creatormate",
	});

	definePageMeta({
		layout: "empty",
	});

	const router = useRouter();
	const {
		errorMessage,
		handleBack,
		handleNext,
		handleSubmit,
		handleSaveAndExit,
	} = useOnboardingActions(router);
	const { isLoading } = useOnboardingInit(router);
	const onboardingStore = useOnboardingStore();
</script>

<template>
	<section class="flex screen-size flex-col pb-10 overflow-x-hidden">
		<!-- Navigation Bar -->
		<NavigationBar @back="handleBack" @save-and-exit="handleSaveAndExit" />

		<!-- Progress Indicator -->
		<div class="flex justify-center w-full mt-3 lg:mt-[-5px]">
			<ProgressIndicator
				:step="onboardingStore.currentStep"
				:total="onboardingStore.totalSteps"
				class="max-w-max mx-auto"
			/>
		</div>

		<!-- Main Content -->
		<div
			v-if="isLoading"
			class="flex items-center justify-center h-[calc(100vh-68px)]"
		>
			<LoadingSpinner color="#D9D9D9" :size="40" :large="true" />
		</div>

		<div v-else>
			<div class="relative flex flex-grow justify-center px-6">
				<div class="w-[636px] max-w-full mt-20 gap-5">
					<p class="text-red-500" v-if="errorMessage">
						{{ errorMessage }}
					</p>
					<!-- Content Components -->
					<ApplicationReview
						v-if="onboardingStore.isReviewStep"
						class="mb-16 mt-6"
					/>

					<QuestionRenderer
						v-else-if="onboardingStore.currentQuestion"
						:question="onboardingStore.currentQuestion"
						class="mb-16 mt-6"
						@last-enter="onboardingStore.next"
					/>
				</div>
			</div>
		</div>

		<!-- Navigation Buttons -->
		<!-- Next Button - Desktop -->
		<div class="hidden md:block">
			<NavigationButton
				v-if="!onboardingStore.isLastStep"
				:isMobile="false"
				:disabled="!onboardingStore.canProceed"
				@click="handleNext"
			>
				{{ onboardingStore.cameFromReview ? "save answer" : "next" }}
			</NavigationButton>
		</div>

		<!-- Next Button - Mobile -->
		<div class="md:hidden">
			<NavigationButton
				v-if="!onboardingStore.isLastStep"
				:isMobile="true"
				:disabled="!onboardingStore.canProceed"
				@click="handleNext"
			>
				{{ onboardingStore.cameFromReview ? "save answer" : "next" }}
			</NavigationButton>
		</div>

		<!-- Submit Button - Desktop -->
		<div class="hidden md:block">
			<NavigationButton
				v-if="onboardingStore.isReviewStep"
				:isMobile="false"
				:disabled="!onboardingStore.isTOSAccepted"
				@click="handleSubmit"
			>
				submit application
			</NavigationButton>
		</div>

		<!-- Submit Button - Mobile -->
		<div class="md:hidden">
			<NavigationButton
				v-if="onboardingStore.isReviewStep"
				:isMobile="true"
				:disabled="!onboardingStore.isTOSAccepted"
				@click="handleSubmit"
			>
				submit application
			</NavigationButton>
		</div>
	</section>
</template>
