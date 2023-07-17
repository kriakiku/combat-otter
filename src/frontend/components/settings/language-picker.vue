<template>
    <dropdown
        v-model="value"
        :options="availableLocales"
        placeholder="Select a locale"
        class="w-full md:w-14rem"
    >
        <!-- Picked -->
        <template #value="slotProps">
            <div v-if="slotProps.value" :class="$style.item">
                <div>{{ $t('languageTitle', {}, { locale: slotProps.value }) }}</div>
            </div>
            <span v-else>
                {{ slotProps.placeholder }}
            </span>
        </template>

        <!-- List -->
        <template #option="slotProps">
            <div :class="$style.item">
                <img :src="flags[slotProps.option as keyof typeof flags]" :class="$style.flag" />
                <div>{{ $t('languageTitle', {}, { locale: slotProps.option }) }}</div>
            </div>
        </template>

    </dropdown>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { SettingsKeys } from '../../../typed';
import { useSetting } from '../../stores/settings';
import gbFlag from '../../assets/images/flags/gb.svg';
import uaFlag from '../../assets/images/flags/ua.svg';
import ruFlag from '../../assets/images/flags/ru.svg';
import ltFlag from '../../assets/images/flags/lt.svg';
import { computed, watch } from 'vue';

const flags = {
    en: gbFlag,
    ua: uaFlag,
    ru: ruFlag,
    lt: ltFlag
}

const { availableLocales, locale } = useI18n();
const userRawLocale = useSetting(SettingsKeys.UserRawLocale)

const value = computed({
    get() {
        return locale.value
    },
    set(value: string) {
        locale.value = value
        userRawLocale.value = value
    }
})

</script>

<style lang="scss" module>
.item {
    display: flex;
}

.flag {
    display: inline-block;
    height: 1rem;
    margin-right: 0.4rem;
}
</style>