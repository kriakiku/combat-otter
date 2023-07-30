import { app } from 'electron'
import Store from 'electron-store'
import { SettingsStore, SettingsKeys, ServiceInterval, Services, ServiceScreenshotMethod, ServiceScreenshotWindowPreset } from '@typed';

export const store = new Store<SettingsStore>({
    watch: true,
    accessPropertiesByDotNotation: false,
    beforeEachMigration: (_, context) => {
        console.log(`[Config:beforeEachMigration] migrate from ${context.fromVersion} => ${context.toVersion}`);
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

        /** Service: Screenshot */
        [SettingsKeys.ScreenshotServiceWindow]: ServiceScreenshotWindowPreset.COD_APPLICATION,
        [SettingsKeys.ScreenshotServiceMethod]: ServiceScreenshotMethod.SCREEN_CAPTURE,

        /** Backend */
        [SettingsKeys.BackendEnabled]: true,
        [SettingsKeys.BackendPort]: null,

        /** User settings */
        [SettingsKeys.UserRawLocale]: app.getLocaleCountryCode(),
    }
});
