<script setup lang='ts'>
    import { useAccountState } from "~/src/utils/Auth/AccountState";
    import { onMounted } from "vue";
    import { AccountStatus } from "~/src/utils/SupabaseTypes";
    import QuestionRenderer from "~/src/modules/Onboarding/components/questions/QuestionRenderer.vue";
    import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
    import ProgressBar from "~/src/components/Core/ProgressBar.vue";

    const accountState = useAccountState()
    const router = useRouter()
    const onboardingStore = useOnboardingStore()

    async function finished() {
        if(!accountState.user) return;
        const creator = await $fetch('/API/creators/me', {
            method: 'put',
            body: JSON.stringify({
                ...onboardingStore.answers,
                status: AccountStatus.IN_REVIEW
            })
        });

        accountState.user.status = AccountStatus.IN_REVIEW;
        await router.push('/')
    }

    onMounted(() => {
        if (accountState.user?.status == AccountStatus.ACCEPTED) {
          onboardingStore.reset()
          router.push('/')
        }

      // retrieve past answers from local storage
      onboardingStore.hydrate()
    })
</script>

<template>
    <section class="flex screen-size flex-col">
        <nav class="w-full flex px-12 py-6 items-center border-b border-[#E9E9E9] justify-between">
            <img alt="creatormate-logo" class="h-5" src="/logo-light.svg">total
        </nav>
        <ProgressBar
            class="progress-bar"
            :step="onboardingStore.currentStep"
            :total="onboardingStore.totalSteps"
        />
        <div class="flex flex-grow justify-center px-6">
            <div class="w-[850px] max-w-full mt-20 ">

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
    </section>
</template>

<style scoped>
.progress-bar {
    transition: width 0.3s;
}
</style>
