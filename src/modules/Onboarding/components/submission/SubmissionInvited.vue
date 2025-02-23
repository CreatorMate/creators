<script setup lang="ts">
import { useRouter } from "vue-router";
import PhylloButton from "~/src/components/Core/PhylloButton.vue";
const router = useRouter();
async function linked() {
  await router.push("/");
}
</script>

<template>
  <h1 class="text-2xl font-medium">Application: Invited</h1>
  <p class="text-[#8D8D8D] font-medium mt-2 w-[440px] max-w-full">
    Congratulations you have been invited by creatormate or one of our partners
    to work with us! only thing to do now is to link your Instagram data to the
    platform, after linking no one can access your data without your permission.
  </p>
  <div class="mt-2">
    <a class="underline cursor-pointer"
      >click here if you want to know why we need this</a
    >
  </div>
  <div class="my-10">
    <PhylloButton :linked>connect instagram</PhylloButton>
  </div>

  <p>join and work with our creators & brands</p>
</template>
