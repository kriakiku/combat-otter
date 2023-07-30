<template>
    <surface :class="[
        $style.container,
        step === ServiceAreaSteps.None && $style.containerSmall,
    ]">
        <!-- No image -->
        <v-icon v-if="!$slots.preview" name="md-imagenotsupported-sharp" scale="2.4" />
        
        <!-- Preview -->
        <div v-else :class="$style.preview">
            <slot name="preview" />
        </div>
        
        <!-- Record overlay -->
        <div :class="$style.rec" v-if="step === ServiceAreaSteps.CaptureImage">
            <v-icon name="md-fibermanualrecord-sharp" scale="1.6" />
            <span>REC</span>
        </div>

        <!-- Updated at overlay -->
        <div :class="$style.updatedAt" v-if="updatedAt && step === ServiceAreaSteps.CaptureImage">
            <time-ago :date="updatedAt" />
        </div>
    </surface>
</template>

<script setup lang="ts">
import { ServiceAreaSteps } from '@typed';

const { step, updatedAt } = defineProps<{
    step: ServiceAreaSteps,
    updatedAt?: Date
}>()
</script>

<style lang="scss" module>
.container {
    position: relative;
    display: flex;
    height: 650px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 0;

    &:hover .rec {
        opacity: 0.7;
    }
}

.containerSmall {
    height: 320px;
}

.rec {
    position: absolute;
    bottom: 14px;
    left: 14px;
    display: flex;
    gap: 4px;
    align-items: center;
    user-select: none;

    svg {
        color: #c2262d;
        animation: flashing infinite 2.6s;

        @keyframes flashing {
            from { opacity: 0; }
            35% { opacity: 1; }
            85% { opacity: 1; }
            to { opacity: 0; }
        }
    }
}

.updatedAt {
    font-size: 0.8rem;
    position: absolute;
    top: 0;
    background-color: #fff;
    color: #000;
    padding: 0 0.3em;
    border-radius: 0 0 0.2em 0.2em;
}

.preview {
    display: flex;
    width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;

    img {
        object-fit: contain;
        margin: 0 auto;
    }
}
</style>
