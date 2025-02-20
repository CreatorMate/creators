import type {Answer} from "~/src/modules/Onboarding/types/OnboardingAnswer";

export type Question = {
    question: string;
    type: 'text' | 'date' | 'multi' | 'textarea';
    key: keyof Answer;
    options?: string[];
}