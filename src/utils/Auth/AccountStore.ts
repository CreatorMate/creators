import {defineStore} from "pinia";
import type {Brand, User} from "~/src/utils/SupabaseTypes";
import type {APIResponse} from "~/src/api/utils/HonoResponses";
import {appSettings} from "~/src/GlobalSettings";

export const useAccountStore = defineStore("account", () => {
        const user = ref<User | null>(null);
        const brand = ref<Brand | null>(null);

        async function initialize() {
            const result: APIResponse<User> = await $fetch(`${appSettings.baseUrl}/API/users/me`);
            if (!result.success) return;
            if (result.data) {
                user.value = result.data;
                const brandResult: APIResponse<Brand> = await $fetch(`${appSettings.baseUrl}/API/brands/${result.data.brand_id}`);
                if (!brandResult.success) return;
                brand.value = brandResult.data;
            }
        }

        async function save() {
            const result = await $fetch(`${appSettings.baseUrl}/API/users/me`, {
                method: "PUT",
                body: JSON.stringify(user.value)
            });
        }

        return {initialize, user, save, brand}
    }
)