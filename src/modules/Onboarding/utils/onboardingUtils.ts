import type {
	Question,
	Answers,
	TextFieldType,
	DateFieldType,
	MultiChoiceFieldType,
	SocialMediaFieldType,
	TextAreaFieldType,
	LocationFieldType,
	ValidationAnswer,
} from "../types/onboardingTypes";

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
	if (question.required === false) return { valid: true };
	const answerGroup = answers[question.key] ?? {};

	for (const field of question.fields) {
		const answer = answerGroup[field.key];
		let validation;

		switch (field.type) {
			case "text":
				validation = validateTextField(field, answer as string);
				break;
			case "date":
				validation = validateDateField(field, answer as Date);
				break;
			case "multi-choice":
				validation = validateMultiChoiceField(field, answer as string[]);
				break;
			case "textarea":
				validation = validateTextareaField(field, answer as string);
				break;
			case "social":
				validation = validateSocialField(field, answer as string);
				break;
			case "location":
				validation = validateLocationField(field, answer as string);
				break;
			default:
				continue;
		}

		if (!validation.valid) {
			return validation;
		}
	}
	return { valid: true };
}

/**
 * Validates a text field based on its properties and the provided answer.
 *
 * @param {TextFieldType} field - The text field definition containing validation rules.
 * @param {string} answer - The user's input to be validated.
 * @returns {ValidationAnswer} An object indicating whether the input is valid and an error message if applicable.
 */
export function validateTextField(
	field: TextFieldType,
	answer: string,
): ValidationAnswer {
	// if answer exceeds maxLength, invalidate it, even if it is not required
	if (answer && field.maxLength && answer.length > field.maxLength) {
		return {
			valid: false,
			errorMessage: `${field.label} field cannot exceed ${field.maxLength} characters`,
		};
	}
	if (!field.required) return { valid: true };

	if (!answer || answer === "") {
		return {
			valid: false,
			errorMessage: `${field.label} field cannot be empty`,
		};
	}
	return { valid: true };
}

/**
 * Validates a date field based on its properties and the provided answer.
 *
 * @param {DateFieldType} field - The date field definition containing validation rules.
 * @param {Date} answer - The user's input to be validated.
 * @returns {ValidationAnswer} An object indicating whether the input is valid and an error message if applicable.
 */
export function validateDateField(field: DateFieldType, answer: Date) {
	if (!field.required) return { valid: true };

	const dateValue = new Date(answer);
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
	return { valid: true };
}

/**
 * Validates a multi-choice field based on its properties and the provided answer.
 *
 * @param {MultiChoiceFieldType} field - The multi-choice field definition containing validation rules.
 * @param {string[]} answer - The user's input to be validated.
 * @returns {ValidationAnswer} An object indicating whether the input is valid and an error message if applicable.
 */
export function validateMultiChoiceField(
	field: MultiChoiceFieldType,
	answer: string[],
) {
	if (!field.required) return { valid: true };

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
	return { valid: true };
}

export function validateSocialField(
	field: SocialMediaFieldType,
	answer: string,
) {
	if (!field.required) return { valid: true };

	if (!answer || answer === "") {
		return {
			valid: false,
			errorMessage: `${field.label} field cannot be empty`,
		};
	}
	return { valid: true };
}

/**
 * Validates a textarea field based on its properties and the provided answer.
 *
 * @param {TextAreaFieldType} field - The textarea field definition containing validation rules.
 * @param {string} answer - The user's input to be validated.
 * @returns {ValidationAnswer} An object indicating whether the input is valid and an error message if applicable.
 */
export function validateTextareaField(
	field: TextAreaFieldType,
	answer: string,
) {
	if (answer && field.maxLength && answer.length > field.maxLength) {
		return {
			valid: false,
			errorMessage: `${field.label} field cannot exceed ${field.maxLength} characters`,
		};
	}

	if (!field.required) return { valid: true };

	if (!answer || answer === "") {
		return {
			valid: false,
			errorMessage: `${field.label} field cannot be empty`,
		};
	}
	return { valid: true };
}

/**
 * Validates a location field based on its properties and the provided answer.
 *
 * @param {LocationFieldType} field - The location field definition containing validation rules.
 * @param {string} answer - The user's input to be validated.
 * @returns {ValidationAnswer} An object indicating whether the input is valid and an error message if applicable.
 */
export function validateLocationField(
	field: LocationFieldType,
	answer: string,
) {
	if (!field.required) return { valid: true };

	if (!answer || answer === "") {
		return {
			valid: false,
			errorMessage: `${field.label} field cannot be empty`,
		};
	}
	return { valid: true };
}

/**
 * Helper function to format a key for display.
 * E.g., "name_question" -> "name"
 */
export function formatDisplayKey(key: string): string {
	return key.replace("_question", "").replace(/_/g, " ");
}
