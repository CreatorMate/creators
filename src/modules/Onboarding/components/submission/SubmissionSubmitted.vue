<script setup lang="ts">
	import ProgressIndicator from "~/src/components/Loading/ProgressIndicator.vue";

	const router = useRouter();

	async function clickUpdate() {
		await router.push("/apply");
	}
</script>

<template>
	<div class="mt-10 ml-0 lg:ml-10 mx-4 lg:mx-0">
		<div class="space-y-4">
			<p class="text-2xl font-[400]">application status:</p>

			<p class="text-[28px] font-[500]">under review.</p>
		</div>

		<!-- progress indicator -->
		<div class="w-fit">
			<ProgressIndicator
				:step="2"
				:total="3"
				:height="5"
				:width="25"
				class="mt-7 mb-4 ml-[-1px]"
			/>
		</div>

		<p class="text-[#151515] font-[400] mt-2 w-[408px] max-w-full">
			thank you for applying! we appreciate your interest in joining our curated
			community. our team will carefully review your application, considering
			your portfolio and experience. we will reach out with an update once the
			review process is complete. if you have any questions in the meantime,
			feel free to contact us.
		</p>

		<button
			@click="clickUpdate"
			class="flex items-center bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
		>
			<span>update your application</span>
			<img src="/icons/arrow-right.svg" alt="" class="w-4 h-4 invert ml-3" />
		</button>
	</div>
</template>
