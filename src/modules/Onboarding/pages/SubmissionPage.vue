<script setup lang="ts">
	import { useAccountState } from "~/src/utils/Auth/AccountState";
	import { onMounted } from "vue";
	import { AccountStatus } from "~/src/utils/SupabaseTypes";
	import SubmissionNotStarted from "~/src/modules/Onboarding/components/submission/SubmissionNotStarted.vue";
	import SubmissionSubmitted from "~/src/modules/Onboarding/components/submission/SubmissionSubmitted.vue";

	const accountState = useAccountState();
	const { logout } = useOidcAuth();

	const router = useRouter();

	const checked = ref(false);

	onMounted(() => {});

	async function apply() {
		await router.push("/apply");
	}

	const statusMap = new Map();
	statusMap.set(AccountStatus.NEW, "not started.");
	statusMap.set(AccountStatus.IN_REVIEW, "under review.");
</script>

<template>
	<section class="flex screen-size flex-col">
		<!-------------------------------------------------------------------------------->
		<!-- navbar -->
		<nav
			class="relative w-full flex items-center text-center px-12 py-6 justify-center"
		>
			<!-- go back button -->
			<!-- TODO: Add functionality to this button -->
			<button class="absolute left-[15%]">back</button>

			<!-- wrapper for logo and progress indicator -->
			<div class="flex flex-col items-center">
				<!-- creatormate logo -->
				<img
					alt="creatormate-logo"
					class="h-[15.134px] w-[128px]"
					src="/creatormate.svg"
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

		<div class="flex flex-grow justify-center px-6">
			<div class="w-[850px] max-w-full mt-20">
				<SubmissionNotStarted
					v-if="accountState.creator?.status == AccountStatus.IN_REVIEW"
				/>

				<SubmissionSubmitted
					v-if="accountState.creator?.status == AccountStatus.IN_REVIEW"
				/>
				<!--				<SubmissionSubmitted-->
				<!--					v-if="accountState.creator?.status == AccountStatus.IN_REVIEW"-->
				<!--				/>-->
				<!--				<SubmissionAccepted-->
				<!--					v-if="accountState.creator?.status == AccountStatus.ACCEPTED"-->
				<!--				/>-->
				<!--				<SubmissionInvited-->
				<!--					v-if="accountState.creator?.status == AccountStatus.INVITED"-->
				<!--				/>-->
			</div>
		</div>
	</section>
</template>

<style scoped>
	.progress-bar {
		transition: width 0.3s;
	}
</style>
