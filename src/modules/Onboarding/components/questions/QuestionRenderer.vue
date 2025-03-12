<script setup lang="ts">
	import type { Question } from "~/src/modules/Onboarding/types/onboardingTypes";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import TextField from "~/src/modules/Onboarding/components/questions/TextField.vue";
	import TextAreaField from "~/src/modules/Onboarding/components/questions/TextAreaField.vue";
	import DateField from "~/src/modules/Onboarding/components/questions/DateField.vue";
	import MultiChoiceField from "~/src/modules/Onboarding/components/questions/MultiChoiceField.vue";
	import SocialField from "~/src/modules/Onboarding/components/questions/SocialField.vue";
	import LocationField from "~/src/modules/Onboarding/components/questions/LocationField.vue";

	const onboardingStore = useOnboardingStore();

	const props = defineProps<{
		question: Question;
	}>();

	const fields = computed(() => props.question.fields);

	const fieldMap = {
		text: TextField,
		textarea: TextAreaField,
		date: DateField,
		"multi-choice": MultiChoiceField,
		social: SocialField,
		location: LocationField,
	};
</script>

<template>
	<div>
		<p class="text-2xl mb-[20px] font-semibold">{{ props.question.label }}</p>
		<!--  <p class="text-[#8D8D8D] font-medium mt-2">{{ props.question.label }}</p>-->
		<p
			v-if="props.question.description"
			class="text-black font-medium mt-2 mb-2 whitespace-pre-line"
		>
			{{ props.question.description }}
		</p>

		<!-- Answer fields -->
		<component
			v-for="field in fields"
			:key="field.key"
			:is="fieldMap[field.type] as any"
			:field="field"
			class="mb-[24px]"
		/>
	</div>
</template>
