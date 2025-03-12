import type { Question, Answers } from "../types/onboardingTypes";

type ValidationAnswer = {
	valid: boolean;
	errorMessage?: string;
};

/**
 * Validates answers of a question.
 *
 * @param question The question for which the answer fields are validated.
 * @param answers Object storing the answers for all question.
 */
export function validateQuestion(
	question: Question,
	answers: Answers,
): ValidationAnswer {
	// If the question isn’t required, there's no need to validate any fields.
	if (question.required === false) return { valid: true };

	// Get the answer group for this question, defaulting to empty object if not found
	const answerGroup = answers[question.key] ?? {};

	for (const field of question.fields) {
		// If the field is not required, skip extra checks.
		if (!field.required) continue;

		const answer = answerGroup[field.key];

		switch (field.type) {
			// Validate text fields
			case "text":
				if (!answer || answer === "") {
					return {
						valid: false,
						errorMessage: `${field.label} field cannot be empty`,
					};
				}

				if (field.maxLength && (answer as string).length > field.maxLength) {
					return {
						valid: false,
						errorMessage: `${field.label} field cannot exceed ${field.maxLength} characters`,
					};
				}
				break;

			// Validate date fields
			case "date":
				const dateValue = new Date(answer as string);
				if (isNaN(dateValue.getTime())) {
					return {
						valid: false,
						errorMessage: `${field.label} field cannot be empty`,
					};
				}

				if (field.minDate && dateValue.getTime() < field.minDate.getTime()) {
					return {
						valid: false,
						errorMessage: `date must be after ${field.minDate.toISOString().split("T")[0]}`,
					};
				}

				if (field.maxDate && dateValue.getTime() > field.maxDate.getTime()) {
					return {
						valid: false,
						errorMessage: `date must be before ${field.maxDate.toISOString().split("T")[0]}`,
					};
				}
				break;

			// Validate multi-choice fields
			case "multi-choice":
				if (!Array.isArray(answer)) {
					return { valid: false, errorMessage: "answer must be an array" };
				}

				const count = answer.length;

				if (field.required && count === 0) {
					return {
						valid: false,
						errorMessage: "at least one choice must be selected",
					};
				}

				if (field.minChoices && count < field.minChoices) {
					return {
						valid: false,
						errorMessage: `answer must have at least ${field.minChoices} choices`,
					};
				}

				if (field.maxChoices && count > field.maxChoices) {
					return {
						valid: false,
						errorMessage: `answer must have at most ${field.maxChoices} choices`,
					};
				}
				break;

			// Validate textarea fields
			case "textarea":
				if (!answer || answer === "") {
					return {
						valid: false,
						errorMessage: `${field.label} field cannot be empty`,
					};
				}

				if (field.maxLength && (answer as string).length > field.maxLength) {
					return {
						valid: false,
						errorMessage: `field cannot exceed ${field.maxLength} characters`,
					};
				}
				break;

			// Validate location fields
			case "location":
				if (!answer || answer === "") {
					return {
						valid: false,
						errorMessage: `${field.label} field cannot be empty`,
					};
				}
				break;

			// Handle unexpected field types
			default:
				console.warn(`Unknown field type: ${field.type}`);
				break;
		}
	}

	// If all fields passed validation
	return { valid: true };
}

/**
 * Helper function to format a key for display.
 * E.g., "name_question" -> "name"
 */
export function formatDisplayKey(key: string): string {
	return key.replace("_question", "").replace(/_/g, " ");
}
