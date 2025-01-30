<script setup lang='ts'>
    import type {PhylloConnection} from "~/src/utils/Phyllo/PhylloConnection";
    import type {Ref} from "vue";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";
    import {useAccountStore} from "~/src/utils/Auth/AccountStore";
    import {appSettings} from "~/src/GlobalSettings";

    const connection: Ref<PhylloConnection|null> = ref(null);
    let connector: any = null;
    const success = ref(false);
    const accountState = useAccountStore();

    const {linked, removed} = defineProps<{
        linked: Function,
        removed: Function,
    }>()

    onMounted(async () => {
        if(!accountState.user) return;
        const response: APIResponse = await $fetch( `/API/phyllo?creatorId=${accountState.user.id}&creatorEmail=${accountState.user.email}`);

        if(!response.success) {
            console.error('could not initiate a connection with instagram through phyllo');
            return;
        }

        connection.value = response.data;
        if(!connection.value) return; //against null type issues in editor

        const config: PhylloConfig = {
            clientDisplayName: 'creator mate',
            environment: 'staging',
            userId: connection.value.user_id,
            token: connection.value.token,
            redirect: false,
            workPlatformId: '9bb8913b-ddd9-430b-a66a-d74d846e6c66',
            'redirect URL': `${appSettings.baseUrl}`,
        };

        const phylloConnect = PhylloConnect.initialize(config);

        phylloConnect.on("accountConnected", async (accountId: any, workplatformId: any, userId: any) => {  // gives the successfully connected account ID and work platform ID for the given user ID
            const result: APIResponse = await $fetch(`${appSettings.baseUrl}/API/creators/${userId}/accounts`, {
                method: 'POST',
                body: JSON.stringify({
                    accountId: accountId,
                    platformId: workplatformId
                })
            });

            if(!result.success) return;

            const updateStats: APIResponse = await $fetch(`/API/creators/me`, {
                method: 'PUT',
                body: JSON.stringify({
                    linked: true
                }),
            });
            if(!accountState.user) return;
            accountState.user.linked = true;
            success.value = true;
            linked();
        });
        phylloConnect.on("accountDisconnected", async (accountId: any, workplatformId: any, userId: any) => {  // gives the successfully disconnected account ID and work platform ID for the given user ID
            const result: APIResponse = await $fetch(`${appSettings.baseUrl}/API/creators/${userId}/accounts/${accountId}`, {
                method: 'DELETE'
            });
            removed();
            /* @todo
                2. Send request to backend to remove that account from the cache.
             */
        });
        phylloConnect.on("tokenExpired", (userId: any) => {});
        phylloConnect.on("exit", (reason: any, userId: any) => {});
        phylloConnect.on("connectionFailure", (reason: any, workplatformId: any, userId: any) => {});

        connector = phylloConnect;
    });

</script>

<template>
    <button @click="connector.open()"
            class="bg-black text-white px-14 py-3 rounded-lg disabled:bg-gray-400">
        <slot/>
    </button>
</template>