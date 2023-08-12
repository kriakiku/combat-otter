<template>
    <!-- Screenshot window -->
    <menu-item>
        <template #icon>
            <v-icon v-if="!pickedOption" name="bi-window-desktop" scale="1.4" />
            <v-icon v-else-if="'icon' in pickedOption" name="bi-window-desktop" scale="1.4" />
            <span v-else-if="'emoji' in pickedOption" :class="$style.emoji">
                {{ pickedOption.emoji }}
            </span>
        </template>

        <template #title>
            {{ $t(`service.input-source.sources.${Services.screenshot}.window.title`) }}
        </template>

        <template #description>
            {{ pickedOption?.description }}
        </template>

        <template #action>
            <user-button
                :label="$t('service.input-source.edit')"
                @click="visible = true"
                outlined
                size="small"
            />
        </template>
    </menu-item>

    <!-- Picker -->
    <dialog-window
        v-model:visible="visible"
        modal
        :draggable="false"
        :header="$t(`service.input-source.sources.${Services.screenshot}.window.title`)"
        :style="{ width: 'min(55rem, 80vw)' }"
    >
        <menu-list v-for="group of groupedOptions">
            <template #title>
                {{ group.label }}
            </template>

            <menu-item
                v-for="item of group.items"
                :key="item.value"
            >
                <template #link>
                    <a
                        @click="
                            window = item.value;
                            visible = false;
                        "
                    />
                </template>

                <template #icon>
                    <v-icon v-if="'icon' in item" :name="item.icon" scale="1.4" />
                    <span v-else="'emoji' in item" :class="$style.emoji">
                        {{ item.emoji }}
                    </span>
                </template>

                <template #title>
                    {{ item.label }}
                </template>

                <template #description>
                    {{ item.path || item.description }}
                </template>

                <template #action>
                    <v-icon v-if="props.modelValue === item.value" name="bi-check-lg" scale="1.4" />
                </template>
            </menu-item>
        </menu-list>
        <template #footer>
            <div :class="$style.footer">
                <badge>{{ $t('badge.presets.tip') }}</badge>{{
                    $t(`service.input-source.sources.${Services.screenshot}.window.windows.description`)
                }}
            </div>
        </template>
    </dialog-window>
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
const visible = ref(false);

/** Subscribe to window's update */
onBeforeUnmount(windowsStore.unsubscribe);
watch(visible, () => {
    if (visible.value) {
        windowsStore.subscribe();
    } else {
        windowsStore.unsubscribe();
    }
}, { immediate: true })

/** Options */
const groupedOptions = computed(() => ([
    // Presets
    {
        label: t(`service.input-source.sources.${Services.screenshot}.window.presetsTitle`),
        items: presets.value.map(preset => ({
            value: preset,
            label: t(`service.input-source.sources.${Services.screenshot}.window.presets.${preset}.title`),
            description: t(`service.input-source.sources.${Services.screenshot}.window.presets.${preset}.description`),
            path: '',
            emoji:  t(`service.input-source.sources.${Services.screenshot}.window.presets.${preset}.emoji`),
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
            path: value.path,
            icon: 'ri-window-line'
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
.emoji {
    font-size: 1.4rem;
}

.footer {
    display: block;
    text-align: left;
}
</style>