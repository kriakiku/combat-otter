export enum SettingsKeys {
    ServiceFrequencyInterval = 'service.frequency.interval',
    ServiceFrequencyShortcut = 'service.frequency.shortcut',
    ServiceFrequencyDelay = 'service.frequency.delay',

    ServiceInputSourceService = 'service.input-source.service',
}

export interface SettingsStore {
    /** Service: Frequency */
    [SettingsKeys.ServiceFrequencyInterval]: ServiceInterval,
    [SettingsKeys.ServiceFrequencyShortcut]: string[],
    [SettingsKeys.ServiceFrequencyDelay]: boolean,

    /** Service: Input Source */
    [SettingsKeys.ServiceInputSourceService]: Services
}

export enum Services {
    screenshot = "screenshot",
    obs = "obs",
    twitch = "twitch",
    youtube = "youtube",
}

export enum Division {
    bronze = "bronze",
    silver = "silver",
    gold = "gold",
    platinum = "platinum",
    diamond = "diamond",
    crimson = "crimson",
    iridescent = "iridescent",
}

export enum DivisionLevel {
    I = 'I',
    II = 'II',
    III = 'III',
}

export enum RankedType {
    WZ = "WZ",
    MW = "MW"
}

export enum ServiceInterval {
    SHORTCUT = 'SHORTCUT',
    NORMAL = 'NORMAL',
    RARELY = 'RARELY',
    OFTEN = 'OFTEN',
    VERY_OFTEN = 'VERY_OFTEN'
}

export const ServiceIntervalMs = {
    [ServiceInterval.VERY_OFTEN]: 5_000,
    [ServiceInterval.OFTEN]: 10_000,
    [ServiceInterval.NORMAL]: 15_000,
    [ServiceInterval.RARELY]: 25_000,
}

export const SERVICE_INTERVAL_PAUSE = 5 * 60 * 1000

