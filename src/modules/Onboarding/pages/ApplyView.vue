<script setup lang='ts'>
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import {onMounted, type Ref} from "vue";
    import {AccountStatus} from "~/src/utils/SupabaseTypes";
    import OnboardingQuestion from "~/src/modules/Onboarding/components/OnboardingQuestion.vue";

    const accountState = useAccountState();
    const router = useRouter();

    const step = ref(1);
    const total = ref(6);

    interface Question {
      question: string;
      type: string;
      key: keyof Answer;
    }

    interface Answer {
        handle: string,
        based_in: string,
        date_of_birth: string,
        additional_info: string,
        project_types: string,
        tiktok: string,
    }

    const questions: Question[] = [
        {
            question: 'first, what is your instagram handle?',
            type: 'text',
            key: 'handle',
        },
        {
            question: 'alright, thanks. now, where are you based?',
            type: 'text',
            key: 'based_in',
        },
        {
            question: 'great! when were you born?',
            type: 'date',
            key: 'date_of_birth',
        },
        {
            question: 'what project types do you mostly work on?',
            type: 'multi',
            key: 'project_types',
        },
        {
            question: 'have anything else you want to share with us?',
            type: 'textarea',
            key: 'additional_info',
        },
        {
            question: 'do you also have a tiktok account?',
            type: 'text',
            key: 'tiktok',
        }
    ]

    const answers = reactive<Answer>({
        handle: '',
        based_in: '',
        date_of_birth: '',
        additional_info: '',
        project_types: '',
        tiktok: '',
    })

    const next = () => step.value ++;
    const back = () => step.value --;

    async function finished() {
        if(!accountState.user) return;
        const creator = await $fetch('/API/creators/me', {
            method: 'put',
            body: JSON.stringify({
                ...answers,
                status: AccountStatus.IN_REVIEW
            })
        });

        accountState.user.status = AccountStatus.IN_REVIEW;
        await router.push('/')
    }

    onMounted(() => {
        if (accountState.user?.status == AccountStatus.ACCEPTED) {
            router.push('/')
        }
    });
</script>

<template>
    <section class="flex screen-size flex-col">
        <nav class="w-full flex px-12 py-6 items-center border-b border-[#E9E9E9] justify-between">
            <img alt="creatormate-logo" class="h-5" src="/logo-light.svg">
        </nav>
        <ProgressBar :step :total/>
        <div class="flex flex-grow justify-center px-6">
            <div class="w-[850px] max-w-full mt-20 ">

              <!-- could probably simplify this -->
              <!-- also, keep track of application state maybe, so if user goes back to previous question, his answer is saved -->
              <OnboardingQuestion v-model="answers.handle" v-if="step == 1" :question="questions[0]" :step :total
                                  @next="next" @back="back"></OnboardingQuestion>
              <OnboardingQuestion v-model="answers.based_in" v-if="step == 2" :question="questions[1]" :step :total
                                  @next="next" @back="back"></OnboardingQuestion>
              <OnboardingQuestion v-model="answers.date_of_birth" v-if="step == 3" :question="questions[2]" :step
                                  :total @next="next" @back="back"></OnboardingQuestion>
              <OnboardingQuestion v-model="answers.project_types" v-if="step == 4" :question="questions[3]" :step
                                  :total @next="next" @back="back"></OnboardingQuestion>
              <OnboardingQuestion v-model="answers.additional_info" v-if="step == 5" :question="questions[4]" :step
                                  :total @next="next" @back="back"></OnboardingQuestion>
              <OnboardingQuestion v-model="answers.tiktok" v-if="step == 6" :question="questions[5]" :step :total
                                  @next="next" @back="back"></OnboardingQuestion>
                <button
                    v-if="step == total"
                    @click="finished"
                    class="bg-black text-white px-24 py-3 rounded-lg mt-6"
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