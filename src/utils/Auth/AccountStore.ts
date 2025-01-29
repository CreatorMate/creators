import {defineStore} from "pinia";
import type {Brand, Creator, User} from "~/src/utils/SupabaseTypes";
import type {APIResponse} from "~/src/api/utils/HonoResponses";
import {appSettings} from "~/src/GlobalSettings";

export const useAccountStore = defineStore("account", () => {
        const user = ref<Creator | null>(null);

        async function initialize() {
            try {
                const result: APIResponse<Creator> = await $fetch(`${appSettings.baseUrl}/API/creators/me`);
                if (!result.success) return;
                if (result.data) {
                    user.value = result.data;
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

        return {initialize, user, save}
    }
)