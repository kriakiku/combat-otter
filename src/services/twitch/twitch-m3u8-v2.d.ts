declare module 'twitch-m3u8-v2' {
    type FPS = number;
    type ShortResolution = number;
    type Meta = ` (source)` | '';

    type WidthResolution = number;
    type HeightResolution = number;

    interface PlaylistItem {
        quality: `${ShortResolution}p${FPS}${Meta}`,
        resolution: `${WidthResolution}x${HeightResolution}`,
        url: string
    }

    export default class {
        static getStream(channel: string, oauthToken?: string, rawOutput?: false): Promise<PlaylistItem[]>
        static getStream(channel: string, oauthToken?: string, rawOutput?: true): Promise<string>

        static getVod(vid: string, rawOutput?: false): Promise<PlaylistItem[]>
        static getVod(vid: string, rawOutput?: true): Promise<string>
    }
}
