// src/modules/Onboarding/utils/onboardingStorage.ts
import type { Answers } from "../types/onboardingTypes";

// Key for session storage of answers.
export const STORAGE_KEY = "onboarding-state";

// Type of state that will get saved to local storage, containing the currentStep and the answers object.
export type StoredState = {
	currentStep: number;
	answers: Answers;
	cameFromReview?: boolean;
};

/**
 * Loads and parses stored answer state from local storage.
 *
 * Returns a StoredState object holding the parsed answers saved in local storage, and null if an error arises.
 */
export function loadOnboardingState(): StoredState | null {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		return saved ? JSON.parse(saved) : null;
	} catch (error) {
		console.error("Error loading onboarding state:", error);
		return null;
	}
}

/**
 * Saves the current answers state to local storage.
 *
 * This function takes the current state of the answers (the `answers` object, as well as the `currentStep`) and
 * saves it to local storage using a `STORAGE_KEY`.
 */
export function saveOnboardingState(state: StoredState): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (error) {
		console.error("Failed to save onboarding state:", error);
	}
}
