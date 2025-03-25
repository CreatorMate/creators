<script setup lang="ts">
	import type { Question } from "~/src/modules/Onboarding/types/onboardingTypes";
	import TextField from "~/src/modules/Onboarding/components/questions/TextField.vue";
	import TextAreaField from "~/src/modules/Onboarding/components/questions/TextAreaField.vue";
	import DateField from "~/src/modules/Onboarding/components/questions/DateField.vue";
	import MultiChoiceField from "~/src/modules/Onboarding/components/questions/MultiChoiceField.vue";
	import SocialField from "~/src/modules/Onboarding/components/questions/SocialField.vue";
	import LocationField from "~/src/modules/Onboarding/components/questions/LocationField.vue";
	import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
	import PictureField from "~/src/modules/Onboarding/components/questions/PictureField.vue";
	import PhoneNumberField from "~/src/modules/Onboarding/components/questions/modals/PhoneNumberField.vue";

	const onboardingStore = useOnboardingStore();

	const props = defineProps<{
		question: Question;
	}>();

	const emit = defineEmits<{
		(e: "last-enter"): void;
	}>();

	const fieldRefs = ref<any[]>([]);

	const fields = computed(() => props.question.fields);

	const fieldMap = {
		text: TextField,
		textarea: TextAreaField,
		date: DateField,
		"multi-choice": MultiChoiceField,
		social: SocialField,
		location: LocationField,
		picture: PictureField,
		"phone-number": PhoneNumberField,
	};

	const handleFieldEnter = (
		index: number,
		inputEl: HTMLInputElement | null,
	) => {
		if (index < props.question.fields.length - 1) {
			// If not the last field, focus the next one.
			nextTick(() => {
				const nextField = fieldRefs.value[index + 1];
				// Call the exposed focus method if available.
				nextField?.focus?.();
			});
		} else {
			// Last field: notify the parent to trigger the "next" action.
			emit("last-enter");
		}
	};

	// Watch for changes to the question prop
	watch(
		() => props.question,
		() => {
			// Reset field refs when the question changes
			nextTick(() => {
				// Ensures refs are updated after the DOM has rendered
				fieldRefs.value = fieldRefs.value.filter((ref) => ref !== null);
			});
		},
		{ immediate: true },
	);

	// Add an onMounted hook to ensure refs are initialized
	onMounted(() => {
		nextTick(() => {
			fieldRefs.value = fieldRefs.value.filter((ref) => ref !== null);
		});
	});
</script>

<template>
	<div>
		<p class="text-2xl mb-[20px] font-semibold">{{ props.question.label }}</p>
		<p
			v-if="props.question.description"
			class="text-black font-medium mt-2 mb-2 whitespace-pre-line"
		>
			{{ props.question.description }}
		</p>

		<!-- TODO: Fix this messy code!!!! robin: yes pleaseeeeee -->
		<!-- Answer fields -->
		<div :class="{ 'flex flex-row gap-6': onboardingStore.currentStep === 1 }">
			<template v-if="onboardingStore.currentStep === 2">
				<!-- First field (full row) -->
				<component
					:is="fieldMap[fields[0].type] as any"
					:field="fields[0]"
					class="mb-[24px] w-full"
					:ref="
						(el: any) => {
							if (el) fieldRefs[0] = el;
						}
					"
					@enter="handleFieldEnter(0, $event)"
				/>

				<!-- Second & Third fields in flex-row -->
				<div class="flex flex-row gap-6 w-full">
					<component
						v-for="(field, index) in fields.slice(1)"
						:key="field.key"
						:is="fieldMap[field.type] as any"
						:field="field"
						class="mb-[24px] w-1/2"
						:ref="
							(el: any) => {
								if (el) fieldRefs[index + 1] = el;
							}
						"
						@enter="handleFieldEnter(index + 1, $event)"
					/>
				</div>
			</template>

			<template v-else>
				<component
					v-for="(field, index) in fields"
					:key="field.key"
					:is="fieldMap[field.type] as any"
					:field="field"
					class="mb-[24px] w-full"
					:ref="
						(el: any) => {
							if (el) fieldRefs[index] = el;
						}
					"
					@enter="handleFieldEnter(index, $event)"
				/>
			</template>
		</div>
		<p>{{ onboardingStore.answers }}</p>
	</div>
</template>
