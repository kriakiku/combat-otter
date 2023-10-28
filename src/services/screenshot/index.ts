import { ServiceScreenshotMethod, ServiceScreenshotWindowItem, ServiceScreenshotWindowItemVersion, ServiceScreenshotWindowPreset, SettingsKeys } from '@typed';
import activeWin from 'active-win';
import log from 'electron-log';
import { config } from '@config';
import { ffmpeg } from '@modules/ffmpeg';
import { stream2buffer } from '@services/helpers';
import { InputService } from '../typed';


export async function getActiveWindowList(): Promise<ServiceScreenshotWindowItem[]> {
    try {
        const windows = [
            await activeWin(),
            ...await activeWin.getOpenWindows()
        ]

        return windows
            .filter(item => !!item)
            .filter((item, index) => windows.findIndex(rightItem => rightItem.id === item.id) === index)
            .map(item => ({
                version: ServiceScreenshotWindowItemVersion.v1,
                title: item.title,
                path: item.owner?.path,
                bounds: item.bounds
            }));
    } catch (reason) {
        log.scope('services:screenshot.getActiveWindowList').error(`failed to get list of active windows: ${reason?.message}`);
        return [];
    }
}

/**
 * Screenshot service
 * TODO: Capture area outside screen
 */
class ScreenshotService implements InputService {

    /** Start service */
    public start() {
        log.scope('services:screenshot.start').log(`starting service`);
    }

    /** Stop service */
    public stop() {
        log.scope('services:screenshot.stop').log(`stopping service`);
    }
    
    /** Get active window */
    private async getActiveWindow() {
        const window = await activeWin();
        return this.formatWindow(window);
    }

    /** Get all windows (may not see the active window) */
    private async getAllWindow() {
        const windows = await activeWin.getOpenWindows();
        return windows.map(this.formatWindow)
    }

    /** Format window */
    private formatWindow(window: activeWin.Result): ServiceScreenshotWindowItem {
        return {
            version: ServiceScreenshotWindowItemVersion.v1,
            title: window.title,
            path: window.owner?.path,
            bounds: window.bounds
        }
    }
    
    /** Get picked window */
    private getPickedWindow(): PickedWindowTest {
        const pickedWindow = config.get(SettingsKeys.ScreenshotServiceWindow);
        return generateWindowPickedTest(pickedWindow);
    }

    /** Get input image */
    public async getInput() {
        let method = config.get(SettingsKeys.ScreenshotServiceMethod);
        const window = config.get(SettingsKeys.ScreenshotServiceWindow);
        const isFullScreen = window === ServiceScreenshotWindowPreset.FULL_SCREEN;

        // When need to capture all screens
        if (isFullScreen) {
            method = ServiceScreenshotMethod.SCREEN_CAPTURE
        }
        
        switch (method) {
            case ServiceScreenshotMethod.SCREEN_CAPTURE:
                return this.captureScreen(isFullScreen);
            case ServiceScreenshotMethod.WINDOW_CAPTURE:
                return this.captureWindow();
            default:
                return null;
        }
    }

    /** Capture screen or window on full screen capture */
    private async captureScreen(fullScreen: boolean) {
        try {
            /** FullScreen */
            if (fullScreen) {
                const { stream, promise } = stream2buffer();
                log.error('1')
                ffmpeg()
                    // .on('start', (cmdline) => console.log(cmdline))
                    .input('desktop')
                    .inputFormat('gdigrab')
                    .frames(1)
                    .format('mjpeg')
                    .output(stream, { end: true })
                    .run();

                const buffer = await promise;
                return buffer;
            }

            /** Capture window on screen */
            const window = await this.getActiveWindow();
            const pickedWindow = this.getPickedWindow();

            // Current window is not selected
            if (!pickedWindow.test(window)) {
                log.scope('services:screenshot.captureScreen').log(`the active window is not selected`);
                return null;
            }

            let captureArea = null;

            const { stream, promise } = stream2buffer();
            log.error('2')
            // .inputOptions(['-tune zerolatency', '-pix_fmt yuv420p', '-preset ultrafast', '-b:v 5M'])
            ffmpeg()
                // .on('start', (cmdline) => console.log(cmdline))
                .input('desktop')
                .inputFormat('gdigrab')
                .inputOptions([
                    `-offset_x ${window.bounds.x}`,
                    `-offset_y ${window.bounds.y}`,
                    '-show_region 1',
                    `-video_size ${window.bounds.width}x${window.bounds.height}`
                ])
                .frames(1)
                .format('mjpeg')
                .output(stream, { end: true })
                .on('error', (...reasons) => {
                    // TODO: Try to solve problem with outside window
                    captureArea = detectAvailableCaptureArea(reasons);
                    if (!captureArea) {
                        log.scope('services:screenshot.captureScreen.ffmpeg').error(`failed to capture window:`, ...reasons);
                    } else {
                        log.scope('services:screenshot.captureScreen.gdigrab').warn(`the captured window pops out of the screen (${captureArea.screenWidth}x${captureArea.screenHeight})`);
                    }
                })
                .run();

            const buffer = await promise;
            return buffer;
        } catch (reason) {
            log.scope('services:screenshot.captureScreen').error(`failed to capture screen`);
            return null;
        }
    }

