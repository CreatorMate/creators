import {defineStore} from "pinia";
import type {Brand, User} from "~/src/utils/SupabaseTypes";
import type {APIResponse} from "~/src/api/utils/HonoResponses";
import {appSettings} from "~/src/GlobalSettings";
import {API} from "~/src/utils/API/API";

export const useAccountState = defineStore("account", () => {
        const user = ref<User | null>(null);
        const supabase = useSupabaseClient();
        const router = useRouter();

        async function initialize() {
            try {
                const result: APIResponse<User> = await API.ask(`/users/me`);
                if (!result.success) return;
                if (result.data) {
                    user.value = result.data;
                }
            } catch (error) {
            }
        }

        async function logout() {
            user.value = null;
            await supabase.auth.signOut();
            await router.push('/login');
        }

        async function save() {
            const result = await $fetch(`${appSettings.baseUrl}/API/creators/me`, {
                method: "PUT",
                body: JSON.stringify(user.value)
            });
        }

        return {initialize, user, save, logout}
    }
)