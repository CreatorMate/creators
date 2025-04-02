import { BaseController } from "~/src/api/utils/BaseController";
import type { Context } from "hono";
import { errorResponse, successResponse } from "~/src/api/utils/HonoResponses";
import { usePrisma } from "~/src/api/src/lib/prisma";

export class FieldOptionsController extends BaseController {
	async endpoints() {
		this.app.get(
			"/onboarding/field_options",
			async (context: Context): Promise<any> => {
				const fieldKey = context.req.query("key");

				if (!fieldKey) return errorResponse(context, "no field key provided");

				try {
					const results = await usePrisma().field_options.findMany({
						where: {
							field_key: fieldKey,
						},
					});

					// Format results into array of strings
					const options = results.length > 0 ? results[0].options : [];

					return successResponse(context, { options: options });
				} catch (error) {
					console.error("error fetching field options: ", error);
					return errorResponse(context, "failed to fetch field options");
				}
			},
		);
	}
}
