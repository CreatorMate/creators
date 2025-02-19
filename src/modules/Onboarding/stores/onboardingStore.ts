import {defineStore} from 'pinia'
import {ref, computed, watch} from 'vue'
import type {Answer} from '../types/OnboardingAnswer'
import rawQuestions from '../data/questions.json'
import type {Question} from '../types/OnboardingQuestion'

const STORAGE_KEY = 'onboarding-state'

type StoredState = {
    currentStep: number
    answers: Partial<Answer>
}

export const useOnboardingStore = defineStore('onboarding', () => {
    const questions = rawQuestions as Question[]

    const currentStep = ref(1)
    const answers = ref<Partial<Answer>>({})

    const totalSteps = computed(() => questions.length)
    const currentQuestion = computed(() => questions[currentStep.value - 1])
    const isLastStep = computed(() => currentStep.value === totalSteps.value)

    const canProceed = computed(() => {
        const current = currentQuestion.value;
        const answer = answers.value[current.key as keyof Answer];

        // Handle different question types
        switch (current.type) {
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
            case 'multi':
                // Handle arrays
                return Array.isArray(answer) && answer.length > 0
            case 'textarea':
                return true
            default:
                return answer !== ''
        }
    })

    const canGoBack = computed(() => currentStep.value > 1)

    function hydrate() {
        const savedState = loadState()
        if (savedState) {
            currentStep.value = savedState.currentStep
            answers.value = savedState.answers
        }
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
    function saveState(state: StoredState) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
            console.log("Saving state", state)
        } catch (error) {
            console.error('Failed to save onboarding state:', error)
        }
    }

    function setAnswer(value: any) {
        const key = currentQuestion.value.key
        answers.value[key] = value
    }

    function next() {
        if (canProceed.value && currentStep.value < totalSteps.value) {
            currentStep.value++

            // Saves state when user clicks 'next'
            saveState({
                currentStep: currentStep.value,
                answers: answers.value
            })
        }
    }

    function back() {
        if (canGoBack.value) {
            currentStep.value--
        }
    }

    function reset() {
        currentStep.value = 1
        answers.value = {}
        localStorage.removeItem(STORAGE_KEY)
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
        hydrate,
        setAnswer,
        next,
        back,
        reset
    }
})