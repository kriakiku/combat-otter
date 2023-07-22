<template>
    <!-- Interval picker -->
    <menu-item>
        <template #icon>
            <v-icon name="ri-alarm-line" scale="1.4" />
        </template>

        <template #title>
            {{ $t('service.interval.title') }}
        </template>

        <template #description>
            {{ $t(`service.interval.description.${interval}`) }}
        </template>

        <template #action>
            <dropdown
                v-model="interval"
                :options="options"
            >
                <!-- Picked -->
                <template #value="{ value }">
                    {{ value ? labels[value].short : '-' }}
                </template>

                <!-- List -->
                <template #option="{ option }">
                    {{ labels[option].label }}
                </template>
            </dropdown>
        </template>
    </menu-item>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useI18n } from 'vue-i18n'
import { ServiceInterval, ServiceIntervalMs } from '@typed'

const { t } = useI18n();

const options = ref(Object.values(ServiceInterval))

const labels = computed(() => Object.fromEntries(options.value.map(serviceInterval => {
    const options: { sec?: number } = {};

    if (serviceInterval in ServiceIntervalMs) {
        options.sec = Math.round(ServiceIntervalMs[serviceInterval as keyof typeof ServiceIntervalMs] / 1000);
    }

    return [
    serviceInterval,
    {
        short: t(`service.interval.options.${serviceInterval}`).split('(')[0].trim(),
        label: t(`service.interval.options.${serviceInterval}`, options)
    }
]
})))

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const interval = computed<ServiceInterval>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<style lang="scss" module>
</style>