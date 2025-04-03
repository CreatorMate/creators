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
    import SupabaseImage from "~/src/components/Core/SupabaseImage.vue";

    const router = useRouter();
    const route = useRoute();
    const accountState = useAccountState();
    const isOn = ref(false);
    const user = ref<User|null>(null)
    const ableToEdit = ref(false);

    const active = ref('about');
    const user_handle = route.params.handle;
    const activeRoute = route.query.tab;
    function goBack() {
        router.back();
    }

    onMounted(async () => {
        if(activeRoute == 'about' || activeRoute == 'contact' || activeRoute == 'work') {
            active.value = activeRoute;
        }
        if(!user_handle) {
            user.value = accountState.user;
            ableToEdit.value = true;
            return;
        }

        const userRequest: APIResponse<User> = await API.ask(`/profiles/${user_handle}`);
        if(!userRequest.success) return;

        user.value = userRequest.data;
    });

    function switchTab(tab: string) {
        router.push({ path: route.path, query: {tab}});
        active.value = tab;
    }
</script>

<template>
    <div class="flex w-full justify-center py-6 relative">
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
            <SupabaseImage class="rounded-full h-16 w-16 object-fill"  bucket="user-pictures" :name="user.profile_picture"/>
        </div>
        <div class="flex w-full justify-between mt-3">
            <div class="flex items-center gap-1 text-[#3C3C3C]">
                <Icon icon="material-symbols:location-on-outline"/>
                <p class="text-size-XS">{{user.based_in}}</p>
            </div>
            <Icon icon="material-symbols:share-outline"/>
        </div>
        <div class="flex w-full justify-around mt-3 mb-6 gap-6">
            <p @click="switchTab('work')" class="border-[#D6D6D6] py-2 px-6 text-size-XS" :class="{'border-b': active === 'work'}">work</p>
            <p @click="switchTab('about')" class="border-[#D6D6D6] py-2 px-6 text-size-XS" :class="{'border-b': active === 'about'}">about</p>
            <p @click="switchTab('contact')" class="border-[#D6D6D6] py-2 px-6 text-size-XS" :class="{'border-b': active === 'contact'}">contact</p>
        </div>
        <div>
            <ContactBlock v-if="active === 'contact'" :editable="ableToEdit" :user/>
            <AboutBlock v-if="active === 'about'" :editable="ableToEdit" :user/>
            <WorkBlock v-if="active === 'work'" :editable="ableToEdit" :user/>
        </div>
    </section>
    <MobileNavigation>
        <MobileBaseNavigationItems/>
    </MobileNavigation>
</template>
