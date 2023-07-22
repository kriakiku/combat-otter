<template>
    <menu-list>
        <!-- Title -->
        <template #title>
            {{ $t('service.interval.blockTitle') }}
        </template>

        <!-- Frequency picker -->
        <interval-picker v-model="interval" />

        <!-- Delay after successful recognition -->
        <delay-picker v-if="interval !== ServiceInterval.SHORTCUT" v-model="delay" />

        <!-- Shortcut -->
        <shortcut-record v-else v-model="shortcut" />
    </menu-list>
</template>

<script lang="ts" setup>
import IntervalPicker from './interval-picker.vue'
import DelayPicker from './delay-picker.vue'
import ShortcutRecord from './shortcut-record.vue'
import { ServiceInterval, SettingsKeys } from '@typed';
import { useSetting } from '@frontend/stores/settings'

const interval = useSetting(SettingsKeys.ServiceFrequencyInterval)
const delay = useSetting(SettingsKeys.ServiceFrequencyDelay)
const shortcut = useSetting(SettingsKeys.ServiceFrequencyShortcut)
</script>

<style lang="scss" module>
</style>