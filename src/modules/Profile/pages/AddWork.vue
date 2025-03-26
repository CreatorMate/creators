<script setup lang='ts'>
    import {Icon} from "@iconify/vue";
    import Header from "~/src/components/Core/Header.vue";
    import Label from "~/src/components/Core/Label.vue";
    import MobileNavigation from "~/src/components/Navigation/MobileNavigation.vue";
    import {boolean} from "zod";
    import {API} from "~/src/utils/API/API";

    const router = useRouter();
    const title = ref('');
    const jobTitle = ref('');
    const image = ref('');
    const file = ref<File|null>(null);
    const linkTo = ref('');
    const imagePreview = ref("");
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();

    const fileInput = ref<HTMLInputElement | null>(null);

    async function save() {
        if(!file.value) return;
        const fileExt = image.value.split('.').pop();
        const fileName = `${user.value?.id}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('work-images')
            .upload(fileName, file.value, {
                cacheControl: '3600',
                upsert: false
            });

        //@todo show errors
        if (error) {
            throw error;
        }

        const workItem = await API.ask('/work', 'POST', {
            title: title.value,
            job_title: jobTitle.value,
            image: fileName,
            link_to: linkTo.value
        });

        if(!workItem.success) {
            return;
        }

        await router.push('/profile?tab=work');
    }

    function openFileUpload() {
        if (fileInput.value) {
            fileInput.value.click();
        }
    }

    function handleFileUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            const uploadedFile = target.files[0];

            // Store the file for later use (e.g., sending to server)
            file.value = uploadedFile;
            image.value  = uploadedFile.name;

            // Create a URL for the image preview
            imagePreview.value = URL.createObjectURL(uploadedFile);
        }
    }

    const isFormValid = computed(() => {
        return !!title.value && !!jobTitle.value && !!image.value;
    });


    function goBack() {
        router.back();
    }

    function reset() {
        file.value = null;
        imagePreview.value = '';
        image.value = '';

        if (fileInput.value) {
            fileInput.value.value = "";
        }
    }
</script>

<template>
    <div class="flex xs:hidden w-full justify-center py-6 relative">
        <Icon @click="goBack" icon="material-symbols:arrow-back-ios" class="absolute left-6 top-1/2 -translate-y-1/2">
            back
        </Icon>
        <NuxtImg src="/logo-light.svg"/>
    </div>
    <section class="border-t flex flex-col px-6 gap-3 py-6">
        <Header text="add work"/>
        <Label text="add title"/>
        <input v-model="title" placeholder="title" type="text" class="px-4 py-6 bg-[#F8F8F8] text-[#3C3C3C] placeholder-[#3C3C3C] w-full rounded-xl outline-none">
        <Label text="add role"/>
        <input v-model="jobTitle" placeholder="job title" type="text" class="px-4 py-6 bg-[#F8F8F8] text-[#3C3C3C] placeholder-[#3C3C3C] w-full rounded-xl outline-none">
        <Label text="media"/>
        <div class="w-full h-48 bg-[#F8F8F8] rounded-lg py-3 px-4">
            <div @click="openFileUpload" v-if="!image" class="w-full h-full justify-center items-center flex flex-col gap-2.5">
                <div class="w-11 h-11 flex items-center justify-center bg-white rounded-lg border text-[#3C3C3C]">
                    <Icon width="24" icon="material-symbols:image-outline"/>
                </div>
                <p class="underline text-size-M font-medium ">upload from your device</p>
            </div>
            <div v-else class="w-full h-full relative">
                <img
                    :src="imagePreview"
                    class="w-full h-full object-cover rounded-lg"
                    alt="Uploaded image preview"
                />
                <button
                    @click="reset"
                    class="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    title="Remove image"
                >
                    <Icon icon="material-symbols:close" width="20" />
                </button>
            </div>
        </div>
        <Label text="links"/>
        <div  class="px-4 py-3 bg-[#F8F8F8] text-[#3C3C3C] placeholder-[#3C3C3C] w-full rounded-xl flex items-center gap-2.5">
            <Icon width="20" icon="material-symbols:link"/>
            <input v-model="linkTo" placeholder="type here" type="text" class="w-full bg-[#F8F8F8] text-[#3C3C3C] placeholder-[#3C3C3C] outline-none">
        </div>
    </section>
    <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileUpload"
    />
    <MobileNavigation>
        <div class="w-full h-full flex p-1">
            <NuxtLink to="/profile?tab=work" class="h-full w-full rounded-full text-center flex items-center justify-center">back</NuxtLink>
            <button :disabled="!isFormValid" @click="save()" class="h-full w-full rounded-full bg-[#F1F1F1] disabled:bg-gray-100">add</button>
        </div>
    </MobileNavigation>
</template>