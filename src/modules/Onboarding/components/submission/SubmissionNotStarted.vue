<script setup lang="ts">
import { useAccountState } from "~/src/utils/Auth/AccountState";
import { onMounted } from "vue";
import { AccountStatus } from "~/src/utils/SupabaseTypes";

const accountState = useAccountState();
const { user } = useOidcAuth();

const router = useRouter();

const checked = ref(false);

onMounted(() => {});

async function apply() {
  await router.push("/apply");
}

const statusMap = new Map();
</script>

<template>
  <h1 class="text-2xl font-medium">Application: Not started</h1>
  <p class="text-[#8D8D8D] font-medium mt-2 w-[440px] max-w-full">
    Welcome to creatormate, before we can start working with you we would like
    to review your account, to be able do this properly we would like you to
    answer some questions
  </p>
  <div class="flex gap-2 items-center my-6 text-[#5E5E5E]">
    <input v-model="checked" type="checkbox" class="accent-black" />
    <p class="">
      by checking the box you agree to our
      <span class="underline"
        >terms <br />
        and conditions</span
      >
      and <span class="underline">privacy policy</span>
    </p>
  </div>
  <button
    @click="apply"
    :disabled="!checked"
    class="bg-black text-white px-14 py-3 rounded-lg mb-6 disabled:bg-gray-400"
  >
    apply
  </button>
  <p>join and work with our creators & brands</p>
</template>

<style scoped>
.progress-bar {
  transition: width 0.3s; /* You can adjust the duration as needed */
}
</style>
