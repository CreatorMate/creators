import type { Question } from "~/src/modules/Onboarding/types/onboardingTypes";

export const onboardingQuestions: Question[] = [
	{
		key: "name_question",
		label: "what is your name?",
		required: true,
		fields: [
			{
				key: "first_name",
				type: "text",
				label: "first name",
				maxLength: 40,
				required: true,
				placeholder: "name",
			},
			{
				key: "last_name",
				type: "text",
				maxLength: 40,
				label: "last name",
				required: true,
				placeholder: "name",
			},
		],
	},
	{
		key: "personal_info_question",
		label: "tell us more about you",
		required: true,
		fields: [
			{
				key: "date_of_birth",
				type: "date",
				label: "date of birth",
				required: true,
				minDate: new Date(1905, 0, 1),
				maxDate: new Date(
					new Date().getFullYear() - 13,
					new Date().getMonth(),
					new Date().getDate(),
				),
			},
			{
				key: "phone_number",
				type: "phone-number",
				label: "phone number",
				defaultCountryCode: "+31",
				required: true,
			},
			{
				key: "profile_picture",
				type: "picture",
				label: "picture",
			},
		],
	},
	{
		key: "based_in_question",
		label: "where are you based?",
		required: true,
		fields: [
			{
				key: "based_in",
				type: "location",
				label: "location",
				required: true,
			},
		],
	},
	{
		key: "work_types_question",
		label: "what do you do?",
		description:
			"(choose up to three roles that best describe your work in video production)\nsearch for your role or select" +
			" from the list below:",
		required: true,
		fields: [
			{
				key: "work_types",
				type: "multi-choice",
				search: true,
				minChoices: 1,
				maxChoices: 3,
				required: true,
			},
		],
	},
	{
		key: "project_types_question",
		label: "what types of projects do you usually work on?",
		description:
			"(choose at least one option)\nsearch for a project type or select from the list below:",
		required: true,
		fields: [
			{
				key: "project_types",
				type: "multi-choice",
				search: true,
				minChoices: 1,
				required: true,
			},
		],
	},
	{
		key: "socials_question",
		label: "where can we see your work?",
		fields: [
			{
				key: "handle",
				type: "social",
				socialMediaName: "instagram",
				socialMediaIcon: "/icons/instagram.svg",
				required: true,
			},
			{
				key: "website",
				type: "text",
				label: "website",
				placeholder: "link to website",
				required: false,
				maxLength: 255,
			},
		],
	},
	{
		key: "additional_info_question",
		label: "is there anything else we should know?",
		fields: [
			{
				key: "additional_info",
				label: "additional information",
				type: "textarea",
				placeholder: "recent client you have worked with.",
				required: false,
				maxLength: 255,
			},
		],
	},
];
