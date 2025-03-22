import { BaseController } from "~/src/api/utils/BaseController";
import type { Context } from "hono";
import { errorResponse, successResponse } from "~/src/api/utils/HonoResponses";
import { usePrisma } from "~/src/api/src/lib/prisma";
import { createAzure } from "@ai-sdk/azure";
import { generateObject } from "ai";
import { z } from "zod";

export class CityCountryCodesController extends BaseController {
	async endpoints() {
		this.app.get(
			"/onboarding/countries",
			async (context: Context): Promise<any> => {
				const search = context.req.query("search");

				if (!search) return errorResponse(context, "no search given");

				// pull from db
				const results = await usePrisma().cities.findMany({
					where: {
						city_name: { contains: search, mode: "insensitive" },
					},
					take: 10,
				});

				// if results are not empty, format return the data
				if (results && results.length > 0) {
					// format database results
					const formattedResults = results.map(
						(city) => `${city.city_name}, ${city.country_name}`,
					);

					return successResponse(context, { results: formattedResults });
				}

				// if no entries match in the database call AI
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
			},
		);

		this.app.post(
			"/onboarding/countries",
			async (context: Context): Promise<any> => {
				const body = await context.req.json();

				if (!body.input) {
					return errorResponse(context, "no input given");
				}

				// extract input and format it from "<city>, <country>"
				const { cityName, countryName, error } = this.parseCityCountryInput(
					body.input,
				);
				if (error) {
					return errorResponse(context, error);
				}

				// add city to database, if it doesn't exist already
				try {
					const existingCity = await usePrisma().cities.findFirst({
						where: {
							city_name: cityName,
							country_name: countryName,
						},
					});

					if (existingCity) {
						return errorResponse(context, "city already exists");
					}

					// insert city
					const newCity = await usePrisma().cities.create({
						data: {
							city_name: cityName!,
							country_name: countryName!,
						},
					});

					return successResponse(context, newCity);
				} catch (error) {
					return errorResponse(context, "failed to add city");
				}
			},
		);
	}

	/**
	 * Takes input of format "<city>, <country>" and parses it to `cityName` and `countryName`.
	 *
	 * @param input - a string of format "<city>, <country>"
	 * @returns An object containing either the parsed city and country names, or an error message if the input
	 * format is invalid.
	 *
	 * @example
	 * // Returns { cityName: "New York", countryName: "USA" }
	 * parseCityCountryInput("New York, USA");
	 */
	private parseCityCountryInput(input: string): {
		cityName?: string;
		countryName?: string;
		error?: string;
	} {
		const trimmedInput = input.trim();
		const parts = trimmedInput.split(", ");

		if (parts.length < 2) {
			return {
				error: "invalid input format. expected '<city>, <country>'",
			};
		}

		const cityName = parts[0].trim();
		const countryName = parts.slice(1).join(",").trim();

		if (!cityName || !countryName) {
			return {
				error: "invalid city or country name",
			};
		}

		return { cityName, countryName };
	}
}
