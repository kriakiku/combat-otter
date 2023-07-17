<template>
    <div
        :class="$style.container"
        :style="{
            ...render
        }"
    >
        <!-- Game type -->
        <span :class="$style.title">
            {{ $t(`gameType.${type}`) }}
        </span>

        <!-- Division level -->
        <svg viewBox="0 0 62.4 75" :class="$style.divisionLevel">
            <defs>
                <!-- Inner gradient -->
                <radialGradient :id="`${$style.divisionLevel}--inner-gradient`" cx="0.3" cy="-0.3" r="2">
                    <stop offset="0%" stop-color="#000000" />
                    <stop offset="100%" stop-color="#414141" />
                </radialGradient>

                <!-- Content -->
                <clipPath :id="`${$style.divisionLevel}--mask-${divisionLevel}`">
                    <path v-if="divisionLevel === DivisionLevel.III || divisionLevel === DivisionLevel.II" :transform="divisionLevel === DivisionLevel.II ? 'translate(11)' : ''" d="m18.4 73 0 2-18.4 0 0-1.9a4.49 4.49 180 001.475-.255 5.124 5.124 180 00.125-.045 2.388 2.388 180 00.312-.141q.357-.196.453-.458a.58.58 180 00.035-.201l0-69a.618.618 180 00-.191-.441q-.2-.205-.609-.359a4.611 4.611 180 00-1.3-.289 4.276 4.276 180 00-.3-.011l0-1.9 18.4 0z" />
                
                    <path v-if="divisionLevel === DivisionLevel.III" d="m23 0 16 0 0 76-16 0z" />
                    <path v-if="divisionLevel === DivisionLevel.I" d="m21.6 1.9 0-1.9 18.4 0 0 1.9a4.49 4.49 0 00-1.475.255 5.124 5.124 0 00-.125.045 2.388 2.388 0 00-.312.141q-.357.196-.453.458a.58.58 0 00-.035.201l0 69a.618.618 0 00.191.441q.2.205.609.359a4.611 4.611 0 001.3.289 4.276 4.276 0 00.3.011l0 1.9-18.4 0 0-1.9a4.49 4.49 0 001.475-.255 5.124 5.124 0 00.125-.045 2.388 2.388 0 00.312-.141q.357-.196.453-.458a.58.58 0 00.035-.201l0-69a.618.618 0 00-.191-.441q-.2-.205-.609-.359a4.611 4.611 0 00-1.3-.289 4.276 4.276 0 00-.3-.011z" />

                    <path v-if="divisionLevel === DivisionLevel.III || divisionLevel === DivisionLevel.II" :transform="divisionLevel === DivisionLevel.II ? 'translate(-11)' : ''" d="m43.6 2 0-2 18.4 0 0 1.9a4.49 4.49 0 00-1.475.255 5.124 5.124 0 00-.125.045 2.388 2.388 0 00-.312.141q-.357.196-.453.458a.58.58 0 00-.035.201l0 69a.618.618 0 00.191.441q.2.205.609.359a4.611 4.611 0 001.3.289 4.276 4.276 0 00.3.011l0 1.9-18.4 0z" />
                </clipPath>
            </defs>

            <rect
                width="100%"
                height="100%"
                :fill="`url(#${$style.divisionLevel}--inner-gradient)`"
                :clip-path="`url(#${$style.divisionLevel}--mask-${divisionLevel})`"
            />
        </svg>

        <!-- Meta -->
        <div :class="$style.meta">
            <!-- SR -->
            <div :class="$style.sr">
                <span :class="$style.srIcon">SR</span>
                <span :class="$style.srValue" v-text="sr" />
            </div>
            <!-- Rank -->
            <div :class="$style.rank">
                <span :class="$style.rankLabel">{{ $t('rank.title') }}</span>
                <span :class="$style.rankValue" v-text="rank" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import 'vue-i18n'
import { computed } from 'vue';
import { Division, DivisionLevel, RankedType } from '../../typed';

const { division, divisionLevel, type, sr } = defineProps<{
    division: Division,
    divisionLevel: DivisionLevel,
    type: RankedType,
    sr: number,
    rank: number
}>()

const render = computed(() => {

    switch (division) {
        case Division.bronze:
            return {
                color: '#a67f61',
                backgroundImage: 
                    'radial-gradient(circle, rgb(156 102 60 / 79%) 11%, rgb(92 52 21 / 57%) 68%),' +
                    'linear-gradient(133deg, rgb(166 127 97) 0%, rgb(170 115 72 / 1) 100%)'
            }
        case Division.silver:
            return {
                color: '#ada7a0',
                backgroundImage: 
                    'radial-gradient(circle, rgb(82 78 78 / 79%) 11%, rgb(4 3 3 / 57%) 68%),' +
                    'linear-gradient(133deg, rgb(114 114 114) 0%, rgb(157 152 147) 100%)'
            }
        case Division.platinum:
            return {
                color: '#489781',
                backgroundImage: 
                    'radial-gradient(circle, #129d876e 11%, #1e333066 68%),' +
                    'linear-gradient(133deg, #03ca8c 0%, #0a6654 100%)'
            }
        case Division.diamond:
            return {
                color: '#1b95bb',
                backgroundImage: 
                    'radial-gradient(circle, #22ccf03d 11%, #22ccf01c 68%),' +
                    'linear-gradient(133deg, #0e3659 0%, #094366 100%)'
            }
        case Division.crimson:
            return {
                color: '#eb2658',
                backgroundImage: 
                    'radial-gradient(circle, #a71c1eab 11%, #39151238 68%),' +
                    'linear-gradient(133deg, #4f0f19 0%, #970319 100%)'
            }
        case Division.gold:
        case Division.iridescent:
        default:
            return {
                color: '#aa9053',
                backgroundImage: 
                    'radial-gradient(circle, #8d6c2e 11%, rgb(151 119 56 / 77%) 68%),' +
                    'linear-gradient(133deg, rgb(133 96 18) 0%, rgb(255 128 0) 100%)'
            }
    }

    return {
        gradient: ``
    }
})
</script>

<style lang="scss" module>
.container {
    display: flex;
    flex-direction: column;
    background: red;
    width: 14rem;
    height: 18rem; 
    user-select: none;
}

.title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 3.8rem;
    color: #fff;
    line-height: 0.9;
    font-family: var(--second-font);
    font-size: 2rem;
    text-transform: uppercase;
    text-align: center;
    margin-top: 0.4rem;
}

.divisionLevel {
    height: 7rem;
    margin-top: 1.4rem;
}

.meta {
    display: flex;
    margin-top: auto;
    padding: 0.6rem;
}

.sr {
    display: flex;
    align-items: center;
}

.srIcon {
    display: inline-block;
    width: 1.8rem;
    color: #000;
    font-family: var(--second-font);
    
    background: #fff;
    color: currentColor;

       /* -webkit-background-clip: text;
        -webkit-text-fill-color: transparent; */
    font-size: 1.2rem;
    text-align: center;
    margin-right: 0.3rem;
}

.srValue {
    color: #fff;
    user-select: all;
}

.rank {
    display: flex;
    align-items: center;
    margin-left: auto;
}

.rankLabel {
    color: currentColor;
    text-transform: uppercase;
    margin-right: 0.3rem;
    font-weight: bolder;
}

.rankValue {
    color: #fff;
    user-select: all;
}
</style>