<script setup lang='ts'>
    const props = defineProps<{
        total: number,
        step: number
    }>();

    const {step, total} = toRefs(props);
    const emits = defineEmits(['back', 'next']);
    const model = defineModel();

    const value = ref('');
    const selected = ref<string[]>([]);

    const options = ["option1", "option2", "option3", "option4"];

    function next() {
        let local = '';
        for(const option of selected.value) {
            local += `${option}, `
        }
        model.value = local
        emits('next');
    }

    function remove(item: string) {
        selected.value = selected.value.filter((option) => option != item);
    }
</script>

<template>
    <p class="font-medium mt-2">selected options:</p>
    <div class="flex flex-wrap gap-2">
        <p class="px-3 py-1 bg-gray-400 text-white rounded-full" @click="remove(option)" v-for="option of selected">{{option}}</p>
    </div>
    <div class="mt-6">
        <p class="font-medium mt-2">options:</p>
        <div class="flex flex-wrap gap-2">
            <div @click="selected.push(option)" v-for="option of options">
                <p class="px-3 py-1 bg-gray-400 text-white rounded-full" v-if="!selected.includes(option)">{{option}}</p>
            </div>
        </div>
    </div>
    <button v-if="step > 1" @click="emits('back')" class="bg-black text-white px-24 py-3 rounded-lg mt-6 mr-2">back</button>
    <button :disabled="selected.length === 0" v-if="step != total" @click="next"
            class="bg-black text-white px-24 py-3 rounded-lg mt-6 disabled:bg-gray-400">next
    </button>
</template>