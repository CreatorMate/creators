import { useOnboardingStore } from "~/src/modules/Onboarding/stores/onboardingStore";
import { AccountStatus } from "~/src/utils/SupabaseTypes";
import { extractAnswers } from "~/src/modules/Onboarding/utils/onboardingUtils";
import { API } from "~/src/utils/API/API";
import { useAccountState } from "~/src/utils/Auth/AccountState";

export function useOnboardingActions(router: any) {
	const accountState = useAccountState();
	const onboardingStore = useOnboardingStore();
	const errorMessage = ref("");

	async function submitApplication(status: AccountStatus) {
		if (!accountState.user) {
			errorMessage.value =
				"error updating creator: account state is missing a user.";
			return;
		}
		const { answers } = onboardingStore;
		const extractedAnswers = extractAnswers(answers);
		try {
			const response = await API.ask("/users/me", "PUT", {
				...extractedAnswers,
				status: status,
			});
			if (response.success) {
				accountState.user.status = status;
				accountState.updateUserAnswers(extractedAnswers);
				onboardingStore.reset();
				await router.push("/");
			} else {
				errorMessage.value =
					response.message || "An error occurred while updating creator.";
			}
		} catch (error) {
			errorMessage.value =
				error instanceof Error ? error.message : "an unknown error occurred.";
			console.error("error updating creator:", error);
		}
	}

	function resetErrorMessage() {
		errorMessage.value = "";
	}

	function blurActiveElement() {
		void nextTick(() => {
			if (document.activeElement instanceof HTMLElement) {
				document.activeElement.blur();
			}
		});
	}

	function handleBack() {
		resetErrorMessage();
		onboardingStore.back();
		blurActiveElement();
	}

	function handleNext() {
		resetErrorMessage();
		onboardingStore.next();
		blurActiveElement();
	}

	async function handleSubmit() {
		resetErrorMessage();
		onboardingStore.validateAllQuestions();
		if (!onboardingStore.allQuestionsValid) {
			errorMessage.value = onboardingStore.error;
			return;
		}
		await submitApplication(AccountStatus.IN_REVIEW);
		blurActiveElement();
	}

	async function handleSaveAndExit() {
		resetErrorMessage();
		await submitApplication(AccountStatus.IN_PROCESS);
		blurActiveElement();
	}

	return {
		errorMessage,
		handleBack,
		handleNext,
		handleSubmit,
		handleSaveAndExit,
	};
}
