import type { Answers } from "~/src/modules/Onboarding/types/onboardingTypes";

/**
 * Extracts answer from answers object, with the option of excluding keys.
 * @param answers
 * @param excludeKeys
 */
export const extractAnswers = (
	answers: Answers,
	excludeKeys: string[] = [],
) => {
	return Object.fromEntries(
		Object.entries(answers).flatMap(([questionKey, questionAnswers]) =>
			Object.entries(questionAnswers).filter(
				([key]) => !excludeKeys.includes(key),
			),
		),
	);
};
