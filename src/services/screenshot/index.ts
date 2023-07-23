// import screenshot from 'screenshot-desktop';
import activeWin from 'active-win';
// import { spawn } from 'node:child_process';
// import { relative } from 'node:path'
// import { config } from '@config';

// console.log('ffmpegPath', ffmpegPath.path.replace('undefined', 'C:\\Users\\kriakiku\\Documents\\combat-otter\\.webpack\\main\\native_modules\\'))
// // console.log('ffprobePath', ffprobePath.path)

// ffmpeg.setFfmpegPath(ffmpegPath.path.replace('undefined', 'C:\\Users\\kriakiku\\Documents\\combat-otter\\.webpack\\main\\native_modules\\'));

// ffmpeg.setFfprobePath(ffprobePath.path);

// ./ffmpeg.exe -f gdigrab -offset_x 0 -offset_y 0 -video_size 5120x1440 -i desktop -pix_fmt yuv420p -vcodec libx264 -profile:v main -crf 16 outfile.mp4
// ./ffmpeg.exe -f gdigrab -i "title=Steam" -vframes 1 -vcodec copy -f rawvideo out.bmp
// ./ffmpeg.exe -rtbufsize 1500M -f gdigrab -framerate 29.97 -draw_mouse 0 -offset_x 13 -offset_y 103 -video_size 1280x720 -i desktop -pix_fmt yuv420p -c:v libx264 -preset ultrafast ./myvideo.mp4

// ffmpeg -f gdigrab -framerate 30 -i title="german.avi - VLC media player" -b:v 3M  germ.flv

/**
 * Screenshot of window (has black screen bug when rendered on GPU)
        ffmpeg()
            .on('start', (cmdline) => console.log(cmdline))
            .input('title=Steam')
            .inputFormat('gdigrab')
            .frames(1)
            .save('C:\\Users\\kriakiku\\Documents\\combat-otter\\gg.jpg')
            .run()
 */

// process.env.FFMPEG_PATH = ffmpegPath;

export async function getActiveWindowList(): Promise<Array<any>> {
    try {
        // const windows = await activeWin()

        // console.log('windows', windows);

        // ffmpeg -f gdigrab -i "title=Steam" -vframes 1 -vcodec copy -f rawvideo out.bmp
        // ffmpeg -f gdigrab -i title=Steam" -y -f mjpeg ./gg.jpg

        // ffmpeg()
        //     .on('start', (cmdline) => console.log(cmdline))
        //     .input('title=Steam')
        //     .inputFormat('gdigrab')
        //     .frames(1)
        //     .save('C:\\Users\\kriakiku\\Documents\\combat-otter\\gg.jpg')
        //     .run()

        console.log(activeWin)

        return ['lol', await activeWin.getOpenWindows()];

        // const child = spawn(ffmpegPath, ['-h'], { shell: true, stdio: 'inherit' });

        // child.on('error', (error) => {
        //     console.log('!!!!!', error)
        // });
    
        // child.stdout.setEncoding('utf8');
        // child.stdout.on('data', (data) => {
        //     //Here is the output
        //     data=data.toString();   
        //     console.log('----', data);      
        // });

        // child.on('close', (code) => {
        //     console.log('_____', code)
        // });

        // console.log(__dirname)
        // console.log(ffmpegPath)
        // console.log(ffmpegPath.replace(__dirname, '.'))
        // // console.log(relative(ffmpegPath, __dirname));

        // execFile('./ffmpeg.exe', ['-h'], (...args) => {
        //     console.log(...args)
        // })

        // return windows as any

    } catch (reason) {
        console.error('[services:screenshot:getActiveWindowList] Failed to get list of active windows', reason);
        return [];
    }
}

// TODO: https://stackoverflow.com/questions/64288069/windows-is-there-npm-modules-that-can-getactivewindow-and-setwindowpos

// /** Get list of displays / TODO: call cache */
// export async function getListOfDisplays() {
//     try {
//         const displays = await screenshot.listDisplays();

//         if (displays.length === 0) {
//             console.warn('[Screenshot]', 'Empty displays list');
//             return [];
//         }

//         return displays.map(item => ({
//             ...item,
//             picked: item.id === config.services.screenshot.displayId
//         }))

//     } catch (e) {
//         console.error('[Screenshot]', e)
//     }
// }

// /** Make screenshot */
// export async function getInput(): Promise<Buffer | null> {
//     const displayList = await getListOfDisplays();
//     const displayPicked = displayList.find(item => item.picked) || displayList.at(0);
//     const displayId = displayPicked?.id;

//     try {
//         const input = await screenshot({
//             format: 'png',
//             screen: displayId
//         })

//         if (!input) {
//             throw new Error("Failed to take a screenshot");
//         }

//         return input;
//     } catch (e) {
//         console.log('[Screenshot]', e)
//         return null;
//     }
// }