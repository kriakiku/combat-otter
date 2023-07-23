import { defineStore } from 'pinia'
import { ServiceScreenshotWindowItem, TimeoutId } from '@typed'

const FETCH_INTERVAL = 3000;

/**
 * Screenshot windows
 * TODO: Refactor subscribe plz
 */
export const useScreenshotWindowsStore = defineStore('screenshot-windows', {
    state: () => {
        return {
            windows: [] as ServiceScreenshotWindowItem[],
            timeoutId: null as TimeoutId,
            subscribed: false,
        };
    },
    getters: {},
    actions: {
        async fetch() {
            try {
                const response = await fetch('backend:///services/screenshot/window-list')
                const windows: ServiceScreenshotWindowItem[] = await response.json()

                for (const window of windows) {
                    const isExists = this.windows.some((item: ServiceScreenshotWindowItem) => item.path === window.path && item.title === item.title);
                    if (!isExists) {
                        console.log(window)
                        this.windows.push(window)
                    }
                }

            } catch (reason) {
                console.error(`[stores:screenshot-windows:fetch] fetch error`, reason);
            } finally {
                if (this.subscribed) {
                    this.timeoutId = setTimeout(this.fetch, FETCH_INTERVAL)
                }
            }
        },
        subscribe() {
            if (this.subscribed) {
                return;
            }

            this.subscribed = true;
            void this.fetch();
        },
        unsubscribe() {
            this.subscribed = false;
            clearTimeout(this.timeoutId);
        }
    },
})
