export default {
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
            'We care about maintaining the performance of your device. You don\'t have to worry about FPS drops while using the utility.'
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
