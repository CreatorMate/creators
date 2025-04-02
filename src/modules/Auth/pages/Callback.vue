<script setup lang='ts'>
    import {onMounted} from "vue";
    import {useRouter} from "#app";
    import {useAccountState} from "~/src/utils/Auth/AccountState";

    const user = useSupabaseUser();
    const supabase = useSupabaseClient();
    const accountState = useAccountState();
    const router = useRouter();

    useHead({
        title: 'logging you in... - creatormate'
    });

    onMounted(async () => {
        if(!user.value) {
            await router.push('/')
            return;
        }
        await accountState.initialize();
        if(!accountState.user) {
            await router.push('/login');
        }
        await router.push('/');
    });
</script>

<template>
    <section style="" class="background-mask w-full h-full flex justify-center z-40">
        <div class="p-10">
            <img alt="creator mate logo"  src="/creatormate.svg">
        </div>
    </section>
</template>