<template>
    <layout-base>
        <template v-slot:title>
            {{ $t("home.title") }}
        </template>

        <template v-slot:default>
            <!-- Summary -->
            <div :class="$style.summary">
                <rank-summary v-bind="wz" />
                <rank-summary v-bind="mw" />
            </div>

            <!-- Menu -->
            <menu-list>
                <template v-slot:title>
                    {{ $t('settings.title') }}
                </template>
                <template v-slot:default>

                    <!-- Input service -->
                    <menu-item>
                        <template #link>
                            <router-link :to="{ name: 'settings.service' }" />
                        </template>

                        <template #icon>
                            <v-icon name="md-screenshotmonitor" scale="1.4" />
                        </template>

                        <template #title>
                            {{ $t('service.title') }}
                        </template>

                        <template #description>
                            {{ $t('service.description') }}
                        </template>
                    </menu-item>

                    <!-- Discord integration -->
                    <menu-item>
                        <template #link>
                            <router-link :to="{ name: 'settings.service' }" />
                        </template>

                        <template #icon>
                            <v-icon name="si-discord" scale="1.4" />
                        </template>

                        <template #title>
                            {{ $t('plugins.discord.title') }}
                        </template>

                        <template #description>
                            {{ $t('plugins.discord.description') }}
                        </template>
                    </menu-item>

                    <!-- OBS integration -->
                    <menu-item>
                        <template #link>
                            <router-link :to="{ name: 'settings.service' }" />
                        </template>

                        <template #icon>
                            <v-icon name="si-obsstudio" scale="1.4" />
                        </template>

                        <template #title>
                            {{ $t('plugins.obs.title') }}
                        </template>

                        <template #description>
                            {{ $t('plugins.obs.description') }}
                        </template>
                    </menu-item>

                    <!-- WZHub integration -->
                    <menu-item>
                        <template #link>
                            <router-link :to="{ name: 'settings.service' }" />
                        </template>

                        <template #icon>
                            <v-icon name="bi-balloon" scale="1.4" />
                        </template>

                        <template #title>
                            {{ $t('plugins.wzhub.title') }}
                        </template>

                        <template #description>
                            {{ $t('plugins.wzhub.description') }}
                        </template>
                    </menu-item>

                    <!-- Shadow ban notifier -->
                    <menu-item>
                        <template #link>
                            <router-link :to="{ name: 'settings.service' }" />
                        </template>

                        <template #icon>
                            <v-icon name="oi-blocked" scale="1.4" />
                        </template>

                        <template #title>
                            {{ $t('plugins.shadow-ban.title') }}
                        </template>

                        <template #description>
                            {{ $t('plugins.shadow-ban.description') }}
                        </template>
                    </menu-item>

                    <!-- Language -->
                    <menu-item>
                        <template #icon>
                            <v-icon name="la-globe-europe-solid" scale="1.4" />
                        </template>

                        <template #title>
                            {{ $t('settings.locale.title') }}
                        </template>

                        <template #action>
                            <settings-language-picker />
                        </template>
                    </menu-item>

                </template>
            </menu-list>

        </template>
    </layout-base>
</template>

<script setup lang="ts">
import 'vue-i18n'
import { Division, DivisionLevel, RankedType } from '@typed';

const wz = {
    division: Division.crimson,
    divisionLevel: DivisionLevel.III,
    type: RankedType.WZ,
    sr: 19_943,
    rank: 333
}

const mw = {
    division: Division.platinum,
    divisionLevel: DivisionLevel.II,
    type: RankedType.MW,
    sr: 300,
    rank: 18
}
</script>

<style lang="scss" module>
.summary {
    display: flex;
    gap: 1rem;
}
</style>