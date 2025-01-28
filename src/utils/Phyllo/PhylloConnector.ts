//@ts-ignore
import {defineStore} from "pinia";
import {type Ref, ref} from "vue";
import {useAccountStore} from "~/src/utils/Auth/AccountStore";


class PhylloConnection {
}

export const usePhylloConnection = defineStore("phyllo", () => {
    const connection: Ref<PhylloConnection> = ref({
        id: '',
        user_id: '',
        token: '',
        expires_on: new Date()
    });

    async function get() {
        const accountStore = useAccountStore();
        connection.value = await $fetch( `/API/phyllo/${accountStore.user}`);
    }

    return {connection, get}
})