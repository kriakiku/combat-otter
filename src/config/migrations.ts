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
        
        /** Service: Area */
        [SettingsKeys.ServiceGridAreaMode]: {
            x: 51,
            y: 16,
            width: 278,
            height: 35,
            canvas: {
                width: 1356.4375,
                height: 763
            }
        },
        [SettingsKeys.ServiceGridAreaRank]: {
            x: 63,
            y: 301,
            width: 121,
            height: 51,
            canvas: {
                width: 1356.4375,
                height: 763
            }
        },
        [SettingsKeys.ServiceGridAreaSR]: {
            x: 63,
            y: 410,
            width: 121,
            height: 20,
            canvas: {
                width: 1356.4375,
                height: 763
            }
        },
        [SettingsKeys.ServiceGridAreaLevel]: {
            x: 1140,
            y: 16,
            width: 82,
            height: 38,
            canvas: {
                width: 1356.4375,
                height: 763
            }
        },

        /** Backend */
        [SettingsKeys.BackendEnabled]: true,
        [SettingsKeys.BackendPort]: null,

        /** User settings */
        [SettingsKeys.UserRawLocale]: app.getLocaleCountryCode(),
    }
});
