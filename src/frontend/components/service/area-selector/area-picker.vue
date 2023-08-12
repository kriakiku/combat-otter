<template>
    <div ref="container" :class="$style.container">
        <!-- Preview -->
        <span
            v-if="props.step === ServiceAreaSteps.None"
            v-for="item in items"
            :class="['area-select']"
            :style="item.style"
        >
            {{ $t(`service.area-selector.${item.step}.area`) }}
        </span>

        <!-- Drag -->
        <Vue3DraggableResizable
            v-else-if="editable"
            :min-w="30"
            :min-h="20"
            :initW="editable.value.width"
            :initH="editable.value.height"
            v-model:x="editable.value.x"
            v-model:y="editable.value.y"
            v-model:w="editable.value.width"
            v-model:h="editable.value.height"
            v-model:active="active"
            parent
        >
            <span :class="[$style.area, 'area-select']">
                {{ $t(`service.area-selector.${editable.step}.area`) }}
            </span>
        </Vue3DraggableResizable>
    </div>
</template>

<script setup lang="ts">
import { useSetting } from '@frontend/stores/settings';
import { AreaPosition } from '@typed';
import { ServiceAreaSteps, SettingsKeys } from '@typed';
import { WritableComputedRef, watch, ref, nextTick, computed, StyleValue } from 'vue';
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import { watchDebounced, useResizeObserver } from '@vueuse/core'

const props = defineProps<{
    step: ServiceAreaSteps
}>()

const active = ref(false);
const container = ref(null);
const area = ref({
    width: 0,
    height: 0
});

useResizeObserver(container, (entries) => {
    const { width, height } = entries[0].contentRect;
    area.value = { width, height }
});

/**
 * Helpers
 */
function recalculate(value: AreaPosition, canvas: AreaPosition['canvas']): AreaPosition {
    return {
        x: value.x / value.canvas.width * canvas.width,
        y: value.y / value.canvas.height * canvas.height,
        width: value.width / value.canvas.width * canvas.width,
        height: value.height / value.canvas.height * canvas.height,
        canvas
    }
}

function useArea(step: ServiceAreaSteps, key: SettingsKeys) {
    const setting = useSetting(key) as WritableComputedRef<AreaPosition>;
    const value = ref<AreaPosition>(null);

    const style = computed<StyleValue>(() => {
        const { x, y, width, height } = recalculate(setting.value, area.value);

        return {
            position: 'absolute',
            top: `${y}px`,
            left: `${x}px`,
            width: `${width}px`,
            height: `${height}px`,
        }
    });

    watch(() => [area, setting], () => {
        value.value = recalculate(setting.value, area.value);
    }, { immediate: true, deep: true });

    watchDebounced(value, () => {
        if (props.step !== step) {
            return;
        }

        setting.value = {
            ...value.value,
            canvas: {
                ...area.value
            }
        }
    }, { debounce: 100, maxWait: 4000, deep: true })

    return {
        step,
        value,
        style
    }
}

const mode = useArea(ServiceAreaSteps.ModeArea, SettingsKeys.ServiceGridAreaMode);
const rank = useArea(ServiceAreaSteps.RankArea, SettingsKeys.ServiceGridAreaRank);
const sr = useArea(ServiceAreaSteps.SRArea, SettingsKeys.ServiceGridAreaSR);
const level = useArea(ServiceAreaSteps.LevelArea, SettingsKeys.ServiceGridAreaLevel);

const items = ref([
    mode,
    rank,
    sr,
    level
])

const editable = ref(null);

watch(() => props.step, () => {
    active.value = false;
    editable.value = items.value.find(item => item.step === props.step);
})
</script>

<style lang="scss" module>
.container {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.area {
    width: 100%;
    height: 100%;
    pointer-events: none;
}
</style>
