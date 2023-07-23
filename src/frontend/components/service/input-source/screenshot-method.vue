<template>
    <!-- Screenshot method -->
    <menu-item>
        <template #icon>
            <v-icon name="bi-signpost-fill" scale="1.4" />
        </template>

        <template #title>
            {{ $t(`service.input-source.sources.${Services.screenshot}.method.title`) }}
        </template>

        <template #description>
            <badge color="warning" v-if="method === ServiceScreenshotMethod.WINDOW_CAPTURE">{{$t('badge.presets.attention')}}</badge>{{
                $t(`service.input-source.sources.${Services.screenshot}.method.options.${method}.description`)
            }}
        </template>

        <template #action>
            <dropdown
                v-model="method"
                :options="options"
            >
                <!-- Picked -->
                <template #value="{ value }">
                    {{ value ? labels[value].label : '-' }}
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
import { Services, ServiceScreenshotMethod } from '@typed'

const { t } = useI18n();

const options = ref(Object.values(ServiceScreenshotMethod))

const labels = computed(() => Object.fromEntries(options.value.map(service => ([
    service,
    {
        label: t(`service.input-source.sources.${Services.screenshot}.method.options.${service}.title`),
    }
]))))

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const method = computed<ServiceScreenshotMethod>({
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