<script setup lang='ts'>
    import OnboardingTextQuestion from "~/src/modules/Onboarding/components/OnboardingTextQuestion.vue";
    import OnboardingTextAreaQuestion from "~/src/modules/Onboarding/components/OnboardingTextAreaQuestion.vue";
    import OnboardingMultiSelectQuestion from "~/src/modules/Onboarding/components/OnboardingMultiSelectQuestion.vue";
    import OnboardingDateQuestion from "~/src/modules/Onboarding/components/OnboardingDateQuestion.vue";
    const props = defineProps<{
        question: {
            question: string,
            type: string
        },
        total: number,
        step: number
    }>();

    const {question, step, total} = toRefs(props);
    const model = defineModel();

    const emits = defineEmits(['back', 'next']);

</script>

<template>
    <h1 class="text-2xl font-medium">Application: Started</h1>
    <p class="text-[#8D8D8D] font-medium mt-2">{{  question.question }}</p>
    <p class="mt-2 font-medium">question: {{ step }} of {{ total }}</p>
    <OnboardingTextQuestion v-if="question.type === 'text'" v-model="model" @back="emits('back')" @next="emits('next')" :step :total/>
    <OnboardingDateQuestion v-if="question.type === 'date'" v-model="model" @back="emits('back')" @next="emits('next')" :step :total/>
    <OnboardingMultiSelectQuestion v-if="question.type === 'multi'" v-model="model" @back="emits('back')" @next="emits('next')" :step :total/>
    <OnboardingTextAreaQuestion v-if="question.type === 'textarea'" v-model="model" @back="emits('back')" @next="emits('next')" :step :total/>
</template>