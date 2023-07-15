/**
 * Configurations service
 */
export const config = {
    backend: {
        port: 3001,
        logger: false
    },
    services: {
        obs: {
            enabled: true,

            port: 4455,
            address: 'ws://localhost',
            password: 'wx7BUPpP4Z7SdEIY',
        },
        screenshot: {
            enabled: true,

            displayId: undefined as number | undefined,
        },
        twitch: {
            enabled: true,

            streamerId: 'this_otter',
        }
    }
}
