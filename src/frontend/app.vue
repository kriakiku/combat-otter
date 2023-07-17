<template>
    <router-view v-if="settings.phase" />
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n'
import { SettingsKeys } from '../typed';
import { useSetting, useSettingsStore } from './stores/settings';

const settings = useSettingsStore();

/** Subscribe to settings change */
const unsubscribe = ref<() => void>()

onBeforeMount(() => {
    unsubscribe.value = settings.subscribe()
})

onBeforeUnmount(() => {
    unsubscribe.value?.()
})

/** Set user locale */
const { availableLocales, fallbackLocale, locale: uiLocale } = useI18n();
const userRawLocale = useSetting(SettingsKeys.UserRawLocale)

watch(userRawLocale, () => {
    const userLocale = (userRawLocale.value || '').toLowerCase();
    const locale = String(availableLocales.includes(userLocale) ? userLocale : fallbackLocale.value);

    if (!locale || uiLocale.value === locale) {
        return
    }

    uiLocale.value = locale;
}, { immediate: true })

</script>
