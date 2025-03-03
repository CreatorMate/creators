import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type { Answers, FieldType, Question } from "../types/onboardingTypes";
import { onboardingQuestions } from "~/src/modules/Onboarding/constants/questions";

// Key for local storage of answers
const STORAGE_KEY = "onboarding-state";

// Type of state that will get saved to local storage, containing the currentStep and the answers object.
type StoredState = {
  currentStep: number;
  answers: Answers;
};

// Store to manage the onboarding flow state and actions.
export const useOnboardingStore = defineStore("onboarding", () => {
  // Array of questions for onboarding process.
  const questions = ref<Question[]>(onboardingQuestions);
  // Index of the current step.
  const currentStep = ref(1);
  // Object storing the answers keyed by the questions' key field.
  const answers = ref<Answers>({});
  // Boolean storing whether the state has been correctly loaded/initialized.
  const isInitialized = ref(false);
  // String storing an error message.
  const errorMessage = ref("");
  // Computed property that determines the total number of steps (questions).

  const totalSteps = computed(() => questions.value.length);

  // Computed property that determines the current question based on the current step.
  const currentQuestion = computed(
    () => questions.value[currentStep.value - 1],
  );

  // Computed property that determines whether the current step is the last one.
  const isLastStep = computed(() => currentStep.value === totalSteps.value);

  // Computed property that determines if user can proceed to the next question.
  // TODO: simplify this and add validation logic to external utils funcitons
  const canProceed = computed(() => {
    const question = currentQuestion.value;
    const questionFields = question.fields;
    // If question is not required
    if (question.required === false) {
      return true;
    }
    // If question is required, loop through its fields and check whether the user input is valid
    return questionFields.every((field) => {
      // Only validate fields marked as required.
      if (field.required === true) {
        const answer = answers.value[question.key][field.key];
        switch (field.type) {
          case "text":
            return answer !== undefined && answer !== "";
          case "date":
            try {
              const dateValue = new Date(answer as string);
              return !isNaN(dateValue.getTime());
            } catch {
              return false;
            }
          case "multi-choice":
            // Check that answer is an array
            if (!Array.isArray(answer)) return false;
            // Keep track of number of choices made by user
            const count = answer.length;
            // If a minimum number of choices is specified, ensure the count meets it.
            if (field.minChoices !== undefined && count < field.minChoices) {
              return false;
            }
            // If a maximum number of choices is specified, ensure the count does not exceed it.
            return !(
              field.maxChoices !== undefined && count > field.maxChoices
            );

          case "textarea":
            return answer !== undefined && answer !== "";
          default:
            // For unrecognized types, either decide to fail validation or skip.
            return true;
        }
      }
      // If the field is not required, consider it valid.
      return true;
    });
  });

  // Computer property that determines if the user can go back to the previous question.
  const canGoBack = computed(() => currentStep.value > 1);

  // Sets the answer for the current question in the `answers` object.
  function setAnswer(fieldKey: string, value: FieldType): void {
    const questionKey = currentQuestion.value.key;

    // Initialize the answer object for this question if it doesn't exist
    if (!answers.value[questionKey]) {
      answers.value[questionKey] = {};
    }

    // Set the field value
    answers.value[questionKey][fieldKey] = value;
  }

  // Increments the current step in the quiz, if the user can proceed further. Also resets any error messages.
  function next(): void {
    if (canProceed.value && currentStep.value < totalSteps.value) {
      currentStep.value++;
      resetErrorMessage();
    }
  }

  // Decrements the current step in the quiz, if the user can go back. Also resets any error messages.
  function back(): void {
    if (canGoBack.value) {
      currentStep.value--;
      resetErrorMessage();
    }
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

  // Loads and parses answers state from local storage.
  function loadState(): StoredState | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  /**
   * Saves the current answers state to local storage.
   *
   * This function takes the current state of the answers (the `answers` object, as well as the `currentStep`) and
   * saves it to local storage using a `STORAGE_KEY`.
   */
  function saveState(): void {
    const state: StoredState = {
      currentStep: currentStep.value,
      answers: answers.value,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save onboarding state:", error);
    }
  }

  /**
   * This watcher saves the current state every time an answer or the current step is changed. This may lead to
   * performance issues, as every user keystroke is recorded and saved to local storage.
   * TODO: Improve performance using debouncing or similar.
   */
  watch(
    [answers, currentStep],
    () => {
      if (isInitialized.value) {
        saveState();
      }
    },
    { deep: true },
  );

  /**
   * Loads saved state from local storage and sets `answers` and `currentStep` objects to match the most recently
   * saved state.
   *
   * This function is called when `ApplyView` is mounted.
   */
  function hydrate(): void {
    const savedState = loadState();
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

  /**
   * Resets the error message to an empty string.
   *
   * This function is used to clear any previous errors before performing a new operation/validation.
   */
  function resetErrorMessage(): void {
    errorMessage.value = "";
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
  };
});
