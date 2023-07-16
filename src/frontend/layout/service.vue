<template>
    <layout-base>
        <template #back>
            <router-link :to="{ name: 'settings.service' }" />
        </template>

        <template #title>
                <slot name="title" />
        </template>
        
        <template #guide>
            <slot name="guide" />
        </template>

        <template #default>
            <div :class="$style.container">
                <menu-list>
                    <!-- Interval picker -->
                    <service-interval-picker />
                </menu-list>
            

                <!-- Specific content -->
                <slot />
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