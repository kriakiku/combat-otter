import { app, ipcMain, IpcMainEvent, WebContents } from 'electron'
import { store } from './migrations';
import { SettingsKeys } from '../typed';

/** Subscribers */
const updateSubscribers: WebContents[] = [];
const updateSubscribe = (event: IpcMainEvent) => {
    updateSubscribers.push(event.sender);
    event.reply('settings:updated', store.store);
}
const updateHandler = (_: IpcMainEvent, key: SettingsKeys, value: unknown) => {
    try {
        const prevValue = store.get(key);
        if (prevValue === value) {
            console.log(`[Config:api:update] Settings "${key}" has no changes ${JSON.stringify(value)}`)
            return
        }

        store.set(key, value);
        console.log(`[Config:api:update] Settings "${key}" updated ${JSON.stringify(prevValue)} => ${JSON.stringify(value)}`)
    } catch (e) {
        console.log(`[Config:api:update] Failed to update setting "${key}"`, e)
    }
}

/** 
 * Subscriptions (ipc)
 * TODO: delete on unsubscribe
 */
ipcMain.on('settings:subscribe', updateSubscribe);
ipcMain.on('settings:update', updateHandler);

/**
 * Subscription (config)
 */
const unsubscribe = store.onDidAnyChange((config) => {
    console.log('[Config:api] settings updated')

    for (const event of updateSubscribers) {
        try {
            event.send('settings:updated', config)
        } catch (e) {
            console.error('[Config:api:onChange] cant send settings update notification', e);
        }
    }
});

app.on('before-quit', () => {
    console.log('[Config:api] unsubscribe')
    ipcMain.off('settings:subscribe', updateSubscribe);
    ipcMain.off('settings:update', updateHandler);
    unsubscribe();
});