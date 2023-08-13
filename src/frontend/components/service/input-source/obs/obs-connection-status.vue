<template>
    <span :class="$style.container">
        <badge :color="data.type === 'connected' ? 'success' : 'warning'">
            {{ data.type }}
        </badge> {{ 
            data.message
        }}
        (<time-ago :date="new Date(data.at)" />)
    </span>
</template>

<script lang="ts" setup>
import { OBSConnectionStatus } from '@typed';
import { computed } from 'vue';

const props = defineProps<{
    data: string | null,
}>()

const data = computed<OBSConnectionStatus>(() => {
    if (!props.data) {
        return {
            type: 'disconnected',
            message: 'connecting...',
            at: Date.now()
        }
    }

    return JSON.parse(props.data) as OBSConnectionStatus;
})
</script>

<style lang="scss" module>
.container {
    display: inline;
    font-size: 0.8rem;
}
</style>