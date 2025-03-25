<script setup lang='ts'>

import MobileNavigationItem from "~/src/components/Navigation/MobileNavigationItem.vue";
</script>

<template>
    <MobileNavigationItem link-to="/" icon-name="material-symbols:home-outline" name="home"/>
    <MobileNavigationItem link-to="/jobs" icon-name="material-symbols:work-outline" name="my jobs"/>
    <MobileNavigationItem link-to="/settings" icon-name="material-symbols:settings-outline" name="settings"/>
</template>