<script setup lang="ts">
import { useAccountState } from "~/src/utils/Auth/AccountState";
import { onMounted } from "vue";
import { AccountStatus } from "~/src/utils/SupabaseTypes";
import QuestionRenderer from "~/src/modules/Onboarding/components/questions/QuestionRenderer.vue";
import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
import ProgressBar from "~/src/components/Core/ProgressBar.vue";
import LoadingSpinner from "~/src/components/Core/LoadingSpinner.vue";
import ProgressIndicator from "~/src/components/Core/ProgressIndicator.vue";

const accountState = useAccountState();
const onboardingStore = useOnboardingStore();
const router = useRouter();

const { logout } = useOidcAuth();

const isLoading = ref(true);

// async function finished() {
//   if (!accountState.user) return;
//
//   try {
//     const creator = await $fetch("/API/creators/me", {
//       method: "put",
//       body: JSON.stringify({
//         ...onboardingStore.answers,
//         status: AccountStatus.IN_REVIEW,
//       }),
//     });
//
//     accountState.user.status = AccountStatus.IN_REVIEW;
//     await router.push("/");
//   } catch (error) {
//     if (error instanceof Error) {
//       onboardingStore.errorMessage = error.message;
//     } else {
//       onboardingStore.errorMessage = "An unknown error occurred.";
//     }
//     console.error("Error updating creator:", error);
//   }
// }

onMounted(() => {
  // if (accountState.user?.status == AccountStatus.ACCEPTED) {
  //   onboardingStore.reset();
  //   router.push("/");
  // }

  // retrieve past answers from local storage
  onboardingStore.hydrate();

  // Set loading state to false
  isLoading.value = false;
});
</script>

<template>
  <section class="flex screen-size flex-col">
    <!-- navbar -->
    <nav
      class="relative w-full flex items-center text-center px-12 py-6 justify-center"
    >
      <!-- go back button -->
      <button
        class="absolute left-[15%]"
        :disabled="!onboardingStore.canGoBack"
        @click="onboardingStore.back"
      >
        back
      </button>

      <!-- wrapper for logo and progress indicator -->
      <div class="flex flex-col items-center">
        <!-- creatormate logo -->
        <img
          alt="creatormate-logo"
          class="h-[15.134px] w-[128px]"
          src="/creatormate.svg"
        />

        <!-- progress indicator -->
        <ProgressIndicator
          :step="onboardingStore.currentStep"
          :total="onboardingStore.totalSteps"
          class="mt-2.5"
        />
      </div>

      <!-- logout button -->
      <button
        class="absolute right-[15%] px-5 py-2 bg-gray-100 rounded-lg"
        @click="logout()"
      >
        logout
      </button>
    </nav>

    <div
      v-if="isLoading"
      class="flex items-center justify-center h-[calc(100vh-68px)]"
    >
      <LoadingSpinner color="#D9D9D9" :size="40" :large="true" />
    </div>

    <div v-else>
      <div class="relative flex flex-grow justify-center px-6">
        <div class="w-[636px] max-w-full mt-20 gap-5">
          <span v-if="onboardingStore.errorMessage !== ''" class="text-red-600">
            {{ onboardingStore.errorMessage }}
          </span>

          <QuestionRenderer :question="onboardingStore.currentQuestion" />

          <!-- Buttons -->
          <!--          <button-->
          <!--            v-if="onboardingStore.isLastStep"-->
          <!--            :disabled="!onboardingStore.canProceed"-->
          <!--            @click="finished"-->
          <!--            class="bg-black text-white px-24 py-3 rounded-lg mt-6 disabled:bg-gray-400"-->
          <!--          >-->
          <!--            finish-->
          <!--          </button>-->
        </div>
      </div>
    </div>

    <!-- next button -->
    <button
      class="absolute bottom-4 right-[15%] bg-black text-white px-5 py-2 rounded-lg mt-6 disabled:bg-gray-400"
      v-if="!onboardingStore.isLastStep"
      @click="onboardingStore.next"
      :disabled="!onboardingStore.canProceed"
    >
      next
    </button>
  </section>
</template>
