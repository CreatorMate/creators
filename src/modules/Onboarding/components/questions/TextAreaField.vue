<script setup lang="ts">
import type { TextAreaField } from "~/src/modules/Onboarding/types/onboardingTypes";
import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

const props = defineProps<{
  field: TextAreaField;
}>();

const { field } = toRefs(props);

const onboardingStore = useOnboardingStore();

// Get key of current question
const questionKey = computed(() => onboardingStore.currentQuestion.key);

const value = computed({
  get: () => {
    // Initialize the question's answer object if it doesn't exist
    if (!onboardingStore.answers[questionKey.value]) {
      onboardingStore.answers[questionKey.value] = {};
    }
    // Return the current value or empty string
    return onboardingStore.answers[questionKey.value][props.field.key] || "";
  },
  set: (newValue) => {
    // Initialize the question's answer object if it doesn't exist
    if (!onboardingStore.answers[questionKey.value]) {
      onboardingStore.answers[questionKey.value] = {};
    }
    // Update answer
    onboardingStore.setAnswer(props.field.key, newValue);
  },
});
</script>

<template>
  <div class="mb-4">
    <span class="block mb-2">{{ field.label ? field.label : "" }}</span>

    <div class="relative">
      <textarea
        v-model="value as any"
        class="w-full border rounded-lg py-3 px-3 outline-gray-300"
        type="text"
        :placeholder="field.placeholder || ''"
      ></textarea>
    </div>
  </div>
</template>
