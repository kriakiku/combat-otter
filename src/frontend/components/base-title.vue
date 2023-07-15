<template>
    <h1 :class="$style.title">
        <slot />
    </h1>
</template>

<style lang="scss" module>
.title {
    display: block;
    font-size: 1.5rem;
}
</style>