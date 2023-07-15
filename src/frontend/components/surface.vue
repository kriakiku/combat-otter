<template>
    <div :class="$style.container">
        <slot />
    </div>
</template>

<style lang="scss" module>
.container {
    background-color: #15161a;
    color: #7a8694;
    padding: 1rem;
}
</style>