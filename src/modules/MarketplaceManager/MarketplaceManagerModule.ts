import BaseModule from "~/src/utils/Modules/BaseModule";
import type { NuxtPage } from "@nuxt/schema";

export class MarketplaceManagerModule extends BaseModule {
	protected moduleRoutes: NuxtPage[] = [
		{
			name: "jobs",
			file: "@/src/modules/MarketplaceManager/pages/JobPostsView.vue",
			path: "/jobs",
		},
	];
}
