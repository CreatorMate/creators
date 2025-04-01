import type {
	Answers,
	Question,
} from "~/src/modules/Onboarding/types/onboardingTypes";
import { onboardingQuestions } from "~/src/modules/Onboarding/constants/questions";

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

/**
 * Formats answers. TODO: Better documentation for this
 * @param flattenedAnswers
 * @param questions
 */
export const formatAnswers = (
	flattenedAnswers: Record<string, string | string[]>,
	questions: Question[] = onboardingQuestions,
): Answers => {
	const formattedAnswers: Record<
		string,
		Record<string, string | string[]>
	> = {};

	questions.forEach((question) => {
		const questionAnswers: Record<string, string | string[]> = {};

		question.fields.forEach((field) => {
			const value = flattenedAnswers[field.key];

			// Only add non-null/non-empty values
			if (
				value !== undefined &&
				value !== null &&
				(typeof value !== "string" || value.trim() !== "") &&
				(Array.isArray(value) ? value.length > 0 : true)
			) {
				questionAnswers[field.key] = value;
			}
		});

		// Only add non-empty question answer objects
		if (Object.keys(questionAnswers).length > 0) {
			formattedAnswers[question.key] = questionAnswers;
		}
	});

	return formattedAnswers;
};
