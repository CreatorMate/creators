<script setup lang="ts">
import OnboardingTextQuestion from "~/src/modules/Onboarding/components/questions/OnboardingTextQuestion.vue";
import OnboardingTextAreaQuestion from "~/src/modules/Onboarding/components/questions/OnboardingTextAreaQuestion.vue";
import OnboardingMultiSelectQuestion from "~/src/modules/Onboarding/components/questions/OnboardingMultiSelectQuestion.vue";
import OnboardingDateQuestion from "~/src/modules/Onboarding/components/questions/OnboardingDateQuestion.vue";
import type { Question } from "~/src/modules/Onboarding/types/OnboardingQuestion";
import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

const onboardingStore = useOnboardingStore();

const props = defineProps<{
  question: Question;
  total: number;
  step: number;
}>();

const { question, step, total } = toRefs(props);

const answer = computed(() => onboardingStore.answers[props.question.key]);

// Mapping of type to component
const componentMap = {
  text: OnboardingTextQuestion,
  textarea: OnboardingTextAreaQuestion,
  date: OnboardingDateQuestion,
  "multi-choice": OnboardingMultiSelectQuestion,
};

// Compute question component based on type
const questionComponent = computed(() => componentMap[props.question.type]);
</script>

<template>
  <h1 class="text-2xl font-medium">Application: Started</h1>
  <p class="text-[#8D8D8D] font-medium mt-2">{{ question.label }}</p>
  <p class="mt-2 font-medium">question: {{ step }} of {{ total }}</p>

  <component
    :is="questionComponent as any"
    :question="question"
    :model-value="answer"
    @update:model-value="onboardingStore.setAnswer($event)"
  />
</template>
