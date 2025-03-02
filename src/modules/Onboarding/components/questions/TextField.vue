<script setup lang="ts">
import type {
  Field,
  Question,
  TextField,
} from "~/src/modules/Onboarding/types/onboardingTypes";
import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

const props = defineProps<{
  field: TextField;
  modelValue: string;
}>();

const { field } = toRefs(props);

const onboardingStore = useOnboardingStore();

// Get key of current question
const questionKey = computed(() => onboardingStore.currentQuestion.key);

// Check field has an icon
const hasIcon = computed(() => !!props.field.icon);

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
      <input
        v-model="value"
        class="w-full border rounded-lg py-3 px-3 outline-gray-300"
        :class="{ 'pl-10': hasIcon }"
        type="text"
        :placeholder="field.placeholder || ''"
      />
      <div
        v-if="hasIcon"
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
      >
        <img
          v-if="typeof field.icon === 'string'"
          :src="field.icon"
          alt=""
          class="w-5 h-5"
        />
      </div>
    </div>
  </div>
</template>
