<script setup lang='ts'>
    import type {Brand, User} from "~/src/utils/SupabaseTypes";
    import Label from "~/src/components/Core/Label.vue";
    import {Icon} from "@iconify/vue";
    import ContactItem from "~/src/modules/Profile/components/ContactItem.vue";

    const {user} = defineProps<{
        user: User
    }>();
</script>

<template>
    <div class="flex flex-col gap-1">
        <Label text="contact"/>
        <ContactItem icon="material-symbols:alternate-email" :text="user.email"/>
        <ContactItem icon="material-symbols:call-outline" :text="user.phone_number"/>
        <ContactItem v-if="user.website" icon="material-symbols:language" :text="user.website"/>
        <ContactItem icon="mdi:instagram" :text="user.handle"/>
    </div>
</template>