<script setup lang="ts">

    const clientId = useRuntimeConfig().public.META_CLIENT_ID;
    const redirectURL = useRuntimeConfig().public.META_REDIRECT_URL;
    async function connectIg() {
        location.href = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${clientId}&redirect_uri=${redirectURL}&response_type=code&scope=instagram_business_basic,instagram_business_manage_insights`
    }
</script>

<template>
  <button
      @click="connectIg"
    class="bg-black text-white px-14 py-3 rounded-lg disabled:bg-gray-400"
  >
    <slot />
  </button>
</template>
