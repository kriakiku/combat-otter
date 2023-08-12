<template>
    <div
        :class="$style.container"
    >
        <sub-title v-if="$slots.title">
            <slot name="title" />
        </sub-title>

        <div :class="$style.list">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" module>
.container {
    display: block;
    margin-top: 1.4rem;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>