<script setup lang="ts">
import type { DateField } from "~/src/modules/Onboarding/types/onboardingTypes";
import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

const props = defineProps<{
  field: DateField;
}>();

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
  <span class="block mb-2">{{ field.label ? field.label : "" }}</span>

  <input
    v-model="value"
    class="w-full bg-gray-100 text-gray-700 px-5 py-5 rounded-md focus:outline-none"
    type="date"
  />
</template>
