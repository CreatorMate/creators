<script setup lang='ts'>
    import hotkeys from "hotkeys-js";

    defineProps({
        modelActive: {
            type: Boolean,
            default: false,
        },
        center: {
            type: Boolean,
            default: true
        }
    })
    const emit = defineEmits(["close"]);

    onMounted(() => {
        hotkeys('esc', function(event) {
            event.preventDefault();
            emit('close');
        });
    });

</script>

<template>
    <Teleport to="body">
        <Transition name="modal-outer">
            <div :class="{'items-center': center}" v-show="modelActive"
                 class="absolute top-0 screen-size flex justify-center  z-40 bg-black bg-opacity-20">
                <Transition name="modal-inner">
                    <div :class="{'mt-20': !center}" autofocus @keydown.esc="emit('close')" v-if="modelActive" @click.stop>
                        <slot  ></slot>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<style >
.popup {
    box-shadow: 0 3px 12px 0 rgb(0 0 0 / 0.15);
}
.modal-outer-enter-active, .modal-outer-leave-active {
    transition: opacity 0.2s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-outer-enter-from, .modal-outer-leave-to {
    opacity: 0;
}

.modal-inner-enter-active {
    transition: all 150ms cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.1s;
}

.modal-inner-leave-active {
    transition: all 0.2s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-inner-enter-from {
    opacity: 0;
    transform: scale(0.8);
}

.modal-inner-leave-to {
    transform: scale(0.8);
}
</style>