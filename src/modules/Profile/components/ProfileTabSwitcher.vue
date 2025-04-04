<script setup lang="ts">
    import { ref, reactive, watch, onMounted, nextTick, onBeforeUpdate } from 'vue';

    // Define the possible tab identifiers
    type TabId = 'work' | 'about' | 'contact';

    const model = defineModel();

    const router = useRouter();
    const route = useRoute();
    const activeRoute = route.query.tab;
    const active = ref<TabId>('about');
    const tabsContainerRef = ref<HTMLElement | null>(null);
    const tabRefs = ref<HTMLElement[]>([]);

    // Define the tabs
    const tabs = [
        { id: 'work', label: 'work' },
        { id: 'about', label: 'about' },
        { id: 'contact', label: 'contact' },
    ];

    const indicatorStyle = reactive({
        left: '0px',
        width: '0px',
    });

    onMounted(async () => {
        if (activeRoute == 'about' || activeRoute == 'contact' || activeRoute == 'work') {
            active.value = activeRoute;
        }

        updateIndicator();
    });

    watch(model, () => {
        updateIndicator();
    });

    const updateIndicator = () => {
        const activeIndex = tabs.findIndex(tab => tab.id === active.value);
        const activeTabElement = tabRefs.value[activeIndex];
        if (activeTabElement) {

            const left = activeTabElement.offsetLeft;
            const width = activeTabElement.offsetWidth;

            indicatorStyle.left = `${left}px`;
            indicatorStyle.width = `${width}px`;
        }
    };

    const switchTab = (tabId: string) => {
        active.value = <TabId>tabId;
        model.value = tabId
        router.push({path: route.path, query: {tabId}});
        updateIndicator();
    };
</script>

<template>
    <!-- Container needs relative positioning for the absolute indicator -->
    <div ref="tabsContainerRef" class="relative border-b border-[#D6D6D6]">
        <div class="flex w-full justify-around">
            <!-- Use v-for for cleaner tab generation -->
            <button
                v-for="(tab, index) in tabs"
                :key="tab.id"
                :ref="el => { if (el) tabRefs[index] = el as HTMLElement }"
                @click="switchTab(tab.id)"
                class="tab-item border-none bg-none py-2 px-4 text-size-XS w-full text-center cursor-pointer focus:outline-none"
            >
                {{ tab.label }}
            </button>
        </div>


        <div
            class="indicator absolute bottom-[-1px] h-[1px] bg-black transition-all duration-200 ease-in-out"
            :style="indicatorStyle"
        ></div>
    </div>
</template>