<script setup lang="ts">
	import ProgressIndicator from "~/src/components/Core/ProgressIndicator.vue";

	const router = useRouter();

	async function clickUpdate() {
		await router.push("/apply");
	}
</script>

<template>
	<div class="mt-10 ml-0 lg:ml-10 mx-4 lg:mx-0">
		<div class="space-y-4">
			<p class="text-2xl font-[400]">application status:</p>

			<p class="text-[28px] font-[500]">unfinished.</p>
		</div>

		<!-- progress indicator -->
		<div class="w-fit">
			<ProgressIndicator
				:step="1"
				:total="3"
				:height="5"
				:width="25"
				class="mt-7 mb-4 ml-[-1px]"
			/>
		</div>

		<p class="text-[#151515] font-[400] mt-2 w-[408px] max-w-full">
			continue your application by clicking the button below. if you have any
			questions in the meantime, feel free to contact us.
		</p>

		<button
			@click="clickUpdate"
			class="flex items-center bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
		>
			<span>continue your application</span>
			<img src="/icons/arrow-right.svg" alt="" class="w-4 h-4 invert ml-3" />
		</button>
	</div>
</template>
