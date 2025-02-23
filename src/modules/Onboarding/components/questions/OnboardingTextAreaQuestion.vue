<script setup lang="ts">
import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
import type { TextAreaQuestion } from "~/src/modules/Onboarding/types/OnboardingQuestion";

const props = defineProps<{
  question: TextAreaQuestion;
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);
const onboardingStore = useOnboardingStore();

const value = computed({
  get: () => props.modelValue || "",
  set: (newValue) => emit("update:modelValue", newValue),
});
</script>

<template>
  <textarea
    v-model="value"
    class="w-full border rounded-lg py-3 px-3 mt-2 outline-gray-300"
    type="text"
  ></textarea>
  <button
    v-if="onboardingStore.canGoBack"
    @click="onboardingStore.back"
    class="bg-black text-white px-24 py-3 rounded-lg mt-6 mr-2"
  >
    back
  </button>
  <button
    v-if="!onboardingStore.isLastStep"
    @click="onboardingStore.next"
    class="bg-black text-white px-24 py-3 rounded-lg mt-6 disabled:bg-gray-400"
  >
    next
  </button>
</template>
