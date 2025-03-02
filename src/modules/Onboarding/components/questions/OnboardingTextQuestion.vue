<script setup lang="ts">
import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
import type {
  AnswerType,
  TextQuestion,
} from "~/src/modules/Onboarding/types/onboardingTypes";

const props = defineProps<{
  question: TextQuestion;
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);
const onboardingStore = useOnboardingStore();

const value = computed({
  get: () => props.modelValue || "",
  set: (newValue: AnswerType<TextQuestion>) =>
    emit("update:modelValue", newValue),
});
</script>

<template>
  <input
    v-model="value"
    class="w-full border rounded-lg py-3 px-3 mt-2 outline-gray-300"
    type="text"
  />
  <div class="flex gap-2 mt-6">
    <button
      :disabled="!onboardingStore.canGoBack"
      @click="onboardingStore.back"
      class="bg-black text-white px-24 py-3 rounded-lg disabled:bg-gray-400"
    >
      back
    </button>
    <button
      v-if="!onboardingStore.isLastStep"
      :disabled="!onboardingStore.canProceed"
      @click="onboardingStore.next"
      class="bg-black text-white px-24 py-3 rounded-lg disabled:bg-gray-400"
    >
      next
    </button>
  </div>
</template>
