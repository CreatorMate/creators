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
				maxLength: 255,
				required: true,
				placeholder: "name",
			},
			{
				key: "last_name",
				type: "text",
				maxLength: 255,
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
				type: "text",
				label: "phone number",
				numeric: true,
				required: true, 
				maxLength: 18,
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
				options: [
					"director",
					"filmmaker",
					"gaffer",
					"lighting technician",
					"drone operator",
					"editor",
					"colorist",
					"motion graphics artist",
					"vfx artist",
					"production designer",
					"scriptwriter / screenwriter",
					"set designer",
					"behind-the-scenes (bts) photographer",
					"behind-the-scenes (bts) videographer",
				],
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
				options: [
					"commercial video campaigns",
					"branded content",
					"fashion films",
					"music videos",
					"short films",
					"feature films",
					"product films / ads",
					"documentary",
					"social media video content",
					"event coverage / video",
					"green screen / vfx projects",
					"food & beverage cinematic ads",
					"behind-the-scenes (bts) documentation",
					"luxury & lifestyle videos",
					"studio shoots",
					"interviews & talking head videos",
					"cinematic storytelling",
					"action / sports cinematography",
					"automotive cinematography",
					"drone cinematography",
					"live performance filming",
					"360° / vr content",
					"slow-motion / high-speed cinematography",
				],
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
			// {
			// 	key: "instagram_handle",
			// 	label: "username",
			// 	type: "text",
			// 	required: true,
			// 	maxLength: 255,
			// 	placeholder: "@username",
			// 	icon: "/icons/instagram_op.svg",
			// },
			{
				key: "handle",
				type: "social",
				socialMediaName: "instagram",
				socialMediaIcon: "/icons/instagram.svg",
				required: true,
			},
			// {
			// 	key: "vimeo_handle",
			// 	type: "social",
			// 	socialMediaName: "vimeo",
			// 	socialMediaIcon: "/icons/vimeo.svg",
			// 	required: false,
			// },
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
				maxLength: 500,
			},
		],
	},
];
