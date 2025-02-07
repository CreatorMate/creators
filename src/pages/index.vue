<script setup lang='ts'>
    import {useAccountStore} from "~/src/utils/Auth/AccountStore";

    const router = useRouter();
    const invited = ref(true);
    const brands = ref<{ id: number, name: string, accepted: boolean }[]>([]);
    const accountState = useAccountStore();
    const isOn = ref(false);

    const {logout} = useOidcAuth();


    onBeforeMount(async () => {
        if (!accountState.user) return;
        const brandsRequest = await $fetch(`/API/creator/${accountState.user.id}/brands`);

        brands.value = [...brandsRequest.data];
    });

    async function check(checked: boolean, brandId: number) {
        console.log(checked)
        await $fetch(`/API/creator/${accountState.user?.id}/brand`, {
            method: 'PUT',
            body: JSON.stringify({
                accepted: checked,
                brand_id: brandId
            }),
        })
    }
</script>

<template>
    <section class="flex screen-size flex-col">
        <nav class="w-full flex px-12 py-6 items-center border-b border-[#E9E9E9] justify-between">
            <img alt="creatormate-logo" class="h-5" src="/logo-light.svg">
            <button class="bg-black text-white py-2 px-4 rounded" @click="logout()">logout</button>
        </nav>
        <div class="flex flex-grow justify-center px-6">
            <div class="w-[850px] max-w-full mt-20 flex flex-col">
                <h1 class="text-2xl font-medium">Work with brands</h1>
                <p class="text-[#8D8D8D] font-medium mt-2 w-[440px] max-w-full">When we or one of our brands want to work with you they will show up here. You can then accept to work with them and allow them to view the analytics of your account.</p>
                <div class="mt-2">
                    <a class="underline cursor-pointer">click here if you want to know why we need this</a>
                </div>
                <div class="flex flex-col mt-20">
                    <div class="flex items-center justify-between w-full" v-for="brand of brands">
                        <p class="text-lg">@{{ brand.name }}</p>
                        <ToggleButton @toggle="check($event, brand.id)" :is-on="brand.accepted"/>
                    </div>
                </div>
                <PhylloButton class="mt-auto mb-14">change instagram</PhylloButton>
            </div>
        </div>
    </section>
</template>