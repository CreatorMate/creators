interface BaseQuestion<T extends String> {
  id: string;
  type: T;
  label: string;
  required?: boolean;
  description?: string;
  validate?: (answer: unknown) => boolean | string;
}

export interface TextQuestion extends BaseQuestion<"text"> {
  placeholder?: string;
  maxLength?: number;
}

export interface TextAreaQuestion extends BaseQuestion<"textarea"> {
  rows?: number;
}

export interface DateQuestion extends BaseQuestion<"date"> {
  format?: string;
  minDate?: Date;
  maxDate?: Date;
}

export interface MultiChoiceQuestion extends BaseQuestion<"multi-choice"> {
  options: string | string[];
  multiple?: boolean; // multiple choices available
}

export type Question =
  | TextQuestion
  | TextAreaQuestion
  | DateQuestion
  | MultiChoiceQuestion;

type AnswerType<T extends Question> = T extends TextQuestion
  ? string
  : T extends TextAreaQuestion
    ? string
    : T extends DateQuestion
      ? Date
      : T extends MultiChoiceQuestion
        ? string | string[]
        : never;

export type Answers = Record<string, unknown>;
