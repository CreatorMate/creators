<script setup lang="ts">
	import { ref, onMounted, onUnmounted, computed } from "vue";
	import { Icon } from "@iconify/vue";

	const props = defineProps<{
		imgPreviewUrl?: string | null;
	}>();

	const emit = defineEmits(["close", "upload"]);

	const fileInput = ref<HTMLInputElement | null>(null);
	const selectedFile = ref<File | null>(null);
	const previewUrl = ref<string>(props.imgPreviewUrl ?? "");
	const isDragging = ref(false);

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			if (isValidImageFile(file)) {
				selectedFile.value = file;
				createPreview(file);
			}
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging.value = true;
	}

	function handleDragLeave() {
		isDragging.value = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging.value = false;
		if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
			const file = event.dataTransfer.files[0];
			if (isValidImageFile(file)) {
				selectedFile.value = file;
				createPreview(file);
			}
		}
	}

	function isValidImageFile(file: File): boolean {
		const acceptedTypes = [
			"image/jpeg",
			"image/png",
			"image/gif",
			"image/webp",
		];
		return acceptedTypes.includes(file.type);
	}

	function createPreview(file: File) {
		previewUrl.value = URL.createObjectURL(file);
	}

	function openFileBrowser() {
		fileInput.value?.click();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Escape") {
			emit("close");
		}
	}

	// Truncate filename
	function truncateFilename(filename: string, maxLength: number = 20): string {
		if (filename.length <= maxLength) return filename;
		const extensionStart = filename.lastIndexOf(".");
		const extension = filename.slice(extensionStart);
		const name = filename.slice(0, extensionStart);
		return name.slice(0, maxLength - extension.length - 3) + "..." + extension;
	}

	// Upload function
	function handleUpload() {
		if (selectedFile.value) {
			emit("upload", selectedFile.value);
			emit("close");
		}
	}

	const truncatedFileName = computed(() => {
		return selectedFile.value ? truncateFilename(selectedFile.value.name) : "";
	});

	// Determines whether to show the upload instructions
	const showUploadMenu = computed(() => previewUrl.value === "");

	onMounted(() => {
		window.addEventListener("keydown", handleKeyDown);
	});

	onUnmounted(() => {
		window.removeEventListener("keydown", handleKeyDown);
		// Clean up any object URLs to avoid memory leaks
		if (previewUrl.value && previewUrl.value.startsWith("blob:")) {
			URL.revokeObjectURL(previewUrl.value);
		}
	});
</script>

<template>
	<div
		class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30"
	>
		<div
			class="bg-white p-6 rounded-lg shadow-xl w-[600px] relative mx-5 pb-20"
		>
			<button
				class="absolute top-5 right-6 text-gray-500 hover:text-gray-700"
				@click="emit('close')"
			>
				<Icon icon="material-symbols:close-rounded" width="24" height="24" />
			</button>

			<h2 class="text-lg font-semibold mb-2">Add profile picture</h2>
			<p class="mb-4 text-[#3C3C3C] font-medium">
				upload a photo to represent you on creatormate.
			</p>

			<!-- hidden file input -->
			<input
				ref="fileInput"
				type="file"
				accept="image/jpeg, image/png, image/gif, image/webp"
				class="hidden"
				@change="handleFileSelect"
			/>

			<!-- upload area -->
			<div
				class="mb-6 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
				:class="[
					isDragging
						? 'border-blue-500 bg-blue-50'
						: 'border-gray-300 hover:border-gray-400',
					showUploadMenu ? 'py-12' : 'py-4',
				]"
				@click="openFileBrowser"
				@dragover="handleDragOver"
				@dragleave="handleDragLeave"
				@drop="handleDrop"
			>
				<!-- show upload instructions if no preview available -->
				<div v-if="showUploadMenu">
					<div class="flex justify-center mb-4">
						<Icon
							icon="material-symbols:image-outline"
							width="40"
							height="40"
							class="text-gray-700"
						/>
					</div>
					<p class="text-gray-700 mb-2 font-medium">
						drag and drop your photo here
					</p>
					<p class="text-gray-500 text-sm font-medium">or click to browse</p>
					<p class="text-gray-500 text-sm mt-2 font-medium">
						JPG, PNG, GIF, or WEBP (max 5MB)
					</p>
				</div>
				<!-- Show preview if available -->
				<div v-else class="flex items-center justify-center">
					<div class="relative w-24 h-24 mr-4">
						<img
							:src="previewUrl"
							alt="Profile preview"
							class="w-full h-full object-cover rounded-full"
						/>
					</div>
					<div class="text-left font-medium">
						<p class="text-gray-800 font-medium">
							{{ selectedFile ? truncatedFileName : "Current photo" }}
						</p>
						<p class="text-gray-500 text-sm">
							{{
								selectedFile ? Math.round(selectedFile.size / 1024) + " kb" : ""
							}}
						</p>
						<p class="text-blue-500 text-sm mt-1 cursor-pointer">
							change photo
						</p>
					</div>
				</div>
			</div>

			<button
				class="absolute bottom-6 right-6 bg-black text-white px-5 py-2 rounded-lg disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
				:disabled="!selectedFile"
				@click="handleUpload"
			>
				add profile picture
			</button>
		</div>
	</div>
</template>
