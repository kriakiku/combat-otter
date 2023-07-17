import { ServiceInterval } from "../../typed";

export default {
    languageTitle: 'English',

    home: {
        title: 'Combat Otter'
    },

    service: {
        title: 'Data source',
        description: 'Source of capturing information about your rank',
        disclaimer: 
            'CoD: MW II does not have a public API to collect your statistics. ' +
            'The only legal way to do this is to visually analyze the pre-game lobby. ' +
            'This method of collecting data is absolutely safe, cannot lead to bans, does not affect the game, etc. ' +
            'If you are a PC player, then the screen capture option will suit you. ' +
            'For streamers, console players (with video capture cards or broadcast to PC) there are additional ways to capture. ' +
            'We care about maintaining the performance of your device. You don\'t have to worry about FPS drops while using the utility.',

        interval: {
            blockTitle: 'Frequency',
            title: 'Statistics collection frequency',
            description: {
                [ServiceInterval.SHORTCUT]: 'The most efficient way to collect statistics. The most minimal load on your system',
                [ServiceInterval.NORMAL]: 'Statistics will definitely have time to collect during the search for the game',
                [ServiceInterval.OFTEN]: '⚠️ We do not imagine a situation in which such a frequency will be useful to you',
                [ServiceInterval.RARELY]: 'A great option if you move away from the PC while searching for a game',
                [ServiceInterval.VERY_OFTEN]: '⛔ Haha, very funny. It seems you missed the choice. Are you sure you need it?',
            },
            options: {
                [ServiceInterval.SHORTCUT]: '🔥 Shortcut (most effectively)',
                [ServiceInterval.VERY_OFTEN]: '💩 Useless often (every ~{sec} sec)',
                [ServiceInterval.OFTEN]: '🐇 Often (every ~{sec} sec)',
                [ServiceInterval.NORMAL]: '🔥 Balanced (every ~{sec} sec)',
                [ServiceInterval.RARELY]: '🐌 Rarely (every ~{sec} sec)',
            },
            delay: {
                title: 'Pause after successful recognition',
                description: 'If you prefer to play MW or rarely occupy 45-50 place in WZ, you can pause recognition for 5 minutes after the last successful recognition'
            },
            shortcut: {
                title: 'Shortcut',
                description: 'When you are in the pre-game lobby - just press the keyboard shortcut and recognition will start',
                record: 'Record',
                cancel: 'Press ESC to cancel record',
                reset: 'Click to reset'
            }
        },

        'input-source': {
            title: 'Input source'
        },
    
        screenshot: {
            title: 'Screen capture',
            disclaimer:
                'This method is suitable for you if you are just playing the game on your PC. ' +
                'It is also suitable for console players broadcasting the screen to a PC (or using a video capture card), ' +
                'as well as for cloud gaming. If you are a streamer, there is probably a more convenient option for you (integration with OBS).'
        }
    },

    plugins: {
        obs: {
            title: 'OBS overlay',
            description: 'Overlay with your statistics on the stream'
        },
        discord: {
            title: 'Discord profile',
            description: 'Integration into the description of your profile, avatar or banner'
        },
        wzhub: {
            title: 'WZHub integration',
            description: 'Automatic synchronization of statistics in wzhub.gg'
        },
        'shadow-ban': {
            title: 'Shadow ban notifier',
            description: 'A quick way to find out if you are in the shadow ban bases'
        }
    },

    settings: {
        title: 'Settings',
        locale: {
            title: 'Language'
        }
    },

    badge: {
        presets: {
            tip: 'Tip'
        }
    },

    gameType: {
        MW: 'Modern Warframe',
        WZ: 'Warzone'
    },

    rank: {
        title: 'Rank'
    }
}
