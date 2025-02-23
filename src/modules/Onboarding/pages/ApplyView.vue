<script setup lang="ts">
import { useAccountState } from "~/src/utils/Auth/AccountState";
import { onMounted } from "vue";
import { AccountStatus } from "~/src/utils/SupabaseTypes";
import QuestionRenderer from "~/src/modules/Onboarding/components/questions/QuestionRenderer.vue";
import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
import ProgressBar from "~/src/components/Core/ProgressBar.vue";
import LoadingSpinner from "~/src/components/Core/LoadingSpinner.vue";

const accountState = useAccountState();
const onboardingStore = useOnboardingStore();
const router = useRouter();

const isLoading = ref(true);

async function finished() {
  if (!accountState.user) return;

  try {
    const creator = await $fetch("/API/creators/me", {
      method: "put",
      body: JSON.stringify({
        ...onboardingStore.answers,
        status: AccountStatus.IN_REVIEW,
      }),
    });

    accountState.user.status = AccountStatus.IN_REVIEW;
    await router.push("/");
  } catch (error) {
    if (error instanceof Error) {
      onboardingStore.errorMessage = error.message;
    } else {
      onboardingStore.errorMessage = "An unknown error occurred.";
    }
    console.error("Error updating creator:", error);
  }
}

onMounted(() => {
  if (accountState.user?.status == AccountStatus.ACCEPTED) {
    onboardingStore.reset();
    router.push("/");
  }

  // retrieve past answers from local storage
  onboardingStore.hydrate();

  // Set loading state to false
  isLoading.value = false;
});
</script>

<template>
  <section class="flex screen-size flex-col">
    <nav
      class="w-full flex px-12 py-6 items-center border-b border-[#E9E9E9] justify-between"
    >
      <img alt="creatormate-logo" class="h-5" src="/logo-light.svg" />total
    </nav>

    <div
      v-if="isLoading"
      class="flex items-center justify-center h-[calc(100vh-68px)]"
    >
      <LoadingSpinner color="#D9D9D9" :size="40" :large="true" />
    </div>
    <div v-else>
      <ProgressBar
        class="progress-bar"
        :step="onboardingStore.currentStep"
        :total="onboardingStore.totalSteps"
      />
      <div class="flex flex-grow justify-center px-6">
        <div class="w-[850px] max-w-full mt-20">
          <span v-if="onboardingStore.errorMessage !== ''" class="text-red-600">
            {{ onboardingStore.errorMessage }}
          </span>

          <QuestionRenderer
            :question="onboardingStore.currentQuestion"
            :step="onboardingStore.currentStep"
            :total="onboardingStore.totalSteps"
          />
          <button
            v-if="onboardingStore.isLastStep"
            :disabled="!onboardingStore.canProceed"
            @click="finished"
            class="bg-black text-white px-24 py-3 rounded-lg mt-6 disabled:bg-gray-400"
          >
            finish
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.progress-bar {
  transition: width 0.3s;
}
</style>
