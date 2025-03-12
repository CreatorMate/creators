import type { Question, Answers } from "../types/onboardingTypes";

/**
 * Validates answers of a question.
 *
 * @param question The question for which the answer fields are validated.
 * @param answers Object storing the answers for all question.
 */
export function validateQuestion(
	question: Question,
	answers: Answers,
): boolean {
	// If the question isn’t required, there's no need to validate any fields.
	if (question.required === false) return true;

	return question.fields.every((field) => {
		// If the field is not required, skip extra checks.
		if (!field.required) return true;

		const answerGroup = answers[question.key] ?? {};
		const answer = answerGroup[field.key];

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
				if (!Array.isArray(answer)) return false;
				const count = answer.length;
				if (field.minChoices !== undefined && count < field.minChoices)
					return false;
				if (field.maxChoices !== undefined && count > field.maxChoices)
					return false;
				return true;
			case "textarea":
				return answer !== undefined && answer !== "";
			case "location":
				return answer !== undefined && answer !== "";
			default:
				return true;
		}
	});
}

/**
 * Helper function to format a key for display.
 * E.g., "name_question" -> "name"
 */
export function formatDisplayKey(key: string): string {
	return key.replace("_question", "").replace(/_/g, " ");
}
