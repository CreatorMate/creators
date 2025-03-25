<script setup lang="ts">
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import {API} from "~/src/utils/API/API";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";
    import ToggleButton from "~/src/components/Core/ToggleButton.vue";
    import {useSupabaseUser} from "#imports";
    import {Icon} from "@iconify/vue";
    import {onMounted} from "vue";
    import MobileNavigation from "~/src/components/Navigation/MobileNavigation.vue";
    import MobileBaseNavigationItems from "~/src/components/Navigation/MobileBaseNavigationItems.vue";
    import Header from "~/src/components/Core/Header.vue";
    import SubTitle from "~/src/components/Core/SubTitle.vue";
    import ContactBlock from "~/src/modules/Profile/components/ContactBlock.vue";
    import AboutBlock from "~/src/modules/Profile/components/AboutBlock.vue";
    import WorkBlock from "~/src/modules/Profile/components/WorkBlock.vue";
    import type {User} from "~/src/utils/SupabaseTypes";

    const router = useRouter();
    const accountState = useAccountState();
    const isOn = ref(false);
    const route = useRoute();
    const user = ref<User|null>(null)

    const active = ref('about');
    const user_id = route.params.id;
    function goBack() {
        router.back();
    }

    onMounted(async () => {
        if(!user_id) {
            user.value = accountState.user;
            return;
        }
        const userRequest: APIResponse<User> = await API.ask(`/profiles/${user_id}`);
        if(!userRequest.success) return;

        user.value = userRequest.data;
    });
</script>

<template>
    <div class="flex xs:hidden w-full justify-center py-6 relative">
        <Icon @click="goBack" icon="material-symbols:arrow-back-ios" class="absolute left-6 top-1/2 -translate-y-1/2">
            back
        </Icon>
        <NuxtImg src="/logo-light.svg"/>
    </div>
    <section v-if="user" class="border-t flex flex-col px-6 gap-3 py-6">
        <div class="pt-6 flex w-full justify-between items-center">
            <div>
                <Header :text="`${user.first_name} ${user.last_name}`"/>
                <p class="text-size-S text-[#3C3C3C]">{{user.project_types.join(',')}}</p>
            </div>
            <NuxtImg class="rounded-full h-16 w-16 object-fill" :src="`https://accounts.creatormate.com/storage/v1/object/public/user_pictures/${user.profile_picture}`"/>
        </div>
        <div class="flex w-full justify-between mt-3">
            <div class="flex items-center gap-1 text-[#3C3C3C]">
                <Icon icon="material-symbols:location-on-outline"/>
                <p class="text-size-XS">{{user.based_in}}</p>
            </div>
            <Icon icon="material-symbols:share-outline"/>
        </div>
        <div class="flex w-full justify-around mt-3 mb-6 gap-6">
            <p @click="active = 'work'" class="border-[#D6D6D6] py-2 px-6 text-size-XS" :class="{'border-b': active === 'work'}">work</p>
            <p @click="active = 'about'" class="border-[#D6D6D6] py-2 px-6 text-size-XS" :class="{'border-b': active === 'about'}">about</p>
            <p @click="active = 'contact'" class="border-[#D6D6D6] py-2 px-6 text-size-XS" :class="{'border-b': active === 'contact'}">contact</p>
        </div>
        <div>
            <ContactBlock v-if="active === 'contact'" :user/>
            <AboutBlock v-if="active === 'about'" :user/>
            <WorkBlock v-if="active === 'work'" :user/>
        </div>
    </section>
    <MobileNavigation>
        <MobileBaseNavigationItems/>
    </MobileNavigation>
</template>
