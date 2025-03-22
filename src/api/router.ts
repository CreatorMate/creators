import type { Endpoint } from "~/src/api/utils/Endpoint";
import type { BaseController } from "~/src/api/utils/BaseController";
import type { Hono } from "hono";
import { GetSelfEndpoint } from "~/src/api/modules/users/GetSelf/GetSelfEndpoint";
import { UpdateSelfEndpoint } from "~/src/api/modules/users/UpdateSelf/UpdateSelfEndpoint";
import { JobPostController } from "~/src/api/modules/jobposts/JobPostController";
import { OnboardingVerificationController } from "~/src/api/modules/onboarding/OnboardingVerificationController";
import { CityCountryCodesController } from "~/src/api/modules/onboarding/CityCountryCodesController";

export function initializeHonoRouter(app: Hono) {
	const controllers: BaseController[] = [
		new JobPostController(app),
		new OnboardingVerificationController(app),
		new CityCountryCodesController(app),
	];

	const endpoints: Endpoint[] = [
		new GetSelfEndpoint(),
		new UpdateSelfEndpoint(),
	];

	for (const controller of controllers) {
		controller.endpoints();
	}

	for (const endpoint of endpoints) {
		endpoint.register(app);
	}
}
