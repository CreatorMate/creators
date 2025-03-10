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

        console.log(onboardingStore.answers)

        return;
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
		<!-- Navigation Bar -->
		<nav
			class="relative w-full flex items-center text-center px-12 py-6 justify-center"
		>
			<!-- Back Button - Desktop -->
			<button
				class="absolute left-[15%] hidden lg:block"
				:disabled="!onboardingStore.canGoBack"
				@click="onboardingStore.back"
			>
				{{ onboardingStore.cameFromReview ? "back to review" : "back" }}
			</button>

			<!-- Back Button - Mobile -->
			<button
				class="absolute left-4 block lg:hidden"
				:disabled="!onboardingStore.canGoBack"
				@click="onboardingStore.back"
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
				<button
					class="flex items-center gap-2 px-5 py-2 hover:bg-[#E9E9E9] rounded-lg transition-all duration-150"
				>
					save & exit
				</button>

				<button
					class="flex items-center gap-2 px-8 py-2 bg-gray-100 hover:bg-[#E9E9E9] rounded-lg transition-all duration-150"
					@click="logout()"
				>
					<span>logout</span>
					<img
						src="/icons/logout.svg"
						alt="logout"
						class="w-4 h-4 text-gray-400"
					/>
				</button>
			</div>

			<!-- Action Buttons - Mobile -->
			<div class="absolute right-4 flex items-center space-x-2 lg:hidden">
				<button class="flex items-center text-sm gap-2 px-3 py-2 rounded-lg">
					save & exit
				</button>

				<button
					class="flex items-center bg-gray-100 p-2 rounded-lg transition-all duration-150"
					@click="logout()"
				>
					<img src="/icons/logout.svg" alt="logout" class="w-4 h-4" />
				</button>
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
					<!-- Error Message -->
					<span v-if="onboardingStore.errorMessage !== ''" class="text-red-600">
						{{ onboardingStore.errorMessage }}
					</span>

					<!-- Content Components -->
					<ApplicationReview
						v-if="onboardingStore.isReviewStep"
						class="mb-16"
					/>

					<QuestionRenderer
						v-else-if="onboardingStore.currentQuestion"
						:question="onboardingStore.currentQuestion"
						class="mb-16"
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
				@click="onboardingStore.next"
				:disabled="!onboardingStore.canProceed"
			>
				next
			</button>
		</div>

		<!-- Next Button - Mobile -->
		<div class="md:hidden">
			<button
				v-if="!onboardingStore.isLastStep"
				class="fixed bottom-4 mx-auto left-0 right-0 w-[95%] bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
				@click="onboardingStore.next"
				:disabled="!onboardingStore.canProceed"
			>
				next
			</button>
		</div>

		<!-- Submit Button - Desktop -->
		<div class="hidden md:block">
			<button
				v-if="onboardingStore.isReviewStep"
				class="fixed bottom-4 right-[15%] bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
				@click="submitApplication()"
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
				@click="submitApplication()"
				:disabled="!onboardingStore.isTOSAccepted"
			>
				submit application
			</button>
		</div>
	</section>
</template>
