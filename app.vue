<script setup lang="ts">
	import "~/src/assets/css/tailwind.css";
	import ToastArea from "~/src/utils/Toast/ToastArea.vue";
	import { checkUnguarded } from "~/src/utils/AuthGuard/GuardChecker";
	import { appSettings } from "~/src/GlobalSettings";
	import { useAccountState } from "~/src/utils/Auth/AccountState";
	import { AccountStatus } from "~/src/utils/SupabaseTypes";
	import { protectedRoutes } from "~/src/utils/AuthGuard/ProtectedRoutes";
	const colorMode = useColorMode();
	const runtimeConfig = useRuntimeConfig();
	const accountStore = useAccountState();

	const route = useRoute();

	const ready = ref(false);

	//initial page load middleware, the actual middleware runs after page load, problem with that the user can see a flash of the wrong page.
	onBeforeMount(async () => {
        appSettings.baseUrl = runtimeConfig.public.BASE_URL;
        if (checkUnguarded(route.path)) {
            ready.value = true;
			return;
		}

		const accountStore = useAccountState();
		if (!accountStore.user) {
			await accountStore.initialize();
		}

		if (accountStore.user) {
			if (
				(accountStore.user?.status == AccountStatus.NEW ||
					accountStore.user?.status == AccountStatus.IN_REVIEW ||
					accountStore.user?.status == AccountStatus.IN_PROCESS) &&
				route.path !== "/submission/status" &&
				route.path !== "/apply"
			) {
				ready.value = true;
				return navigateTo("/submission/status");
			}
			if (
				protectedRoutes.has(route.path) &&
				!accountStore.rights.includes(protectedRoutes.get(route.path) as string)
			) {
				return navigateTo("/");
			}
		}
		ready.value = true;
	});
</script>

<template>
	<NuxtLayout v-if="ready">
		<NuxtPage />
	</NuxtLayout>
	<ToastArea></ToastArea>
</template>
