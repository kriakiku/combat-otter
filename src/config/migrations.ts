import Store from 'electron-store'
import { SettingsStore, SettingsKeys, ServiceInterval, Services } from '../typed';

export const store = new Store<SettingsStore>({
    watch: true,
    accessPropertiesByDotNotation: false,
    beforeEachMigration: (_, context) => {
        console.log(`[Config] migrate from ${context.fromVersion} → ${context.toVersion}`);
    },
	migrations: {
		'0.0.1': store => {
			store.set('phase', '0.0.1');
		},
	},
    defaults: {
        /** Service: Frequency */
        [SettingsKeys.ServiceFrequencyInterval]: ServiceInterval.NORMAL,
        [SettingsKeys.ServiceFrequencyShortcut]: [],
        [SettingsKeys.ServiceFrequencyDelay]: true,

        /** Service: Input Source */
        [SettingsKeys.ServiceInputSourceService]: Services.screenshot,

        /** Backend */
        [SettingsKeys.BackendEnabled]: true,
        [SettingsKeys.BackendPort]: null
    }
});
