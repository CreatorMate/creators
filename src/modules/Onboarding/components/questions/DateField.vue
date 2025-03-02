<script setup lang="ts">
import type { DateField } from "~/src/modules/Onboarding/types/onboardingTypes";
import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

const props = defineProps<{
  field: DateField;
  modelValue: string;
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
  <span>{{ field.label ? field.label : "" }}</span>

  <input
    v-model="value"
    class="w-full border rounded-lg py-3 px-3 mt-2 outline-gray-300"
    type="date"
  />
</template>