    /** Capture window */
    private async captureWindow() {
        try {
            const pickedWindow = this.getPickedWindow();
            let window: ServiceScreenshotWindowItem | null = null;

            // Trying to find the picked window
            const activeWindow = await this.getActiveWindow();
            if (pickedWindow.test(activeWindow)) {
                window = activeWindow;
            } else {
                const allWindow = await this.getAllWindow();
                window = allWindow.find(pickedWindow.test) || null
            }

            // Window not exists
            if (window === null) {
                log.scope('services:screenshot.captureWindow').log(`failed to find a window. The application may not be running.`);
                return null;
            }

            const { stream, promise } = stream2buffer();
            log.error('3')
            ffmpeg()
                // .on('start', (cmdline) => console.log(cmdline))
                .input(`title=${window.title}`)
                .inputFormat('gdigrab')
                .frames(1)
                .format('mjpeg')
                .output(stream, { end: true })
                .on('error', (...reasons) => {
                    log.scope('services:screenshot.captureWindow.ffmpeg').error(`failed to capture window:`, ...reasons);
                })
                .run();

                const buffer = await promise;
                return buffer;
        } catch (reason) {
            log.scope('services:screenshot.captureWindow').error(`failed to capture window: ${reason?.message}`);
            return null;
        }

    }

}

/** Picked window test presets */
interface PickedWindowTest {
    test: (window: ServiceScreenshotWindowItem) => boolean;
}

const pickedWindowAllwaysFalse: PickedWindowTest = { test: () => false }
const pickedWindowTestCache = new Map<string, PickedWindowTest>([
    /** Incorrect entity */
    [null, pickedWindowAllwaysFalse],

    /** Full screen (Cannot be selected) */
    [ServiceScreenshotWindowPreset.FULL_SCREEN, pickedWindowAllwaysFalse],

    /** Cod application preset */
    [ServiceScreenshotWindowPreset.COD_APPLICATION, {
        test: window => window.path.endsWith('cod.exe')
    }],
]);

function generateWindowPickedTest(configValue: string) {
    /** Already exists */
    let test = pickedWindowTestCache.get(configValue || null);
    if (test) {
        return test;
    }

    /** Need to generate new one */
    const pickedWindow = parseScreenshotWindowItem(configValue);
    
    if (pickedWindow === null) {
        test = pickedWindowAllwaysFalse;
    } else {
        test = {
            test: (window) => {
                // window.title === window.title
                return window.path === pickedWindow.path;
            }
        }
    }

    pickedWindowTestCache.set(configValue, test);
    return test;
}

/** Easy JSON parsing */
const parseScreenshotWindowItem = (rawInput: string): ServiceScreenshotWindowItem | null => {
    try {
        const window = JSON.parse(rawInput);

        if (window.version !== ServiceScreenshotWindowItemVersion.v1) {
            return null
        }

        return window;
    } catch {
        return null
    }
}

/** Detect available capture area */
interface AvailableCaptureArea {
    screenWidth: number;
    screenHeight: number;
}

const gdigrabScreenAreaRegex = /Capture area \(\d+,\d+\),\(\d+,\d+\) extends outside window area \(0,0\),\((?<screenWidth>\d+),(?<screenHeight>\d+)\)desktop/s;
const detectAvailableCaptureArea = (ffmpegGdigrabErrorOutputLogs: string[]): AvailableCaptureArea | null => {
    for (const line of ffmpegGdigrabErrorOutputLogs) {
        if (typeof line !== 'string') {
            continue;
        }

        const result = gdigrabScreenAreaRegex.exec(line)

        if (!result) {
            continue;
        }

        return {
            screenWidth: Number(result.groups.screenWidth),
            screenHeight: Number(result.groups.screenHeight),
        }
    }

    return null;
}

export const screenshotService = new ScreenshotService();