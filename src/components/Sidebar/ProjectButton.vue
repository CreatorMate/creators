<script setup lang='ts'>
    import {Icon} from "@iconify/vue";
    import type {Project} from "~/src/utils/SupabaseTypes"
    import {API} from "~/src/utils/API/API";
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";
    import AddProjectModal from "~/src/modules/projects/components/AddProjectModal.vue";
    import ProjectSidebarButton from "~/src/modules/projects/components/Sidebar/ProjectSidebarButton.vue";
    import draggable from "vuedraggable";

    const route = useRoute();
    const show = ref(false);

    function isActive(path: string) {
        return route.fullPath === path;
    }

    const loading = ref(true);
    const open = ref(false);

    const projects = ref<Project[]>([]);
    const accountState = useAccountState();

    onMounted(async () => {
        await getProjects();
    });

    async function getProjects() {
        projects.value = [];
        loading.value = true;
        const projectsRequest: APIResponse<Project[]> = await API.ask(`/projects/${accountState.brand?.id}`);
        if (!projectsRequest.success) return;

        projects.value = projectsRequest.data;
        loading.value = false;
        open.value = false;
    }

    async function closeModal() {
        open.value = false
    }


</script>

<template>
    <div class="flex w-full justify-between items-center mt-8 pr-6 mb-3 cursor-pointer">
        <div class="flex items-center gap-3 transition duration-100 pl-3">
            <Icon width="20" icon="material-symbols:chevron-left" class="rotate-90"/>
            <p class="text-sm">projects</p>
        </div>
        <Icon @click="open = true" @click.stop class="cursor-pointer" icon="material-symbols:add"/>
    </div>
    <div v-if="loading" class="w-full flex justify-center">
        <Icon width="16" icon="line-md:loading-loop"></Icon>
    </div>
    <div v-else-if="!loading && projects.length === 0">
        <p @click="open = true" class="text-sm underline pl-4 mt-2 cursor-pointer">No projects yet, add one</p>
    </div>
        <div v-else class="flex flex-col gap-2 max-h-[150px] overflow-auto relative">
        <draggable
            v-model="projects"
            item-key="id"
            tag="div"
            ghost-class="dragging"
            :force-fallback="true"
        >
            <template #item="{ element }">
                <div class="cursor-grab active:cursor-grabbing">
                    <ProjectSidebarButton :project="element" @update="getProjects" />
                </div>
            </template>
        </draggable>
    </div>
    <modal-popup @close="closeModal" :model-active="open">
        <AddProjectModal @update="getProjects()" @close="closeModal"/>
    </modal-popup>
</template>