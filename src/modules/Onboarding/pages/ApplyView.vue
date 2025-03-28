<script setup lang="ts">
	import { useAccountState } from "~/src/utils/Auth/AccountState";
	import { onMounted } from "vue";
	import { AccountStatus } from "~/src/utils/SupabaseTypes";
	import QuestionRenderer from "~/src/modules/Onboarding/components/questions/QuestionRenderer.vue";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import LoadingSpinner from "~/src/components/Loading/LoadingSpinner.vue";
	import ProgressIndicator from "~/src/components/Loading/ProgressIndicator.vue";
	import ApplicationReview from "~/src/modules/Onboarding/components/questions/ApplicationReview.vue";
	import {
		extractAnswers,
		formatAnswers,
	} from "~/src/modules/Onboarding/utils/onboardingUtils";
	import { API } from "~/src/utils/API/API";
	import NavigationBar from "~/src/modules/Onboarding/components/misc/NavigationBar.vue";
	import NavigationButton from "~/src/modules/Onboarding/components/buttons/NavigationButton.vue";
	import { loadOnboardingState } from "~/src/modules/Onboarding/utils/onboardingStorage";
	import { validateQuestion } from "~/src/modules/Onboarding/utils/onboardingValidators";

	const accountState = useAccountState();
	const onboardingStore = useOnboardingStore();
	const router = useRouter();

	const isLoading = ref(true);

	const errorMessage = ref("");

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
			errorMessage.value =
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
				accountState.updateUserAnswers(extractedAnswers);

				onboardingStore.reset();

				await router.push("/");
			} else {
				errorMessage.value =
					response.message || "An error occurred while updating creator.";
			}
		} catch (error) {
			errorMessage.value =
				error instanceof Error ? error.message : "an unknown error occurred.";
			console.error("error updating creator:", error);
		}
	}

	/**
	 * Handles the back button click action.
	 * Navigates to the previous step in the onboarding process and removes focus from the active element to prevent unintended Enter key interactions.
	 */
	function handleBack() {
		// Submit incomplete application
		resetErrorMessage();
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
		// Submit incomplete application
		resetErrorMessage();
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
		resetErrorMessage();

		// Check if all questions are valid
		onboardingStore.validateAllQuestions();

		if (!onboardingStore.allQuestionsValid) {
			errorMessage.value = onboardingStore.error;
			return;
		}

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
		resetErrorMessage();

		const status = AccountStatus.IN_PROCESS;

		submitApplication(status);
		nextTick(() => {
			document.activeElement instanceof HTMLElement &&
				document.activeElement.blur();
		});
	}

	function resetErrorMessage() {
		errorMessage.value = "";
	}

	onMounted(async () => {
		// If creator has been accepted, route to home page
		if (accountState.user?.status == AccountStatus.ACCEPTED) {
			onboardingStore.reset();
			await router.push("/");
		}

		// Check if there are already stored answers in session storage
		const storedAnswers = loadOnboardingState();

		if (!storedAnswers) {
			// First visit in this session: pull from the database
			const retrievedAnswers = formatAnswers(
				accountState.user as Record<string, string | string[]>,
			);

			const keys = Object.keys(retrievedAnswers);

			// Only update onboarding question answers if retrieved answers object isn't empty
			if (keys.length > 0) {
				onboardingStore.answers = retrievedAnswers;

				// Find last invalid question
				const lastInvalidQuestionKey = onboardingStore.questions.find(
					(question) => {
						const { valid } = validateQuestion(question, retrievedAnswers);
						return !valid;
					},
				)?.key;

				// Set current step to the last invalid question or the final step
				if (lastInvalidQuestionKey) {
					onboardingStore.currentStep = onboardingStore.getQuestionStepByKey(
						lastInvalidQuestionKey,
					);
				} else {
					onboardingStore.currentStep = onboardingStore.totalSteps;
				}
			}
		} else {
			// If answers already exist hydrate from the store
			onboardingStore.hydrate();
		}

		// Initialize storage watcher
		onboardingStore.initializeWatcher();

		// Set loading state to false
		isLoading.value = false;
		resetErrorMessage();
	});
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
