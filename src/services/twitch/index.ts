// import twitch from 'twitch-m3u8-v2';
// import ffmpeg from 'fluent-ffmpeg';
// import { config } from '../../config';
// import { stream2buffer } from '../helpers';

// /**
//  * Pick source stream or first from list
//  */
// async function pickStreamUri() {
//     console.log('!!!!! 1')
//     try {
//         console.log('!!!!! 2', config.services, config.services.twitch.streamerId, twitch.getStream(config.services.twitch.streamerId))
//         const streams = await twitch.getStream(config.services.twitch.streamerId);
//         console.log('!!!!! 3')
//         const stream = streams?.find(item => item.quality.includes('source')) || streams?.at(0);

//         console.log('!!!!!!!!!twitch', stream);

//         if (!stream) {
//             throw new Error('Could not find stream. Maybe stream offline?');
//         }

//         return stream.url;
//     } catch (reason) {
//         console.error('[twitch]', reason);
//         return null;
//     }
// }

// /**
//  * Get input
//  */
// export async function getInput(): Promise<Buffer | null> {
//     const streamUri = await pickStreamUri();
//     if (!streamUri) {
//         return null;
//     }

//     // Connect and download an image
//     try {
//         const { stream, promise } = stream2buffer()

//         ffmpeg(streamUri)
//             .videoFilters('fps=1')
//             .outputFormat('png')
//             .writeToStream(stream);

//         const buffer = await promise;

//         if (!buffer || buffer.byteLength === 0) {
//             throw new Error('Failed to get preview image');
//         }

//         return buffer;
//     } catch (reason) {
//         console.error('[twitch]', reason);
//         return null;
//     }
// }
export const gg = '';