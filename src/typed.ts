import type { history } from "@database/schema"
import type { InferModel } from "drizzle-orm"

export enum SettingsKeys {
    /** Service */
    ServiceFrequencyInterval = 'service.frequency.interval',
    ServiceFrequencyShortcut = 'service.frequency.shortcut',
    ServiceFrequencyDelay = 'service.frequency.delay',

    ServiceInputSourceService = 'service.input-source.service',

    /** Service: Screenshot */
    ScreenshotServiceMethod = 'service.screenshot-service.method',
    ScreenshotServiceWindow = 'service.screenshot-service.window',

    /** Service: OBS */
    OBSServiceConnectionServer = 'service.obs-service.connection.server', 
    OBSServiceConnectionPort = 'service.obs-service.connection.port', 
    OBSServiceConnectionPassword = 'service.obs-service.connection.password',
    OBSServiceSource = 'service.obs-service.source',

    /** Service: Area */
    ServiceGridAreaMode = 'service.grid.area.mode',
    ServiceGridAreaRank = 'service.grid.area.rank',
    ServiceGridAreaSR = 'service.grid.area.sr',
    ServiceGridAreaLevel = 'service.grid.area.level',

    /** Backend */
    BackendEnabled = 'backend.enabled',
    BackendPort = 'backend.port',

    /** User settings */
    UserRawLocale = 'user.raw-locale',
}

export interface SettingsStore {
    /** Service: Frequency */
    [SettingsKeys.ServiceFrequencyInterval]: ServiceInterval,
    [SettingsKeys.ServiceFrequencyShortcut]: string[],
    [SettingsKeys.ServiceFrequencyDelay]: boolean,

    /** Service: Input Source */
    [SettingsKeys.ServiceInputSourceService]: Services,

    /** Service: Screenshot */
    [SettingsKeys.ScreenshotServiceWindow]: ServiceScreenshotWindowPreset | string,
    [SettingsKeys.ScreenshotServiceMethod]: ServiceScreenshotMethod,

    /** Service: OBS */
    [SettingsKeys.OBSServiceConnectionServer]: string,
    [SettingsKeys.OBSServiceConnectionPort]: number,
    [SettingsKeys.OBSServiceConnectionPassword]: string,
    [SettingsKeys.OBSServiceSource]: string,

    /** Service: Area */
    [SettingsKeys.ServiceGridAreaMode]: AreaPosition,
    [SettingsKeys.ServiceGridAreaRank]: AreaPosition,
    [SettingsKeys.ServiceGridAreaSR]: AreaPosition,
    [SettingsKeys.ServiceGridAreaLevel]: AreaPosition,

    /** Backend */
    [SettingsKeys.BackendEnabled]: boolean,
    [SettingsKeys.BackendPort]: null | number,

    /** User settings */
    [SettingsKeys.UserRawLocale]: string
}

export interface AreaPosition {
    width: number,
    height: number,
    x: number,
    y: number,
    canvas: {
        width: number,
        height: number
    }
}

export enum Services {
    screenshot = "screenshot",
    obs = "obs",
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

export enum ServiceScreenshotMethod {
    WINDOW_CAPTURE = 'WINDOW_CAPTURE',
    SCREEN_CAPTURE = 'SCREEN_CAPTURE',
}

export enum ServiceScreenshotWindowPreset {
    COD_APPLICATION = 'COD_APPLICATION',
    FULL_SCREEN = 'FULL_SCREEN',
}

export interface ServiceScreenshotWindowItem {
    version: ServiceScreenshotWindowItemVersion
    title: string
    path: string
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }
}

export enum ServiceScreenshotWindowItemVersion {
    v1 = 'v1'
}

export const SERVICE_INTERVAL_PAUSE = 5 * 60 * 1000

export enum ServiceAreaSteps {
    None,
    CaptureImage,
    ModeArea,
    RankArea,
    SRArea,
    LevelArea,
}

export interface OBSConnectionStatus {
    type: 'connected' | 'disconnected'
    message?: string
    at: number
}

export interface OBSSourceScene {
    sceneIndex: number,
    sceneName: string,
    items: OBSSourceSceneItem[]
}

export interface OBSSourceSceneItem {
    inputKind: string
    sourceName: string
    sceneItemEnabled: boolean
}

export interface OBSCurrentSource {
    sceneName: string
    sourceName: string
    status: 'not-selected' | 'disabled' | 'not-found' | 'ok' | 'unknown' | 'not-launched'
    message?: string
}

/**
 * Models
 */
export enum GameType {
    'MW' = 'MW',
    'WZ' = 'WZ',
}

export type History = InferModel<typeof history>

export enum HistoryType {
    'MW:level' = 'MW:level',

    'MW:rank' = 'MW:rank',
    'MW:sr' = 'MW:sr',

    'WZ:rank' = 'WZ:rank',
    'WZ:sr' = 'WZ:sr'
}


export type JSONStringified = string
export type TimeoutId = ReturnType<typeof setTimeout>
