<script setup lang="ts">
import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";

const onboardingStore = useOnboardingStore();
</script>

<template>
  <h1 class="text-2xl font-medium">Application: Submitted</h1>
  <p class="text-[#8D8D8D] font-medium mt-2 w-[440px] max-w-full">
    Thanks for filling out the questions, you will get an email when we reviewed
    and accepted your profile
  </p>
  <div class="my-10">
    <NuxtLink
      to="/apply"
      @click="onboardingStore.reset()"
      class="bg-black text-white px-14 py-3 rounded-lg mb-6 disabled:bg-gray-400 my-10"
      >try again
    </NuxtLink>
  </div>

  <p>join and work with our creators & brands</p>
</template>
