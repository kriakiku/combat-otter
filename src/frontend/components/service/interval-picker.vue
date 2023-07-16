<template>
    <!-- Frequency picker -->
    <menu-item>
        <template #icon>
            <v-icon name="ri-alarm-line" scale="1.4" />
        </template>

        <template #title>
            {{ $t('service.interval.title') }}
        </template>

        <template #description>
            {{ $t(`service.interval.description.${interval}`) }}
        </template>

        <template #action>
            <dropdown
                v-model="interval"
                :options="options"
            >
                <!-- Picked -->
                <template #value="{ value, placeholder }">
                    <template v-if="value">
                        {{ $t(`service.interval.options.${value}`, value in ServiceIntervalMs ? {
                            sec: Math.round(ServiceIntervalMs[value as keyof typeof ServiceIntervalMs] / 1000)
                        } : undefined) }}
                    </template>
                    <template v-else>
                        {{ placeholder }}
                    </template>
                </template>

                <!-- List -->
                <template #option="{ option }">
                    {{ $t(`service.interval.options.${option}`, option in ServiceIntervalMs ? {
                            sec: Math.round(ServiceIntervalMs[option as keyof typeof ServiceIntervalMs] / 1000)
                    } : undefined) }}
                </template>
            </dropdown>
        </template>
    </menu-item>

    <!-- Delay after successful recognition -->
    <menu-item v-if="interval !== ServiceInterval.SHORTCUT">
        <template #icon>
            <v-icon name="ri-zzz-fill" scale="1.4" />
        </template>

        <template #title>
            {{ $t('service.interval.delay.title') }}
        </template>

        <template #description>
            {{ $t(`service.interval.delay.description`) }}
        </template>

        <template #action>
            <input-switch v-model="delay" />
        </template>
    </menu-item>

    <!-- Shortcut -->
    <menu-item v-else>
        <template #icon>
            <span :class="$style.keyboardKey">F</span>
        </template>

        <template #title>
            {{ $t('service.interval.shortcut.title') }}
        </template>

        <template #description>
            {{ $t(`service.interval.shortcut.description`) }}
        </template>

        <template #action>
            <!-- Record -->
            <user-button v-if="shortcut.length === 0 && !shortcutRecording" :label="$t('service.interval.shortcut.record')" outlined @click="startShortcutRecord" />
            <!-- Recorded keys -->
            <div v-else-if="shortcut.length > 0 || shortcutRecording" :class="$style.keyboardKeyBlock" @click="resetShortcut">
                <!-- Binded keys -->
                <div :class="$style.keyboardKeyList">
                    <span :class="$style.keyboardKey" v-for="key of shortcut" :key="key">
                        {{ key }}
                    </span>
                </div>

                <!-- Info message -->
                <span :class="$style.keyboardKeyInfo">
                    <template v-if="shortcutRecording">
                        {{ $t('service.interval.shortcut.cancel') }}
                    </template>
                    <template v-else>
                        {{ $t('service.interval.shortcut.reset') }}
                    </template>
                </span>
            </div>
        </template>
    </menu-item>

</template>

<script lang="ts" setup>
import { ref } from "vue";
import hotkeys from 'hotkeys-js'
import { ServiceInterval, ServiceIntervalMs } from '../../../typed'

const options = ref(Object.values(ServiceInterval))
const interval = ref(ServiceInterval.SHORTCUT)
const delay = ref(true)
const shortcut = ref<string[]>([])
const shortcutRecording = ref(false)

function stopShortcutRecord() {
    if (shortcutRecording.value) {
        shortcutRecording.value = false;
        hotkeys.unbind('*');
    }
}

function resetShortcut() {
    stopShortcutRecord();
    shortcut.value = [];
}

function startShortcutRecord() {
    stopShortcutRecord();
    shortcutRecording.value = true;

    let pressedKeys: string[] = [];
    hotkeys('*', { keyup: true }, ({ type }) => {
        const nowPressedKeys = hotkeys.getPressedKeyString();

        // Cancel
        if (hotkeys.isPressed('ESC')) {
            shortcut.value = [];
            stopShortcutRecord();
            return;
        }

        // Done
        if (
            type === 'keyup' ||
            pressedKeys.length > nowPressedKeys.length ||
            pressedKeys.some(key => !nowPressedKeys.includes(key))
        ) {
            stopShortcutRecord();
            return;
        }

        // Limit
        if (nowPressedKeys.length >= 2) {
            stopShortcutRecord();
        }

        // Save
        pressedKeys = nowPressedKeys;
        shortcut.value = nowPressedKeys;
    })
}
</script>

<style lang="scss" module>
    .item {
        display: flex;
    }

    .keyboardKeyBlock {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        cursor: pointer;
        text-align: right;  
    }

    .keyboardKeyList {
        display: flex;
        gap: 0.2rem;
        height: 1.66rem;
        margin-left: auto;
    }

    .keyboardKeyInfo {
        font-size: 0.7rem;
    }

    .keyboardKey {
        display: inline-block;
        align-items: center;
        text-align: center;
        border: 2px solid #fff;
        color: #fff;
        border-radius: 4px;
        min-width: 1.6rem;
        height: 1.6rem;
        padding: 0 0.2rem;
        text-transform: uppercase;
    }
</style>