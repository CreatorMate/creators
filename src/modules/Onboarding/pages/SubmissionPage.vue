<script setup lang="ts">
	import { useAccountState } from "~/src/utils/Auth/AccountState";
	import { onMounted } from "vue";
	import { AccountStatus } from "~/src/utils/SupabaseTypes";
	import SubmissionNotStarted from "~/src/modules/Onboarding/components/submission/SubmissionNotStarted.vue";
	import SubmissionSubmitted from "~/src/modules/Onboarding/components/submission/SubmissionSubmitted.vue";
	import SubmissionInProgress from "~/src/modules/Onboarding/components/submission/SubmissionInProgress.vue";

	const accountState = useAccountState();

	const router = useRouter();

	useHead({
		title: "status - creatormate",
	});
	definePageMeta({
		layout: "empty",
	});

	onMounted(async () => {
		// If user's application is accepted, route to home page
		if (accountState.user?.status == AccountStatus.ACCEPTED) {
			await router.push("/");
		}
	});
</script>

<template>
	<section class="flex screen-size flex-col">
		<section class="flex screen-size flex-col">
			<nav
				class="relative w-full flex items-center text-center px-12 py-6 justify-center"
			>
				<button class="absolute left-4 block lg:hidden">
					<img src="/icons/arrow-back.svg" alt="back" class="w-4 h-4" />
				</button>
				<div class="flex flex-col items-center">
					<img
						alt="creatormate-logo"
						class="h-[15.134px] w-[128px] hidden lg:block"
						src="/creatormate.svg"
					/>
					<img
						alt="cm"
						class="h-[10px] w-[26.6px] block lg:hidden"
						src="/logo.png"
					/>
				</div>
				<div class="absolute right-[15%] hidden lg:block">
					<button
						class="flex items-center p-2 transition-all duration-150"
						@click="accountState.logout()"
					>
						<img src="/icons/logout.svg" alt="Logout" class="w-4 h-4" />
					</button>
				</div>

				<div class="absolute right-4 block lg:hidden">
					<button
						class="flex items-center bg-gray-100 p-2 rounded-lg transition-all duration-150"
						@click="accountState.logout()"
					>
						<img src="/icons/logout.svg" alt="Logout" class="w-4 h-4" />
					</button>
				</div>
			</nav>

			<div class="flex flex-grow justify-center px-6">
				<div class="w-[850px] max-w-full lg:mt-20 mt-12">
					<SubmissionNotStarted
						v-if="accountState.user?.status == AccountStatus.NEW"
					/>
					<SubmissionSubmitted
						v-if="accountState.user?.status == AccountStatus.IN_REVIEW"
					/>
					<SubmissionInProgress
						v-if="accountState.user?.status == AccountStatus.IN_PROCESS"
					/>
				</div>
			</div>
		</section>
	</section>
</template>
