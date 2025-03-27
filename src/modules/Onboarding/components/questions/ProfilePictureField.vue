<script setup lang="ts">
	import type { PictureField } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { Icon } from "@iconify/vue";
	import UploadPictureModal from "~/src/modules/Onboarding/components/questions/modals/UploadPictureModal.vue";
	import { ref } from "vue";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

	const props = defineProps<{
		field: PictureField;
	}>();

	const onboardingStore = useOnboardingStore();

	const showModal = ref(false);
	const selectedImage = ref<File | null>(null);
	const imagePreviewUrl = ref<string>("");

	// Fetches existing image from Supabase to display to user
	async function fetchExistingImage() {
		const supabase = useSupabaseClient();
		const existingImagePath = onboardingStore.getAnswer(props.field.key);

		if (existingImagePath) {
			try {
				const { data } = supabase.storage
					.from("user-pictures")
					.getPublicUrl(existingImagePath as string);

				if (data?.publicUrl) {
					imagePreviewUrl.value = data.publicUrl;
				}
			} catch (error) {
				console.error("Error fetching existing image:", error);
			}
		}
	}

	async function handleUpload(file: File) {
		selectedImage.value = file;
		imagePreviewUrl.value = URL.createObjectURL(file);

		const filePath = `${Date.now()}_${file.name}`;

		const supabase = useSupabaseClient();

		const { data, error } = await supabase.storage
			.from("user-pictures")
			.upload(filePath, file);

		if (error) {
			console.error(error);
			return;
		}

		onboardingStore.setAnswer(props.field.key, data.path);
	}

	// Fetch existing image when component is mounted
	onMounted(() => {
		fetchExistingImage();
	});
</script>

<template>
	<div class="mb-4">
		<span class="block mb-2 font-medium">
			{{ field.label ? field.label : "" }}
			<span v-if="field.required"> (required)</span>
			<span v-else class="opacity-50"> (optional) </span>
		</span>

		<div class="flex items-center">
			<!-- profile picture button -->
			<button
				class="flex justify-center items-center bg-gray-100 w-[72px] h-[72px] rounded-lg"
				@click="showModal = true"
				v-if="!imagePreviewUrl"
			>
				<Icon
					icon="material-symbols:add-2-rounded"
					width="24"
					height="24"
					style="color: #8d8d8d"
				/>
			</button>

			<!-- selected image preview -->
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
			:img-preview-url="imagePreviewUrl"
			@close="showModal = false"
			@upload="handleUpload"
		/>
	</div>
</template>
