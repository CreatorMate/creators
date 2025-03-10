/**
 * Base interface for answer fields. Requires (unique) `key`, `type`, and `label` attributes. May also have
 * `required` and `validate`
 * attributes.
 */
interface BaseField<T> {
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
export interface TextField extends BaseField<"text"> {
  // Max length of text answer, if applicable
  maxLength?: number;
  // Placeholder for text field, if applicable
  placeholder?: string;
  // Text field icon
  icon?: string;
}

/**
 * Date answer field. May have minimum and maximum possible input dates (`minDate`, resp. `maxDate).
 */
export interface DateField extends BaseField<"date"> {
  // Minimum accepted date
  minDate?: Date;
  // Maximum accepted date
  maxDate?: Date;
}

/**
 * Multiple choice answer field. Requires `options` attribute holding possible options that the user can select. May
 * also have a `maxChoices` attribute representing the maximum number of options user can select.
 */
export interface MultiChoiceField extends BaseField<"multi-choice"> {
  // Options user can choose
  options: string[];
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
export interface TextAreaField extends BaseField<"textarea"> {
  // Max length of text area answer, if applicable
  maxLength?: number;
  // Placeholder for text area field, if applicable
  placeholder?: string;
}

/**
 * Social media answer field. May have `socialMedia` attribute representing chosen social media.
 * TODO: finish this interface
 */
export interface SocialMediaField extends BaseField<"social"> {
  // Type of social media
  socialMediaName: string;
  socialMediaIcon: string;
}

/**
 * Answer field type. May be `TextField`, `DateField`, `MultiChoiceField`, `TextAreaField`, or `SocialMediaField`.
 */
export type Field =
  | TextField
  | DateField
  | MultiChoiceField
  | TextAreaField
  | SocialMediaField;

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
  fields: Field[];
};

/**
 * Field type
 */
export type FieldType = string | string[] | Date | undefined;

/**
 * Answer type
 */
export type Answers = {
  [questionKey: string]: {
    [fieldKey: string]: FieldType;
  };
};
