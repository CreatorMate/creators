interface BaseQuestion<T extends String> {
  key: string;
  type: T;
  label: string;
  required?: boolean;
  description?: string;
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

/**
 * This construction automatically types answers based on its question definition
 * based on the question's id.
 */
// export type Answers<Q extends readonly Question[]> = {
//   [P in Q[number] as P["id"]]: AnswerType<P>;
// };

export type Answers = Record<string, unknown>;
