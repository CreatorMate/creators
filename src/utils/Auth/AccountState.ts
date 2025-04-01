import {defineStore} from "pinia";
import type {Brand, User} from "~/src/utils/SupabaseTypes";
import type {APIResponse} from "~/src/api/utils/HonoResponses";
import {appSettings} from "~/src/GlobalSettings";
import {API} from "~/src/utils/API/API";

export const useAccountState = defineStore("account", () => {
    const user = ref<User | null>(null);
    const supabase = useSupabaseClient();
    const router = useRouter();
    const rights = ref<string[]>([]);
    const roles = ref<string[]>([]);

    async function initialize() {
        try {
            const result: APIResponse<User> = await API.ask(`/users/me`);
			if(!result.success) return;
            if (result.data) {
                user.value = result.data;

                roles.value = result.data.roles.map(
                    (userRole: any) => userRole.role.name,
                );
                rights.value = result.data.roles.flatMap((userRole: any) => {
                    return userRole.role.rights.map(
                        (roleRight: any) => roleRight.right.name,
                    );
                });

                rights.value = [...new Set(rights.value)];
            }
        } catch (error) {
        }
    }

    function updateUserAnswers(newAnswers: Partial<User>) {
        if (!user.value) return;
        user.value = {...user.value, ...newAnswers};
    }

    async function logout() {
        user.value = null;
        await supabase.auth.signOut();
        await router.push("/login");
    }

    async function save() {
        const result = await $fetch(`${appSettings.baseUrl}/API/creators/me`, {
            method: "PUT",
            body: JSON.stringify(user.value),
        });
    }

    return {initialize, updateUserAnswers, user, save, logout, rights};
});
