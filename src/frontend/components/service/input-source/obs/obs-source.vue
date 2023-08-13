<template>
    <!-- OBS Source -->
    <menu-item>
        <template #icon>
            <v-icon name="bi-window-desktop" scale="1.4" />
        </template>

        <template #title>
            {{ $t(`service.input-source.sources.${Services.obs}.source.title`) }}
        </template>

        <template #description>
            {{ $t(`service.input-source.sources.${Services.obs}.source.description`) }}
            <div>
                <badge :color="status?.status === 'ok' ? 'success' : 'warning'">{{ $t(`badge.presets.${status?.status === 'ok' ? 'ok' : 'attention'}`) }}</badge>{{
                    $t(`service.input-source.sources.${Services.obs}.source.statuses.${status?.status || 'unknown'}`, {...status})
                }}
            </div>
        </template>

        <template #action>
            <user-button
                :label="$t(`service.input-source.sources.${Services.obs}.source.actions.reconfigure`)"
                @click="visible = true"
                outlined
                size="small"
            />
        </template>
    </menu-item>

    <!-- Form -->
    <dialog-window
        v-model:visible="visible"
        modal
        :draggable="false"
        :header="$t(`service.input-source.sources.${Services.obs}.source.title`)"
        :style="{ width: 'min(40rem, 80vw)' }"
    >
        <template v-if="list && list.length === 0">
            <badge color="warning">{{ $t(`badge.presets.warning`) }}</badge>{{
                $t(`service.input-source.sources.${Services.obs}.source.emptyScenes`)
            }}
        </template>
        <template v-else>
            <badge>{{ $t(`badge.presets.tip`) }}</badge>{{
                $t(`service.input-source.sources.${Services.obs}.source.disclaimer`)
            }}
        </template>

        <menu-list v-if="list" v-for="scene of list" :key="scene.sceneIndex">
            <template #title>
                {{ scene.sceneName }}
            </template>

            <template v-if="scene.items.length === 0">
                {{ $t(`service.input-source.sources.${Services.obs}.source.emptySources`) }}
            </template>

            <menu-item
                v-else
                v-for="item of scene.items"
                :key="item.sourceName"
            >
                <template #link>
                    <a
                        @click="
                            source = item.sourceName;
                            visible = false;
                        "
                    />
                </template>

                <template #icon>
                    <v-icon v-if="item.sceneItemEnabled" name="hi-eye" scale="1.4" />
                    <v-icon v-else name="hi-eye-off" scale="1.4" />
                </template>

                <template #title>
                    {{ item.sourceName }}
                </template>

                <template #description>
                    <badge color="blank">{{ item.inputKind.replace('_', ' ') }}</badge>
                </template>

                <template #action>
                    <v-icon v-if="props.source === item.sourceName" name="bi-check-lg" scale="1.4" />
                </template>
            </menu-item>
        </menu-list>
    </dialog-window>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { Services, OBSSourceScene, OBSCurrentSource } from '@typed'
import { useFetch, useIntervalFn } from "@vueuse/core";

/**
 * Step
 */
const visible = ref(false);


/**
 * Current status
 */
const { execute: executeStatus, data: statusRaw } = useFetch<string>('backend:///service/obs/current-source', { immediate: true });
useIntervalFn(executeStatus, 3500, { immediate: true });
const status = computed(() => {
    if (!statusRaw.value) {
        return null;
    }

    return  JSON.parse(statusRaw.value) as OBSCurrentSource;
})

/**
 * Source list
 */
const { execute: executeList, data: listRaw } = useFetch<string>('backend:///service/obs/source-list', { immediate: false });
const { pause: pauseList, resume: resumeList } = useIntervalFn(executeList, 1000, { immediate: false });
const list = computed(() => {
    if (!listRaw.value) {
        return null;
    }

    return  JSON.parse(listRaw.value) as OBSSourceScene[];
})

watch(visible, () => {
    if (visible.value) {
        executeList();
        resumeList();
    } else {
        pauseList();
        executeList();
        executeStatus();
    }
}, { immediate: false });

/**
 * Source
 */
const props = defineProps<{
    source: string
}>()
const emit = defineEmits(['update:source'])

const source = computed<string>({
  get() {
    return props.source
  },
  set(value) {
    emit('update:source', value)
  }
})

</script>

<style lang="scss" module>
</style>