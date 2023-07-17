import { defineStore } from 'pinia'
import { SettingsKeys, SettingsStore } from '../../typed'
import { computed } from 'vue';

/**
 * Settings store
 */
export const useSettingsStore = defineStore('settings', {
    // TODO: Looks like code from Hogwarts Legacy 🤮
    state: () => {
        const keys = Object.values(SettingsKeys);
        const config = {
            phase: null
        } as SettingsStore & { phase: string };

        config[SettingsKeys.ServiceFrequencyDelay] = true;

        for (const key of keys) {
            config[key] = null as never;
        }
    
        return config;
    },
    getters: {},
    actions: {
        subscribe() {
            return window.api.subscribeSettings((config) => {
                for (const rawKey in config) {
                    const key = rawKey as keyof SettingsStore
                    const value = config[key];

                    if (value !== this[key]) {
                        this[key] = value;
                    }
                }
            });
        },
        set<K extends keyof SettingsStore>(key: K, value: SettingsStore[K]) {
            window.api.setSettings(key, value);
        }
    },
})

export const useSetting = <K extends keyof SettingsStore>(key: K) => {
    const settings = useSettingsStore();

    const value = computed({
        get() {
            return settings[key]
        },
        set(value: SettingsStore[K]) {
            settings.set(key, value)
        }
    })

    return value;
}
