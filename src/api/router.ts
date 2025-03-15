import type {Endpoint} from "~/src/api/utils/Endpoint";
import type {BaseController} from "~/src/api/utils/BaseController";
import type {Hono} from "hono";
import {GetSelfEndpoint} from "~/src/api/modules/users/GetSelf/GetSelfEndpoint";
import {UpdateSelfEndpoint} from "~/src/api/modules/users/UpdateSelf/UpdateSelfEndpoint";
import {GetCitryCountryCodes} from "~/src/api/modules/onboarding/GetCitryCountryCodes";
import {JobPostController} from "~/src/api/modules/jobposts/JobPostController";


export function initializeHonoRouter(app: Hono) {
    const controllers: BaseController[] = [
        new JobPostController(app),
    ];

    const endpoints: Endpoint[] = [
        new GetSelfEndpoint(),
        new UpdateSelfEndpoint(),
        new GetCitryCountryCodes(),
    ];

	for (const controller of controllers) {
		controller.endpoints();
	}

	for (const endpoint of endpoints) {
		endpoint.register(app);
	}
}
