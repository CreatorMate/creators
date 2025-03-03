<script setup lang="ts">
import type { SocialMediaField } from "~/src/modules/Onboarding/types/onboardingTypes";
import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

const props = defineProps<{
  field: SocialMediaField;
}>();

const { field } = toRefs(props);

const onboardingStore = useOnboardingStore();

const questionKey = computed(() => onboardingStore.currentQuestion.key);
</script>

<template>
  <div class="flex w-[638px] flex-col items-start gap-6">
    <div class="flex flex-col items-start gap-[14px] self-stretch">
      <div class="flex w-[351.5px] items-center gap-3">
        <img
          :src="field.socialMediaIcon"
          alt=""
          class="w-6 h-6 flex-shrink-0 aspect-square"
        />
        <p
          class="text-black text-[16px] font-medium leading-[24px] tracking-[-0.32px]"
        >
          {{ field.socialMediaName }}
        </p>
      </div>
      <button class="flex items-center gap-3">connect</button>
    </div>
  </div>
</template>
