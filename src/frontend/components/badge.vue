<template>
    <span :class="[$style.tip, $style[`tip--${color}`]]">
        <span :class="$style.inner">
            <slot />
        </span>
    </span>
</template>

<script setup>
const props = defineProps({
    color: ['info', 'danger']
})

const color = props.color || 'info'
</script>

<style lang="scss" module>
.tip {
    display: inline-flex;
    align-items: center;
    text-transform: uppercase;
    border: 1px solid currentColor;
    padding: 0.05em 0.3em;
    border-radius: 4px;
    margin-right: 0.4em;
    height: 1em;
    user-select: none;
}

.inner {
    font-size: 0.9em;
}

.tip--info {
    color: #6facd9;
}
</style>