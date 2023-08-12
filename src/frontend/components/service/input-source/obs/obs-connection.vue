<template>
    <!-- OBS connection -->
    <menu-item>
        <template #icon>
            <v-icon name="bi-ethernet" scale="1.4" />
        </template>

        <template #title>
            {{ $t(`service.input-source.sources.${Services.obs}.connection.title`) }}
        </template>

        <template #description>
            {{$t(`service.input-source.sources.${Services.obs}.connection.description`)}}
        </template>

        <template #action>
            <user-button
                :label="$t(`service.input-source.sources.${Services.obs}.connection.actions.reconfigure`)"
                @click="visible = true"
                outlined
                size="small"
            />
        </template>
    </menu-item>

    <!-- Form -->
    <dialog-window
        v-model:visible="visible"
        modal
        :draggable="false"
        :header="$t(`service.input-source.sources.${Services.obs}.connection.title`)"
        :contentClass="step === 'info' ? $style.infoStep : ''"
        :style="{ width: 'min(40rem, 80vw)' }"
    >
        <!-- Info -->
        <template v-if="step === 'info'">
            <div :class="$style.infoDisclaimer">
                <badge>{{ $t('badge.presets.tip') }}</badge>{{
                    $t(`service.input-source.sources.${Services.obs}.connection.disclaimer`)
                }}
            </div>
            <img :src="exampleOBS" />
        </template>

        <!-- Form -->
        <template v-else>
            <!-- Server -->
            <input-block id="server">
                <template #label>
                    {{ $t(`service.input-source.sources.${Services.obs}.connection.form.server.title`) }}
                </template>
                
                <input-text v-model="server" id="server" />

                <template #description>
                    {{ $t(`service.input-source.sources.${Services.obs}.connection.form.server.description`) }}
                </template>
            </input-block>

            <!-- Port -->
            <input-block id="port">
                <template #label>
                    {{ $t(`service.input-source.sources.${Services.obs}.connection.form.port.title`) }}
                </template>
                
                <input-number v-model="port" inputId="port" :useGrouping="false" :minFractionDigits="0" />

                <template #description>
                    {{ $t(`service.input-source.sources.${Services.obs}.connection.form.port.description`) }}
                </template>
            </input-block>

            <!-- Password -->
            <input-block id="password">
                <template #label>
                    {{ $t(`service.input-source.sources.${Services.obs}.connection.form.password.title`) }}
                </template>
                
                <input-text v-model="password" id="password" />

                <template #description>
                    {{ $t(`service.input-source.sources.${Services.obs}.connection.form.password.description`) }}
                </template>
            </input-block>
        </template>

        <template #footer>
            <user-button
                :label="$t(`service.input-source.sources.${Services.obs}.connection.actions.continue`)"
                @click="continueHandler"
                outlined
                size="small"
            />
        </template>
    </dialog-window>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { Services } from '@typed'
import exampleOBS from '@frontend/assets/images/obs-server.png';

/**
 * Step
 */
const visible = ref(false);
const step = ref<'info' | 'form'>('info');

const continueHandler = () => {
    if (step.value === 'info') {
        step.value = 'form'
    } else {
        visible.value = false;
    }

}

watch(visible, () => {
    if (visible.value) {
        step.value = 'info'
    }
});

/**
 * Form
 */
const props = defineProps<{
    server: string,
    port: number,
    password: string
}>()
const emit = defineEmits(['update:server', 'update:port', 'update:password'])

const server = computed<string>({
  get() {
    return props.server
  },
  set(value) {
    emit('update:server', value)
  }
})

const port = computed<number>({
  get() {
    return props.port
  },
  set(value) {
    emit('update:port', value)
  }
})

const password = computed<string>({
  get() {
    return props.password
  },
  set(value) {
    emit('update:password', value)
  }
})
</script>

<style lang="scss" module>
.infoStep {
    padding: 0.5rem 0 0 0 !important;
    
    > img {
        height: 33rem;
    }
}

.infoDisclaimer {
    display: block;
    padding: 0 1rem;
    margin-bottom: 1rem;
}
</style>