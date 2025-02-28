import type { Question } from "~/src/modules/Onboarding/types/OnboardingQuestion";

export const onboardingQuestions: Question[] = [
  {
    key: "handle",
    label: "first, what is your instagram handle?",
    type: "text",
    required: true,
  },
  {
    key: "based_in",
    label: "alright, thanks. now, where are you based?",
    type: "text",
    required: true,
  },
  {
    key: "date_of_birth",
    label: "great! when were you born?",
    type: "date",
    required: true,
  },
  {
    key: "project_types",
    label: "what project types do you mostly work on?",
    type: "multi-choice",
    options: ["option1", "option2", "option3"],
    required: true,
  },
  {
    key: "additional_info",
    label: "have anything else you want to share with us?",
    type: "textarea",
  },
  {
    key: "tiktok",
    label: "do you also have a tiktok account?",
    type: "text",
    required: false,
  },
];
