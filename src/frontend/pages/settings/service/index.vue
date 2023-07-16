<template>
    <layout-base>
        <template v-slot:back>
            <router-link :to="{ name: 'home' }" />
        </template>

        <template v-slot:title>
            {{ $t("service.title") }}
        </template>

        <template #guide>
            {{ $t("service.disclaimer") }}
        </template>

        <template v-slot:default>
            <cartoon-list :items="items" />
        </template>
    </layout-base>
</template>

<script lang="ts" setup>
import { Services } from '../../../../typed';
import screenshotBanner from './../../../assets/images/screen-capture-banner.jpg'
import { computed } from 'vue'
import 'vue-i18n'

const items = computed(() => ([
    {
        slug: Services.screenshot,
        title: 'Screen capture',
        color: '#f67bf2',
        banner: screenshotBanner,
        to: { name: 'settings.service.screenshot' }
    },
    {
        slug: Services.obs,
        title: 'OBS',
        color: 'lightblue'
    },
    {
        slug: Services.twitch,
        title: 'Twitch',
        color: 'purple'
    },
    {
        slug: Services.youtube,
        title: 'Youtube',
        color: 'red'
    }
]));
</script>
