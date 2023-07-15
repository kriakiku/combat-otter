<template>
    <main :class="[$style.container]">
        <!-- User info -->
        <header :class="[$style.header]">
        </header>

        <!-- Menu -->
        <div :class="[$style.menu]">
            GGWP
        </div>

        <!-- Title -->
        <h1>Pick menu</h1>

        <slot />
    </main>
</template>

<script setup>
import { ref } from 'vue'

const active = ref('guide')
</script>

<style lang="scss" module>
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin: 14px;
        border-radius: 14px;
        overflow: hidden;
        background: #1a1218;
    }

    .header {
        position: relative;
        display: flex;
        min-height: 140px;

        &::before {
            display: block;
            content: "";

            position: absolute;
            z-index: 1;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: url(../assets/banner.jpg);
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }

        &::after {
            display: block;
            content: "";

            position: absolute;
            z-index: 2;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;

            background: linear-gradient(
                180deg,
                rgba(14,182,193,0.4) 0%,
                rgba(234,87,203,0.6) 100%
            );
        }
    }

    .menu {
        background: #d448b5;
        margin: 0;
        border-radius: 0;
        height: 42px;
    }
</style>