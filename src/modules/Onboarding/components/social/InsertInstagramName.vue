<script setup lang='ts'>
    import type {ValidationAnswer} from "~/src/modules/Onboarding/types/onboardingTypes";

    const model = defineModel<string>();

    const isTouched = ref(false);
    const error = ref("");

    const emit = defineEmits(['confirmName'])

    function handleInput(event: Event) {
        isTouched.value = true; // Mark as touched when the user types
        const { valid, errorMessage } = validate();
        error.value = !valid && errorMessage ? errorMessage : "";
    }

    function validate(): ValidationAnswer {
        if (!model || model.value === "") {
            return { valid: false, errorMessage: "username cannot be empty" };
        }
        if (model.value!.length > 100) {
            return {
                valid: false,
                errorMessage: "username cannot exceed 100 characters",
            };
        }
        return { valid: true };
    }

</script>

<template>
    <p class="mb-4 text-[#3C3C3C]">
        select which of your linked instagram account you'd like to submit with
        your application.
    </p>
    <!-- input field -->
    <div class="mb-3">
        <div class="relative">
            <input
                class="w-full pl-10 bg-gray-100 text-gray-700 px-5 py-5 rounded-md focus:outline-none"
                placeholder="username"
                v-model="model"
                @input="handleInput"
                @keydown.enter.prevent="emit('confirmName')"
            />
            <div
                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
                <img src="/icons/instagram_op.svg" alt="" class="w-5 h-5" />
            </div>
        </div>
        <p v-if="isTouched && error" class="text-red-500 text-sm mt-1">
            {{ error }}
        </p>
    </div>
    <div class="flex w-full justify-end mt-12">
        <button
            class="bg-black text-white px-5 py-2 rounded-lg disabled:bg-gray-400 hover:bg-[#242424] transition-all duration-150"
            :disabled="!validate().valid"
            @click="emit('confirmName')"
        >
            verify
        </button>
    </div>
</template>