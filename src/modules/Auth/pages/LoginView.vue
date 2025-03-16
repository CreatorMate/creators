<script lang="ts" setup>
    import {onMounted, ref} from "vue";
    import {useRouter} from "vue-router";
    import HomeCarousel from "~/src/modules/Auth/components/HomeCarousel.vue";
    import PopupModel from "~/src/modules/Auth/components/PopupModel.vue";
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import Login from "~/src/modules/Auth/components/Landing/Login.vue";
    import VerifyComponent from "~/src/modules/Auth/components/Landing/Verify.vue";
    import {API} from "~/src/utils/API/API";

    const email = ref("");
    const router = useRouter();
    const modelActive = ref(false)
    const verifying = ref(false);
    const accountState = useAccountState();

    useHead({
        title: 'login - creatormate'
    })
    definePageMeta({
        layout: 'empty'
    });

    function verify(value: string) {
        email.value = value;
        verifying.value = true;
    }

    function open() {
        if(accountState.user) {
            router.push('/');
            return;
        }
        modelActive.value = true;
    }
</script>

<template>
    <main class="screen-size max-screen-size text-black lowercase">
        <section class="w-full flex flex-grow justify-center h-full overflow-hidden">
            <section style="" class="background-mask w-full h-full flex flex-col items-center justify-between z-40">
                <div class="p-10">
                    <img alt="creator mate logo" src="/logo-light.svg">
                </div>
                <div class="flex flex-col justify-center items-center gap-6 md:gap-10 w-full md:w-[850px]">
                    <h1 class="text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl flex-wrap font-medium text-center px-5 md:px-0">
                        creatormate <br/> closed beta</h1>
                    <div class="gap-2 md:gap-6 flex">
                        <button class="bg-white py-3 px-12 shadow rounded-full" @click="open()">
                            {{accountState.user ? 'enter' : 'login'}}
                        </button>
                    </div>
                </div>
                <div class="p-8 flex gap-6">
                    <a class="hover:text-opacity-60 hover:underline" href="mailto:hello@creatormate.com">email</a>
                    <a class="hover:text-opacity-20 hover:underline" target="_blank"
                       href="https://www.instagram.com/trycreatormate/">instagram</a>
                </div>
            </section>
            <HomeCarousel></HomeCarousel>
            <PopupModel :model-active="modelActive" @close="modelActive = false">
                <Login v-if="!verifying" @verify="verify"></Login>
                <VerifyComponent :email="email" v-else></VerifyComponent>
            </PopupModel>
        </section>
    </main>
</template>

<style scoped>
.background-mask {
    background: radial-gradient(0% 0% at 100% 100%, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.6) 90%);
}
</style>