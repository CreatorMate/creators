<script setup lang='ts'>

    import MobileNavigation from "~/src/components/Navigation/MobileNavigation.vue";
    import MobileBaseNavigationItems from "~/src/components/Navigation/MobileBaseNavigationItems.vue";
    import {Icon} from "@iconify/vue";
    import Header from "~/src/components/Core/Header.vue";
    import SubTitle from "~/src/components/Core/SubTitle.vue";
    import Label from "~/src/components/Core/Label.vue";
    import {useAccountState} from "~/src/utils/Auth/AccountState";

    const accountState = useAccountState();
</script>

<template>
    <div class="flex xs:hidden w-full justify-center py-6">
        <NuxtImg src="/logo-light.svg"/>
    </div>
    <section class="border-t flex flex-col px-4 gap-3">
        <div class="flex-col flex pt-6 pb-3 gap-1">
            <Header text="settings"/>
            <SubTitle text="oversee all your settings"/>
        </div>
        <Label text="profile" class=""/>
        <ProfileCard :name="`${accountState.user?.first_name} ${accountState.user?.last_name}`" :role="accountState.user?.project_types" link="/profile" :image="accountState.user?.profile_picture"/>
        <div>
            <Label text="email" class="mb-3"/>
            <div class="flex w-full justify-between px-3 py-6">
                <p>{{accountState.user?.email}}</p>
                <Icon width="20" class="text-[#8D8D8D]" icon="material-symbols:edit-square-outline"></Icon>
            </div>
        </div>
        <div>
            <Label text="password" class="mb-3"/>
            <div class="flex w-full justify-between px-3 py-6 text-[#3C3C3C]">
                <p>********</p>
                <Icon width="20" class="text-[#8D8D8D]" icon="material-symbols:edit-square-outline"></Icon>
            </div>
        </div>
        <div>
            <Label text="phone number" class="mb-3"/>
            <div class="flex w-full justify-between px-3 py-6 text-[#3C3C3C]">
                <p>{{accountState.user?.phone_number}}</p>
                <Icon width="20" class="text-[#8D8D8D]" icon="material-symbols:edit-square-outline"></Icon>
            </div>
        </div>
        <div>
            <div class="flex mb-3 justify-between w-full">
                <div class="flex items-center gap-3">
                    <NuxtImg class="w-6 h-6" src="/icons/instagram.svg"/>
                    <Label text="instagram" class=""/>
                </div>
                <button class="rounded-full py-2 px-4 bg-[#F8E5E7]">disconnect</button>
            </div>
            <div class="flex w-full justify-between px-3 py-6 text-[#3C3C3C]">
                <p>@robin.mons</p>
            </div>
        </div>
    </section>
    <MobileNavigation>
        <MobileBaseNavigationItems/>
    </MobileNavigation>
</template>