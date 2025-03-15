<script setup lang="ts">
	import type { SocialMediaFieldType } from "~/src/modules/Onboarding/types/onboardingTypes";
	import InstagramModal from "~/src/modules/Onboarding/components/questions/modals/InstagramModal.vue";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

	const props = defineProps<{
		field: SocialMediaFieldType;
	}>();

	const onboardingStore = useOnboardingStore();

	const { field } = toRefs(props);

	// Map social media name to respective connection flow
	const connectionFlows: Record<
		string,
		{ type: "modal" | "link"; component?: any; url?: string }
	> = {
		instagram: { type: "modal", component: InstagramModal },
		vimeo: { type: "link", url: "/" }, // placeholder, link to vimeo api
	};

	// Hold current modal component
	const currentModalComponent = ref(null);

	function connect() {
		const socialName = field.value.socialMediaName.toLowerCase();
		const flow = connectionFlows[socialName];

		if (!flow) {
			console.warn(`No connection flow defined for ${socialName}`);
			return;
		}

		if (flow.type === "modal" && flow.component) {
			currentModalComponent.value = flow.component;
		} else if (flow.type === "link" && flow.url) {
		}
	}

	function closeModal() {
		currentModalComponent.value = null;
	}

	// Get the handle for the current social media
	const socialMediaHandle = computed(() => {
		const socialName = field.value.socialMediaName.toLowerCase();
		const handleKey = `${socialName}_handle`;
		return onboardingStore.answers.socials_question?.[handleKey] || "";
	});

	// Check if connected
	const isConnected = computed(() => !!socialMediaHandle.value);
</script>

<template>
	<div class="flex flex-col items-start gap-6 w-full max-w-[638px] mx-auto">
		<div class="flex w-full items-center justify-between">
			<div class="flex w-full sm:w-[351.5px] items-center gap-3">
				<img
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

			<button
				class="px-5 py-2 rounded-lg transition-all duration-150 w-auto sm:w-[120px] max-w-full"
				:class="{
					'bg-gray-100 text-black hover:bg-[#E9E9E9]': !isConnected,
					'bg-black text-white hover:bg-[#242424]': isConnected,
				}"
				@click="connect"
			>
				{{ isConnected ? "connected" : "connect" }}
			</button>
		</div>
		<!-- render modal -->
		<component
			v-if="currentModalComponent"
			:is="currentModalComponent"
			@close="closeModal"
			:field="field"
		/>
	</div>
</template>
