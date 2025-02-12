<script setup lang='ts'>
    const props = defineProps<{
        total: number,
        step: number
    }>();

    const {step, total} = toRefs(props);
    const model = defineModel();

    const value = ref('');

    watch(value, () => {
        model.value = value.value;
    });

    const emits = defineEmits(['back', 'next']);
</script>

<template>
    <input v-model="value" class="w-full border rounded-lg py-3 px-3 mt-2 outline-gray-300" type="date">
    <button v-if="step > 1" @click="emits('back')" class="bg-black text-white px-24 py-3 rounded-lg mt-6 mr-2">back</button>
    <button :disabled="value.length === 0" v-if="step != total" @click="emits('next')"
            class="bg-black text-white px-24 py-3 rounded-lg mt-6 disabled:bg-gray-400">next
    </button>
</template>