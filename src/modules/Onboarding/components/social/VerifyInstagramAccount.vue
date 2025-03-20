<script setup lang='ts'>
    import type {InstagramVerification} from "~/src/api/modules/onboarding/OnboardingTypes";
    import {Icon} from "@iconify/vue";
    import {useToastState} from "~/src/utils/Toast/ToastState";
    import {API} from "~/src/utils/API/API";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";

    const model = defineModel<string>();
    const toastState = useToastState();

    const emit = defineEmits(['confirmName', 'cancel']);
    const {verified} = defineProps<{
        verified: InstagramVerification
    }>();

    const checking = ref(false);
    const notComplete = ref(false);

    async function copy(code: string) {
        await navigator.clipboard.writeText(code);
        toastState.addToast('copied to clipboard', true)
    }

    async function verify() {
        checking.value = true;
        const igProfile: APIResponse<InstagramVerification> = await API.ask(`/onboarding/verification?handle=${verified.handle}`);
        checking.value = false;
        if (!igProfile.success) {
            toastState.addToast('something went wrong, try refreshing the page', false);
            return;
        }
        if (igProfile.data.verified) {
            emit('confirmName')
            return;
        }

        notComplete.value = true;
    }

</script>

<template>
    <!-- input field -->
    <div @click="copy(`verify:${verified.verification_code}`)"
         class="w-full pl-4 bg-gray-100 text-gray-700 px-5 py-5 rounded-md focus:outline-none mb-3 flex justify-between items-center cursor-pointer">
        <p>verify:{{ verified.verification_code }}</p>
        <Icon width="20" icon="material-symbols:content-copy-outline"/>
    </div>
    <p v-if="notComplete" class="text-red-600">account not verified yet, try sending the code again.</p>
    <div class="flex w-full justify-end mt-6">
        <div @click="emit('cancel')"
           class="bg-gray-400 cursor-pointer text-white px-5 py-2 rounded-lg disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150 mr-4"
        >
            change name
        </div>
        <a href="https://www.instagram.com/direct/t/17846872649832030/" target="_blank"
            class="bg-gray-400 text-white px-5 py-2 rounded-lg disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150 mr-4"
        >
            open instagram
        </a>
        <button v-if="!checking"
            class="bg-black text-white px-5 py-2 rounded-lg disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
            @click="verify"
        >
            confirm
        </button>
        <button v-else
                class="bg-black text-white px-5 py-2 rounded-lg disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150 flex items-center gap-2"
                @click="verify"
        >
             <Icon icon="line-md:loading-loop" /> checking
        </button>
    </div>
</template>