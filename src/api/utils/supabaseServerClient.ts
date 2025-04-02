import {SupabaseClient} from "@supabase/supabase-js";

export default class SupabaseServer {
    private static supabaseServer = new Map<string, SupabaseClient>();
    public static assign(userId: string, supabaseClient: SupabaseClient) {
        this.supabaseServer.set(userId, supabaseClient);
    }

    public static getClient(userId: string): SupabaseClient|undefined {
        const client = this.supabaseServer.get(userId);
        if(client) {
            this.supabaseServer.delete(userId);
        }

        return client;
    }
}