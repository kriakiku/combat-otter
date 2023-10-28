<template>
    <layout-base>
        <template #back>
            <router-link :to="{ name: 'home' }" />
        </template>

        <template v-slot:title>
            {{ $t("home.title") }}
        </template>

        <template v-slot:default>
            <iframe src="http://localhost:3001/plugin/settings" :class="$style.frame"></iframe>
        </template>
    </layout-base>
</template>

<script setup lang="ts">
import 'vue-i18n'
</script>

<style lang="scss" module>
.frame {
    border: none;
    position: absolute;
    top: 0;
    left: 2rem;
    width: calc(100% - 4rem);
    height: 100%;
}
</style>