<script setup lang="ts">
	import { useAccountState } from "~/src/utils/Auth/AccountState";
	import { onMounted } from "vue";
	import { AccountStatus } from "~/src/utils/SupabaseTypes";
	import QuestionRenderer from "~/src/modules/Onboarding/components/questions/QuestionRenderer.vue";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import LoadingSpinner from "~/src/components/Loading/LoadingSpinner.vue";
	import ProgressIndicator from "~/src/components/Loading/ProgressIndicator.vue";
	import ApplicationReview from "~/src/modules/Onboarding/components/questions/ApplicationReview.vue";
	import { extractAnswers } from "~/src/modules/Onboarding/utils/onboardingUtils";
	import { API } from "~/src/utils/API/API";
	import NavigationBar from "~/src/modules/Onboarding/components/misc/NavigationBar.vue";
	import NavigationButton from "~/src/modules/Onboarding/components/buttons/NavigationButton.vue";
	import { formatAnswers } from "~/src/modules/Onboarding/utils/onboardingUtils";

	const accountState = useAccountState();
	const onboardingStore = useOnboardingStore();
	const router = useRouter();

	const isLoading = ref(true);

	const apiError = ref("");

	useHead({
		title: "apply - creatormate",
	});

	definePageMeta({
		layout: "empty",
	});

	/**
	 * Function which submits application answers to database.
	 * TODO: save & exit
	 */
	async function submitApplication(status: AccountStatus) {
		if (!accountState.user) {
			apiError.value =
				"error updating creator: account state is missing a user.";
			return;
		}

		const { answers } = onboardingStore;
		const extractedAnswers = extractAnswers(answers);

		try {
			const response = await API.ask("/users/me", "PUT", {
				...extractedAnswers,
				status: status,
			});

			if (response.success) {
				accountState.user.status = status;

				onboardingStore.reset();

				await router.push("/");
			} else {
				apiError.value =
					response.message || "An error occurred while updating creator.";
			}
		} catch (error) {
			apiError.value =
				error instanceof Error ? error.message : "an unknown error occurred.";
			console.error("error updating creator:", error);
		}
	}

	/**
	 * Retrieves answers from database
	 */
	async function retrieveApplicationAnswers() {
		if (!accountState.user) {
			apiError.value =
				"error updating creator: account state is missing a user.";
			return;
		}

		try {
			const response = await API.ask("/users/me", "GET");

			if (response.success) {
				const data = response.data;
				return formatAnswers(data as Record<string, string | string[]>);
			} else {
				apiError.value =
					response.message || "Error retrieving application answers";
				return null;
			}
		} catch (error) {
			apiError.value =
				error instanceof Error ? error.message : "An unknown error occurred";
			console.error("Error retrieving application answers:", error);
			return null;
		}
	}

	/**
	 * Handles the back button click action.
	 * Navigates to the previous step in the onboarding process and removes focus from the active element to prevent unintended Enter key interactions.
	 */
	function handleBack() {
		resetApiError();
		onboardingStore.back();
		// Use nextTick to ensure the DOM has updated
		nextTick(() => {
			document.activeElement instanceof HTMLElement &&
				document.activeElement.blur();
		});
	}

	/**
	 * Handles the next button click action
	 * Advances to the next step in the onboarding process and removes focus from the active element to prevent unintended Enter key interactions
	 */
	function handleNext() {
		resetApiError();
		onboardingStore.next();
		nextTick(() => {
			document.activeElement instanceof HTMLElement &&
				document.activeElement.blur();
		});
	}

	/**
	 * Handles the submit application button click action
	 * Submits the completed application and removes focus from the active element to prevent unintended Enter key interactions
	 */
	function handleSubmit() {
		resetApiError();
		submitApplication(AccountStatus.IN_REVIEW);
		nextTick(() => {
			document.activeElement instanceof HTMLElement &&
				document.activeElement.blur();
		});
	}

	/**
	 * Handles partial application submit.
	 */
	function handleSaveAndExit() {
		resetApiError();

		// If the user had finished the application before, updating it should not change his status to IN_PROCESS
		const status: AccountStatus =
			accountState.user?.status == AccountStatus.IN_REVIEW
				? AccountStatus.IN_REVIEW
				: AccountStatus.IN_PROCESS;

		submitApplication(status);
		nextTick(() => {
			document.activeElement instanceof HTMLElement &&
				document.activeElement.blur();
		});
	}

	function resetApiError() {
		apiError.value = "";
	}

	onMounted(async () => {
		// If creator has been accepted, route to home page
		if (accountState.user?.status == AccountStatus.ACCEPTED) {
			onboardingStore.reset();
			await router.push("/");
		}

		// Try to pull answers from database
		const retrievedAnswers = await retrieveApplicationAnswers();

		if (retrievedAnswers) {
			// If database retrieval is successful, update the store
			onboardingStore.answers = retrievedAnswers;
			onboardingStore.currentStep = onboardingStore.getQuestionStepByKey(
				Object.keys(retrievedAnswers)[Object.keys(retrievedAnswers).length - 1],
			);
		} else {
			// If database retrieval fails, hydrate from local storage
			onboardingStore.hydrate();
		}

		// Set loading state to false
		isLoading.value = false;

		// Reset API error message
		resetApiError();
	});
</script>

<template>
	<section class="flex screen-size flex-col pb-10 overflow-x-hidden">
		<!-- Navigation Bar -->
		<NavigationBar
			:canGoBack="onboardingStore.canGoBack"
			:cameFromReview="onboardingStore.cameFromReview"
			@back="handleBack"
			@save-and-exit="handleSaveAndExit"
		/>

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
					<p class="text-red-500" v-if="apiError">
						{{ apiError }}
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
