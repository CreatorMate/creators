<script setup lang='ts'>
    import OnboardingTextQuestion from "~/src/modules/Onboarding/components/questions/OnboardingTextQuestion.vue";
    import OnboardingTextAreaQuestion from "~/src/modules/Onboarding/components/questions/OnboardingTextAreaQuestion.vue";
    import OnboardingMultiSelectQuestion from "~/src/modules/Onboarding/components/questions/OnboardingMultiSelectQuestion.vue";
    import OnboardingDateQuestion from "~/src/modules/Onboarding/components/questions/OnboardingDateQuestion.vue";
    import type {Question} from "~/src/modules/Onboarding/types/OnboardingQuestion";
    import {useOnboardingStore} from "~/src/modules/Onboarding/stores/onboardingStore";

    const onboardingStore = useOnboardingStore()

    const props = defineProps<{
        question: Question,
        total: number,
        step: number,
    }>();

    const {question, step, total} = toRefs(props);

    // Compute type of question component
    const questionComponent = computed(() => {
        switch (question.value.type) {
            case 'text': return OnboardingTextQuestion
            case 'date': return OnboardingDateQuestion
            case 'multi': return OnboardingMultiSelectQuestion  // should accept `options` as param
            default: return OnboardingTextAreaQuestion
        }
    });

</script>

<template>
    <h1 class="text-2xl font-medium">Application: Started</h1>
    <p class="text-[#8D8D8D] font-medium mt-2">{{  question.question }}</p>
    <p class="mt-2 font-medium">question: {{ step }} of {{ total }}</p>

  <component
      :is="questionComponent"
      :modelValue="onboardingStore.answers[question.key] ?? (question.type === 'multi' ? [] : '')"
      @update:modelValue="onboardingStore.setAnswer($event)"
      :step="step"
      :total="total"
      v-bind="question.type === 'multi' && { options: question.options }"
  />
</template>