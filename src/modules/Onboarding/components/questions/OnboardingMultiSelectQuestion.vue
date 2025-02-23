<script setup lang="ts">
import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
import type { MultiChoiceQuestion } from "~/src/modules/Onboarding/types/OnboardingQuestion";

const props = defineProps<{
  question: MultiChoiceQuestion;
  modelValue?: string | string[];
}>();

const emit = defineEmits(["update:modelValue"]);

const onboardingStore = useOnboardingStore();

const value = computed<string[]>({
  get: () => (Array.isArray(props.modelValue) ? props.modelValue : []),
  set: (newValue: string[]) => emit("update:modelValue", newValue),
});

function addOption(item: string) {
  const newValue = [...value.value, item];
  emit("update:modelValue", newValue);
}

function removeOption(item: string) {
  const newValue = value.value.filter((option) => option !== item);
  emit("update:modelValue", newValue);
}
</script>

<template>
  <p class="font-medium mt-2">selected options:</p>
  <div class="flex flex-wrap gap-2">
    <p
      class="px-3 py-1 bg-gray-400 text-white rounded-full"
      @click="removeOption(option)"
      v-for="option of value"
    >
      {{ option }}
    </p>
  </div>
  <div class="mt-6">
    <p class="font-medium mt-2">options:</p>
    <div class="flex flex-wrap gap-2">
      <div @click="addOption(option)" v-for="option of question.options">
        <p
          class="px-3 py-1 bg-gray-400 text-white rounded-full"
          v-if="!value.includes(option)"
        >
          {{ option }}
        </p>
      </div>
    </div>
  </div>
  <div class="flex gap-2 mt-6">
    <button
      v-if="onboardingStore.canGoBack"
      @click="onboardingStore.back"
      class="bg-black text-white px-24 py-3 rounded-lg"
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

    <button @click="onboardingStore.reset">reset</button>
  </div>
</template>
