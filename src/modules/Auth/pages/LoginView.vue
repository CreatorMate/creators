<script lang="ts" setup>
    import {onMounted, ref} from "vue";
    import {useRouter} from "vue-router";
    import HomeCarousel from "~/src/modules/Auth/components/HomeCarousel.vue";
    import PopupModel from "~/src/modules/Auth/components/PopupModel.vue";
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import Login from "~/src/modules/Auth/components/Landing/Login.vue";
    import VerifyComponent from "~/src/modules/Auth/components/Landing/Verify.vue";
    import {API} from "~/src/utils/API/API";
    import {Icon} from "@iconify/vue";

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
    <main class="screen-size text-white flex flex-col lowercase">
        <section class="w-full h-full bg-white text-black flex md:justify-center items-center px-3">
            <div class="flex md:w-auto w-full flex-col gap-3">
                <div class="flex items-center gap-3">
                    <NuxtImg width="40" src="/logo-light.svg"/>
                </div>
                <p class="text-xl">welcome at creatormate</p>
                <h1>choose how you will use the platform.</h1>
                <div
                    class="w-full md:w-[780px] flex flex-col md:flex-row gap-6 md:gap-12 justify-between mt-5 overflow-x-hidden">
                    <NuxtLink to="https://tally.so/r/wL5rgG"
                              class="w-full md:w-1/2 card flex flex-col py-3 overflow-x-hidden relative">
                        <Icon name="material-symbols:north-east" class="absolute right-3 top-3"/>
                        <p class="px-6">i'm a brand</p>
                        <h2 class="text-2xl mt-4 mb-10 md:mb-32 px-6">looking for creators</h2>
                        <div class="flex flex-col gap-3">
                            <div class="flex sliding-left w-full">
                                <div class="flex items-center justify-between text-xs w-[200%] flex-shrink-0">
                                    <p class="label">i'm a creative source</p>
                                    <p class="label">i'm a manager</p>
                                    <p class="label">i'm a marketeer</p>
                                    <p class="label">i'm a freelancer</p>
                                    <p class="label">i'm an agency owner</p>
                                    <p class="label mr-3">i'm a manager</p>
                                </div>
                                <div class="flex items-center justify-between text-xs w-[200%] flex-shrink-0">
                                    <p class="label">i'm a creative source</p>
                                    <p class="label">i'm a manager</p>
                                    <p class="label">i'm a marketeer</p>
                                    <p class="label">i'm a freelancer</p>
                                    <p class="label">i'm an agency owner</p>
                                    <p class="label mr-3">i'm a manager</p>
                                </div>
                            </div>
                            <div class="flex sliding-right w-full">
                                <div class="flex items-center justify-between text-xs w-[200%] flex-shrink-0">
                                    <p class="label">i'm a head of marketing</p>
                                    <p class="label">i'm an agency owner</p>
                                    <p class="label">i'm looking for a film crew</p>
                                    <p class="label">i'm a freelancer</p>
                                    <p class="label">i'm a marketeer</p>
                                    <p class="label mr-3">i'm a fan</p>
                                </div>
                                <div class="flex items-center justify-between text-xs w-[200%] flex-shrink-0">
                                    <p class="label">i'm a head of marketing</p>
                                    <p class="label">i'm an agency owner</p>
                                    <p class="label">i'm looking for a film crew</p>
                                    <p class="label">i'm a freelancer</p>
                                    <p class="label">i'm a marketeer</p>
                                    <p class="label mr-3">i'm a fan</p>
                                </div>
                            </div>
                            <div class="hidden md:flex sliding-left w-full">
                                <div class="flex items-center justify-between text-xs w-[200%] flex-shrink-0">
                                    <p class="label">i'm a content manager</p>
                                    <p class="label">i'm a marketeer</p>
                                    <p class="label mr-3">i'm a fan</p>
                                    <p class="label mr-3">i'm a creative source</p>
                                    <p class="label">i'm a head of marketing</p>
                                    <p class="label mr-3">i'm a fan</p>
                                </div>
                                <div class="flex items-center justify-between text-xs w-[200%] flex-shrink-0 ">
                                    <p class="label">i'm a content manager</p>
                                    <p class="label">i'm a marketeer</p>
                                    <p class="label mr-3">i'm a fan</p>
                                    <p class="label mr-3">i'm a creative source</p>
                                    <p class="label">i'm a head of marketing</p>
                                    <p class="label mr-3">i'm a fan</p>
                                </div>
                            </div>
                        </div>
                    </NuxtLink>
                    <div @click="modelActive = true"
                        class="w-full md:w-1/2 card flex flex-col py-3 overflow-x-hidden relative cursor-pointer">
                        <Icon name="material-symbols:north-east" class="absolute right-3 top-3"/>
                        <p class="px-6">i'm a creator</p>
                        <h2 class="text-2xl mt-4 mb-10 md:mb-32 px-6">looking for work and hire</h2>
                        <div class="flex gap-3 flex-col">
                            <div class="flex sliding-left w-full">
                                <div class="flex items-center justify-between text-xs w-[200%] flex-shrink-0">
                                    <p class="label">i'm a photographer</p>
                                    <p class="label">i'm a videographer</p>
                                    <p class="label">i'm a content creator</p>
                                    <p class="label">i'm a cinematographer</p>
                                    <p class="label">i'm a filmmaker</p>
                                    <p class="label mr-3">i'm a musician</p>
                                </div>
                                <div class="flex items-center justify-between text-xs w-[200%] flex-shrink-0">
                                    <p class="label">i'm a photographer</p>
                                    <p class="label">i'm a videographer</p>
                                    <p class="label">i'm a content creator </p>
                                    <p class="label">i'm a cinematographer </p>
                                    <p class="label">i'm a filmmaker </p>
                                    <p class="label mr-3">i'm a musician</p>
                                </div>
                            </div>
                            <div class="flex sliding-right w-full">
                                <div class="flex items-center justify-between text-xs w-[200%] flex-shrink-0">
                                    <p class="ml-3 label">i'm a filmmaker</p>
                                    <p class="label">i'm a content creator</p>
                                    <p class="label">i'm an artist</p>
                                    <p class="label">i'm a cinematographer</p>
                                    <p class="label">i'm a cameraman</p>
                                    <p class="label">i'm an editor</p>

                                </div>
                                <div class="flex items-center justify-between text-xs w-[200%] flex-shrink-0">
                                    <p class="ml-3 label">i'm a filmmaker</p>
                                    <p class="label">i'm a content creator</p>
                                    <p class="label">i'm an artist</p>
                                    <p class="label">i'm a cinematographer</p>
                                    <p class="label">i'm a cameraman</p>
                                    <p class="label">i'm an editor</p>
                                </div>
                            </div>
                            <div class="hidden md:flex sliding-left w-full">
                                <div class="flex items-center justify-between text-xs w-[200%] flex-shrink-0">
                                    <p class="label">i'm a videographer</p>
                                    <p class="label">i'm a color grading editor</p>
                                    <p class="label">i'm an editor</p>
                                    <p class="label">i'm a cameraman</p>
                                    <p class="label">i'm a content creator</p>
                                    <p class="label mr-3">i'm a photographer</p>
                                </div>
                                <div class="flex items-center justify-between text-xs w-[200%] flex-shrink-0">
                                    <p class="label">i'm a videographer</p>
                                    <p class="label">i'm a color grading editor</p>
                                    <p class="label">i'm an editor</p>
                                    <p class="label">i'm a cameraman</p>
                                    <p class="label">i'm a content creator</p>
                                    <p class="label mr-3">i'm a photographer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <PopupModel :model-active="modelActive" @close="modelActive = false">-->
            <Login v-if="!verifying" @verify="verify"></Login>
            <VerifyComponent :email="email" v-else></VerifyComponent>
        </PopupModel>
    </main>
