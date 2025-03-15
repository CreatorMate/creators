<script setup lang='ts'>

    import {ref, watchEffect} from "vue";
    import {useRouter} from "vue-router";
    import {Icon} from "@iconify/vue";
    import {useAccountState} from "~/src/utils/Auth/AccountState";

    const supabase = useSupabaseClient();
    let text = ref("");
    const loading = ref(false);
    const accountState = useAccountState();
    const form = ref();
    const router = useRouter();
    const verificationError = ref(false)
    const inputValues = ref(Array(7).fill(''));

    const {email} = defineProps<{
        email: string
    }>();

    const inputs = 6;

    async function reSend() {
        const response = await supabase.auth.signInWithOtp({email: email});
        if(response.error) {
            if(response.error.status === 429) {
                // toastStore.addToast("Email was just send please wait a little while", ToastType.ERROR);
            } else {
                // toastStore.addToast("something went wrong while trying to email you, come back again later", ToastType.ERROR);
            }

            return;
        }
        // toastStore.addToast(`Email send to ${email}`, ToastType.SUCCESS);
    }

    async function verify() {
        loading.value = true;
        const {error, data} = await supabase.auth.verifyOtp({email: email, token: text.value, type: 'email'});
        if(error) {
            verificationError.value = true;
            loading.value = false;
            return;
        }

        await accountState.initialize();
        loading.value = false;
        await router.push('/callback');
    }

    watchEffect(() => {
        if(text.value.length === 6) {
            verify();
        }
    })

    async function updateText() {
        text.value = "";
        const inputs = [...form.value.querySelectorAll('input[type=text]')]

        inputs.forEach((input) => {
            text.value += input.value;
        });

        if (text.value.length === 6) {
            await verify();
        }
    }

    function handlePaste(e: any) {
        e.preventDefault();
        const text = e.clipboardData.getData('text')
        const inputs = [...form.value.querySelectorAll('input[type=text]')]
        if (!new RegExp(`^[0-9]{${inputs.length}}$`).test(text)) {
            return
        }
        const digits = text.split('')
        inputs.forEach((input, index) => input.value = digits[index])
        updateText();
    }

    function handleInput(e: any) {
        const {target} = e
        const inputs = [...form.value.querySelectorAll('input[type=text]')]
        const index = inputs.indexOf(target)
        if (target.value) {
            if (index < inputs.length - 1) {
                inputs[index + 1].focus()
            }
        }
    }

    function handleKeyDown (e: any) {
        if (
            !/^[0-9]{1}$/.test(e.key)
            && e.key !== 'Backspace'
            && e.key !== 'Delete'
            && e.key !== 'Tab'
            && !e.metaKey
        ) {
        }
        const inputs = [...form.value.querySelectorAll('input[type=text]')]
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const index = inputs.indexOf(e.target);
            if (index > 0) {
                inputs[index].value = '';
                inputs[index - 1].focus();
            }
        }
    }
</script>

<template>
    <h2 class="text-2xl mb-6 font-medium">verify email</h2>
    <p class="text-black text-opacity-40">enter the code sent to your email address</p>
    <form ref="form" @submit.prevent="verify" class="h-full my-4">
        <div class="grid grid-cols-6 gap-2">
            <input v-for="index in inputs" :key="index"
                   @change="updateText"
                   v-model="inputValues[index]"
                   :disabled="loading"
                   @input="handleInput"
                   @paste="handlePaste"
                   @keydown="handleKeyDown"
                   placeholder=""
                   type="text"
                   :class="[
                       inputValues[index] != '' ? 'border border-black border-opacity-20' : ''
                   ]"
                   class="p-4 h-[56px] verifyBox text-center text-black bg-gray-400 bg-opacity-10 rounded-lg outline-0 focus:border-black focus:border focus:shadow-input"
                   pattern="\d*" maxlength="1"/>
        </div>
    </form>
    <Icon v-if="loading" width="24px" class="mb-6 icon" icon="line-md:loading-loop"></Icon>
    <p v-if="verificationError" class="text-red-500 mb-6">You're code is either incorrect or expired</p>
    <p class="text-black text-opacity-40">didn't receive the code? <span @click="reSend" class="font-medium text-black cursor-pointer hover:underline">resend</span></p>
</template>
