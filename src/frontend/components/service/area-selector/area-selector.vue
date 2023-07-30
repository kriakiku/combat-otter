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

            <div :class="$style.actions">
                <!-- Reset button -->
                <user-button
                    v-if="step === ServiceAreaSteps.None"
                    :label="$t('service.area-selector.actions.reset')"
                    @click="reset"
                    outlined
                    size="small"
                />

                <!-- Continue -->
                <user-button
                    v-if="nextStep"
                    @click="nextStep.handler"
                    :disabled="nextStep.disabled"
                    outlined
                    size="small"
                >
                    {{ $t('service.area-selector.actions.continue') }}
                </user-button>

            </div>
        </info-message>

        <!-- Preview -->
        <area-preview :step="step" :updatedAt="preview?.updatedAt">
            <template #preview v-if="preview">
                <img :src="preview.url" />
            </template>
        </area-preview>

    </menu-list>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { ServiceInterval, SettingsKeys, ServiceAreaSteps, TimeoutId } from '@typed';
import { useServiceAreaPreview } from '@frontend/hooks/service-area-preview'
import InfoMessage from './info-message.vue'
import AreaPreview from './area-preview.vue'

/**
 * Step switch
 */
const step = ref<ServiceAreaSteps>(ServiceAreaSteps.None);

function reset() {
    step.value = ServiceAreaSteps.CaptureImage
}

const nextStep = computed(() => {
    switch (step.value) {
        case ServiceAreaSteps.None:
            return null;
        case ServiceAreaSteps.CaptureImage:
            return {
                disabled: !preview.value,
                handler: () => step.value = ServiceAreaSteps.None
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
    display: block;
    margin-top: 0.8rem;
}
</style>