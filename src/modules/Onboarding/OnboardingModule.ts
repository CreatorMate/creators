import BaseModule from "../../utils/Modules/BaseModule";
import type { NuxtPage } from "@nuxt/schema";

export class OnboardingModule extends BaseModule {
  protected moduleRoutes: NuxtPage[] = [
    {
      name: "onboarding apply",
      file: "@/src/modules/Onboarding/pages/ApplyView.vue",
      path: "/apply",
    },
    {
      name: "submission stats",
      file: "@/src/modules/Onboarding/pages/SubmissionPage.vue",
      path: "/submission/status",
    },
  ];
}
