<script setup lang='ts'>
    import {onMounted, ref} from "vue";
    import {Icon} from "@iconify/vue";
    import {useRouter} from "vue-router";
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    // import {ToastType} from "@/modules/common/Toast/ToastType";
    // import {useUserStore} from "@/utils/Auth/UserStore";
    const supabase = useSupabaseClient();

    const emit = defineEmits(['verify'])
    const email = ref("");
    const router = useRouter();
    const loading = ref(false);
    const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const validationError = ref(false);
    const register = ref(true);
    const accountState = useAccountState();

    async function withGoogle() {
        const {data, error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/callback`,
            }
        });
        //@todo handle redirect error
    }

    async function signIn() {
        if (loading.value) return;
        if (!emailRegex.test(email.value)) {
            validationError.value = true;
            return;
        }
        validationError.value = false;
        loading.value = true;
        const response = await supabase.auth.signInWithOtp({email: email.value});
        loading.value = false;
        if (response.error) {
            return;
        }

        emit('verify', email.value);
    }
</script>

<template>
    <h2 class="text-2xl mb-6 font-medium text-black">login to creatormate</h2>
    <button @click="withGoogle"
            class="bg-white flex items-center justify-center gap-2 w-full rounded-full py-3 text-black font-medium leading-6 hover:bg-opacity-80 transition duration-300 border">
        <Icon class=" leading-6 icon" width="24px" icon="ri:google-fill"></Icon>
        continue with google
    </button>
    <div class="flex items-center w-full">
        <div class="h-[1px] w-full mx-4 bg-gray-200"></div>
        <p class="py-4">or</p>
        <div class="h-[1px] w-full mx-4 bg-gray-200"></div>
    </div>
    <input @keydown.enter="signIn" v-model="email" placeholder="your@email.com"
           class="w-full py-3 px-4 text-center rounded-full bg-gray-200 placeholder-gray-500 text-black mb-2 outline-0 border focus:shadow-input"
           type="email">
    <button @click="signIn" v-if="!loading" class="px-3 py-3 rounded-full bg-gray-200 w-full mb-6 text-black">continue with email</button>
    <button v-else class="px-3 py-3 rounded-full bg-white  w-full mb-6 text-black">
        <Icon class="icon" width="23px" icon="line-md:loading-loop"></Icon>
    </button>
    <p v-if="validationError" class="mb-6 text-red-500">Please enter a valid email</p>
</template>