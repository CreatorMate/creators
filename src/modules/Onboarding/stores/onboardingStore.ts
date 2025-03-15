import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type { Answers, AnswerType, Question } from "../types/onboardingTypes";
import { onboardingQuestions } from "~/src/modules/Onboarding/constants/questions";
import { validateQuestion } from "~/src/modules/Onboarding/utils/onboardingUtils";
import { STORAGE_KEY } from "@supabase/auth-js/src/lib/constants";
import type { StoredState } from "~/src/modules/Onboarding/utils/onboardingStorage";
import {
	loadOnboardingState,
	saveOnboardingState,
} from "~/src/modules/Onboarding/utils/onboardingStorage";

// Store to manage the onboarding flow state and actions.
export const useOnboardingStore = defineStore("onboarding", () => {
	// Array of questions for onboarding process.
	const questions = ref<Question[]>(onboardingQuestions);

	// Index of the current step.
	const currentStep = ref(1);

	// Object storing the answers keyed by the questions' key field.
	const answers = ref<Answers>({});

	// Object to track which fields have been touched by the user
	const touchedFields = ref<Record<string, Record<string, boolean>>>({});

	// Boolean storing whether the state has been correctly loaded/initialized.
	const isInitialized = ref(false);

	// String storing an error message.
	const error = ref("");

	// Boolean storing whether the TOS have been accepted.
	const isTOSAccepted = ref(false);

	// Flag storing if user came from review page.
	const cameFromReview = ref(false);

	// Computed property that determines the total number of steps (questions + application review page).
	const totalSteps = computed(() => questions.value.length + 1);

	// Computed property that determines the current question based on the current step.
	const currentQuestion = computed(() => {
		return currentStep.value <= questions.value.length
			? questions.value[currentStep.value - 1]
			: null; // return null object after finishing all questions
	});

	// Computed property that determines whether the current step is the review step.
	const isReviewStep = computed(() => currentStep.value === totalSteps.value);

	// Computed property that determines whether the current step is the last one.
	// NOTE: This is the same as `isReviewStep`. May change later.
	const isLastStep = computed(() => isReviewStep.value);

	// Computed property that determines if user can proceed to the next question.
	const canProceed = computed(() => {
		// Always allow proceeding on the review step.
		if (isReviewStep.value) return true;

		// Early return if there is no current question.
		if (!currentQuestion.value) return false;

		// Validate current question.
		const { valid, errorMessage } = validateQuestion(
			currentQuestion.value,
			answers.value,
		);

		if (!valid && errorMessage) {
			error.value = errorMessage;
		}

		if (valid) {
			resetErrorMessage();
		}

		return valid;
	});

	/**
	 * Computed property that determines if the user can go back to the previous question.
	 * The user can go back to the previous question either if the value of `currentStep` is greater than 1, or if
	 * the user came from the review page.
	 */
	const canGoBack = computed(
		() => currentStep.value > 1 || cameFromReview.value,
	);

	// Check if a field has been touched
	function isFieldTouched(questionKey: string, fieldKey: string): boolean {
		return touchedFields.value[questionKey]?.[fieldKey] || false;
	}

	// Mark a field as touched
	function setFieldTouched(questionKey: string, fieldKey: string): void {
		if (!touchedFields.value[questionKey]) {
			touchedFields.value[questionKey] = {};
		}
		touchedFields.value[questionKey][fieldKey] = true;
	}

	// Sets the answer for the current question in the `answers` object.
	function setAnswer(fieldKey: string, value: AnswerType): void {
		// Throw error if no currentQuestion exists
		if (!currentQuestion.value) {
			console.error("No current question available");
			return;
		}

		const questionKey = currentQuestion.value.key;

		// Initialize answer object for this question if it doesn't exist
		if (!answers.value[questionKey]) {
			answers.value[questionKey] = {};
		}

		// Set field value
		answers.value[questionKey][fieldKey] = value;

		// Mark this field as touched
		setFieldTouched(questionKey, fieldKey);
	}

	// Increments the current step in the quiz, if the user can proceed further. Also resets any error messages.
	function next(): void {
		// If user came from review, jump back to review step and reset flag
		if (cameFromReview.value) {
			currentStep.value = totalSteps.value;
			cameFromReview.value = false;
			resetErrorMessage();
			return;
		}

		if (canProceed.value && currentStep.value < totalSteps.value) {
			currentStep.value++;
			resetErrorMessage();
		}
	}

	// Decrements the current step in the quiz, if the user can go back. Also resets any error messages.
	function back(): void {
		if (!canGoBack.value) return;

		currentStep.value--;
		resetErrorMessage();
	}

	// Jump to specific question.
	function jumpToQuestion(stepIndex: number): void {
		if (stepIndex >= 1 && stepIndex <= totalSteps.value) {
			currentStep.value = stepIndex;
			resetErrorMessage();
		}
	}

	// Returns the step number for the given question key, or null if not found.
	function getQuestionStepByKey(key: string): number {
		const index = questions.value.findIndex((question) => question.key === key);
		return index + 1;
	}

	/**
	 * Resets the user's answers by assigning the `answers` object to an empty object. Also resets the current step that
	 * the user goes back to the first question.
	 *
	 * This function also removes the user's answer from local storage.
	 */
	function reset(): void {
		isInitialized.value = false;
		currentStep.value = 1;
		answers.value = {};
		localStorage.removeItem(STORAGE_KEY);
		isInitialized.value = true;
	}

	/**
	 * Loads saved state from local storage and sets `answers` and `currentStep` objects to match the most recently
	 * saved state.
	 *
	 * This function is called when `ApplyView` is mounted.
	 */
	function hydrate(): void {
		const savedState = loadOnboardingState();
		if (savedState) {
			currentStep.value = savedState.currentStep;
			answers.value = savedState.answers;
		} else {
			// Initialize empty answer objects for all questions
			questions.value.forEach((question) => {
				if (!answers.value[question.key]) {
					answers.value[question.key] = {};
				}
			});
		}
		isInitialized.value = true;
	}

	// Resets error messages.
	function resetErrorMessage(): void {
		error.value = "";
	}

	// Persist state on every change using a watcher.
	watch(
		[answers, currentStep],
		() => {
			if (isInitialized.value) {
				const state: StoredState = {
					currentStep: currentStep.value,
					answers: answers.value,
				};
				saveOnboardingState(state);
			}
		},
		{ deep: true },
	);

	return {
		questions,
		currentStep,
		answers,
		totalSteps,
		cameFromReview,
		currentQuestion,
		isLastStep,
		isReviewStep,
		canProceed,
		canGoBack,
		error,
		isTOSAccepted,
		hydrate,
		jumpToQuestion,
		setAnswer,
		next,
		back,
		reset,
		getQuestionStepByKey,
		isFieldTouched,
		setFieldTouched,
	};
});
