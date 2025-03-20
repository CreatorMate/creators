<script setup lang="ts">
    import type {
        SocialMediaFieldType,
        ValidationAnswer,
    } from "~/src/modules/Onboarding/types/onboardingTypes";
    import InsertInstagramName from "~/src/modules/Onboarding/components/social/InsertInstagramName.vue";
    import VerifyInstagramAccount from "~/src/modules/Onboarding/components/social/VerifyInstagramAccount.vue";
    import {API} from "~/src/utils/API/API";
    import type {InstagramVerification} from "~/src/api/modules/onboarding/OnboardingTypes";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";
    import {Icon} from "@iconify/vue";

    const props = defineProps<{
        field: SocialMediaFieldType;
        initialValue?: string;
    }>();

    const verified = ref<InstagramVerification | null>(null);

    const emit = defineEmits(["confirm", "close", 'delete']);

    const localValue = ref(props.initialValue ?? '');

    async function verifyNewName() {
        const igProfile: APIResponse<InstagramVerification> = await API.ask(`/onboarding/verification?handle=${localValue.value}`);
        if (!igProfile.success) return;
        verified.value = igProfile.data;
    }

    onMounted(async () => {
        if (props.initialValue) {
            const igProfile: APIResponse<InstagramVerification> = await API.ask(`/onboarding/verification`);
            if (!igProfile.success) return;
            verified.value = igProfile.data;
        }
    })

    async function deleteAccount() {
        const igProfile: APIResponse<InstagramVerification> = await API.ask(`/onboarding/verification?handle=${localValue.value}`, 'DELETE');
        if (!igProfile.success) return;
        verified.value = null;
        localValue.value = '';
        emit('delete');
    }
</script>

<template>

    <div
        class="bg-white p-6 rounded-lg shadow-xl w-[600px] relative"
    >
        <div class="w-full mb-4 flex justify-between">
            <h2 v-if="!verified" class="text-lg font-semibold ">link your instagram account</h2>
            <h2 v-if="verified && !verified.verified" class="text-lg font-semibold ">dm this code to @trycreatormate on
                instagram</h2>
            <h2 v-if="verified?.verified" class="text-lg font-semibold ">your linked instagram accounts</h2>
            <button
                class=" text-gray-500 hover:text-gray-700"
                @click="emit('close')"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10
              8.586l4.293-4.293a1 1 0 011.414
              1.414L11.414 10l4.293 4.293a1
              1 0 01-1.414 1.414L10 11.414l-4.293
              4.293a1 1 0 01-1.414-1.414L8.586
              10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                    />
                </svg>
            </button>
        </div>
        <InsertInstagramName v-if="!verified" @confirm-name="verifyNewName" v-model="localValue"/>
        <div v-else-if="verified.verified">
            <p v-if="verified?.verified" class="mb-4 text-[#3C3C3C]">manage your connected ig account</p>
            <div class="flex items-center w-fit gap-2 px-6 py-2 bg-[#F1F1F1]"><p>{{ verified.handle }}</p>
                <Icon @click="deleteAccount" class="cursor-pointer hover:text-black text-gray-800" icon="material-symbols:close-rounded" width="14"/>
            </div>
        </div>
        <VerifyInstagramAccount v-else @confirm-name="verifyNewName" v-model="localValue" :verified/>
    </div>
</template>
