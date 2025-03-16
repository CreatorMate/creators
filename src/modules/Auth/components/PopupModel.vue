<script setup lang='ts'>
    import {toRefs} from "vue";
    import {Icon} from "@iconify/vue";

    const props = defineProps<{
        modelActive: boolean
    }>();

    const {modelActive} = toRefs(props);

    const emit = defineEmits(["close"]);
</script>

<template>
    <Transition name="modal-outer">
        <div @click="emit('close')" v-show="modelActive"
             class="absolute screen-size top-0 left-0 flex justify-center items-center z-40 bg-black bg-opacity-60 backdrop-blur-[8px]">
            <Transition name="modal-inner">
                <div @click.stop v-if="modelActive" class="p-10 bg-white w-[425px] flex flex-col items-center rounded-2xl">
                    <slot></slot>
                </div>
            </Transition>
        </div>
    </Transition>
    <div @click="emit('close')" v-if="modelActive" class="absolute w-9 h-9 top-6 right-6 z-50 flex justify-center items-center rounded-full bg-white bg-opacity-10 text-white text-opacity-60 hover:text-opacity-100 cursor-pointer hover:bg-opacity-20 transition duration-75">
        <Icon size="20px" icon="material-symbols:close"></Icon>
    </div>
</template>

<style scoped>
.modal-outer-enter-active, .modal-outer-leave-active {
    transition: opacity 0.2s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-outer-enter-from, .modal-outer-leave-to {
    opacity: 0;
}

.modal-inner-enter-active {
    transition: all 0.1s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.1s;
}

.modal-inner-leave-active {
    transition: all 0.1s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-inner-enter-from {
    opacity: 0;
    transform: scale(0.8);
}

.modal-inner-leave-to {
    transform: scale(0.8);
}
</style>