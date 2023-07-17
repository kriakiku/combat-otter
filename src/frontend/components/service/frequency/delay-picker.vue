<template>
    <!-- Delay after successful recognition -->
    <menu-item>
        <template #icon>
            <v-icon name="ri-zzz-fill" scale="1.4" />
        </template>

        <template #title>
            {{ $t('service.interval.delay.title') }}
        </template>

        <template #description>
            {{ $t(`service.interval.delay.description`) }}
        </template>

        <template #action>
            <input-switch v-model="delay" />
        </template>
    </menu-item>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const delay = computed<boolean>({
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