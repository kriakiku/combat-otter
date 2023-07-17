<template>
    <!-- Shortcut -->
    <menu-item>
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
import { computed, onUnmounted, ref } from "vue";
import hotkeys from 'hotkeys-js'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const shortcut = computed<string[]>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

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

onUnmounted(stopShortcutRecord)
</script>

<style lang="scss" module>
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