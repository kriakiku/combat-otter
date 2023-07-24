<template>
    <menu-list>
        <!-- Title -->
        <template #title>
            {{ $t('service.area-selector.title') }}
        </template>
    </menu-list>
</template>

<script lang="ts" setup>
import { ServiceInterval, SettingsKeys } from '@typed';
</script>

<style lang="scss" module>
</style>