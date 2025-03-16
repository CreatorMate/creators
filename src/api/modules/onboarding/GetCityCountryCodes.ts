import { Endpoint } from "~/src/api/utils/Endpoint";
import type { Context } from "hono";
import { createAzure } from "@ai-sdk/azure";
import { generateObject, generateText, streamText, tool } from "ai";
import { errorResponse, successResponse } from "~/src/api/utils/HonoResponses";
import { z } from "zod";

export class GetCityCountryCodes extends Endpoint {
	protected readonly method: string = "get";
	protected readonly route: string = "/onboarding/countries";
	protected async handle(context: Context) {
		const search = context.req.query("search");

		if (!search) return errorResponse(context, "no search given");

		const key = process.env.AZURE_AI_KEY ?? "";
		const azure = createAzure({
			resourceName: "creatormate-ai",
			apiKey: key,
		});

		const model = azure("gpt-4o-mini");

		const { object } = await generateObject({
			model: model,
			schema: z.object({
				results: z.array(z.string()),
			}),
			prompt: `Return the city name, and country name in the format: <City>, <Country>. If the state code is not available, omit it. Examples: \'Terborg, GE, Netherlands\' and \'Florida, FL, USA\'. Now, if you find multiple results provide a list of all the answers with a max of 10. provide the result for ${search}.`,
		});

		return successResponse(context, object);
	}
}
