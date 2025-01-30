<script setup lang='ts'>
    import {useAccountStore} from "~/src/utils/Auth/AccountStore";
    import {onMounted} from "vue";
    import {AccountStatus} from "~/src/utils/SupabaseTypes";
    import SubmissionNotStarted from "~/src/modules/Onboarding/components/submission/SubmissionNotStarted.vue";
    import SubmissionSubmitted from "~/src/modules/Onboarding/components/submission/SubmissionSubmitted.vue";
    import SubmissionAccepted from "~/src/modules/Onboarding/components/submission/SubmissionAccepted.vue";
    import SubmissionInvited from "~/src/modules/Onboarding/components/submission/SubmissionInvited.vue";

    const accountState = useAccountStore();
    const {user} = useOidcAuth();

    const router = useRouter();

    const checked = ref(false);

    onMounted(() => {

    });

    async function apply() {
        await router.push('/apply');
    }

    const statusMap = new Map();
    statusMap.set(AccountStatus.NEW, 'Not started')
    statusMap.set(AccountStatus.IN_REVIEW, 'Submitted')
</script>

<template>
    <section class="flex screen-size flex-col">
        <nav class="w-full flex px-12 py-6 items-center border-b border-[#E9E9E9] justify-between">
            <img alt="creatormate-logo" class="h-5" src="/logo-light.svg">
        </nav>
        <div class="flex flex-grow justify-center px-6">
            <div class="w-[850px] max-w-full mt-20 ">
                <SubmissionNotStarted v-if="accountState.user?.status == AccountStatus.NEW" />
                <SubmissionSubmitted v-if="accountState.user?.status == AccountStatus.IN_REVIEW"/>
                <SubmissionAccepted v-if="accountState.user?.status == AccountStatus.ACCEPTED"/>
                <SubmissionInvited v-if="accountState.user?.status == AccountStatus.INVITED"/>
            </div>
        </div>
    </section>
</template>


<style scoped>
.progress-bar {
    transition: width 0.3s; /* You can adjust the duration as needed */
}
</style>