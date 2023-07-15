<template>
    <surface
        :class="[$style.container, $slots.link && $style.containerWithLink]"
    >
        <!-- Link -->
        <slot name="link" />

        <!-- Icon -->
        <span :class="$style.icon">
            <slot name="icon" />
        </span>

        <!-- Content -->
        <div :class="$style.content">
            <!-- Title -->
            <span :class="$style.title">
                <slot name="title" />
            </span>

            <!-- Description -->
            <span :class="$style.description">
                <slot name="description" />
            </span>

        </div>

        <!-- Confirm button -->
        <span :class="$style.confirmIcon" v-if="!$slots.action">
            <v-icon name="md-keyboardarrowright-round" scale="1.6" />
        </span>

        <!-- Action -->
        <span v-else :class="$style.action">
            <slot name="action" />
        </span>

    </surface>
</template>

<script lang="ts" setup>
import 'vue-i18n'
import { computed } from 'vue';
</script>

<style lang="scss" module>
.container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1.4rem;
    user-select: none;
}

.containerWithLink {
    cursor: pointer;

    &:hover {
        background-color: #191a1f;
    }

    &:active {
        background-color: #121316;
    }

    > a {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
}

.icon, .confirmIcon {
    color: #fff;

    &.confirmIcon {
        margin-left: auto;
    }
}

.title {
    display: flex;
    color: #fff;
}

.description {
    font-size: 0.8rem;
}

.action {
    margin-left: auto;

    select {
        background-color: #191a1f;
        border: 1px solid #121316;
        border-radius: 4px;
        padding: 0.1rem 0.4rem;
        color: #fff;
    }
}
</style>