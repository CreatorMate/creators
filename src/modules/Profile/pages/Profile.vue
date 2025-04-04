<script setup lang="ts">
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import {API} from "~/src/utils/API/API";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";
    import {Icon} from "@iconify/vue";
    import {onMounted} from "vue";
    import MobileNavigation from "~/src/components/Navigation/MobileNavigation.vue";
    import MobileBaseNavigationItems from "~/src/components/Navigation/MobileBaseNavigationItems.vue";
    import ContactBlock from "~/src/modules/Profile/components/ContactBlock.vue";
    import AboutBlock from "~/src/modules/Profile/components/AboutBlock.vue";
    import WorkBlock from "~/src/modules/Profile/components/WorkBlock.vue";
    import type {User} from "~/src/utils/SupabaseTypes";
    import SupabaseImage from "~/src/components/Core/SupabaseImage.vue";
    import Label from "~/src/components/Core/Label.vue";
    import ProfileTabSwitcher from "~/src/modules/Profile/components/ProfileTabSwitcher.vue";

    const router = useRouter();
    const route = useRoute();
    const accountState = useAccountState();
    const isOn = ref(false);
    const user = ref<User | null>(null)
    const ableToEdit = ref(false);

    const active = ref('about');
    const user_handle = route.params.handle;
    const activeRoute = route.query.tab;
    const isPrivate = ref(false);

    function goBack() {
        router.back();
    }

    onMounted(async () => {
        if (activeRoute == 'about' || activeRoute == 'contact' || activeRoute == 'work') {
            active.value = activeRoute;
        }
        if (!user_handle) {
            user.value = accountState.user;
            ableToEdit.value = true;
            return;
        }

        const userRequest: APIResponse<User> = await API.ask(`/profiles/${user_handle}`);
        if (!userRequest.success) return;

        isPrivate.value = !userRequest.data.visibility;

        user.value = userRequest.data;
    });
</script>

<template>
    <div class="flex w-full justify-center py-6 relative">
        <Icon @click="goBack" icon="material-symbols:arrow-back-ios" class="absolute left-6 top-1/2 -translate-y-1/2">
            back
        </Icon>
        <NuxtImg src="/logo-light.svg"/>
    </div>
    <section v-if="user" class="border-t flex flex-col px-6 gap-3 py-6">
        <div class="pt-6 flex w-full items-center gap-3">
            <SupabaseImage class="rounded-full h-16 w-16 object-fill" bucket="user-pictures"
                           :name="user.profile_picture"/>
            <div>
                <Label class="font-semibold" :text="`${user.first_name} ${user.last_name}`"/>
                <p class="text-size-S text-[#3C3C3C]">{{ user.project_types.join(', ') }}</p>
            </div>
        </div>

        <div class="flex items-center gap-1 text-[#3C3C3C]">
            <Icon height="16" icon="material-symbols:location-on-outline"/>
            <p class="text-size-XS text-[#3C3C3C]">{{ user.based_in }}</p>
        </div>
        <div class="flex gap-2">
            <button v-if="ableToEdit" class="bg-black text-white rounded-full py-3 px-6 text-size-S">edit profile</button>
            <button class="flex items-center gap-3 px-6 py-3 border rounded-full text-size-S"> <Icon icon="material-symbols:share-outline"/> share profile</button>
        </div>
        <ProfileTabSwitcher v-model="active"/>
        <div v-if="isPrivate">
            this account is private
        </div>
        <div v-else>
            <ContactBlock v-if="active === 'contact'" :editable="ableToEdit" :user/>
            <AboutBlock v-if="active === 'about'" :editable="ableToEdit" :user/>
            <WorkBlock v-if="active === 'work'" :editable="ableToEdit" :user/>
        </div>
    </section>
    <MobileNavigation>
        <MobileBaseNavigationItems/>
    </MobileNavigation>
</template>
