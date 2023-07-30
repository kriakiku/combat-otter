<template>
    <timeago
        v-if="date"
        :datetime="date"
        :locale="translations"
        :converter-options="{
            includeSeconds: true,
            autoUpdate: 3
        }"
    />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import en from 'date-fns/locale/en-GB';
import lt from 'date-fns/locale/lt';
import ru from 'date-fns/locale/ru';
import ua from 'date-fns/locale/uk';
import { computed } from 'vue';

const { date } = defineProps<{
    date?: Date
}>()

const { locale } = useI18n();

const translations = computed(() => {
    switch (locale.value) {
        case 'lt':
            return lt;
        case 'ru':
            return ru;
        case 'ua':
            return ua;
        default:
            return en;
    }
})
</script>