import {defineStore} from "pinia";
import type {Brand, Creator, InstagramAccount, User} from "~/src/utils/SupabaseTypes";
import type {APIResponse} from "~/src/api/utils/HonoResponses";
import {appSettings} from "~/src/GlobalSettings";
import {API} from "~/src/utils/API/API";

export const useAccountState = defineStore("account", () => {
        const creator = ref<Creator | null>(null);
        const user = ref<User | null>(null);
        const instagramAccount = ref<InstagramAccount | null>(null);
        async function initialize() {
            try {
                const result: APIResponse<User> = await API.ask(`/creators/me`);
                if (!result.success) return;
                if (result.data) {
                    user.value = result.data;
                    creator.value = result.data.creators
                    instagramAccount.value = result.data.creators.instagram_accounts;
                }
            } catch (error) {
            }

        }

        async function save() {
            const result = await $fetch(`${appSettings.baseUrl}/API/creators/me`, {
                method: "PUT",
                body: JSON.stringify(user.value)
            });
        }

        return {initialize, user, save, creator, instagramAccount}
    }
)