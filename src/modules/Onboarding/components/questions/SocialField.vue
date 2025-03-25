<script setup lang="ts">
	import type { SocialMediaFieldType } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import LinkSocialPopup from "~/src/modules/Onboarding/components/social/LinkSocialPopup.vue";
	import type { APIResponse } from "~/src/api/utils/HonoResponses";
	import type { InstagramVerification } from "~/src/api/modules/onboarding/OnboardingTypes";
	import { API } from "~/src/utils/API/API";
	import { awaitExpression } from "@babel/types";

	const props = defineProps<{
		field: SocialMediaFieldType;
	}>();

	const verified = ref<InstagramVerification | null>(null);

	const open = ref(false);
	const isConnected = computed(() => !!value.value);
	const onboardingStore = useOnboardingStore();

	// Get key of current question
	const questionKey = computed(() => onboardingStore.currentQuestion!.key);

	const value = ref("");

	onMounted(async () => {
		if (!onboardingStore.answers[questionKey.value]) {
			onboardingStore.answers[questionKey.value] = {};
		}

		await getVerificationProgress();
	});

	async function getVerificationProgress() {
		const igProfile: APIResponse<InstagramVerification> = await API.ask(`/onboarding/verification`);
		if (igProfile.success) {
			verified.value = igProfile.data;
			value.value = igProfile.data.handle;
			console.log(verified.value)
			if (verified.value.verified) {
				onboardingStore.setAnswer("handle", igProfile.data.handle);
			} else {
				onboardingStore.setAnswer("handle", "");
			}
			return;
		}
		value.value = "";
	}

	function reset() {
		verified.value = null;
		onboardingStore.setAnswer("handle", "");
		value.value = "";
	}

	// Local state for the modal input. This will hold the user's input inside the modal.
	const modalInstagramValue = ref("");

	async function onModalConfirm(newValue: string) {
		onboardingStore.setAnswer("handle", newValue);
		modalInstagramValue.value = newValue;
		value.value = newValue;
		open.value = false;

		await getVerificationProgress();
	}

	function closeModal() {
		open.value = false;
	}
</script>

<template>
	<div class="flex flex-col items-start gap-6 w-full max-w-[638px] mx-auto">
		<div class="flex w-full items-center justify-between">
			<div class="flex flex-col">
				<div class="flex w-full sm:w-[351.5px] items-center gap-3">
					<NuxtImg
						:src="field.socialMediaIcon"
						alt=""
						class="w-6 h-6 flex-shrink-0 aspect-square"
					/>
					<p
						class="text-black text-[16px] font-medium leading-[24px] tracking-[-0.32px]"
					>
						{{ field.socialMediaName }}
						<span v-if="field.required"> (required)</span>
						<span v-else class="opacity-50"> (optional) </span>
					</p>
				</div>

				<!-- Display the handle value when connected -->
				<p v-if="isConnected" class="ml-9 mt-1 text-[14px] text-gray-600">
					@{{ value }}
					{{ verified?.verified ? "" : "(not verified)" }}
				</p>
			</div>

			<button
				class="px-5 py-2 rounded-lg transition-all duration-150 w-auto sm:w-[120px] max-w-full"
				:class="{
					'bg-gray-100 text-black hover:bg-[#E9E9E9]': !isConnected,
					'bg-black text-white hover:bg-[#242424]': isConnected,
				}"
				@click="open = true"
			>
				{{ isConnected ? "connected" : "connect" }}
			</button>
		</div>
	</div>
	<ModalPopup @close="closeModal" :model-active="open">
		<LinkSocialPopup :field="field" :initialValue="value" @close="closeModal" @confirm="onModalConfirm"
										 @delete="reset" />
	</ModalPopup>
</template>
