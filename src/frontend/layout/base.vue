<template>
    <main :class="$style.container">
        <header :class="$style.header">
            <!-- Back -->
            <div :class="$style.back" v-if="$slots.back">
                <slot name="back" />
                <v-icon name="md-keyboardarrowleft-round" scale="1.6" />
            </div>

            <!-- Title -->
            <base-title :class="$style.title">
                <slot name="title" />
            </base-title>
        </header>

        <!-- Content -->
        <section :class="$style.content">

            <!-- Guide -->
            <surface v-if="$slots.guide">
                <badge>
                    {{ $t('badge.presets.tip') }}
                </badge>

                <slot name="guide" />
            </surface>

            <slot />
        </section>
    </main>
</template>

<script setup lang="ts">
import 'vue-i18n'
import { ref } from 'vue'

const active = ref('guide')
</script>

<style lang="scss" module>
    .container {
        display: flex;
        flex-direction: column;
        padding: 1rem 0;
        min-height: 100vh;
    }

    .content {
        position: relative;
        padding: 0 2rem;
        flex: 1;
    }

    .header {
        position: sticky;
        z-index: 3;
        top: 0;
        display: flex;
        padding: 0rem 2rem;
        background-color: var(--bg-color);
        margin-bottom: 1rem;
        -webkit-app-region: drag;
        user-select: none;
    }

    .title {
        margin: 0.4rem 0;
    }

    .back {
        position: relative;
        display: flex;
        align-items: center;
        padding-right: 0.6rem;
        -webkit-app-region: no-drag;

        > a {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
</style>