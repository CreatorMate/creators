import { useAccountState } from "~/src/utils/Auth/AccountState";
import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
import { AccountStatus } from "~/src/utils/SupabaseTypes";
import { loadOnboardingState } from "~/src/modules/Onboarding/utils/onboardingStorage";
import { formatAnswers } from "~/src/modules/Onboarding/utils/onboardingUtils";
import { validateQuestion } from "~/src/modules/Onboarding/utils/onboardingValidators";

export function useOnboardingInit(router: any) {
	const accountState = useAccountState();
	const onboardingStore = useOnboardingStore();
	const isLoading = ref(true);

	onMounted(async () => {
		// Redirect if creator is already accepted.
		if (accountState.user?.status === AccountStatus.ACCEPTED) {
			onboardingStore.reset();
			await router.push("/");
		}

		const storedAnswers = loadOnboardingState();
		if (!storedAnswers) {
			const retrievedAnswers = formatAnswers(
				accountState.user as Record<string, string | string[]>,
			);
			const keys = Object.keys(retrievedAnswers);
			if (keys.length > 0) {
				onboardingStore.answers = retrievedAnswers;
				// Set the step to the first invalid question.
				const lastInvalidQuestionKey = onboardingStore.questions.find(
					(question) => {
						const { valid } = validateQuestion(question, retrievedAnswers);
						return !valid;
					},
				)?.key;
				onboardingStore.currentStep = lastInvalidQuestionKey
					? onboardingStore.getQuestionStepByKey(lastInvalidQuestionKey)
					: onboardingStore.totalSteps;
			}
		} else {
			onboardingStore.hydrate();
		}
		onboardingStore.initializeWatcher();
		isLoading.value = false;
	});

	return { isLoading };
}
