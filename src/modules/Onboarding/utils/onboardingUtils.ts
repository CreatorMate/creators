import type {
	Question,
	Answers,
	TextField,
	DateField,
	MultiChoiceField,
	TextAreaField,
	LocationField,
} from "../types/onboardingTypes";

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
	if (question.required === false) return { valid: true };
	const answerGroup = answers[question.key] ?? {};

	for (const field of question.fields) {
		if (!field.required) continue;
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
			case "location":
				validation = validateLocationField(field, answer as string);
				break;
			default:
				console.warn(`Unknown field type: ${field.type}`);
				continue;
		}

		if (!validation.valid) {
			return validation;
		}
	}
	return { valid: true };
}

export function validateTextField(
	field: TextField,
	answer: string,
): ValidationAnswer {
	if (!answer || answer === "") {
		return {
			valid: false,
			errorMessage: `${field.label} field cannot be empty`,
		};
	}
	if (field.maxLength && answer.length > field.maxLength) {
		return {
			valid: false,
			errorMessage: `${field.label} field cannot exceed ${field.maxLength} characters`,
		};
	}
	return { valid: true };
}

export function validateDateField(field: DateField, answer: Date) {
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

export function validateMultiChoiceField(
	field: MultiChoiceField,
	answer: string[],
) {
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

export function validateTextareaField(field: TextAreaField, answer: string) {
	if (!answer || answer === "") {
		return {
			valid: false,
			errorMessage: `${field.label} field cannot be empty`,
		};
	}
	if (field.maxLength && answer.length > field.maxLength) {
		return {
			valid: false,
			errorMessage: `${field.label} field cannot exceed ${field.maxLength} characters`,
		};
	}
	return { valid: true };
}

export function validateLocationField(field: LocationField, answer: string) {
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
