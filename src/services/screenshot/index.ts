import screenshot from 'screenshot-desktop';
import { config } from '../../config';

// TODO: https://stackoverflow.com/questions/64288069/windows-is-there-npm-modules-that-can-getactivewindow-and-setwindowpos

/** Get list of displays / TODO: call cache */
export async function getListOfDisplays() {
    try {
        const displays = await screenshot.listDisplays();

        if (displays.length === 0) {
            console.warn('[Screenshot]', 'Empty displays list');
            return [];
        }

        return displays.map(item => ({
            ...item,
            picked: item.id === config.services.screenshot.displayId
        }))

    } catch (e) {
        console.error('[Screenshot]', e)
    }
}

/** Make screenshot */
export async function getInput(): Promise<Buffer | null> {
    const displayList = await getListOfDisplays();
    const displayPicked = displayList.find(item => item.picked) || displayList.at(0);
    const displayId = displayPicked?.id;

    try {
        const input = await screenshot({
            format: 'png',
            screen: displayId
        })

        if (!input) {
            throw new Error("Failed to take a screenshot");
        }

        return input;
    } catch (e) {
        console.log('[Screenshot]', e)
        return null;
    }
}