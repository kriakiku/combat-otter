<template>
    <div :class="$style.container">
        <label v-if="$slots.label" :for="props.id" :class="$style.label">
            <slot name="label" />
        </label>
        <slot />
        <div v-if="$slots.description" :class="$style.description">
            <slot name="description" />
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
        id: string
    }>();
</script>

<style lang="scss" module>
.container {
    display: flex;
    flex-direction: column;
    margin: 0.5rem 0 0.8rem 0;
}

.label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: bold;
}

.description {
    margin-top: 0.2rem;
    font-size: 0.78rem;
    opacity: 0.8;
}
</style>