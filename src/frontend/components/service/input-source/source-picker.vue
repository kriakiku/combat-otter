<template>
    <!-- Source picker -->
    <menu-item>
        <template #icon>
            <v-icon :name="icons[service]" scale="1.4" />
        </template>

        <template #title>
            {{ $t('service.input-source.title') }}
        </template>

        <template #description>
            {{ $t(`service.input-source.sources.${service}.description`) }}
        </template>

        <template #action>
            <dropdown
                v-model="service"
                :options="options"
            >
                <!-- Picked -->
                <template #value="{ value }">
                    {{ value ? labels[value].label : '-' }}
                </template>

                <!-- List -->
                <template #option="{ option }">
                    <v-icon :name="labels[option].icon" />
                    {{ labels[option].label }}
                </template>
            </dropdown>
        </template>
    </menu-item>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useI18n } from 'vue-i18n'
import { Services } from '@typed'

const { t } = useI18n();

const options = ref(Object.values(Services))

const icons = ref({
    [Services.obs]: 'si-obsstudio',
    [Services.screenshot]: 'md-screenshotmonitor'
})

const labels = computed(() => Object.fromEntries(options.value.map(service => ([
    service,
    {
        label: t(`service.input-source.sources.${service}.title`),
        icon: icons.value[service]
    }
]))))

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const service = computed<Services>({
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