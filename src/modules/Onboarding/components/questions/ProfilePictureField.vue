<script setup lang="ts">
	import type { PictureField } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { Icon } from "@iconify/vue";
	import { ref } from "vue";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import UploadPictureModal from "~/src/modules/Onboarding/components/questions/modals/UploadPictureModal.vue";
	import SupabaseImage from "~/src/components/Core/SupabaseImage.vue";

	const props = defineProps<{
		field: PictureField;
	}>();

	const onboardingStore = useOnboardingStore();
	const storageBucket = "user-pictures";
	const supabase = useSupabaseClient();

	const showModal = ref(false);
	const localPreviewUrl = ref<string>("");
	const imageFileName = ref<string>("");

	// Generate a unique filename for Supabase storage
	function generateUniqueFileName(file: File) {
		const fileExt = file.name.split(".").pop();
		const user = useSupabaseUser();
		return `${user.value?.id}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
	}

	async function handleUpload(file: File) {
		if (!file) return;

		// If an image is already stored, delete it from Supabase storage
		if (imageFileName.value) {
			const { error: deleteError } = await supabase.storage
				.from(storageBucket)
				.remove([imageFileName.value]);
			if (deleteError) {
				console.error("failed to delete previous image:", deleteError);
			}
		}

		localPreviewUrl.value = URL.createObjectURL(file);

		const fileName = generateUniqueFileName(file);

		const { data, error } = await supabase.storage
			.from(storageBucket)
			.upload(fileName, file, {
				cacheControl: "3600",
				upsert: false,
			});

		if (error) {
			console.error(error);
			return;
		}

		onboardingStore.setAnswer(props.field.key, fileName);
		imageFileName.value = fileName;

		// Clear local preview
		// localPreviewUrl.value = ""
	}

	onMounted(() => {
		const storedImage = onboardingStore.getAnswer(props.field.key) as string;
		if (storedImage && storedImage !== "") {
			imageFileName.value = storedImage;
		}
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
				v-if="!localPreviewUrl && !imageFileName"
			>
				<Icon
					icon="material-symbols:add-2-rounded"
					width="24"
					height="24"
					style="color: #8d8d8d"
				/>
			</button>

			<!-- display immediate preview from blob if available -->
			<div
				v-else-if="localPreviewUrl"
				class="relative w-[72px] h-[72px] rounded-lg overflow-hidden cursor-pointer"
				@click="showModal = true"
			>
				<img :src="localPreviewUrl" class="w-full h-full object-cover" />
			</div>
			<!-- once uploaded, use the supabase image -->
			<div
				v-else
				class="relative w-[72px] h-[72px] rounded-lg overflow-hidden cursor-pointer"
				@click="showModal = true"
			>
				<SupabaseImage
					:bucket="storageBucket"
					:name="imageFileName"
					class="w-full h-full object-cover"
				/>
			</div>
		</div>

		<!-- Modal component -->
		<UploadPictureModal
			v-if="showModal"
			:img-preview-url="localPreviewUrl || imageFileName"
			:storage-bucket="storageBucket"
			@close="showModal = false"
			@upload="handleUpload"
		/>
	</div>
</template>
