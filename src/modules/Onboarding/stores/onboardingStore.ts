import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { Answers, Question } from '../types/OnboardingQuestion'
import { onboardingQuestions } from "~/src/modules/Onboarding/constants/questions";

// Key for local storage of answers
const STORAGE_KEY = 'onboarding-state'

type StoredState = {
    currentStep: number
    answers: Answers
}

export const useOnboardingStore = defineStore('onboarding', () => {
    const questions = ref<Question[]>(onboardingQuestions)
    const currentStep = ref(1)
    const answers = ref<Answers>({})
    const isInitialized = ref(false)
    const errorMessage = ref('')

    const totalSteps = computed(() => questions.value.length)
    const currentQuestion = computed(() => questions.value[currentStep.value - 1])
    const isLastStep = computed(() => currentStep.value === totalSteps.value)

    const canProceed = computed(() => {
        const answer = answers.value[currentQuestion.value.id]
        const question = currentQuestion.value

        switch (question.type) {
            case 'text':
                return !(answer === undefined || answer === '')
            case 'date':
                // Handle dates
                try {
                    const dateValue = new Date(answer as string)
                    return !isNaN(dateValue.getTime())
                } catch {
                    return false;
                }
            case 'multi-choice':
                // Handle arrays
                return Array.isArray(answer) && answer.length > 0
            case 'textarea':
                return true
            default:
                return answer !== ''
        }

        // return question.validate ? question.validate(answer) : true;
    });

    const canGoBack = computed(() => currentStep.value > 1)

    function setAnswer(value: unknown) {
        answers.value[currentQuestion.value.id] = value
    }

    function next() {
        if (canProceed.value && currentStep.value < totalSteps.value) {
            currentStep.value++
            resetErrorMessage()
        }
    }

    function back() {
        if (canGoBack.value) {
            currentStep.value--
            resetErrorMessage()
        }
    }

    function reset() {
        isInitialized.value = false
        currentStep.value = 1
        answers.value = {}
        localStorage.removeItem(STORAGE_KEY)
        isInitialized.value = true
    }

    // Loads state from local storage
    function loadState(): StoredState | null {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            console.log('Loading saved state:', saved)
            return saved ? JSON.parse(saved) : null
        } catch {
            return null
        }
    }

    // Save state to local storage
    function saveState() {
        const state: StoredState = {
            currentStep: currentStep.value,
            answers: answers.value
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        } catch (error) {
            console.error('Failed to save onboarding state:', error)
        }
    }

    /**
     * This watcher saves the current state every time an answer or the current step is
     * changed. This may lead to performance issues. May fix later with debouncing or similar.
     * Alternatively, if keeping the current state of the onboarding quiz is not that important,
     * keeping track of state could be removed altogether.
     */
    watch(
        [answers, currentStep],
        () => {
            if (isInitialized.value) {
                saveState();
            }
        },
        { deep: true }
    );

    function hydrate() {
        const savedState = loadState()
        if (savedState) {
            currentStep.value = savedState.currentStep
            answers.value = savedState.answers
        }
        isInitialized.value = true;
    }

    function resetErrorMessage() {
        errorMessage.value = ''
    }

    return {
        questions,
        currentStep,
        answers,
        totalSteps,
        currentQuestion,
        isLastStep,
        canProceed,
        canGoBack,
        errorMessage,
        hydrate,
        setAnswer,
        next,
        back,
        reset,
        resetErrorMessage,
    }
})