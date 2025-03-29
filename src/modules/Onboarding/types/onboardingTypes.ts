/**
 * Base interface for answer fields. Requires (unique) `key`, `type`, and `label` attributes. May also have
 * `required` and `validate`
 * attributes.
 */
interface BaseFieldType<T> {
	// Unique key for answer field
	key: string;
	// Generic answer type
	type: T;
	// Answer field label
	label?: string;
	// Dictates whether field requires user input
	required?: boolean;
}

/**
 * Text answer field. May have `maxLength` and `placeholder` attributes.
 */
export interface TextFieldType extends BaseFieldType<"text"> {
	// Max length of text answer, if applicable
	maxLength?: number;
	// Placeholder for text field, if applicable
	placeholder?: string;
	// Text field icon
	icon?: string;
	// Flag which, when set true, only allows user to input numerals
	numeric?: boolean;
}

/**
 * Date answer field. May have minimum and maximum possible input dates (`minDate`, resp. `maxDate).
 */
export interface DateFieldType extends BaseFieldType<"date"> {
	// Minimum accepted date
	minDate?: Date;
	// Maximum accepted date
	maxDate?: Date;
}

/**
 * Multiple choice answer field. May
 * also have a `maxChoices` attribute representing the maximum number of options user can select.
 */
export interface MultiChoiceFieldType extends BaseFieldType<"multi-choice"> {
	// Minimum number of choices user can make
	minChoices?: number;
	// Maximum number of choices user can make
	maxChoices?: number;
	// If set to `true`, the multi choice field will have a search bar
	search?: boolean;
}

/**
 * Textarea answer field. May have `maxLength` and `placeholder` attributes.
 */
export interface TextAreaFieldType extends BaseFieldType<"textarea"> {
	// Max length of text area answer, if applicable
	maxLength?: number;
	// Placeholder for text area field, if applicable
	placeholder?: string;
}

/**
 * Social media answer field. May have `socialMedia` attribute representing chosen social media.
 */
export interface SocialMediaFieldType extends BaseFieldType<"social"> {
	// Type of social media
	socialMediaName: string;
	socialMediaIcon: string;
}

export interface LocationFieldType extends BaseFieldType<"location"> {}

export interface PictureField extends BaseFieldType<"picture"> {}

export interface PhoneNumberFieldType extends BaseFieldType<"phone-number"> {
	// Optional default country code
	defaultCountryCode?: string;
	// Optional list of allowed country codes
	allowedCountryCodes?: string[];
	// Optional field placeholder
	placeholder?: string;
}

/**
 * Answer field type. May be `TextField`, `DateField`, `MultiChoiceField`, `TextAreaField`, or `SocialMediaField`.
 */
export type FieldType =
	| TextFieldType
	| DateFieldType
	| MultiChoiceFieldType
	| TextAreaFieldType
	| SocialMediaFieldType
	| LocationFieldType
	| PictureField
	| PhoneNumberFieldType;

/**
 * Question type. Requires (unique) `key`, `label`, and `fields` attributes. May have `description` and `required`
 * attributes.
 */
export type Question = {
	// Unique key for question
	key: string;
	// Question label
	label: string;
	// Question description, if applicable
	description?: string;
	// Dictates whether question (incl. all its fields) require an answer
	required?: boolean;
	// Question fields
	fields: FieldType[];
};

/**
 * Answer type
 */
export type AnswerType = string | string[] | Date | undefined;

/**
 * Answers
 */
export type Answers = {
	[questionKey: string]: {
		[fieldKey: string]: AnswerType;
	};
};

/**
 * Validation answer
 */
export type ValidationAnswer = {
	valid: boolean;
	errorMessage?: string;
};
