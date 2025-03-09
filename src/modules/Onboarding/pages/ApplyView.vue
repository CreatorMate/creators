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
	<section class="flex screen-size flex-col pb-10">
		<!-------------------------------------------------------------------------------->
		<!-- navbar -->
		<nav
			class="relative w-full flex items-center text-center px-12 py-6 justify-center"
		>
			<!-- go back button -->
			<!-- Desktop version -->
			<button
				class="absolute left-[15%] hidden lg:block"
				:disabled="!onboardingStore.canGoBack"
				@click="onboardingStore.back"
			>
				back
			</button>

			<!-- Mobile version -->
			<button
				class="absolute left-4 block lg:hidden"
				:disabled="!onboardingStore.canGoBack"
				@click="onboardingStore.back"
			>
				<img src="/icons/arrow-back.svg" alt="back" class="w-4 h-4" />
			</button>

			<!-- wrapper for logo and progress indicator -->
			<div class="flex flex-col items-center">
				<!-- creatormate logo - desktop -->
				<img
					alt="creatormate-logo"
					class="h-[15.134px] w-[128px] hidden lg:block"
					src="/creatormate.svg"
				/>
				<!-- logo for mobile -->
				<img
					alt="cm"
					class="h-[10px] w-[26.6px] block lg:hidden"
					src="/logo.png"
				/>
			</div>

			<!-- Action buttons container -->
			<div class="absolute right-[15%] hidden lg:flex space-x-2">
				<!-- save state button - desktop -->
				<button
					class="flex items-center gap-2 px-5 py-2 hover:bg-[#E9E9E9] rounded-lg transition-all duration-150"
				>
					save & exit
				</button>

				<!-- logout button - desktop -->
				<button
					class="flex items-center gap-2 px-8 py-2 bg-gray-100 hover:bg-[#E9E9E9] rounded-lg transition-all duration-150"
					@click="logout()"
				>
					<span>logout</span>
					<img src="/icons/logout.svg" alt="" class="w-4 h-4 text-gray-400" />
				</button>
			</div>

			<!-- Mobile buttons container -->
			<div class="absolute right-4 flex items-center space-x-2 lg:hidden">
				<!-- save state button - mobile -->
				<button class="flex items-center text-sm gap-2 px-3 py-2 rounded-lg">
					save & exit
				</button>

				<!-- logout button - mobile -->
				<button
					class="flex items-center bg-gray-100 p-2 rounded-lg transition-all duration-150"
					@click="logout()"
				>
					<img src="/icons/logout.svg" alt="Logout" class="w-4 h-4" />
				</button>
			</div>
		</nav>
		<!-------------------------------------------------------------------------------->

		<!-- progress indicator -->
		<div class="flex justify-center w-full mt-3 lg:mt-[-5px]">
			<ProgressIndicator
				:step="onboardingStore.currentStep"
				:total="onboardingStore.totalSteps"
				class="max-w-max mx-auto"
			/>
		</div>

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

					<ApplicationReview
						class="mb-16"
						v-if="onboardingStore.isReviewStep"
					/>

					<!-- TODO: add transition between questions -->
					<QuestionRenderer
						class="mb-16"
						v-else-if="onboardingStore.currentQuestion"
						:question="onboardingStore.currentQuestion"
					/>
				</div>
			</div>
		</div>

		<!-- next button -->
		<!-- desktop version -->
		<div class="hidden md:block">
			<button
				class="fixed bottom-4 right-[15%] bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
				v-if="!onboardingStore.isLastStep"
				@click="onboardingStore.next"
				:disabled="!onboardingStore.canProceed"
			>
				next
			</button>
		</div>

		<!-- mobile version -->
		<div class="md:hidden">
			<button
				class="fixed bottom-4 mx-auto left-0 right-0 w-[95%] bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
				v-if="!onboardingStore.isLastStep"
				@click="onboardingStore.next"
				:disabled="!onboardingStore.canProceed"
			>
				next
			</button>
		</div>

		<!-- submit button -->
		<!-- desktop version -->
		<div class="hidden md:block">
			<button
				class="fixed bottom-4 right-[15%] bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400"
				v-if="onboardingStore.isReviewStep"
				:disabled="!onboardingStore.isTOSAccepted"
				@click="submitApplication()"
			>
				submit application
			</button>
		</div>

		<!-- mobile version -->
		<div class="md:hidden">
			<button
				class="fixed bottom-4 mx-auto left-0 right-0 w-[95%] bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
				v-if="onboardingStore.isReviewStep"
				:disabled="!onboardingStore.isTOSAccepted"
				@click="submitApplication()"
			>
				submit application
			</button>
		</div>
	</section>
</template>
