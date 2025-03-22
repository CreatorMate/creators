<script setup lang="ts">
	import type { PictureField } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { Icon } from "@iconify/vue";
	import UploadPictureModal from "~/src/modules/Onboarding/components/questions/modals/UploadPictureModal.vue";
	import { ref } from "vue";

	const props = defineProps<{
		field: PictureField;
	}>();

	const showModal = ref(false);
	const selectedImage = ref<File | null>(null);
	const imagePreviewUrl = ref<string>("");

	function handleUpload(file: File) {
		selectedImage.value = file;
		imagePreviewUrl.value = URL.createObjectURL(file);
	}
</script>

<template>
	<div class="mb-4">
		<span class="block mb-2 font-medium">
			{{ field.label ? field.label : "" }}
			<span v-if="field.required"> (required)</span>
			<span v-else class="opacity-50"> (optional) </span>
		</span>

		<div class="flex items-center">
			<!-- Profile picture button -->
			<button
				class="flex justify-center items-center bg-gray-100 w-[72px] h-[72px] rounded-lg"
				@click="showModal = true"
				v-if="!selectedImage"
			>
				<Icon
					icon="material-symbols:add-2-rounded"
					width="24"
					height="24"
					style="color: #8d8d8d"
				/>
			</button>

			<!-- Selected image preview -->
			<div
				v-else
				class="relative w-[72px] h-[72px] rounded-lg overflow-hidden cursor-pointer"
				@click="showModal = true"
			>
				<img
					:src="imagePreviewUrl"
					alt="Profile picture"
					class="w-full h-full object-cover"
				/>
			</div>
		</div>

		<!-- Modal component -->
		<UploadPictureModal
			v-if="showModal"
			@close="showModal = false"
			@upload="handleUpload"
		/>
	</div>
</template>
