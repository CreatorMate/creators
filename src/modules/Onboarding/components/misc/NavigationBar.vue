<script setup lang="ts">
	import BackButton from "~/src/modules/Onboarding/components/buttons/BackButton.vue";
	import LogoComponent from "~/src/modules/Onboarding/components/misc/LogoComponent.vue";
	import ActionButton from "~/src/modules/Onboarding/components/buttons/ActionButton.vue";

	const props = defineProps<{
		canGoBack: boolean;
		cameFromReview: boolean;
	}>();

	const emit = defineEmits<{
		(e: "back"): void;
	}>();
</script>

<template>
	<nav
		class="relative w-full flex items-center text-center px-12 py-6 justify-center"
	>
		<!-- Back Button -->
		<BackButton
			v-if="canGoBack && !cameFromReview"
			:isMobile="false"
			@click="emit('back')"
		/>
		<BackButton
			v-if="canGoBack && !cameFromReview"
			:isMobile="true"
			@click="emit('back')"
		/>

		<!-- Logo and Progress Container -->
		<div class="flex flex-col items-center">
			<LogoComponent :isMobile="false" />
			<LogoComponent :isMobile="true" />
		</div>

		<!-- Action Buttons - Desktop -->
		<div class="absolute right-[15%] hidden lg:flex space-x-2">
			<ActionButton :to="'/submission/status'" :isMobile="false">
				save & exit
			</ActionButton>
		</div>

		<!-- Action Buttons - Mobile -->
		<div class="absolute right-4 flex items-center space-x-2 lg:hidden">
			<ActionButton :to="'/submission/status'" :isMobile="true">
				save & exit
			</ActionButton>
		</div>
	</nav>
</template>
