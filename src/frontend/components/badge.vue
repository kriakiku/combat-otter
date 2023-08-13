<template>
    <span :class="[$style.tip, $style[`tip--${color || 'info'}`]]">
        <span :class="$style.inner">
            <slot />
        </span>
    </span>
</template>

<script lang="ts" setup>
const { color } = defineProps<{
    color?: 'info' | 'danger' | 'warning' | 'blank' | 'success'
}>();
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

.tip--success {
    color: #6fd99b;
}

.tip--warning {
    color: #ffd400;
}

.tip--blank {
    color: currentColor;
}
</style>