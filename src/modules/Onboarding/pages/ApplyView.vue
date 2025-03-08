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

	const { logout } = useOidcAuth();

	const isLoading = ref(true);

	// TODO: Fix this..
	async function submitApplication() {
		if (!accountState.creator) return;

		try {
			const creator = await $fetch("/API/creators/me", {
				method: "put",
				body: JSON.stringify({
					...onboardingStore.answers,
					status: AccountStatus.IN_REVIEW,
				}),
			});

			accountState.creator.status = AccountStatus.IN_REVIEW;
			await router.push("/");
		} catch (error) {
			if (error instanceof Error) {
				onboardingStore.errorMessage = error.message;
			} else {
				onboardingStore.errorMessage = "An unknown error occurred.";
			}
			console.error("Error updating creator:", error);
		}
	}

	onMounted(() => {
		// If creator has been accepted, route to home page
		if (accountState.creator?.status == AccountStatus.ACCEPTED) {
			onboardingStore.reset();
			router.push("/");
		}

		// retrieve past answers from local storage
		onboardingStore.hydrate();

		// Set loading state to false
		isLoading.value = false;
	});
</script>

<template>
	<section class="flex screen-size flex-col">
		<!-------------------------------------------------------------------------------->
		<!-- navbar -->
		<nav
			class="relative w-full flex items-center text-center px-12 py-6 justify-center"
		>
			<!-- go back button -->
			<button
				class="absolute left-[15%]"
				:disabled="!onboardingStore.canGoBack"
				@click="onboardingStore.back"
			>
				{{ onboardingStore.cameFromReview ? "back to review" : "back" }}
			</button>

			<!-- wrapper for logo and progress indicator -->
			<div class="flex flex-col items-center">
				<!-- creatormate logo -->
				<img
					alt="creatormate-logo"
					class="h-[15.134px] w-[128px]"
					src="/creatormate.svg"
				/>

				<!-- progress indicator -->
				<ProgressIndicator
					:step="onboardingStore.currentStep"
					:total="onboardingStore.totalSteps"
					class="mt-2.5"
				/>
			</div>

			<!-- save state button -->
			<!-- TODO: add functionality to this button -->
			<div class="absolute right-[23%]">
				<button
					class="flex items-center gap-2 px-5 py-2 hover:bg-[#E9E9E9] rounded-lg transition-all duration-150"
				>
					save & exit
				</button>
			</div>

			<!-- logout button -->
			<div class="absolute right-[15%]">
				<button
					class="flex items-center gap-2 px-8 py-2 bg-gray-100 hover:bg-[#E9E9E9] rounded-lg transition-all duration-150"
					@click="logout()"
				>
					<span>logout</span>
					<img src="/icons/logout.svg" alt="" class="w-4 h-4 text-gray-400" />
				</button>
			</div>
		</nav>
		<!-------------------------------------------------------------------------------->

		<div
			v-if="isLoading"
			class="flex items-center justify-center h-[calc(100vh-68px)]"
		>
			<LoadingSpinner color="#D9D9D9" :size="40" :large="true" />
		</div>

		<div v-else>
			<div class="relative flex flex-grow justify-center px-6">
				<div class="w-[636px] max-w-full mt-20 gap-5">
					<span v-if="onboardingStore.errorMessage !== ''" class="text-red-600">
						{{ onboardingStore.errorMessage }}
					</span>

					<ApplicationReview v-if="onboardingStore.isReviewStep" />

					<!-- TODO: add transition between questions -->
					<QuestionRenderer
						v-else-if="onboardingStore.currentQuestion"
						:question="onboardingStore.currentQuestion"
					/>
				</div>
			</div>
		</div>

		<!-- next button -->
		<!-- TODO: fix positioning so its always on the bottom right of the screen (even if user scrolls) -->
		<button
			class="absolute bottom-4 right-[15%] bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-[#242424]"
			v-if="!onboardingStore.isLastStep"
			@click="onboardingStore.next"
			:disabled="!onboardingStore.canProceed"
		>
			next
		</button>

		<!-- submit button -->
		<button
			class="absolute bottom-4 right-[15%] bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400"
			v-if="onboardingStore.isReviewStep"
			:disabled="!onboardingStore.isTOSAccepted"
			@click="submitApplication()"
		>
			submit application
		</button>
	</section>
</template>
