<template>
    <menu-list>
        <!-- Title -->
        <template #title>
            {{ $t('service.input-source.title') }}
        </template>

        <!-- Input source -->
        <source-picker v-model="inputSource" />
    </menu-list>
</template>

<script lang="ts" setup>
import { useSetting } from '@frontend/stores/settings';
import { SettingsKeys } from '@typed';
import 'vue-i18n'
import SourcePicker from './source-picker.vue'

const inputSource = useSetting(SettingsKeys.ServiceInputSourceService)
</script>

<style lang="scss" module>
</style>