<script setup lang="ts">
	import { useAccountState } from "~/src/utils/Auth/AccountState";
	import { onMounted } from "vue";
	import { AccountStatus } from "~/src/utils/SupabaseTypes";
	import QuestionRenderer from "~/src/modules/Onboarding/components/questions/QuestionRenderer.vue";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import LoadingSpinner from "~/src/components/Core/LoadingSpinner.vue";
	import ProgressIndicator from "~/src/components/Core/ProgressIndicator.vue";
	import ApplicationReview from "~/src/modules/Onboarding/components/questions/ApplicationReview.vue";

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

	async function submitApplication() {
		if (!accountState.user) {
			apiError.value =
				"error updating creator: account state is missing a user.";
			return;
		}

		const { answers } = onboardingStore;
		const extractedAnswers = {
			handle: "blank_for_now",
			based_in: answers.based_in_question.based_in,
			project_types: answers.project_types_question.project_types,
			work_types: answers.work_types_question.work_types,
			date_of_birth: answers.date_of_birth_question.date_of_birth,
			first_name: answers.name_question.first_name,
			last_name: answers.name_question.last_name,
			additional_info: answers.additional_info_question.additional_info,
		};

		try {
			const user = await $fetch("/API/users/me", {
				method: "put",
				body: JSON.stringify({
					...extractedAnswers,
					status: AccountStatus.IN_REVIEW,
				}),
			});

			accountState.user.status = AccountStatus.IN_REVIEW;
			await router.push("/");
		} catch (error) {
			apiError.value =
				error instanceof Error ? error.message : "an unknown error occurred.";
			console.error("error updating creator:", error);
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
		submitApplication();
		nextTick(() => {
			document.activeElement instanceof HTMLElement &&
				document.activeElement.blur();
		});
	}

	function resetApiError() {
		apiError.value = "";
	}

	onMounted(() => {
		// If creator has been accepted, route to home page
		if (accountState.user?.status == AccountStatus.ACCEPTED) {
			onboardingStore.reset();
			router.push("/");
		}

		// retrieve past answers from local storage
		onboardingStore.hydrate();

		// Set loading state to false
		isLoading.value = false;

		// Reset API error message
		resetApiError();

		// onboardingStore.reset();
	});
</script>

<template>
	<section class="flex screen-size flex-col pb-10 overflow-x-hidden">
		<!-- Navigation Bar -->
		<nav
			class="relative w-full flex items-center text-center px-12 py-6 justify-center"
		>
			<!-- Back Button - Desktop -->
			<button
				class="absolute left-[15%] hidden lg:block"
				v-if="onboardingStore.canGoBack && !onboardingStore.cameFromReview"
				@click="handleBack"
			>
				back
			</button>

			<!-- Back Button - Mobile -->
			<button
				class="absolute left-4 block lg:hidden"
				v-if="onboardingStore.canGoBack && !onboardingStore.cameFromReview"
				@click="handleBack"
			>
				<img src="/icons/arrow-back.svg" alt="back" class="w-4 h-4" />
			</button>

			<!-- Logo and Progress Container -->
			<div class="flex flex-col items-center">
				<!-- Logo - Desktop -->
				<img
					src="/creatormate.svg"
					alt="creatormate-logo"
					class="h-[15.134px] w-[128px] hidden lg:block"
				/>
				<!-- Logo - Mobile -->
				<img
					src="/logo.png"
					alt="cm"
					class="h-[10px] w-[26.6px] block lg:hidden"
				/>
			</div>

			<!-- Action Buttons - Desktop -->
			<div class="absolute right-[15%] hidden lg:flex space-x-2">
				<NuxtLink
					to="/submission/status"
					class="flex items-center gap-2 px-5 py-2 hover:bg-[#E9E9E9] rounded-lg transition-all duration-150"
				>
					save & exit
				</NuxtLink>
			</div>

			<!-- Action Buttons - Mobile -->
			<div class="absolute right-4 flex items-center space-x-2 lg:hidden">
				<NuxtLink
					to="/submission/status"
					class="flex items-center text-sm gap-2 px-3 py-2 rounded-lg"
				>
					save & exit
				</NuxtLink>
			</div>
		</nav>

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
						class="mb-16"
					/>

					<QuestionRenderer
						v-else-if="onboardingStore.currentQuestion"
						:question="onboardingStore.currentQuestion"
						class="mb-16"
						@last-enter="onboardingStore.next"
					/>
				</div>
			</div>
		</div>

		<!-- Navigation Buttons -->
		<!-- Next Button - Desktop -->
		<div class="hidden md:block">
			<button
				v-if="!onboardingStore.isLastStep"
				class="fixed bottom-4 right-[15%] bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
				@click="handleNext"
				:disabled="!onboardingStore.canProceed"
			>
				{{ onboardingStore.cameFromReview ? "save answer" : "next" }}
			</button>
		</div>

		<!-- Next Button - Mobile -->
		<div class="md:hidden">
			<button
				v-if="!onboardingStore.isLastStep"
				class="fixed bottom-4 mx-auto left-0 right-0 w-[95%] bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
				@click="handleNext"
				:disabled="!onboardingStore.canProceed"
			>
				{{ onboardingStore.cameFromReview ? "save answer" : "next" }}
			</button>
		</div>

		<!-- Submit Button - Desktop -->
		<div class="hidden md:block">
			<button
				v-if="onboardingStore.isReviewStep"
				class="fixed bottom-4 right-[15%] bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
				@click="handleSubmit"
				:disabled="!onboardingStore.isTOSAccepted"
			>
				submit application
			</button>
		</div>

		<!-- Submit Button - Mobile -->
		<div class="md:hidden">
			<button
				v-if="onboardingStore.isReviewStep"
				class="fixed bottom-4 mx-auto left-0 right-0 w-[95%] bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
				@click="handleSubmit"
				:disabled="!onboardingStore.isTOSAccepted"
			>
				submit application
			</button>
		</div>
	</section>
</template>
