<template>
    <layout-base>
        <template #back>
            <router-link :to="{ name: 'home' }" />
        </template>

        <template #title>
            {{ $t("service.title") }}
        </template>
        
        <template #guide>
            {{ $t("service.disclaimer") }}
        </template>

        <template #default>
            <div :class="$style.container">
                <!-- Frequency -->
                <service-frequency-picker />

                <!-- Input source -->
                <service-input-source-picker />

                <!-- Processing -->
            
                <!-- Specific content -->
                GGWP
            </div>
        </template>

    </layout-base>
</template>

<script setup lang="ts">
import 'vue-i18n'
import { ref } from 'vue'
</script>

<style lang="scss" module>
.container {
    display: block;
}
</style>