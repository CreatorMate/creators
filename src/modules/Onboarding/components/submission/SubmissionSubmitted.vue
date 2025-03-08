<script setup lang="ts">
	import ProgressIndicator from "~/src/components/Core/ProgressIndicator.vue";
</script>

<template>
	<div class="mt-10 ml-10">
		<div class="space-y-4">
			<p class="text-2xl font-[400]">application status:</p>

			<p class="text-[28px] font-[500]">under review.</p>
		</div>

		<ProgressIndicator
			:step="2"
			:total="3"
			:height="5"
			:width="25"
			class="mt-7 mb-4 ml-[-1px]"
		/>

		<p class="text-[#151515] font-[400] mt-2 w-[408px] max-w-full">
			thank you for applying! we appreciate your interest in joining our curated
			community. our team will carefully review your application, considering
			your portfolio and experience. we will reach out with an update once the
			review process is complete. if you have any questions in the meantime,
			feel free to contact us.
		</p>
	</div>
</template>
