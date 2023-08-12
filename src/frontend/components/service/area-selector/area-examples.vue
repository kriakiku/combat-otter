<template>
    <div
        v-if="step !== ServiceAreaSteps.None && step !== ServiceAreaSteps.CaptureImage"
        :class="{
            [$style.container]: true,
            [$style.imageModeArea]: step === ServiceAreaSteps.ModeArea,
            [$style.imageRankArea]: step !== ServiceAreaSteps.ModeArea && step !== ServiceAreaSteps.LevelArea,
            [$style.imageLevelArea]: step === ServiceAreaSteps.LevelArea,
        }"
    >

        <!-- Correct: WZ -->
        <div :class="[$style.image, $style.imageCorrect]">
            <img :src="exampleWZ" />
            <v-icon name="bi-check-lg" scale="2" />
            <span v-if="step === ServiceAreaSteps.ModeArea" style="top: 1.4rem; height: 2rem; left: 4rem; width: 20rem;" class="area-select" />
            <span v-if="step === ServiceAreaSteps.RankArea" style="top: 9.5rem; height: 3.5rem; left: 2.6rem; width: 8.6rem;" class="area-select" />
            <span v-if="step === ServiceAreaSteps.SRArea" style="top: 17.6rem; height: 1.3rem; left: 2.6rem; width: 8.6rem;" class="area-select" />
            <span v-if="step === ServiceAreaSteps.LevelArea" style="top: 1.1rem; height: 2.6rem; right: 6.5rem; width: 5.5rem;" class="area-select" />
        </div>

        <!-- Correct: MW -->
        <div v-if="step === ServiceAreaSteps.ModeArea" :class="[$style.image, $style.imageCorrect]">
            <img :src="exampleMW" />
            <v-icon name="bi-check-lg" scale="2" />
            <span style="top: 1.4rem; height: 2rem; left: 4rem; width: 20rem;" class="area-select" />
        </div>

        <!-- Incorrect: WZ -->
        <div :class="[$style.image, $style.imageIncorrect]">
            <img :src="exampleWZ" />
            <v-icon name="md-close-round" scale="1.8" />
            <span v-if="step === ServiceAreaSteps.ModeArea" style="top: 0rem; height: 3.4rem; left: 4rem; width: 20rem;" class="area-select" />
            <span v-if="step === ServiceAreaSteps.RankArea" style="top: 9rem; height: 4rem; left: 3.6rem; width: 6.6rem;" class="area-select" />
            <span v-if="step === ServiceAreaSteps.SRArea" style="top: 17.1rem; height: 2.2rem; left: 6.4rem; width: 4.8rem;" class="area-select" />
            <span v-if="step === ServiceAreaSteps.LevelArea" style="top: 1.1rem; height: 2.6rem; right: 2.5rem; width: 11.5rem;" class="area-select" />
        </div>

        <!-- Incorrect: MW -->
        <div :class="[$style.image, $style.imageIncorrect]">
            <img :src="exampleMW" />
            <v-icon name="md-close-round" scale="1.8" />
            <span v-if="step === ServiceAreaSteps.ModeArea"  style="top: 1.4rem; height: 2rem; left: 4rem; width: 24rem;" class="area-select" />
            <span v-if="step === ServiceAreaSteps.RankArea" style="top: 9.5rem; height: 3.5rem; left: 5.6rem; width: 2.6rem;" class="area-select" />
            <span v-if="step === ServiceAreaSteps.SRArea" style="top: 17.6rem; height: 1.3rem; left: 5rem; width: 3.7rem;" class="area-select" />
            <span v-if="step === ServiceAreaSteps.LevelArea" style="top: 1.1rem; height: 2.6rem; right: 7.5rem; width: 2rem;" class="area-select" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ServiceAreaSteps } from '@typed';
import exampleWZ from '@frontend/assets/images/example-wz.png';
import exampleMW from '@frontend/assets/images/example-mw.png';

const { step } = defineProps<{
    step: ServiceAreaSteps
}>()
</script>

<style lang="scss" module>
.container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 0.8rem;
    user-select: none;
}

.image {
    position: relative;
    overflow: hidden;
    display: inline-block;
    min-width: var(--width);
    max-width: var(--width);
    min-height: var(--height);
    max-height: var(--height);
    border: 0.2em solid currentColor;

    img {
        position: absolute;
        min-height: 55rem;
        max-height: 55rem;
        width: auto;
        pointer-events: none;
        object-fit: contain;
    }

    svg {
        position: absolute;
        bottom: 0;
        right: 0;
        color: currentColor;
    }
}

.imageCorrect {
    color: #188a42;
}

.imageIncorrect {
    color: #b32b23;
}

.imageModeArea .image {
    --width: 30rem;
    --height: 5rem;
}

.imageRankArea .image {
    --width: 14rem;
    --height: 24rem;

    img {
        margin-top: -12rem;
        margin-left: -2rem;
    }
}

.imageLevelArea .image {
    --width: 19rem;
    --height: 7rem;

    img {
        margin-left: -76rem;
    }
}
</style>
