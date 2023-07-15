<template>
    <div :class="$style.container">
        <a
            v-for="item of items"
            :key="item.slug"
            :href="'#'"
            :class="$style.item"
            :style="{
                color: item.color
            }"
        >
            <img v-if="'banner' in item" :class="$style.banner" :alt="item.title" :src="item.banner" />
            <div :class="$style.summary">
                <span :class="$style.title">
                    {{ item.title }}
                </span>
            </div>
        </a>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    items: Array<{
        slug: string,
        title: string,
        color: string,
        banner?: string
    }>
}>()

const items = props.items
</script>

<style lang="scss" module>
.container {
    display: grid;
    grid: 10rem / repeat(auto-fill, 10rem);
    gap: 1rem;
    margin: 1.6rem 0;
}

.item {
    position: relative;
    background-color: currentColor;
    overflow: hidden;
    display: flex;
    text-decoration: none;
    user-select: none;
}

.title {
    display: block;
    width: 100%;
    margin-top: auto;
    margin-bottom: 1rem;
    color: #fff;
    font-size: 2rem;
    font-family: 'Tilt Warp', cursive;
    text-transform: uppercase;
    text-align: center;
}

.banner {
    $position: 0;
    $size: 100%;

    position: absolute;
    z-index: 0;
    top: $position;
    left: $position;
    min-width: $size;
    min-height: $size;
    max-width: $size;
    max-height: $size;
    object-fit: cover;
}

.summary {
    position: relative;
    z-index: 1;
    display: flex;
    width: 100%;
    height: 100%;
    padding: 0.2rem 0.4rem;
    background-image: linear-gradient(
        180deg,
        transparent 0%,
        transparent 60%,
        currentColor 70%
    );
}
</style>