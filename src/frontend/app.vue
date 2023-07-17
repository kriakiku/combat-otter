<template>
    <router-view v-if="settings.phase" />
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useSettingsStore } from './stores/settings';

const settings = useSettingsStore();
const unsubscribe = ref<() => void>()

onBeforeMount(() => {
    unsubscribe.value = settings.subscribe()
})

onBeforeUnmount(() => {
    unsubscribe.value?.()
})
</script>