<template>
    <!-- Screenshot window -->
    <menu-item>
        <template #icon>
            <v-icon name="bi-window-desktop" scale="1.4" />
        </template>

        <template #title>
            {{ $t(`service.input-source.sources.${Services.screenshot}.window.title`) }}
        </template>

        <template #description>
            <!-- Option description -->
            {{ 
                pickedOption?.description
            }}
        </template>

        <template #action>
            <dropdown
                v-model="window"
                :options="groupedOptions"
                optionLabel="label"
                optionGroupLabel="label"
                optionGroupChildren="items"
                optionValue="value"
                @before-show="windowsStore.subscribe"
            >
                <!-- Group -->
                <template #optiongroup="slotProps">
                    {{ slotProps.option.label }}
                    <div v-if="slotProps.option.description" :class="$style.description">
                        <badge>{{$t('badge.presets.tip')}}</badge>{{
                            slotProps.option.description
                        }}
                    </div>
                </template>

                <!-- List -->
                <template #option="{ option }">
                    {{ option.label }}
                    <div :class="$style.path" v-if="option.path">
                        <badge color="blank">PATH</badge>{{
                            option.path
                        }}
                    </div>
                </template>
            </dropdown>
        </template>
    </menu-item>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from 'vue-i18n'
import { Services, ServiceScreenshotWindowPreset, ServiceScreenshotWindowItem, TimeoutId } from '@typed'
import { useScreenshotWindowsStore } from '@frontend/stores/screenshot-windows'

const { t } = useI18n();

/** Data */
const presets = ref(Object.values(ServiceScreenshotWindowPreset))
const windowsStore = useScreenshotWindowsStore();
onBeforeUnmount(windowsStore.unsubscribe);

/** Options */
const groupedOptions = computed(() => ([
    // Presets
    {
        label: t(`service.input-source.sources.${Services.screenshot}.window.presetsTitle`),
        items: presets.value.map(preset => ({
            value: preset,
            label: t(`service.input-source.sources.${Services.screenshot}.window.presets.${preset}.title`),
            description: t(`service.input-source.sources.${Services.screenshot}.window.presets.${preset}.description`),
            path: ''
        }))
    },
    // Windows
    {
        label: t(`service.input-source.sources.${Services.screenshot}.window.windows.title`),
        description: t(`service.input-source.sources.${Services.screenshot}.window.windows.description`),
        items: windowsStore.windows.map(value => ({
            value: JSON.stringify(value),
            label: value.title,
            description: t(`service.input-source.sources.${Services.screenshot}.window.windows.itemDescription`, { title: value.title, path: value.path }),
            path: value.path
        }))
    }
]))

const pickedOption = computed(() => {
    for (const group of groupedOptions.value) {
        for (const item of group.items) {
            if (item.value === window.value) {
                return item;
            }
        }
    }

    return null;
})


/** v-model */
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const window = computed<ServiceScreenshotWindowPreset | string>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<style lang="scss" module>
    .description, .path {
        font-size: 0.84em;
    }
</style>