</template>

<style scoped>
.label {
    @apply py-3 bg-white px-2 rounded-lg first-of-type:rounded-l-none last-of-type:rounded-r-none;
}

.card {
    background: linear-gradient(0deg, #F9F9F9 0%, #F9F9F9 100%), #FFF;
}

.card:hover {
    background: linear-gradient(0deg, #ededed 0%, #ededed 100%), #FFF;
}

.sliding-left {
    animation: 30s slide-left infinite linear;
}

.sliding-right {
    animation: 30s slide-right infinite linear;
}


@keyframes slide-left {
    from {
        transform: translateX(0);
        -webkit-transform: translateX(0);
    }
    to {
        transform: translateX(-200%);
        -webkit-transform: translateX(-200%);
    }
}

@keyframes slide-right {
    from {
        transform: translateX(-200%);
        -webkit-transform: translateX(-200%);
    }
    to {
        transform: translateX(0);
        -webkit-transform: translateX(0);
    }
}
</style>

<!--<script lang="ts" setup>-->
<!--    import {onMounted, ref} from "vue";-->
<!--    import {useRouter} from "vue-router";-->
<!--    import HomeCarousel from "~/src/modules/Auth/components/HomeCarousel.vue";-->
<!--    import PopupModel from "~/src/modules/Auth/components/PopupModel.vue";-->
<!--    import {useAccountState} from "~/src/utils/Auth/AccountState";-->
<!--    import Login from "~/src/modules/Auth/components/Landing/Login.vue";-->
<!--    import VerifyComponent from "~/src/modules/Auth/components/Landing/Verify.vue";-->
<!--    import {API} from "~/src/utils/API/API";-->

<!--    const email = ref("");-->
<!--    const router = useRouter();-->
<!--    const modelActive = ref(false)-->
<!--    const verifying = ref(false);-->
<!--    const accountState = useAccountState();-->

<!--    useHead({-->
<!--        title: 'login - creatormate'-->
<!--    })-->
<!--    definePageMeta({-->
<!--        layout: 'empty'-->
<!--    });-->

<!--    function verify(value: string) {-->
<!--        email.value = value;-->
<!--        verifying.value = true;-->
<!--    }-->

<!--    function open() {-->
<!--        if(accountState.user) {-->
<!--            router.push('/');-->
<!--            return;-->
<!--        }-->
<!--        modelActive.value = true;-->
<!--    }-->
<!--</script>-->

<!--<template>-->
<!--    <main class="screen-size max-screen-size text-black lowercase">-->
<!--        <section class="w-full flex flex-grow justify-center h-full overflow-hidden">-->
<!--            <section style="" class="background-mask w-full h-full flex flex-col items-center justify-between z-40">-->
<!--                <div class="p-10">-->
<!--                    <img alt="creator mate logo" src="/logo-light.svg">-->
<!--                </div>-->
<!--                <div class="flex flex-col justify-center items-center gap-6 md:gap-10 w-full md:w-[850px]">-->
<!--                    <h1 class="text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl flex-wrap font-medium text-center px-5 md:px-0">-->
<!--                        creatormate <br/> closed beta</h1>-->
<!--                    <div class="gap-2 md:gap-6 flex">-->
<!--                        <button class="bg-white py-3 px-12 shadow rounded-full" @click="open()">-->
<!--                            {{accountState.user ? 'enter' : 'login'}}-->
<!--                        </button>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="p-8 flex gap-6">-->
<!--                    <a class="hover:text-opacity-60 hover:underline" href="mailto:hello@creatormate.com">email</a>-->
<!--                    <a class="hover:text-opacity-20 hover:underline" target="_blank"-->
<!--                       href="https://www.instagram.com/trycreatormate/">instagram</a>-->
<!--                </div>-->
<!--            </section>-->
<!--            <HomeCarousel></HomeCarousel>-->
<!--            <PopupModel :model-active="modelActive" @close="modelActive = false">-->
<!--                <Login v-if="!verifying" @verify="verify"></Login>-->
<!--                <VerifyComponent :email="email" v-else></VerifyComponent>-->
<!--            </PopupModel>-->
<!--        </section>-->
<!--    </main>-->
<!--</template>-->

<!--<style scoped>-->
<!--.background-mask {-->
<!--    background: radial-gradient(0% 0% at 100% 100%, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.6) 90%);-->
<!--}-->
<!--</style>-->