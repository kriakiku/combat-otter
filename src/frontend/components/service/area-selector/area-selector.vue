<template>
    <menu-list>
        <!-- Title -->
        <template #title>
            {{ $t('service.area-selector.title') }} 

            <!-- Step subtitle -->
            <span :class="$style.subtitle" v-if="step !== ServiceAreaSteps.None">
                / {{ $t(`service.area-selector.${step}.subtitle`) }} 
            </span>
        </template>

        <!-- Info -->
        <info-message>
            {{ $t(`service.area-selector.${step}.disclaimer`) }}

            <!-- Examples -->
            <area-examples :step="step" />

            <!-- Actions -->
            <div :class="$style.actions">
                <!-- Continue -->
                <user-button
                    v-if="nextStep.handler"
                    :label="$t('service.area-selector.actions.continue')"
                    @click="nextStep.handler"
                    :disabled="nextStep.disabled"
                    outlined
                    size="small"
                />

                <!-- Reset button -->
                <user-button
                    v-if="nextStep.reset"
                    :label="$t(`service.area-selector.actions.${step === ServiceAreaSteps.None ? 'reconfigure' : 'reset'}`)"
                    @click="nextStep.reset"
                    outlined
                    size="small"
                />
            </div>
        </info-message>

        <!-- Preview -->
        <area-preview :step="step" :updatedAt="preview?.updatedAt" :preview="preview?.url">
            <template #area>
                <AreaPicker v-if="preview" :step="step" />
            </template>
        </area-preview>

    </menu-list>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { SettingsKeys, ServiceAreaSteps } from '@typed';
import { useServiceAreaPreview } from '@frontend/hooks/service-area-preview'
import InfoMessage from './info-message.vue'
import AreaPreview from './area-preview.vue'
import AreaExamples from './area-examples.vue'
import AreaPicker from './area-picker.vue'
import { useResetSetting } from '@frontend/stores/settings';

/**
 * Step switch
 */
const step = ref<ServiceAreaSteps>(ServiceAreaSteps.None);

function reset() {
    step.value = ServiceAreaSteps.CaptureImage
}

const resetSetting = useResetSetting();
const nextStep = computed<{
    disabled?: boolean,
    reset?: () => void,
    handler?: () => void,
}>(() => {
    switch (step.value) {
        case ServiceAreaSteps.None:
            return {
                reset
            };
        case ServiceAreaSteps.CaptureImage:
            return {
                disabled: !preview.value,
                handler: () => step.value = ServiceAreaSteps.ModeArea,
            }
        case ServiceAreaSteps.ModeArea:
            return {
                disabled: false,
                handler: () => step.value = ServiceAreaSteps.RankArea,
                reset: () => resetSetting(SettingsKeys.ServiceGridAreaMode)
            }
        case ServiceAreaSteps.RankArea:
            return {
                disabled: false,
                handler: () => step.value = ServiceAreaSteps.SRArea,
                reset: () => resetSetting(SettingsKeys.ServiceGridAreaRank)
            }
        case ServiceAreaSteps.SRArea:
            return {
                disabled: false,
                handler: () => step.value = ServiceAreaSteps.LevelArea,
                reset: () => resetSetting(SettingsKeys.ServiceGridAreaSR)
            }
        case ServiceAreaSteps.LevelArea:
            return {
                disabled: false,
                handler: () => step.value = ServiceAreaSteps.None,
                reset: () => resetSetting(SettingsKeys.ServiceGridAreaLevel)
            }
    }
})

/**
 * Preview
 */
const preview = useServiceAreaPreview(step)
</script>

<style lang="scss" module>
.subtitle {
    color: #7a8694;
    font-size: 0.7em;
}

.actions {
    display: flex;
    margin-top: 0.8rem;
    gap: 0.6rem;
}
</style>