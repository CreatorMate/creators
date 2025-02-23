import type { Question } from "~/src/modules/Onboarding/types/OnboardingQuestion";

export const onboardingQuestions: Question[] = [
  {
    id: "1",
    label: "first, what is your instagram handle?",
    type: "text",
    required: true,
  },
  {
    id: "2",
    label: "alright, thanks. now, where are you based?",
    type: "text",
    required: true,
  },
  {
    id: "3",
    label: "great! when were you born?",
    type: "date",
    required: true,
  },
  {
    id: "4",
    label: "what project types do you mostly work on?",
    type: "multi-choice",
    options: ["option1", "option2", "option3"],
    required: true,
  },
  {
    id: "5",
    label: "have anything else you want to share with us?",
    type: "textarea",
  },
  {
    id: "6",
    label: "do you also have a tiktok account?",
    type: "text",
    required: true,
  },
  {
    id: "7",
    label: "select one",
    type: "multi-choice",
    options: ["option1", "option2", "option3"],
    multiple: false,
  },
];
