<script setup lang="ts">
const props = defineProps<{
  step: number;
  total: number;
}>();

const { step, total } = toRefs(props);
</script>

<template>
  <section class="w-full h-[3px]">
    <div class="flex justify-center items-start gap-1 px-[10px] py-[3px]">
      <div v-for="index in total" :key="index">
        <div
          class="w-6 h-1 rounded-[2px]"
          :class="index <= step ? 'bg-black' : 'bg-gray-200'"
        ></div>
      </div>
    </div>
  </section>
</template>
