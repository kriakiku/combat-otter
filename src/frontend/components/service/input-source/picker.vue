<template>
    <menu-list>
        <!-- Title -->
        <template #title>
            {{ $t('service.input-source.title') }}
        </template>

        <!-- Input source -->
        <source-picker v-model="inputSource" />

        <!-- Input source (screenshot) -->
        <template v-if="inputSource === Services.screenshot">
            <screenshot-window v-model="screenshotWindow" />
            <screenshot-method v-model="screenshotMethod" />
        </template>

        <!-- Input source (OBS) -->
        <template v-if="inputSource === Services.obs">
            <obs-connection
                v-model:server="obsConnectionServer"
                v-model:port="obsConnectionPort"
                v-model:password="obsConnectionPassword"
            />
            <obs-source
                v-model:source="obsSource"
            />
        </template>

    </menu-list>
</template>

<script lang="ts" setup>
import { useSetting } from '@frontend/stores/settings';
import { Services, SettingsKeys } from '@typed';
import 'vue-i18n'
import SourcePicker from './source-picker.vue'
import ScreenshotWindow from './screenshot/screenshot-window.vue'
import ScreenshotMethod from './screenshot/screenshot-method.vue'
import ObsConnection from './obs/obs-connection.vue'
import ObsSource from './obs/obs-source.vue'

const inputSource = useSetting(SettingsKeys.ServiceInputSourceService)
const screenshotWindow = useSetting(SettingsKeys.ScreenshotServiceWindow)
const screenshotMethod = useSetting(SettingsKeys.ScreenshotServiceMethod)
const obsConnectionServer = useSetting(SettingsKeys.OBSServiceConnectionServer)
const obsConnectionPort = useSetting(SettingsKeys.OBSServiceConnectionPort)
const obsConnectionPassword = useSetting(SettingsKeys.OBSServiceConnectionPassword)
const obsSource = useSetting(SettingsKeys.OBSServiceSource)
</script>
