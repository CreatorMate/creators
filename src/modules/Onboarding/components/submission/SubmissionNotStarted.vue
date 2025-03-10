<script setup lang="ts">
	import ProgressIndicator from "~/src/components/Core/ProgressIndicator.vue";

	const router = useRouter();

	async function clickStart() {
		await router.push("/apply");
	}
</script>

<template>
	<div class="mt-10 ml-0 lg:ml-10 mx-4 lg:mx-0">
		<div class="space-y-4">
			<p class="text-2xl font-[400]">application status:</p>

			<p class="text-[28px] font-[500]">not started.</p>
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
			<span class="font-semibold">creatormate</span> is a curated community of
			creatives, carefully selected based on portfolio quality and experience.
			share your details, and our team will review your application with
			attention to your work and expertise.
		</p>

		<button
			@click="clickStart"
			class="flex items-center bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
		>
			<span>let's start</span>
			<img src="/icons/arrow-right.svg" alt="" class="w-4 h-4 invert ml-3" />
		</button>
	</div>
</template>
